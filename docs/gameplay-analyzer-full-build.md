# Gameplay Analyzer — Full Private Research Build

## Overview

The Gameplay Analyzer is a **private research prototype** that explores turning permitted ultimate game film into teachable animated boards, coaching notes, and Learn Ultimate lesson drafts.

It is **not** production ML, **not** publicly indexed, and **not** linked from the main teaching app homepage.

| Surface | URL | Access |
|---------|-----|--------|
| Lock entry | `/gameplay-analyzer.html` | Code `ultimate-lab` or `?lab=ultimate-lab` |
| Full workspace | `/analyzer/web/index.html` | Same lock (defense in depth) |
| Public SEO teaser | `/free-ultimate-frisbee-gameplay-analyzer/` | Public, indexable, hero-only |
| Main app | `/` | Unchanged |

## Architecture

```
gameplay-analyzer.html          → lock gate → redirects to workspace
analyzer/
  web/                          → static private UI (Netlify-safe)
    index.html, analyzer.css, analyzer.js
  server/                       → Flask API (local only)
    app.py
  scripts/                      → Python pipeline modules
  data/samples/                 → demo possession JSON
  outputs/                      → local run artifacts (gitignored)
docs/
  gameplay-analyzer-full-build.md
```

### Data flow

```
Source (YouTube metadata / local upload)
  → Clip selection (start/end)
  → ingest_video
  → extract_frames (FFmpeg or stub)
  → detect_players (stub)
  → track_players (stub)
  → classify_roles (default 7v7 + UI overrides)
  → field_calibration (manual corners)
  → disc_tracking (keyframes + interpolation)
  → possession_segmentation (stub segments)
  → generate_board
  → animation_generation
  → generate_notes
  → lesson_export
  → UI board + exports
```

## Legal / footage rules

- **YouTube:** embed preview and metadata reference only. No public download UI. No claim that YouTube ripping is supported.
- **Local upload:** for footage the user owns or has permission to process.
- **Future download tooling:** must remain private, local-only, and permission-gated.
- **Reference repo** [marcwagn/ultimate_analytics](https://github.com/marcwagn/ultimate_analytics): conceptual inspiration only. No code, assets, models, or README text copied (no clear license).

## What works today

| Step | Status |
|------|--------|
| Private lock + workspace UI | Functional |
| Demo mode with sample possession | Functional |
| Clip selector UI | Functional |
| Analysis progress UI | Functional (client-side steps) |
| Video + board split view | Functional |
| Frame scrubber | Functional |
| Coaching note cards + edit | Functional |
| Player rename / team / role | Functional |
| Drag pucks on board | Functional |
| Export animation / lesson / summary / frames | Functional (client download) |
| YouTube embed preview | Functional (no download) |
| Local video preview | Functional (browser `File` API) |
| Flask API `/api/demo`, `/api/analyze` | Functional locally |
| FFmpeg frame extract | Functional when FFmpeg installed |
| Player detection / tracking | **Stub** |
| Real ML models | **Not included** |
| Auto field calibration | **Manual / default quad** |
| Disc auto-detection | **Keyframe stub + manual UI placeholder** |
| Track merge/split | **Planned** — UI stub message |
| Public backend on Netlify | **Not deployed** |

## What is stubbed / demo-only

- `detect_players.py` — synthetic bounding boxes
- `track_players.py` — greedy nearest-neighbor stub
- `classify_roles.py` — default 7o7 assignment
- `possession_segmentation.py` — fixed segment list
- `generate_notes.py` — rule-based templates
- Demo possession in `analyzer/data/samples/demo_possession.json`
- YouTube analysis returns demo board + metadata warning

## How to run locally

### Static UI + demo (no Python)

1. Serve repo root: `python3 -m http.server 8080`
2. Open `http://127.0.0.1:8080/gameplay-analyzer.html?lab=ultimate-lab`
3. Click **Load demo possession**

### Full local API

```bash
cd analyzer
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
python server/app.py
```

Open `http://127.0.0.1:5055/?lab=ultimate-lab`

Optional: analyze a permitted local file via UI upload or CLI:

```bash
python scripts/analyze_clip.py --demo
python scripts/analyze_clip.py --video /path/to/permitted.mp4
python scripts/analyze_clip.py --youtube "https://www.youtube.com/watch?v=VIDEO_ID"
```

## Testing with permitted video

1. Use only footage you have rights to process.
2. Upload via the **Upload local video** control.
3. Set clip start/end, click **Analyze clip**.
4. With local Flask server: stub detector runs; refine in corrections panel.
5. Without server: demo data loads with status message.

## Export formats

| Export | Format | Contents |
|--------|--------|----------|
| Animation JSON | `.json` | `boardFrames`, throws, demo flag |
| Lesson draft | `.json` | Learn Ultimate-style steps, positions, disc, notes |
| Coaching summary | `.txt` | Plain-text note cards |
| Board frames | `.json` | Per-frame puck positions + disc |

## Board animation output

```json
{
  "frame": 0,
  "positions": {
    "O6": { "x": 0.42, "y": 0.72, "team": "offense", "label": "CO" }
  },
  "disc": { "x": 0.48, "y": 0.58, "inAir": false }
}
```

Lesson export sample: `analyzer/data/samples/lesson_export_sample.json`

## Known hard problems

- **Disc tracking** — small, fast, occluded
- **Field calibration** — non-broadcast angles, partial field
- **Occlusion** — stacks, poaches, picks
- **Shaky camera** — handheld sidelines
- **Similar jerseys** — ID switches
- **Non-standard angles** — end-zone, low wide, drone
- **YouTube permissions** — metadata ≠ processing rights

## Public / private separation

- Main `index.html`: Tools popover link only after unlock; no homepage feature card
- Practice dropdown: unchanged
- Public SEO page: indexable, no unlock code, no live ML claims
- Analyzer workspace: `noindex, nofollow` on private pages
- Netlify deploy: static files only; no Python server

## Validation checklist

See `validate-gameplay-analyzer-full.mjs` for automated checks on lock flow, UI sections, demo mode, and main app isolation.
