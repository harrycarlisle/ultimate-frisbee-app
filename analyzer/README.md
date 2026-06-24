# Gameplay Analyzer (Private Research Build)

Private end-to-end prototype for turning permitted ultimate game film into teachable animated boards.

**Not deployed publicly.** The static teaching app on Netlify serves the locked UI only. Run the Python server locally for full pipeline testing.

## Quick start

### Static UI only (demo mode)

1. Unlock `gameplay-analyzer.html` with code `ultimate-lab` (or `?lab=ultimate-lab`).
2. Open the full analyzer workspace in the browser.
3. Click **Load demo possession** to run the full UI with sample data.

### Local API + pipeline

```bash
cd analyzer
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
python server/app.py
```

Server: http://127.0.0.1:5055

Set API base in the UI (defaults to same origin when served by Flask).

## Legal / footage

- **YouTube:** metadata/embed preview only — no public download.
- **Local upload:** for footage you own or have permission to process.
- **YouTube download tooling:** not exposed publicly; any future local-only download must stay permission-gated.

## Pipeline modules

| Script | Status |
|--------|--------|
| `ingest_video.py` | YouTube metadata + local upload |
| `extract_frames.py` | FFmpeg when available, else stub |
| `detect_players.py` | Stub detector |
| `track_players.py` | Stub tracker |
| `classify_roles.py` | Default 7v7 + manual overrides |
| `field_calibration.py` | Manual corner mapping |
| `disc_tracking.py` | Keyframes + interpolation |
| `possession_segmentation.py` | Stub segments |
| `generate_board.py` | Board frames from tracks |
| `animation_generation.py` | Step keyframes |
| `generate_notes.py` | Rule-based notes |
| `lesson_export.py` | Learn Ultimate JSON draft |
| `analyze_clip.py` | Orchestrator |

## Outputs

Written to `analyzer/outputs/` (gitignored content except `.gitkeep`).

## Reference

Inspired conceptually by [ultimate_analytics](https://github.com/marcwagn/ultimate_analytics). No code, assets, or models copied.
