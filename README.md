# multimedia-retrieval

## Backend

For Windows users, please run on linux platform using VMs or WSL2

First, navigate to the `backend` directory to install required packages:

```bash
.../multimedia-retrieval$ cd backend
```

Then run:

```bash
conda create -n multimedia-retrieval python=3.11 -y
conda activate multimedia-retrieval
pip install -r requirements.txt 
pip install git+https://github.com/openai/CLIP.git 
conda install -c pytorch/label/nightly -c nvidia faiss-gpu -y
python -m spacy download en
```

Then go to `app` directory, you can run just using this command:

`fastapi dev app.py`

which stores results in /backend/app/result.json

(You can modify the input query in /backend/app/example.json)
