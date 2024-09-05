import numpy as np


def merge_list_results(list_scores, list_indices, k):
    """Merge all lists of scores and indices to a single list of scores and indices

    Args:
        list_scores (list) 
        list_indices (list)
        
    Returns:
        Tuple: (scores, indices)
    """

    def F(rank_list, central, score):
        bonus = sum([central/rank for rank in rank_list])
        bonus /= (len(rank_list) * central*10 + 1)
        return bonus + score

    result_dict = {}
    rank_dict = {}
    central = k // 2

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
    # print(sorted(result_dict.items(), key=lambda x: x[1], reverse=True))

    idx_image, scores = zip(*sorted(result_dict.items(), key=lambda x: x[1], reverse=True))
    scores = (scores - np.min(scores)) / (np.ptp(scores) + 1e-6)
    return scores[:k], idx_image[:k]


list_scores = [[0.5, 0.4, 0.3, 0.2], [0.4, 0.3, 0.2, 0.1]]
list_indices = [[0, 1, 2, 3], [0, 7, 2, 4]]

# print(merge_list_results(list_scores, list_indices, 3))
