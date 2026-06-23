"""
blending.py — Image blending and compositing utilities.

Handles blending the warped tile texture onto the original room
image using the floor mask, with smooth edge transitions.
"""

import logging

import cv2
import numpy as np

logger = logging.getLogger(__name__)


def blend_tile_onto_room(
    room_image: np.ndarray,
    warped_tile: np.ndarray,
    floor_mask: np.ndarray,
    feather_radius: int = 5,
) -> np.ndarray:
    """
    Blend the warped tile onto the room image using the floor mask.

    Args:
        room_image: The original room image (H, W, C).
        warped_tile: The perspective-warped tile texture (H, W, C).
        floor_mask: Binary mask where 255 = floor (H, W).
        feather_radius: Gaussian blur radius for smooth edge blending.

    Returns:
        The composited image with tiles blended onto the floor.
    """
    logger.info("Blending tile onto room image (feather_radius=%d)", feather_radius)

    # TODO: Implement advanced blending (colour correction, shadow preservation) in Task 4
    # Feather the mask edges for smooth blending
    blurred_mask = cv2.GaussianBlur(
        floor_mask, (feather_radius * 2 + 1, feather_radius * 2 + 1), 0
    )
    alpha = blurred_mask.astype(np.float32) / 255.0

    # Ensure dimensions match
    if len(alpha.shape) == 2:
        alpha = np.expand_dims(alpha, axis=2)

    # Alpha-blend: result = tile * alpha + room * (1 - alpha)
    result = (warped_tile.astype(np.float32) * alpha +
              room_image.astype(np.float32) * (1.0 - alpha))
    result = np.clip(result, 0, 255).astype(np.uint8)

    logger.info("Blending complete")
    return result
