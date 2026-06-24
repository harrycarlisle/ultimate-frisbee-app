"""Disc tracking with manual keyframe support."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


def interpolate_disc(keyframes: list[dict[str, Any]], frame: int) -> dict[str, Any]:
    if not keyframes:
        return {"x": 0.5, "y": 0.5, "inAir": False}
    if frame <= keyframes[0]["frame"]:
        k = keyframes[0]
        return {"x": k["x"], "y": k["y"], "inAir": k.get("inAir", False)}
    if frame >= keyframes[-1]["frame"]:
        k = keyframes[-1]
        return {"x": k["x"], "y": k["y"], "inAir": k.get("inAir", False)}
    for a, b in zip(keyframes, keyframes[1:]):
        if a["frame"] <= frame <= b["frame"]:
            t = (frame - a["frame"]) / max(b["frame"] - a["frame"], 1)
            return {
                "x": round(a["x"] + t * (b["x"] - a["x"]), 4),
                "y": round(a["y"] + t * (b["y"] - a["y"]), 4),
                "inAir": a.get("inAir", False) or b.get("inAir", False),
            }
    return {"x": 0.5, "y": 0.5, "inAir": False}


def build_disc_track(keyframes: list[dict[str, Any]], frame_count: int) -> list[dict[str, Any]]:
    return [{"frame": f, **interpolate_disc(keyframes, f)} for f in range(frame_count)]


if __name__ == "__main__":
    demo = [
        {"frame": 0, "x": 0.42, "y": 0.72},
        {"frame": 42, "x": 0.55, "y": 0.48, "inAir": True},
        {"frame": 72, "x": 0.72, "y": 0.32},
    ]
    track = build_disc_track(demo, 85)
    out = Path("analyzer/outputs/disc_track.json")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps({"keyframes": demo, "track": track}, indent=2))
    print(json.dumps({"frames": len(track)}))
