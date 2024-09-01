# Multimedia-retrieval backend engine

## Directory Structure of encoded data

dict/
├── id2img_fps.json
├── clip/
│   └── clip_model_info.json
├── faiss_clip_index/
│   ├── model1.bin
│   ├── model2.bin
│   └── model3.bin
├── obj/
│   ├── context/
│   │   ├── bbox_encoded.npz
│   │   ├── color_encoded.bin
│   │   └── ...
│   └── transform/
│       └── bbox_transform.pkl
├── ocr/
│   └── ocr_encoded.bin
└── tag/
    ├── tags_encoded.npz
    └── tags_tfidf_transform.pkl
└──...some other mapping files
