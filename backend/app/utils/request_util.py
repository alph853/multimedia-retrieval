MAX_K = 200
MAX_NUMBER_OF_FRAMES = 10


def check_invalid_request(q):
    """Modify the request object to make it valid, and return an error message if it is invalid.
    
    maximum number of queried frames is 10
    maximum number of retrieved frames is 200
    
    if frame_info of some queried frame has no information, decrease number_of_frames by 1 and remove the frame
    """
    q.frame_info = {k: v.model_dump() for k, v in q.frame_info.items()}
    frame_info = q.frame_info

    if len(frame_info.keys()) != q.number_of_frames:
        return ("frame_info should have the same number of frames as number_of_frames")

    q.number = max(min(q.number, MAX_K), 1)
    q.number_of_frames = max(min(q.number_of_frames, MAX_NUMBER_OF_FRAMES), 1)

    for frame_id in list(frame_info.keys()):
        for feature in ('tag', 'idx', 'txt', 'img', 'ocr', 'obj', 'asr'):
            if not frame_info[frame_id][feature]:
                frame_info[frame_id][feature] = None
        if all(v is None for v in frame_info[frame_id].values()):
            q.number_of_frames -= 1
            del frame_info[frame_id]

    if q.number_of_frames == 0:
        return ("All frame_info has no information")
    
    return None


def parse_object_retrieval_request(frame_info):
    return frame_info