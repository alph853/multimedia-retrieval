import glob
import os
import json


all_keyframe_paths = dict()
keyframes_dir = "/home/ttd/hcmai/aic2024/multimedia-retrieval/frontend/public/images"
all_keyframes = []
for batch_key in sorted(os.listdir(keyframes_dir)):
    batch = batch_key.split('_')[0]
    batch_dir = os.path.join(keyframes_dir, batch_key)

    all_keyframe_paths[batch] = dict()
    for video_key in sorted(os.listdir(batch_dir)):
        video_dir = os.path.join(batch_dir, video_key)

        keyframes = sorted(glob.glob(f'{video_dir}/*.webp'))
        keyframes = [v.replace("/home/ttd/hcmai/aic2024/multimedia-retrieval/frontend/", "") for v in keyframes]
        all_keyframe_paths[batch][video_key] = keyframes

with open("all_keyframe_paths.json", "w") as f:
    json.dump(all_keyframe_paths, f, indent=2)