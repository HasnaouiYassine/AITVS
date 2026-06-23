"""
perspective.py — Perspective transformation for tile textures.

Handles warping the tile texture image to match the perspective
of the floor region defined by the user's corner coordinates.
"""

import logging
from typing import List, Tuple

import cv2
import numpy as np

logger = logging.getLogger(__name__)


def warp_tile_to_floor(
    tile_image: np.ndarray,
    floor_corners: List[Tuple[float, float]],
    output_size: Tuple[int, int],
) -> np.ndarray:
    """
    Warp the tile texture to fit the floor perspective.

    Args:
        tile_image: The tile texture as a NumPy array (H, W, C).
        floor_corners: List of 4 (x, y) destination corners in the room image.
        output_size: (width, height) of the output warped image.

    Returns:
        The perspective-warped tile image matching the floor region.
    """
    logger.info("Warping tile texture to floor perspective")

    # TODO: Implement full perspective warp in Task 3
    h, w = tile_image.shape[:2]
    src_pts = np.array(
        [[0, 0], [w, 0], [w, h], [0, h]], dtype=np.float32
    )
    dst_pts = np.array(floor_corners, dtype=np.float32)

    matrix = cv2.getPerspectiveTransform(src_pts, dst_pts)
    warped = cv2.warpPerspective(
        tile_image, matrix, output_size, flags=cv2.INTER_LINEAR
    )

    logger.info("Tile warp complete — output size: %s", output_size)
    return warped
