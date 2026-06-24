"""Rule-based coaching notes from board movement."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


def generate_notes(board_frames: list[dict[str, Any]], throws: list[dict[str, Any]] | None = None) -> dict[str, Any]:
    throws = throws or []
    notes = {
        "spacing": {
            "title": "Spacing read",
            "body": "Offense maintains horizontal spread in early frames.",
            "tag": "good",
        },
        "reset": {
            "title": "Reset timing",
            "body": "Reset window appears tight — verify dump timing against marker pressure.",
            "tag": "warn" if len(throws) else "neutral",
        },
        "swing": {
            "title": "Swing window",
            "body": "Look for open-side swing when cutters clear the lane.",
            "tag": "good",
        },
        "cutter": {
            "title": "Cutter timing",
            "body": "Cutters should go when the handler's shoulders open.",
            "tag": "neutral",
        },
        "pressure": {
            "title": "Defensive pressure",
            "body": "Downfield markers stay connected in sample analysis.",
            "tag": "good",
        },
        "drill": {
            "title": "Drill suggestion",
            "body": "Export as a Vertical Stack reset drill for practice.",
            "tag": "next",
        },
    }
    return {"notes": notes, "stub": True, "frameCount": len(board_frames)}


if __name__ == "__main__":
    bf = json.loads(Path("analyzer/outputs/board_frames.json").read_text())
    result = generate_notes(bf.get("frames", []))
    out = Path("analyzer/outputs/notes.json")
    out.write_text(json.dumps(result, indent=2))
    print(json.dumps({"notes": len(result["notes"])}))
