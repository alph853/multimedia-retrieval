import copy
import random
import numpy as np
import json


def frame_info_to_query(features, frame_info: dict):
    """Convert frame info from request format to query and query info
        For request format, see 'request_format.md'

        Args:
            frame_number (int): number of frames
            frame_info (dict): dictionary with format ```{frame_id: {feature: value}}```

        Returns:
            Tuple: `(query, query_info)` with `query` is the input for retrieval and `query_info` is the mapping between frame_id and feature values
        """
    query = {}
    qinfo = {}

    for f in features:
        if f == 'clip':
            types = ['txt', 'img', 'idx']
            query_list = {t: [frame_info[id][t]
                              for id in frame_info if frame_info[id][t] is not None] for t in types}
            qinfo_list = {t: [id for id in frame_info if frame_info[id][t] is not None] for t in types}

            query_list = {k: v if v else None for k, v in query_list.items()}
            qinfo_list = {k: v if v else None for k, v in qinfo_list.items()}

            if all(v is None for v in query_list.values()):
                query_list = None
                qinfo_list = None

        else:
            query_list = [frame_info[id][f] for id in frame_info if frame_info[id][f] is not None]
            qinfo_list = [id for id in frame_info if frame_info[id][f] is not None]

            if not query_list:
                query_list = None
                qinfo_list = None

        query[f] = query_list
        qinfo[f] = qinfo_list

    return query, qinfo


def group_query_results_by_frames(features, results, query_info, frame_number):
    """Group query results by frames (actually convert it to the iniital format)

    Args:
        results (dict): results of retrieval `{feature: (scores, indices)}`
        query_info (dict): mapping between frame_id and feature results

    Returns:
        dict: similar to frame_info `{frame_id: {feature: (scores, indices)}}` except that None features are removed
    """
    all_frames_results = {frm_id: {} for frm_id in range(frame_number)}

    if results['clip'] is not None:
        for t in ['txt', 'img', 'idx']:
            if results['clip'][t] is None:
                continue
            frame_ids = query_info['clip'][t]
            for i, id in enumerate(frame_ids):
                all_frames_results[id][t] = (results['clip'][t][0][i], results['clip'][t][1][i])

    for f in features:
        if results[f] in (None, "clip"):
            continue
        frame_ids = query_info[f]
        for i, id in enumerate(frame_ids):
            all_frames_results[id][f] = (results[f][0][i], results[f][1][i])    # (scores, indices)

    return all_frames_results


def merge_list_results(list_scores, list_indices, k):
    """Merge all lists of scores and indices to a single list of scores and indices

    Args:
        list_scores (list) 
        list_indices (list)
        
    Returns:
        Tuple: (scores, indices)
    """
    if len(list_scores) == 1:
        return list_scores[0], list_indices[0]

    def F(rank_list, central, score):
        coef = sum([central/x for x in rank_list])*(central/rank_list[-1])
        return coef * (score**3 + 0.375)

    result_dict = {}
    rank_dict = {}
    central = k // 4
    for scores, indices in zip(list_scores, list_indices):
        # Normalize scores
        norm_scores = (scores - np.min(scores)) / (np.ptp(scores) + 1e-6)
        for rank, (score, idx) in enumerate(zip(norm_scores, indices)):
            if result_dict.get(idx) is None:
                rank_dict[idx] = [rank + 1]
                result_dict[idx] = F(rank_dict[idx], central, score)
            else:
                rank_dict[idx].append(rank + 1)
                result_dict[idx] += F(rank_dict[idx], central, score)
    # Convert result_dict to sorted arrays
    idx_image, scores = zip(*sorted(result_dict.items(), key=lambda x: x[1], reverse=True))
    return scores[:k], idx_image[:k]


def merge_features_results_within_frames(features, all_frames_results, k):
    for frm_id in all_frames_results:
        list_scores = [all_frames_results[frm_id][f][0] for f in features if f in all_frames_results[frm_id]]
        list_indices = [all_frames_results[frm_id][f][1] for f in features if f in all_frames_results[frm_id]]
        all_frames_results[frm_id] = merge_list_results(list_scores, list_indices, k)
    return all_frames_results


def calculate_final_score(methods_type, d, s_i, s_j):
    if not (1 < d <= 30):
        return s_i

    methods = {
        0: {
            10: lambda x: x**3+0.5,
            20: lambda x: x**2+0.25,
            30: lambda x: x
        },
        1: {'k': 1}
    }

    match methods_type:
        case 0:
            x = (s_i + s_j) / 2
            for key in sorted(methods[0]):
                if d <= key:
                    return methods[0][key](x)
        case 1:
            k = methods[1]['k']
            return s_i + s_j*k / d
        case _:
            return calculate_final_score(0, d, s_i, s_j)


def merge_results_all_frames(all_frames_results, frame_numbers, k, method_type=0):
    _all_frames_results = copy.deepcopy(all_frames_results)
    all_frames_scores = {idx: score for score, idx in zip(*_all_frames_results[frame_numbers])}

    for frame_id in range(frame_numbers, 1, -1):
        s__j, idx__j = _all_frames_results[frame_id]
        s__i, idx__i = _all_frames_results[frame_id - 1]

        s_i_final = []
        for i in range(k):
            s_i_list = [
                calculate_final_score(method_type, idx__j[j] - idx__i[i], s__i[i], s__j[j])
                for j in range(k)
            ]
            s_i_final.append(max(s_i_list))
            all_frames_scores[idx__i[i]] = max(s_i_final[i], all_frames_scores.get(idx__i[i], 0))

        _all_frames_results[frame_id] = (s_i_final, idx__i)
    idx, scores = zip(*sorted(all_frames_scores.items(), key=lambda x: x[1], reverse=True))
    return scores[:k], idx[:k]


frame_info = {
    1: {
        "txt": "photo of a boy walks to school",
        "img": None,
        "ocr": None,
        "idx": [1, 5, 7777],
        "tag": ["school", "sad", "tired", "bicycle", "gate"],
        "asr": "cứu tui dới",
        "obj": {
            "canvasSize": {"h": 30, "w": 30},
            "dragObject": [
                {
                    "class": "bicycle",
                    "position": [
                        {"xTop": 1, "yTop": 5, "xBot": 0.25, "yBot": 2.33},
                        {"xTop": 4, "yTop": 15, "xBot": 3.3, "yBot": 12}
                    ]
                },
                {
                    "class": "person",
                    "position": [
                        {"xTop": 1, "yTop": 5, "xBot": 0.25, "yBot": 2.33},
                        {"xTop": 4, "yTop": 15, "xBot": 3.3, "yBot": 12},
                        {"xTop": 14, "yTop": 15, "xBot": 13.3, "yBot": 12},
                        {"xTop": 16, "yTop": 15, "xBot": 13.3, "yBot": 12}
                    ]
                }
            ],
            "drawColor": [
                {"color": "blue", "position": []},
                {"color": "red", "position": []}
            ]
        }
    },
    2: {
        "txt": "but the school is on fire",
        "img": None,
        "ocr": None,
        "idx": None,
        "tag": None,
        "asr": None,
        "obj": None,
    },
    3: {
        "txt": "so he is very happy",
        "img": None,
        "ocr": None,
        "idx": None,
        "tag": None,
        "asr": None,
        "obj": None,
    }
}
features = ['clip', 'ocr', 'tag', 'obj', 'asr']
query_types = ['txt', 'img', 'ocr', 'tag', 'obj', 'asr', 'idx']

k = 10
frame_number = 3
max_frame_idx = 100
# test for random results
results = {id: {} for id in range(1, frame_number+1)}
for id in range(1, frame_number+1):
    for t in query_types:
        scores = sorted(np.random.rand(k))[::-1]
        indices = np.random.randint(1, max_frame_idx, k).tolist()
        results[id][t] = (scores, indices)


def test(frame_info=frame_info, frame_number=frame_number, k=k, results=results):
    query, qinfo = frame_info_to_query(features, frame_info)
    print("Query:", json.dumps(query, indent=2), "\n\nQuery Info:", json.dumps(qinfo, indent=2))

    # get random retrieval results because we cannot test that yet
    print(json.dumps(results, indent=2))

    all_frames_results = merge_features_results_within_frames(features, results, k)
    print("\nFrames features results Merged:", json.dumps(all_frames_results, indent=2))

    all_frames_results['all'] = merge_results_all_frames(all_frames_results, frame_number, k, 1)
    print("\nAll frames results merged:", all_frames_results['all'][1], all_frames_results['all'][0], sep='\n')


test()
