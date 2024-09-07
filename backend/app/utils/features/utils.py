import numpy as np


def merge_list_results(list_scores, list_indices, k):
    """Merge all lists of scores and indices IN A FRAME to a single list of scores and indices

    Args:
        list_scores (list) 
        list_indices (list)
        
    Returns:
        Tuple: (scores, indices)
    """

    result_dict = {}
    for scores, indices in zip(list_scores, list_indices):
        # Normalize scores
        # norm_scores = (scores - np.min(scores)) / (np.ptp(scores) + 1e-6)
        # for rank, (score, idx) in enumerate(zip(norm_scores, indices)):
        for (score, idx) in (zip(scores, indices)):
            if result_dict.get(idx) is None:
                result_dict[idx] = score
            else:
                result_dict[idx] += score
    # Convert result_dict to sorted arrays
    # print(sorted(result_dict.items(), key=lambda x: x[1], reverse=True))

    idx_image, scores = zip(*sorted(result_dict.items(), key=lambda x: x[1], reverse=True))
    print(scores)
    # scores = (scores - np.min(scores)) / (np.ptp(scores) + 1e-6)
    return scores[:k], idx_image[:k]


list_scores = [[0.5, 0.4, 0.3, 0.2], [0.4, 0.3, 0.2, 0.1]]
list_indices = [[0, 1, 2, 3], [0, 7, 2, 4]]

# print(merge_list_results(list_scores, list_indices, 3))
