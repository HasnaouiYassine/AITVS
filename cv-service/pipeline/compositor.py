"""
compositor.py — Full visualization pipeline orchestrator and compositing utilities.

Merges the blended tiles onto the original room image using soft-edged masks
to ensure realistic boundaries, and supports helper features like split-screen
comparisons and watermarks.
"""

import logging
import time
from typing import Tuple

import cv2
import numpy as np

logger = logging.getLogger(__name__)


def composite_result(
    room_img: np.ndarray,
    blended_tile: np.ndarray,
    mask: np.ndarray
) -> np.ndarray:
    """
    Final step: merge blended tile onto original room image.

    The mask defines exactly where the tile replaces the floor.
    Everything outside the mask (furniture, walls, ceiling) stays unchanged.

    Steps:
    1. Create soft mask: apply slight Gaussian blur to mask edges (3px)
       This softens the hard cutout edge for a more natural look
    2. Normalize soft mask to 0.0-1.0 float
    3. Expand to 3 channels
    4. result = room_img * (1 - soft_mask) + blended_tile * soft_mask
    5. Clip to uint8
    6. Return result
    """
    start_time = time.time()
    logger.info("Compositing final result with soft mask...")

    # 1. Create soft mask: apply slight Gaussian blur to mask edges (3px radius => 7x7 kernel)
    soft_mask = cv2.GaussianBlur(mask, (7, 7), 0)

    # 2. Normalize soft mask to 0.0-1.0 float
    soft_mask_float = soft_mask.astype(np.float32) / 255.0

    # 3. Expand to 3 channels if input images have 3 channels
    if room_img.ndim == 3 and soft_mask_float.ndim == 2:
        soft_mask_float = np.expand_dims(soft_mask_float, axis=2)

    # 4. result = room_img * (1 - soft_mask) + blended_tile * soft_mask
    result = room_img.astype(np.float32) * (1.0 - soft_mask_float) + blended_tile.astype(np.float32) * soft_mask_float

    # 5. Clip to uint8
    result_uint8 = np.clip(result, 0, 255).astype(np.uint8)

    logger.info("Compositing completed in %d ms", int((time.time() - start_time) * 1000))
    return result_uint8


def create_comparison_pair(
    original: np.ndarray,
    result: np.ndarray,
    divider_width: int = 4
) -> np.ndarray:
    """
    Create a side-by-side before/after image.
    Useful for debugging — saves both in one image.

    Left half = original, right half = result, divider line between.
    """
    start_time = time.time()
    logger.info("Creating side-by-side comparison split...")

    h, w = original.shape[:2]
    mid = w // 2

    comparison = np.zeros_like(original)
    comparison[:, :mid] = original[:, :mid]
    comparison[:, mid:] = result[:, mid:]

    # Draw divider line (white)
    half_div = max(1, divider_width // 2)
    comparison[:, mid - half_div : mid + half_div] = [255, 255, 255]

    logger.info("Comparison pair created in %d ms", int((time.time() - start_time) * 1000))
    return comparison


def add_watermark(
    image: np.ndarray,
    text: str = "TileVision Preview",
    opacity: float = 0.3
) -> np.ndarray:
    """
    Add subtle watermark text to bottom-right of image.
    Used for free tier users.
    """
    start_time = time.time()
    logger.info("Adding watermark text '%s'...", text)

    h, w = image.shape[:2]
    font = cv2.FONT_HERSHEY_SIMPLEX
    scale = min(h, w) / 1000.0  # Scale font size based on image resolution
    thickness = max(1, int(scale * 2))

    # Get text size to compute bottom-right alignment
    text_size, _ = cv2.getTextSize(text, font, scale, thickness)
    x = w - text_size[0] - 20
    y = h - 20

    # Draw text on overlay copy
    overlay = image.copy()
    cv2.putText(overlay, text, (x, y), font, scale, (255, 255, 255), thickness, cv2.LINE_AA)

    # Blend overlay with original using alpha opacity
    result = cv2.addWeighted(overlay, opacity, image, 1.0 - opacity, 0)

    logger.info("Watermark added in %d ms", int((time.time() - start_time) * 1000))
    return result


if __name__ == '__main__':
    # Standalone test of the full CV pipeline locally
    print("Running standalone compositor test...")

    # Generate synthetic room: 800x800 image, bottom half has a grey floor with shading
    room_h, room_w = 800, 800
    room_img = np.zeros((room_h, room_w, 3), dtype=np.uint8)
    # Walls (upper half)
    room_img[:400, :] = [240, 230, 220]  # Light beige walls
    # Floor (lower half) with linear gradient shading (shadow on left)
    for y in range(400, room_h):
        for x in range(room_w):
            factor = (x / room_w) * 0.5 + 0.3  # Shading from left (darker) to right (brighter)
            room_img[y, x] = [int(150 * factor), int(150 * factor), int(160 * factor)]

    # Draw a black table leg casting shadow
    room_img[350:600, 380:420] = [30, 30, 30]

    # Generate checkerboard tile: 100x100
    tile = np.zeros((100, 100, 3), dtype=np.uint8)
    tile[:50, :50] = [200, 180, 160]   # Light beige tile
    tile[50:, 50:] = [200, 180, 160]
    tile[:50, 50:] = [120, 100, 80]    # Dark brown tile
    tile[50:, :50] = [120, 100, 80]

    # Floor corners representing a trapezoidal floor segment
    from models.schemas import Corner
    test_corners = [
        Corner(x=150.0, y=400.0),
        Corner(x=650.0, y=400.0),
        Corner(x=780.0, y=780.0),
        Corner(x=20.0, y=780.0),
    ]

    # Binary mask
    test_mask = np.zeros((room_h, room_w), dtype=np.uint8)
    pts = np.array([[c.x, c.y] for c in test_corners], dtype=np.int32).reshape((-1, 1, 2))
    cv2.fillPoly(test_mask, [pts], 255)
    # Exclude table leg from mask (table is in front of the floor)
    test_mask[350:600, 380:420] = 0

    # Execute full pipeline steps sequentially
    try:
        from pipeline.perspective import warp_tile_to_floor
        from pipeline.blending import blend_shadows

        # 1. Warp
        print("Step 1: Warping tile...")
        warped_tile = warp_tile_to_floor(tile, test_corners, (room_h, room_w), test_mask)

        # 2. Blend shadows
        print("Step 2: Blending shadows...")
        blended_tile = blend_shadows(room_img, warped_tile, test_mask)

        # 3. Composite
        print("Step 3: Compositing...")
        final_result = composite_result(room_img, blended_tile, test_mask)

        # 4. Save results
        cv2.imwrite('test_compositor_result.jpg', final_result)

        # 5. Create comparison pair and save
        comparison = create_comparison_pair(room_img, final_result)
        cv2.imwrite('test_compositor_comparison.jpg', comparison)

        # 6. Add watermark and save
        watermarked = add_watermark(final_result, text="TileVision Free Tier")
        cv2.imwrite('test_compositor_watermarked.jpg', watermarked)

        print("Success! Outputs saved to test_compositor_result.jpg, test_compositor_comparison.jpg, and test_compositor_watermarked.jpg")
    except Exception as exc:
        print(f"Error during test: {exc}")
