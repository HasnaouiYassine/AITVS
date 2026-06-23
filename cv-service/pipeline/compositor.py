"""
compositor.py — Full visualization pipeline orchestrator.

Orchestrates the end-to-end tile visualization pipeline:
  1. Download room + tile images
  2. Segment the floor region
  3. Warp the tile texture to floor perspective
  4. Blend tile onto the room image
  5. Upload result to Cloudinary
"""

import logging
import time
from typing import Dict, List, Optional, Tuple

import numpy as np

from pipeline.segmentation import segment_floor
from pipeline.perspective import warp_tile_to_floor
from pipeline.blending import blend_tile_onto_room
from utils.image_utils import download_image, encode_image_to_bytes
from utils.cloudinary_utils import upload_image

logger = logging.getLogger(__name__)


def run_visualization_pipeline(
    room_image_url: str,
    tile_image_url: str,
    floor_corners: List[Tuple[float, float]],
    floor_point: Optional[Tuple[float, float]] = None,
) -> Dict[str, str | int]:
    """
    Execute the full tile visualization pipeline.

    Args:
        room_image_url: URL of the room image.
        tile_image_url: URL of the tile texture image.
        floor_corners: List of 4 (x, y) corner coordinates.
        floor_point: Optional SAM2 point hint.

    Returns:
        Dictionary containing result_image_url, mask_image_url,
        and processing_time_ms.
    """
    start_time = time.time()
    logger.info("Starting visualization pipeline")

    # Step 1: Download images
    logger.info("Step 1/5 — Downloading images")
    room_image: np.ndarray = download_image(room_image_url)
    tile_image: np.ndarray = download_image(tile_image_url)
    logger.info(
        "Downloaded room (%s) and tile (%s)",
        room_image.shape, tile_image.shape,
    )

    # Step 2: Segment floor
    logger.info("Step 2/5 — Segmenting floor")
    floor_mask: np.ndarray = segment_floor(room_image, floor_corners, floor_point)

    # Step 3: Warp tile to floor perspective
    logger.info("Step 3/5 — Warping tile texture")
    h, w = room_image.shape[:2]
    warped_tile: np.ndarray = warp_tile_to_floor(tile_image, floor_corners, (w, h))

    # Step 4: Blend tile onto room
    logger.info("Step 4/5 — Blending tile onto room")
    result_image: np.ndarray = blend_tile_onto_room(room_image, warped_tile, floor_mask)

    # Step 5: Upload results
    logger.info("Step 5/5 — Uploading results")
    result_bytes: bytes = encode_image_to_bytes(result_image)
    mask_bytes: bytes = encode_image_to_bytes(floor_mask)

    result_url: str = upload_image(result_bytes, folder="tilevision/results")
    mask_url: str = upload_image(mask_bytes, folder="tilevision/masks")

    processing_time_ms = int((time.time() - start_time) * 1000)
    logger.info("Pipeline complete in %d ms", processing_time_ms)

    return {
        "result_image_url": result_url,
        "mask_image_url": mask_url,
        "processing_time_ms": processing_time_ms,
    }
