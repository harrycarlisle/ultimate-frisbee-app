"""Player detection — stub detector with optional OpenCV path later."""

from __future__ import annotations

import json
import random
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any


@dataclass
class Detection:
    frame: int
    x: float
    y: float
    w: float
    h: float
    confidence: float
    label: str = "player"

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


def detect_players_stub(frame_count: int, seed: int = 42) -> list[Detection]:
    """Return synthetic detections for pipeline testing."""
    rng = random.Random(seed)
    detections: list[Detection] = []
    player_count = 10
    for frame in range(frame_count):
        for i in range(player_count):
            base_x = 0.15 + (i % 5) * 0.15
            base_y = 0.25 + (i // 5) * 0.35
            detections.append(
                Detection(
                    frame=frame,
                    x=max(0.02, min(0.95, base_x + rng.uniform(-0.03, 0.03))),
                    y=max(0.05, min(0.95, base_y + rng.uniform(-0.02, 0.02) + frame * 0.002)),
                    w=0.04,
                    h=0.08,
                    confidence=round(rng.uniform(0.55, 0.92), 3),
                    label="player",
                )
            )
    return detections


def run_detect(frame_count: int = 85) -> dict[str, Any]:
    dets = detect_players_stub(frame_count)
    return {
        "stub": True,
        "model": None,
        "frame_count": frame_count,
        "detections": [d.to_dict() for d in dets],
        "message": "Stub detector — replace with real model when weights are available.",
    }


if __name__ == "__main__":
    import argparse

    p = argparse.ArgumentParser()
    p.add_argument("--frames", type=int, default=85)
    p.add_argument("--out", type=Path, default=Path("analyzer/outputs/detections.json"))
    args = p.parse_args()
    result = run_detect(args.frames)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(result, indent=2))
    print(json.dumps({"detections": len(result["detections"]), "stub": result["stub"]}))
