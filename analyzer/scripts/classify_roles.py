"""Manual-friendly role classification helpers."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


DEFAULT_OFFENSE = ["O1", "O2", "O3", "O4", "O5", "O6", "O7"]
DEFAULT_DEFENSE = ["D1", "D2", "D3", "D4", "D5", "D6", "D7"]


def classify_roles(
    tracks: dict[str, list[list[float]]],
    assignments: dict[str, dict[str, str]] | None = None,
) -> dict[str, Any]:
    """Map track IDs to offense/defense roles. Automation is minimal."""
    assignments = assignments or {}
    players = []
    for i, tid in enumerate(sorted(tracks.keys())[:14]):
        team = "offense" if i < 7 else "defense"
        label = DEFAULT_OFFENSE[i] if i < 7 else DEFAULT_DEFENSE[i - 7]
        override = assignments.get(tid, {})
        players.append(
            {
                "id": override.get("id", label),
                "trackId": tid,
                "label": override.get("label", label),
                "team": override.get("team", team),
                "role": override.get("role", "handler" if i < 2 else "cutter"),
            }
        )
    return {
        "stub": True,
        "players": players,
        "message": "Default 7v7 assignment — edit in analyzer UI.",
    }


if __name__ == "__main__":
    import argparse

    p = argparse.ArgumentParser()
    p.add_argument("--tracks", type=Path, default=Path("analyzer/outputs/tracks.json"))
    p.add_argument("--out", type=Path, default=Path("analyzer/outputs/roles.json"))
    args = p.parse_args()
    data = json.loads(args.tracks.read_text())
    result = classify_roles(data.get("tracks", {}))
    args.out.write_text(json.dumps(result, indent=2))
    print(json.dumps({"players": len(result["players"])}))
