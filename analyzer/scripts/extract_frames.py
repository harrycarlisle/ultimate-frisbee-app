"""Extract frames from a local video using FFmpeg when available."""

from __future__ import annotations

import json
import shutil
import subprocess
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any


@dataclass
class ExtractResult:
    video_path: str
    output_dir: str
    fps: float
    frame_count: int
    frames: list[str]
    stub: bool
    message: str

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


def ffmpeg_available() -> bool:
    return shutil.which("ffmpeg") is not None


def extract_frames(video_path: Path, output_dir: Path, fps: float = 10.0) -> ExtractResult:
    output_dir.mkdir(parents=True, exist_ok=True)
    pattern = output_dir / "frame_%05d.jpg"

    if not ffmpeg_available():
        # Stub: generate placeholder manifest without real frames
        frames = [str(output_dir / f"frame_{i:05d}.jpg") for i in range(1, 11)]
        return ExtractResult(
            video_path=str(video_path),
            output_dir=str(output_dir),
            fps=fps,
            frame_count=len(frames),
            frames=frames,
            stub=True,
            message="FFmpeg not found. Returned stub frame list for pipeline testing.",
        )

    cmd = [
        "ffmpeg",
        "-y",
        "-i",
        str(video_path),
        "-vf",
        f"fps={fps}",
        str(pattern),
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    frames = sorted(str(p) for p in output_dir.glob("frame_*.jpg"))
    return ExtractResult(
        video_path=str(video_path),
        output_dir=str(output_dir),
        fps=fps,
        frame_count=len(frames),
        frames=frames,
        stub=False,
        message="Frames extracted with FFmpeg.",
    )


if __name__ == "__main__":
    import argparse

    p = argparse.ArgumentParser()
    p.add_argument("video", type=Path)
    p.add_argument("--out", type=Path, default=Path("analyzer/outputs/frames"))
    p.add_argument("--fps", type=float, default=10.0)
    args = p.parse_args()
    result = extract_frames(args.video, args.out, args.fps)
    manifest = args.out / "manifest.json"
    manifest.write_text(json.dumps(result.to_dict(), indent=2))
    print(json.dumps(result.to_dict(), indent=2))
