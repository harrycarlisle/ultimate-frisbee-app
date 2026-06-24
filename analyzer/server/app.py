"""Private Gameplay Analyzer local API server.

Run locally only — not deployed to Netlify.
"""

from __future__ import annotations

import json
import sys
import tempfile
from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from analyze_clip import analyze_clip, load_demo

WEB_DIR = ROOT / "web"
SAMPLES_DIR = ROOT / "data" / "samples"

app = Flask(__name__, static_folder=str(WEB_DIR), static_url_path="")
CORS(app, resources={r"/api/*": {"origins": "*"}})


@app.get("/api/health")
def health():
    return jsonify({"ok": True, "service": "gameplay-analyzer", "mode": "private"})


@app.get("/api/demo")
def demo():
    return jsonify(load_demo())


@app.post("/api/analyze")
def analyze():
    payload = request.get_json(silent=True) or {}
    demo = bool(payload.get("demo"))
    youtube = payload.get("youtubeUrl")
    start = float(payload.get("startSec", 0))
    end = payload.get("endSec")
    end_f = float(end) if end is not None else None

    video_path = None
    if "video" in request.files:
        f = request.files["video"]
        if f.filename:
            tmp = Path(tempfile.mkdtemp(prefix="ufc-analyzer-"))
            dest = tmp / f.filename
            f.save(dest)
            video_path = dest

    if not demo and not youtube and not video_path:
        return jsonify({"error": "Provide demo mode, YouTube URL, or video upload"}), 400

    try:
        result = analyze_clip(
            demo=demo,
            video_path=video_path,
            youtube_url=youtube,
            start_sec=start,
            end_sec=end_f,
        )
        return jsonify(result)
    except Exception as exc:  # noqa: BLE001 — private research API
        return jsonify({"error": str(exc)}), 500


@app.get("/api/samples/<path:filename>")
def samples(filename: str):
    return send_from_directory(SAMPLES_DIR, filename)


@app.get("/")
def index():
    return send_from_directory(WEB_DIR, "index.html")


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5055, debug=True)
