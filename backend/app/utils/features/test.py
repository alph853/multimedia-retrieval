from timeit import default_timer as timer
import random
import numpy as np
import copy


method = {
    0: {
        10: lambda x: x**3+0.5,
        20: lambda x: x**2+0.25,
        30: lambda x: x
    },
    1: {'k': 1}
}


# s_final^i
def calculate_final_score(method_type, d, s_i, s_j):
    if not (1 < d <= 30):
        return s_i

    match method_type:
        case 0:
            x = (s_i + s_j) / 2
            for key in sorted(method[0]):
                if d <= key:
                    return method[0][key](x)
        case 1:
            k = method[1]['k']
            return s_i + s_j*k / d
        case _:
            return calculate_final_score(0, d, s_i, s_j)


frame_numbers = 3
k = 2
all_frames_results1 = {
    1: ([0.9, 0.7], [5, 10]),
    2: ([0.8, 0.6], [30, 18]),
    3: ([0.85, 0.75], [80, 30])
}


frame_numbers = 3
k = 200

all_frames_results2 = {
    frame_id: (np.random.rand(k), np.random.randint(1, 100000, k))
    for frame_id in range(1, frame_numbers + 1)
}


# all_frame_results = {frame_id: (s_i, idx_i)} with s_i and idx_i shape (k,) each


def merge_results_all_frames(all_frames_results, frame_numbers, k, method_type=0):
    _all_frames_results = copy.deepcopy(all_frames_results)
    all_frames_scores = {}
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
    return scores, idx


method_type = 0
s = timer()
print(merge_results_all_frames(all_frames_results2, frame_numbers, k, method_type=method_type))
e = timer()

print(f'{e - s:0.6f} seconds')
