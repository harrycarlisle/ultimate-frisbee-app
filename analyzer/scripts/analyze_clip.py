"""End-to-end clip analysis orchestrator."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from animation_generation import generate_animation
from classify_roles import classify_roles
from detect_players import run_detect
from disc_tracking import build_disc_track
from field_calibration import default_calibration
from generate_board import generate_board_frames
from generate_notes import generate_notes
from ingest_video import ingest_local_path, ingest_youtube_reference
from lesson_export import export_lesson
from possession_segmentation import segment_stub
from track_players import track_players_from_detections


def load_demo() -> dict:
    sample = ROOT / "data" / "samples" / "demo_possession.json"
    notes = ROOT / "data" / "samples" / "coaching_notes.json"
    lesson = ROOT / "data" / "samples" / "lesson_export_sample.json"
    data = json.loads(sample.read_text())
    data["notes"] = json.loads(notes.read_text())
    data["lessonDraft"] = json.loads(lesson.read_text())
    data["demo"] = True
    board = generate_board_frames(data["tracks"], data["players"])
    data["boardFrames"] = board
    return data


def analyze_clip(
    *,
    video_path: Path | None = None,
    youtube_url: str | None = None,
    start_sec: float = 0.0,
    end_sec: float | None = None,
    demo: bool = False,
) -> dict:
    if demo:
        return load_demo()

    ingest = None
    if youtube_url:
        ingest = ingest_youtube_reference(youtube_url).to_dict()
        # YouTube cannot run full pipeline without permitted local file
        demo_data = load_demo()
        demo_data["source"] = ingest
        demo_data["warnings"] = ingest.get("warnings", [])
        demo_data["pipelineMode"] = "youtube_metadata_only"
        return demo_data

    if video_path and video_path.exists():
        ingest = ingest_local_path(video_path).to_dict()
        detect = run_detect(85)
        tracks = track_players_from_detections(detect["detections"])
        roles = classify_roles(tracks["tracks"])
        disc_kf = [{"frame": 0, "x": 0.42, "y": 0.72}, {"frame": 42, "x": 0.55, "y": 0.48, "inAir": True}]
        disc_track = build_disc_track(disc_kf, 85)
        # Remap tracks to player ids
        player_tracks = {}
        for p in roles["players"]:
            player_tracks[p["id"]] = tracks["tracks"].get(p["trackId"], [])
        board = generate_board_frames(player_tracks, roles["players"], disc_track)
        anim = generate_animation(board, title=ingest["title"])
        notes = generate_notes(board)
        lesson = export_lesson(anim, notes)
        return {
            "demo": False,
            "stub": True,
            "source": ingest,
            "clip": {"startSec": start_sec, "endSec": end_sec, "durationSec": (end_sec or 8.5) - start_sec},
            "calibration": {"corners": default_calibration()},
            "players": roles["players"],
            "tracks": player_tracks,
            "boardFrames": board,
            "disc": {"keyframes": disc_kf, "track": disc_track},
            "notes": notes["notes"],
            "lessonDraft": lesson,
            "possessions": [p.to_dict() for p in segment_stub()],
            "pipelineMode": "local_stub",
            "message": "Local pipeline ran with stub detector/tracker. Refine in UI.",
        }

    raise ValueError("Provide demo=True, video_path, or youtube_url")


if __name__ == "__main__":
    import argparse

    p = argparse.ArgumentParser(description="Analyze an ultimate possession clip")
    p.add_argument("--demo", action="store_true")
    p.add_argument("--video", type=Path)
    p.add_argument("--youtube")
    p.add_argument("--start", type=float, default=0.0)
    p.add_argument("--end", type=float)
    p.add_argument("--out", type=Path, default=Path("analyzer/outputs/analysis.json"))
    args = p.parse_args()
    result = analyze_clip(
        demo=args.demo,
        video_path=args.video,
        youtube_url=args.youtube,
        start_sec=args.start,
        end_sec=args.end,
    )
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(result, indent=2))
    print(json.dumps({"demo": result.get("demo"), "frames": len(result.get("boardFrames", []))}))
