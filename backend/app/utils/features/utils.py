import copy
import numpy as np


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


# s_final^i
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
