"""Possession segmentation — manual override friendly."""

from __future__ import annotations

import json
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any


@dataclass
class Possession:
    id: str
    start_sec: float
    end_sec: float
    confidence: float
    source: str

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


def segment_stub(duration_sec: float = 18.4) -> list[Possession]:
    return [
        Possession("p1", 0.0, 6.2, 0.55, "stub"),
        Possession("p2", 6.2, 12.8, 0.62, "stub"),
        Possession("p3", 12.8, duration_sec, 0.48, "stub"),
    ]


if __name__ == "__main__":
    segs = [p.to_dict() for p in segment_stub()]
    out = Path("analyzer/outputs/possessions.json")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps({"segments": segs, "stub": True}, indent=2))
    print(json.dumps({"segments": len(segs)}))
