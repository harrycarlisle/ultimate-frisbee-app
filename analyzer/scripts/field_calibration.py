"""Field corner calibration and image→board coordinate transform."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


def bilinear_field_point(
    image_xy: tuple[float, float],
    corners: list[dict[str, list[float]]],
) -> tuple[float, float]:
    """Simple quad mapping using two triangles (stub homography)."""
    # corners: TL, TR, BR, BL with image + field keys
    ix, iy = image_xy
    # Normalize using bounding box of image corners for stub
    img_xs = [c["image"][0] for c in corners]
    img_ys = [c["image"][1] for c in corners]
    min_x, max_x = min(img_xs), max(img_xs)
    min_y, max_y = min(img_ys), max(img_ys)
    nx = (ix - min_x) / max(max_x - min_x, 1e-6)
    ny = (iy - min_y) / max(max_y - min_y, 1e-6)
    fld_xs = [c["field"][0] for c in corners]
    fld_ys = [c["field"][1] for c in corners]
    fx = fld_xs[0] + nx * (fld_xs[1] - fld_xs[0])
    fy = fld_ys[0] + ny * (fld_ys[3] - fld_ys[0])
    return round(max(0, min(1, fx)), 4), round(max(0, min(1, fy)), 4)


def default_calibration() -> list[dict[str, list[float]]]:
    return [
        {"image": [0.08, 0.18], "field": [0.05, 0.05]},
        {"image": [0.92, 0.18], "field": [0.95, 0.05]},
        {"image": [0.92, 0.88], "field": [0.95, 0.95]},
        {"image": [0.08, 0.88], "field": [0.05, 0.95]},
    ]


def save_calibration(corners: list[dict[str, list[float]]], out: Path) -> dict[str, Any]:
    payload = {"corners": corners, "stub": True, "message": "Manual calibration — refine corners in UI."}
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(payload, indent=2))
    return payload


if __name__ == "__main__":
    import argparse

    p = argparse.ArgumentParser()
    p.add_argument("--out", type=Path, default=Path("analyzer/outputs/calibration.json"))
    args = p.parse_args()
    print(json.dumps(save_calibration(default_calibration(), args.out), indent=2))
