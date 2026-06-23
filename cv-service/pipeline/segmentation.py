"""
segmentation.py — Floor segmentation using SAM2.

Responsible for generating a binary mask of the floor region
from a room image, using either user-provided corner points
or an optional SAM2 point hint.
"""

import logging
from typing import List, Optional, Tuple

import numpy as np

logger = logging.getLogger(__name__)


def segment_floor(
    image: np.ndarray,
    floor_corners: List[Tuple[float, float]],
    floor_point: Optional[Tuple[float, float]] = None,
) -> np.ndarray:
    """
    Generate a binary mask for the floor region.

    Args:
        image: The room image as a NumPy array (H, W, C).
        floor_corners: List of 4 (x, y) corner coordinates defining the floor polygon.
        floor_point: Optional (x, y) point hint for SAM2 segmentation.

    Returns:
        A binary mask (H, W) where 255 = floor, 0 = non-floor.
    """
    logger.info("Starting floor segmentation with %d corners", len(floor_corners))

    # TODO: Replace with SAM2-based segmentation in Task 2
    # For now, create a polygon mask from the provided corners
    import cv2

    h, w = image.shape[:2]
    mask = np.zeros((h, w), dtype=np.uint8)

    pts = np.array(floor_corners, dtype=np.int32).reshape((-1, 1, 2))
    cv2.fillPoly(mask, [pts], 255)

    logger.info(
        "Floor segmentation complete — mask covers %.1f%% of image",
        (np.count_nonzero(mask) / mask.size) * 100,
    )
    return mask
