import glob
import os


def ocr_inference(ocr_path = 'dict/ocr/inference'):
    inference = []
    for batch_key in sorted(os.listdir(ocr_path)):
        batch_path = os.path.join(ocr_path, batch_key)
        
        for inference_path in sorted(glob.glob(os.path.join(batch_path, '*.txt'))):
            with open(inference_path, 'r') as f:
                inference.extend(f.readlines())
    return inference

OCR = ocr_inference()