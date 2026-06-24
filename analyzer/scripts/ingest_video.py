"""Ingest local video or YouTube metadata reference.

YouTube: metadata/preview only — no public download in this module.
Local: copies or references permitted upload paths.
"""

from __future__ import annotations

import json
import re
import shutil
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any

YOUTUBE_RE = re.compile(
    r"(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/)([A-Za-z0-9_-]{11})"
)


@dataclass
class IngestResult:
    source_type: str
    path: str | None
    youtube_id: str | None
    title: str
    duration_sec: float | None
    warnings: list[str]
    metadata_only: bool

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


def parse_youtube_url(url: str) -> str | None:
    m = YOUTUBE_RE.search(url.strip())
    return m.group(1) if m else None


def ingest_youtube_reference(url: str) -> IngestResult:
    """Return embed metadata only. Does not download video."""
    vid = parse_youtube_url(url)
    if not vid:
        raise ValueError("Invalid YouTube URL")
    warnings = [
        "YouTube reference only — no video download performed.",
        "Analyze only footage you own or have permission to use.",
        "For full analysis, upload a local copy of permitted footage.",
    ]
    return IngestResult(
        source_type="youtube_reference",
        path=None,
        youtube_id=vid,
        title=f"YouTube reference {vid}",
        duration_sec=None,
        warnings=warnings,
        metadata_only=True,
    )


def ingest_local_upload(src: Path, dest_dir: Path) -> IngestResult:
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / src.name
    shutil.copy2(src, dest)
    return IngestResult(
        source_type="local_upload",
        path=str(dest),
        youtube_id=None,
        title=src.stem,
        duration_sec=None,
        warnings=[
            "Local upload stored for private analysis only.",
            "Confirm you have rights to process this footage.",
        ],
        metadata_only=False,
    )


def ingest_local_path(path: Path) -> IngestResult:
    if not path.exists():
        raise FileNotFoundError(path)
    return IngestResult(
        source_type="local_path",
        path=str(path.resolve()),
        youtube_id=None,
        title=path.stem,
        duration_sec=None,
        warnings=["Local file path reference for permitted footage only."],
        metadata_only=False,
    )


if __name__ == "__main__":
    import argparse

    p = argparse.ArgumentParser(description="Ingest video source (local or YouTube metadata)")
    p.add_argument("--youtube", help="YouTube URL (metadata only)")
    p.add_argument("--file", type=Path, help="Local video file")
    p.add_argument("--out", type=Path, default=Path("analyzer/outputs/ingest.json"))
    args = p.parse_args()
    if args.youtube:
        result = ingest_youtube_reference(args.youtube)
    elif args.file:
        result = ingest_local_upload(args.file, Path("analyzer/outputs/uploads"))
    else:
        raise SystemExit("Provide --youtube or --file")
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(result.to_dict(), indent=2))
    print(json.dumps(result.to_dict(), indent=2))
