# Gameplay Analyzer Prototype

## What this is

Gameplay Analyzer is a future feature that turns ultimate video into a tactical board, then uses that board to teach spacing, cuts, resets, and scoring patterns.

The main teaching app should stay static, fast, and reliable. Gameplay Analyzer is a separate prototype track. The older internal name was Video Lab.

## External reference

Reference repo: <https://github.com/marcwagn/ultimate_analytics>

That repo explores player detection/tracking and a bird's-eye tactical dashboard for ultimate footage. It uses YOLOv8 for player detection, a Kedro data pipeline, and a Flask/Celery web app for video analysis.

## What we tested

- Clone location: `experiments/ultimate-analytics/`
- The folder is ignored and not committed.
- The repo cloned successfully at commit `08270732d4c33a98506b39fdbd2f25cdb1837aaf`.
- Top-level README was inspected.
- `ultimate-pipeline/README.md` was inspected.
- `web-app/requirements.txt`, `web-app/requirements.lock`, `web-app/docker-compose.yml`, `web-app/src/app.py`, and YOLO helper code were inspected.

Commands attempted:

```bash
git clone https://github.com/marcwagn/ultimate_analytics experiments/ultimate-analytics
python3 -m venv experiments/ultimate-analytics/.venv
```

What worked:

- The external repo cloned.
- The web app structure and pipeline docs are readable.
- Test data includes labels/tracking text and sample annotation JSON.

What failed:

- Python virtual environment creation failed because `ensurepip` is unavailable in this system Python. The error asks for the OS package `python3.12-venv`.
- Because the venv could not be created safely, no dependencies were installed.
- No Streamlit/Flask demo was run.

Dependencies required by the prototype:

- Python 3.11-style lock files
- Flask
- Celery
- Redis
- OpenCV
- pandas/numpy
- scikit-learn
- Google Cloud logging packages
- YOLO/Ultralytics
- Torch/torchvision CPU wheels
- Kedro for the data pipeline
- Supervisely API access for training data

Model/data status:

- Training data is not included. It must be downloaded from Supervisely.
- Trained YOLO weights are not included.
- No local demo video or model asset was found.
- Running full video analysis locally needs data/model setup first.

## What we should not do yet

- Do not put ML/video dependencies into the static teaching app.
- Do not block the main app on this prototype.
- Do not promise instant production video analysis yet.
- Do not commit large video/model/dataset files.
- Do not add YOLO, Kedro, Streamlit, Redis, Celery, or Python build steps to the Netlify teaching app.

## Product direction

Working name: **Gameplay Analyzer**

Other name ideas:

- Video Lab
- Film to Field
- Clip to Chalkboard
- Video to Playbook

User promise:

> Upload a clip. Turn the play into a tactical board. See what actually happened.

## MVP scope

### Phase 1

- landing-page feature card
- upload UI mockup
- sample clip placeholder
- "prototype" status
- docs for the external prototype

### Phase 2

- manual video-to-puck timeline
- user marks players manually
- generate teachable animation from a clip

### Phase 3

- automated player tracking
- tactical board generation
- compare real spacing to lessons

## Integration plan

The current app stays static. Gameplay Analyzer can become:

- a separate route
- a separate prototype app
- a linked lab page
- eventually a backend-powered feature

Keep the teaching app and the video-analysis system separate until there is a clear backend/deployment plan.

## Public status

Gameplay Analyzer is hidden from the public homepage. Access is locked behind a subtle top-right tools control on `index.html` (access code in source). Direct visits to `gameplay-analyzer.html` also require unlock.
