import os
import json
from .features import (
    ClipRetrieval, ObjectRetrieval, OcrRetrieval, SpeechRetrieval,
    TagRetrieval, TagAssistant, PromptAssistant, PROJECT_ROOT,
    merge_list_results, merge_results_all_frames
)


class RetrievalEngine:
    def __init__(self, id2img_fps='dict/id2img_fps.json'):
        self.retrieval_features = {
            'clip': ClipRetrieval(),
            'ocr': OcrRetrieval(),
            'tag': TagRetrieval(),
            'obj': ObjectRetrieval(),
            'asr': SpeechRetrieval(),
        }
        self.id2img_fps = self.load_json_int_key(os.path.join(PROJECT_ROOT, id2img_fps))
        self.features = self.retrieval_features.keys()

    def __call__(self, frame_number: int, frame_info: dict, k: int):
        query, query_info = self.frame_info_to_query(frame_info, frame_number)
        results = self.get_retrieval_results(query, k)
        all_frames_results = self.group_query_results_by_frames(results, query_info)

        for frm_id in all_frames_results:
            list_scores = [all_frames_results[frm_id][f][0] for f in self.features if f in all_frames_results[frm_id]]
            list_indices = [all_frames_results[frm_id][f][1] for f in self.features if f in all_frames_results[frm_id]]
            all_frames_results[frm_id] = merge_list_results(list_scores, list_indices, k)

        if frame_number == 1:
            return all_frames_results[1][0], self.map_ids_to_paths(all_frames_results[1][1])

        all_frames_results['all'] = merge_results_all_frames(all_frames_results, frame_number, k)

        for frame_id in all_frames_results:
            all_frames_results[frame_id] = all_frames_results[frame_id][0], self.map_ids_to_paths(
                all_frames_results[frame_id][1])

        return all_frames_results

    def frame_info_to_query(self, frame_info: dict, frame_number: int):
        """Convert frame info input format to query and query info

        Args:
            frame_number (int): number of frames
            frame_info (dict): dictionary with format ```{frame_id: {feature: value}}``` 
            
                e.g ```{0: {'txt': 'hello', 'img': null, 'ocr': 'hello', 'tag': 'hello', 'obj': null, 'asr': null}, 1: {...}, ...}```

        Returns:
            Tuple: `(query, query_info)` with `query` is the input for retrieval and `query_info` is the mapping between frame_id and feature values
        """
        query = {}
        qinfo = {}

        for f in self.features:
            query[f] = qinfo[f] = {}
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

        qinfo['frame_number'] = frame_number
        return query, qinfo

    def get_retrieval_results(self, query, k):
        results = {}
        for f in query.keys():
            results[f] = self.retrieval_features[f](query[f], k) if query[f] is not None else None
        return results

    def group_query_results_by_frames(self, results, query_info, k):
        """Group query results by frames (actually convert it to the iniital format)

        Args:
            results (dict): results of retrieval `{feature: (scores, indices)}`
            query_info (dict): mapping between frame_id and feature results

        Returns:
            dict: similar to frame_info `{frame_id: {feature: (scores, indices)}}` except that None features are removed
        """
        all_frames_results = {frm_id: {} for frm_id in range(query_info['frame_number'])}

        if results['clip'] is not None:
            for t in ['txt', 'img', 'idx']:
                if results['clip'][t] is None:
                    continue
                frame_ids = query_info['clip'][t]
                for i, id in enumerate(frame_ids):
                    all_frames_results[id][t] = (results['clip'][t][0][i], results['clip'][t][1][i])

        for f in self.features:
            if results[f] in (None, "clip"):
                continue
            frame_ids = query_info[f]
            for i, id in enumerate(frame_ids):
                all_frames_results[id][f] = (results[f][0][i], results[f][1][i])    # (scores, indices)

        return all_frames_results

    def map_ids_to_paths(self, list_idx):
        infos_query = list(map(self.id2img_fps.get, list(list_idx)))
        image_paths = [info['image_path'] for info in infos_query]
        return infos_query, image_paths

    def load_json_int_key(self, path):
        with open(path, 'r') as f:
            return {int(k): v for k, v in json.load(f).items()}


class Assistant:
    def __init__(self):
        self.tag_assistant = TagAssistant()
        self.prompt_assistant = PromptAssistant()

    def tag_assistant(self, query: str | list[str]):
        return self.tag_assistant(query)

    def prompt_assistant(self, query: str):
        return self.prompt_assistant(query)
