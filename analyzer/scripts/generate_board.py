"""Convert tracks to simplified board frames."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


def smooth_point(points: list[list[float]], idx: int, window: int = 3) -> list[float]:
    if not points:
        return [0.5, 0.5]
    lo = max(0, idx - window)
    hi = min(len(points), idx + window + 1)
    chunk = points[lo:hi]
    if not chunk:
        return [0.5, 0.5]
    x = sum(p[0] for p in chunk) / len(chunk)
    y = sum(p[1] for p in chunk) / len(chunk)
    return [round(x, 4), round(y, 4)]


def generate_board_frames(
    tracks: dict[str, list[list[float]]],
    players: list[dict[str, Any]],
    disc_track: list[dict[str, Any]] | None = None,
) -> list[dict[str, Any]]:
    track_by_player = {p.get("id"): tracks.get(p.get("trackId", p["id"]), []) for p in players}
    max_frames = max((len(v) for v in tracks.values()), default=0)
    frames: list[dict[str, Any]] = []
    for fi in range(max_frames):
        positions = {}
        for p in players:
            pts = track_by_player.get(p["id"], [])
            xy = smooth_point(pts, fi)
            positions[p["id"]] = {
                "x": xy[0],
                "y": xy[1],
                "team": p["team"],
                "label": p["label"],
            }
        disc = disc_track[fi] if disc_track and fi < len(disc_track) else {"x": 0.5, "y": 0.5}
        frames.append({"frame": fi, "positions": positions, "disc": disc})
    return frames


if __name__ == "__main__":
    sample = Path("analyzer/data/samples/demo_possession.json")
    data = json.loads(sample.read_text())
    frames = generate_board_frames(data["tracks"], data["players"], None)
    out = Path("analyzer/outputs/board_frames.json")
    out.write_text(json.dumps({"frames": frames}, indent=2))
    print(json.dumps({"board_frames": len(frames)}))
