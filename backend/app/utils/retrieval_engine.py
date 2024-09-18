import bisect
import copy
import os

import json

import numpy as np
from .features import (
    ClipRetrieval, ObjectRetrieval, OcrRetrieval, SpeechRetrieval,
    TagRetrieval, TagAssistant, PromptAssistant, PROJECT_ROOT, ROOT,
    merge_list_results, translator
)

from timeit import default_timer as timer

class History:
    def __init__(self, filename: str, query_type: str, request: dict, csv_content: list[str]):
        self.filename = filename
        self.request = request
        self.csv_content = csv_content
        self.query_type = query_type


class RetrievalEngine:
    """
        Process query frame information and return retrieval results.

        This method performs the following steps:
            1. Converts frame info to query and query info.
            (Refer to test.py for frame info format)
            (Run 'test.py/test()' to see query and query_info format)
            2. Retrieves results for each feature.
            3. Groups query results by frames, converting them to the initial format.
            4. Merges results of features within each frame.
            5. Merges results between frames for temporal search.
        
        We have to convert frame info to query and query info because if we perform search for each frame, it will affect performance. 
        So, we combine each frame features into one query and perform search once.
        Then, we assign the results to each frame again to calculate top-k scores. Finally perform temporal search. 

        Args:
            frame_number (int): Number of query frames.
            frame_info (dict): Frame information (format specified in 'request_format.md').
            k (int): Top k results to retrieve.

        Returns:
            dict: A dictionary with frame IDs as keys and tuples of scores, image paths, and infos as values.

        Example:
            With k=3, the returned dictionary might look like:

            .. code-block:: python
                {
                    1: ([0.9, 0.8, 0.7], [p1, p2, p3], [info1, info2, info3]),
                    2: ([0.85, 0.75, 0.65], [p4, p5, p6], [info4, info5, info6]),
                    ...
                }
                (p1, p2, etc are image paths)
    """

    def __init__(self, id2img_fps='dict/id2img_fps.json', all_video_info='dict/all_video_info.json'):
        self.feature_retrievers = {
            'tag': TagRetrieval(),
            'clip': ClipRetrieval(),
            'ocr': OcrRetrieval(),
            # 'obj': ObjectRetrieval(),
            # 'asr': SpeechRetrieval(),
        }
        self.all_video_info = json.load(open(os.path.join(PROJECT_ROOT, all_video_info), 'r', encoding='utf-8'))
        self.id2img_fps = load_json_int_key(os.path.join(PROJECT_ROOT, id2img_fps))
        self.features = self.feature_retrievers.keys()
        self.query_types = ['txt', 'img', 'idx', 'tag', 'ocr', 'obj', 'asr']
        self.method_type = 0
        self.tag_assistant = TagAssistant()
        self.translator = translator
        
        self.history = {}

    def __call__(self, frame_number: int, frame_info: dict, k: int):
        query, query_info = frame_info_to_query(self.features, frame_info)
        results = self.get_retrieval_results(query, k)
        all_frames_results = group_query_results_by_frames(self.features, results, query_info, frame_number)
        all_frames_results = merge_features_results_within_frames(self.query_types, all_frames_results, k)

        if frame_number > 1:
            all_frames_results['all'] = merge_results_all_frames(all_frames_results, frame_number, k, self.method_type)

        results = self.map_ids_to_paths(all_frames_results)
        return results

    def get_retrieval_results(self, query, k):
        results = {}
        for f in query.keys():
            results[f] = self.feature_retrievers[f](query[f], k) if query[f] is not None else None
        return results
    
    def get_id_from_filename(self, batch, video, filename):
        try:
            all_filename = self.all_video_info[batch][video]['files']
            index_filename = all_filename.index(filename)
        except ValueError:
            # Handle the case where filename is not found
            return -1
        
        index_filename = self.all_video_info[batch][video]["files"][index_filename]
        
        idx_frm = 0;
        for batch_key in sorted(self.all_video_info.keys()):
            for video_key in sorted(self.all_video_info[batch_key].keys()):
                if batch_key == batch and video_key == video:
                    idx_frm += index_filename
                    return idx_frm
                idx_frm += (self.all_video_info[batch_key][video_key]["files"][-1] + 1 )
                
        return -1
    
    def get_id_from_frm_number(self, batch, video, frm_number):
        try:
            all_frame_numbers = self.all_video_info[batch][video]['frm_numbers']
            index_frm_number = all_frame_numbers.index(frm_number)
        except ValueError:
            pos = bisect.bisect_left(all_frame_numbers, frm_number)
            
            if pos == 0:
                nearest_frm_number = all_frame_numbers[0]
            elif pos == len(all_frame_numbers):
                nearest_frm_number = all_frame_numbers[-1]
            else:
                before = all_frame_numbers[pos - 1]
                after = all_frame_numbers[pos]
                nearest_frm_number = after if after - frm_number < frm_number - before else before
            
            index_frm_number = all_frame_numbers.index(nearest_frm_number)
        
        frame_id = 0
        for batch_key in sorted(self.all_video_info.keys()):
            for video_key in sorted(self.all_video_info[batch_key].keys()):
                if batch_key == batch and video_key == video:
                    frame_id += index_frm_number
                    return frame_id
                frame_id += len(self.all_video_info[batch_key][video_key]['frm_numbers'])
        return -1
        
    def get_frame_info(self, batch, video, filename):
        filename = int(filename)

        frm_id = self.get_id_from_filename(batch, video, filename)
        return self.map_info(frm_id) if frm_id != -1 else None
    
    def map_info(self, frm_id, answer=""):
        info = self.id2img_fps[int(frm_id)]
        info['frm_id'] = frm_id

        video_key = info['scene_id'].split('/')
        batch_key = video_key[1]
        video_key = video_key[2]
        format = f"{batch_key}_{video_key}, {info['frm_number']}"
        fps = self.all_video_info[batch_key][video_key]['fps']

        timeframe = int(info['frm_number']) // int(fps)
        info['format'] = format
        info['timeframe'] = timeframe
        info['publish_date'] = self.all_video_info[batch_key][video_key]['publish_date']
        info['watch_url'] = self.all_video_info[batch_key][video_key]['watch_url'] + f'&t={timeframe}s'
        info['answer'] = answer
        
        return info
    
    def add_to_history(self, filename, request, csv_content): 
        file_info = filename.split('-')
        question_number = int(file_info[2])
        query_type = file_info[3]
        
        self.history[question_number] = History(
            filename=filename,
            request=request,
            csv_content=csv_content,
            query_type=query_type
        )
        
        return "Add to history successfully"
        
        
    def get_history(self):
        return {question_num: self.history[question_num] for question_num in sorted(self.history.keys())}
    
    def get_history_result_by_question(self, question_number):
        if question_number not in self.history.keys():
            return None
        
        all_results = self.history[question_number].csv_content
        query_type = self.history[question_number].query_type
        
        infos = []        
        for line in all_results:
            line = line.split(',')
            format = line[0]
            frame_number = int(line[1])
            
            batch_key = format.split('_')[0]
            video_key = format.split('_')[1]
            
            frm_id = self.get_id_from_frm_number(batch_key, video_key, frame_number)
            
            if query_type == 'qa':
                answer = line[2]
            
            info = self.map_info(frm_id, answer)
            infos.append(info)
        
        return infos
    
    def get_output_by_timeframe(self, batch, video, timeframe: str):
        fps = self.all_video_info[batch][video]['fps']
        timeframe = timeframe.split(':')
        frm_number = (int(timeframe[0]) * 60 + int(timeframe[1])) * int(fps)
        return f'{batch}_{video}, {frm_number}'
    
    def map_ids_to_paths(self, all_frames_results):
        result_paths = {}
        for frame_id in all_frames_results:
            list_scores = all_frames_results[frame_id][0]
            list_indices = all_frames_results[frame_id][1]

            infos_query = list(map(self.id2img_fps.get, list(list_indices)))

            for info, score, index in zip(infos_query, list_scores, list_indices):
                info['score'] = score
                info['frm_id'] = index

                video_key = info['scene_id'].split('/')
                batch_key = video_key[1]
                video_key = video_key[2]
                format = f"{batch_key}_{video_key}, {info['frm_number']}"
                fps = self.all_video_info[batch_key][video_key]['fps']

                timeframe = int(info['frm_number']) // int(fps)
                info['format'] = format
                info['timeframe'] = timeframe
                info['publish_date'] = self.all_video_info[batch_key][video_key]['publish_date']
                info['watch_url'] = self.all_video_info[batch_key][video_key]['watch_url'] + f'&t={timeframe}s'
                info['answer'] = ""          

            result_paths[frame_id] = infos_query

        result_paths = json.dumps(result_paths, indent=2, default=custom_serializer)
        with open(os.path.join(PROJECT_ROOT, 'result.json'), 'w') as f:
            f.write(result_paths)

        return result_paths
    
    
    def get_tag_assistant(self, query: str, num_tags: int):
        query = self.translator(query)
        return self.tag_assistant(query, num_tags)

    def get_prompt_assistant(self, query: str):
        return self.prompt(query)



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

    print("Transformed Query: ", query)

    return query, qinfo


def group_query_results_by_frames(features, results, query_info, frame_number):
    """Group query results by frames (actually convert it to the iniital format)

    Args:
        results (dict): results of retrieval `{feature: (scores, indices)}`
        query_info (dict): mapping between frame_id and feature results

    Returns:
        dict: similar to frame_info `{frame_id: {feature: (scores, indices)}}` except that None features are removed
    """
    all_frames_results = {frm_id: {} for frm_id in range(1, frame_number + 1)}

    clip_results = results.get('clip')
    if clip_results is not None:
        for t in ['txt', 'img', 'idx']:
            clip_t_results = clip_results.get(t)
            if clip_t_results is None:
                continue
            frame_ids = query_info.get('clip', {}).get(t, [])
            for i, id in enumerate(frame_ids):
                all_frames_results[id][t] = (clip_t_results[0][i], clip_t_results[1][i])

    for f in features:
        if f == "clip" or results.get(f) is None:
            continue
        frame_ids = query_info.get(f, [])
        for i, id in enumerate(frame_ids):
            all_frames_results[id][f] = (results[f][0][i], results[f][1][i])  # (scores, indices)

    return all_frames_results


def merge_features_results_within_frames(query_types, all_frames_results, k):
    for frm_id in all_frames_results:
        list_scores = [all_frames_results[frm_id][t][0] for t in query_types if t in all_frames_results[frm_id]]
        list_indices = [all_frames_results[frm_id][t][1] for t in query_types if t in all_frames_results[frm_id]]
        all_frames_results[frm_id] = merge_list_results(list_scores, list_indices, k)
    return all_frames_results


def load_json_int_key(path):
    with open(path, 'r') as f:
        return {int(k): v for k, v in json.load(f).items()}


def calculate_final_score(methods_type, d, s_i, s_j):
    if not (1 < d <= 30):
        return s_i

    if methods_type == 0:
        x = (s_i + s_j) / 2
        bounded_frames = {
            10: lambda x: x**3+0.5,
            20: lambda x: x**2+0.25,
            30: lambda x: x
        }
        for key in sorted(bounded_frames):
            if d <= key:
                return bounded_frames[key](x)
    elif methods_type == 1:
        k = 1
        return s_i + s_j*k / d
    else:
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


def custom_serializer(obj):
    if isinstance(obj, np.int64):
        return int(obj)
    if isinstance(obj, np.float32):
        return float(obj)
    raise TypeError(f"Object of type {type(obj)} is not JSON serializable")





