"""Generate Learn Ultimate-style animation steps from board frames."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


def pick_key_frames(board_frames: list[dict[str, Any]], count: int = 3) -> list[int]:
    if not board_frames:
        return []
    if len(board_frames) <= count:
        return list(range(len(board_frames)))
    step = max(1, len(board_frames) // count)
    return [min(i * step, len(board_frames) - 1) for i in range(count)]


def generate_animation(board_frames: list[dict[str, Any]], title: str = "Analyzed possession") -> dict[str, Any]:
    keys = pick_key_frames(board_frames, 3)
    steps = []
    for i, fi in enumerate(keys):
        fr = board_frames[fi]
        steps.append(
            {
                "title": f"Step {i + 1}",
                "frame": fi,
                "positions": fr["positions"],
                "disc": fr["disc"],
                "routes": [],
                "body": f"Board state at frame {fi}.",
            }
        )
    return {
        "title": title,
        "steps": steps,
        "timing": {"fps": 10, "keyFrames": keys},
        "stub": True,
    }


if __name__ == "__main__":
    bf = json.loads(Path("analyzer/outputs/board_frames.json").read_text())
    anim = generate_animation(bf.get("frames", []))
    out = Path("analyzer/outputs/animation.json")
    out.write_text(json.dumps(anim, indent=2))
    print(json.dumps({"steps": len(anim["steps"])}))
