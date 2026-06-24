"""Export analyzer output as Learn Ultimate lesson draft JSON."""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def export_lesson(
    animation: dict[str, Any],
    notes: dict[str, Any],
    meta: dict[str, Any] | None = None,
) -> dict[str, Any]:
    meta = meta or {}
    steps = []
    for s in animation.get("steps", []):
        steps.append(
            {
                "title": s.get("title", "Step"),
                "body": s.get("body", ""),
                "disc": s.get("disc"),
                "positions": s.get("positions", {}),
                "routes": s.get("routes", []),
                "selectedPlayerNotes": s.get("selectedPlayerNotes", {}),
            }
        )
    summary_parts = [n.get("body", "") for n in notes.get("notes", {}).values()]
    return {
        "title": animation.get("title", "Exported lesson"),
        "formation": meta.get("formation", "vertical-stack"),
        "steps": steps,
        "coachingSummary": " ".join(summary_parts[:2]),
        "metadata": {
            "exportedAt": datetime.now(timezone.utc).isoformat(),
            "analyzerVersion": "0.1.0",
            "demo": meta.get("demo", False),
        },
    }


if __name__ == "__main__":
    anim = json.loads(Path("analyzer/outputs/animation.json").read_text())
    notes = json.loads(Path("analyzer/outputs/notes.json").read_text())
    lesson = export_lesson(anim, notes, {"demo": True})
    out = Path("analyzer/outputs/lesson_export.json")
    out.write_text(json.dumps(lesson, indent=2))
    print(json.dumps({"steps": len(lesson["steps"])}))
