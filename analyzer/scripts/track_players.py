"""Assign persistent track IDs across frames."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


def track_players_from_detections(detections: list[dict[str, Any]], track_count: int = 10) -> dict[str, Any]:
    """Greedy nearest-neighbor stub tracker."""
    tracks: dict[str, list[list[float]]] = {f"T{i+1}": [] for i in range(track_count)}
    by_frame: dict[int, list[dict[str, Any]]] = {}
    for d in detections:
        by_frame.setdefault(d["frame"], []).append(d)

    prev_centers: list[tuple[float, float]] = []
    for frame in sorted(by_frame):
        frame_dets = by_frame[frame][:track_count]
        for i, det in enumerate(frame_dets):
            tid = f"T{i+1}"
            cx = det["x"] + det["w"] / 2
            cy = det["y"] + det["h"] / 2
            tracks[tid].append([round(cx, 4), round(cy, 4)])
        while len(frame_dets) < track_count:
            tid = f"T{len(frame_dets)+1}"
            if tracks[tid]:
                tracks[tid].append(tracks[tid][-1])
            else:
                tracks[tid].append([0.5, 0.5])
            frame_dets = frame_dets + [None]  # type: ignore

    return {
        "stub": True,
        "tracks": tracks,
        "message": "Stub tracker — manual role assignment required in UI.",
    }


if __name__ == "__main__":
    import argparse

    p = argparse.ArgumentParser()
    p.add_argument("--detections", type=Path, default=Path("analyzer/outputs/detections.json"))
    p.add_argument("--out", type=Path, default=Path("analyzer/outputs/tracks.json"))
    args = p.parse_args()
    data = json.loads(args.detections.read_text())
    result = track_players_from_detections(data.get("detections", []))
    args.out.write_text(json.dumps(result, indent=2))
    print(json.dumps({"tracks": len(result["tracks"]), "stub": result["stub"]}))
