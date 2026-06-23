"""
perspective.py — Perspective transformation for tile textures.

Handles warping the tile texture image to match the perspective
of the floor region defined by the user's corner coordinates.
"""

import logging
import time
from typing import List, Tuple

import cv2
import numpy as np

from models.schemas import Corner
from utils.image_utils import tile_texture

logger = logging.getLogger(__name__)


def order_corners(corners: List[Corner]) -> np.ndarray:
    """
    Order 4 corners as: top-left, top-right, bottom-right, bottom-left.
    This is required for correct homography computation.

    Method:
    - Sum of (x+y): smallest = top-left, largest = bottom-right
    - Diff of (x-y): smallest = top-right, largest = bottom-left (wait, x - y is largest for top-right, smallest for bottom-left)
    """
    pts = np.array([[c.x, c.y] for c in corners], dtype=np.float32)
    rect = np.zeros((4, 2), dtype=np.float32)

    # Top-left has the smallest sum, bottom-right has the largest sum
    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]      # Top-Left
    rect[2] = pts[np.argmax(s)]      # Bottom-Right

    # Difference (x - y): top-right has the largest positive difference, bottom-left has the largest negative/smallest difference
    diff = pts[:, 0] - pts[:, 1]
    rect[1] = pts[np.argmax(diff)]   # Top-Right
    rect[3] = pts[np.argmin(diff)]   # Bottom-Left

    return rect


def compute_homography(corners: List[Corner], tile_size: int = 100) -> Tuple[np.ndarray, np.ndarray]:
    """
    Compute homography matrix from floor corners.

    Args:
        corners: 4 Corner objects from user clicks
        tile_size: size of one tile in pixels in the source texture

    Returns:
        H: 3x3 homography matrix
        src_pts: source rectangle points
    """
    # 1. Order corners (top-left, top-right, bottom-right, bottom-left)
    ordered_dst = order_corners(corners)

    # Check collinearity / degenerate polygon
    area = cv2.contourArea(ordered_dst)
    if area < 100.0:
        raise ValueError("Floor corners form a degenerate shape (area is too small).")

    # 2. Define source rectangle: [(0,0), (tile_size,0), (tile_size,tile_size), (0,tile_size)]
    src_pts = np.array([
        [0, 0],
        [tile_size, 0],
        [tile_size, tile_size],
        [0, tile_size]
    ], dtype=np.float32)

    # 3. cv2.findHomography(src_pts, dst_pts)
    H, status = cv2.findHomography(src_pts, ordered_dst)
    if H is None:
        raise ValueError("Failed to compute homography matrix.")

    logger.info("Homography computed successfully")
    return H, src_pts


def estimate_tile_scale(corners: List[Corner], real_tile_size_cm: float = 60) -> float:
    """
    Estimate how many pixels = 1 tile based on floor size.
    Uses the bottom edge of the floor (closest to camera = largest).

    This ensures tile pattern scales realistically with room perspective.
    """
    ordered = order_corners(corners)
    # ordered[2] is bottom-right, ordered[3] is bottom-left
    bottom_edge = np.linalg.norm(ordered[2] - ordered[3])

    # Assume the bottom of the floor represents roughly 300 cm in the real world
    assumed_floor_width_cm = 300.0
    num_tiles = assumed_floor_width_cm / real_tile_size_cm
    pixel_per_tile = bottom_edge / num_tiles

    return max(1.0, pixel_per_tile)


def warp_tile_to_floor(
    tile_img: np.ndarray,
    corners: List[Corner],
    room_shape: Tuple[int, int],
    mask: np.ndarray
) -> np.ndarray:
    """
    Main function: warp tile texture onto floor perspective.

    Args:
        tile_img: tile texture as numpy RGB array
        corners: 4 floor corner coordinates
        room_shape: (height, width) of room image
        mask: binary floor mask (255=floor)

    Returns:
        warped_layer: numpy array same size as room, tile projected onto floor, black elsewhere
    """
    room_h, room_w = room_shape[:2]

    # 1. Resize tile texture to standard size (e.g. 200x200px per tile)
    tile_size_canvas = 200
    tile_resized = cv2.resize(tile_img, (tile_size_canvas, tile_size_canvas), interpolation=cv2.INTER_LINEAR)

    # 2. Estimate tile scale (pixels per tile at bottom edge)
    tile_pixel_size_at_bottom = estimate_tile_scale(corners, real_tile_size_cm=60)
    logger.info("Estimated tile scale: %.2f pixels per tile", tile_pixel_size_at_bottom)

    # 3. Calculate target grid parameters
    ordered = order_corners(corners)
    bottom_edge = np.linalg.norm(ordered[2] - ordered[3])
    num_tiles = bottom_edge / tile_pixel_size_at_bottom

    # 4. Total width of the floor region in the ground coordinates (pixel_per_tile)
    pixel_per_tile = num_tiles * tile_size_canvas

    # 5. Create large flat tiled canvas (2x room size to be safe)
    tiled_canvas = tile_texture(tile_resized, target_h=room_h * 2, target_w=room_w * 2)

    # 6. Compute homography (from floor plane to image plane)
    H, _ = compute_homography(corners, tile_size=int(pixel_per_tile))

    # 7. Warp the flat tiled canvas using the homography
    logger.info("Warping flat tiled canvas using homography...")
    start_time = time.time()
    warped = cv2.warpPerspective(tiled_canvas, H, (room_w, room_h), flags=cv2.INTER_LINEAR)
    warp_time_ms = int((time.time() - start_time) * 1000)
    logger.info("Warp completed in %d ms", warp_time_ms)

    # 8. Mask to floor area only
    warped_masked = cv2.bitwise_and(warped, warped, mask=mask)

    return warped_masked


if __name__ == '__main__':
    # Simple test with a checkerboard tile and a hardcoded trapezoid floor
    # Save result to test_warp_output.jpg
    # This lets you test the warp without running the full API
    print("Running standalone warp test...")
    tile = np.zeros((100, 100, 3), dtype=np.uint8)
    tile[:50, :50] = [255, 255, 255]
    tile[50:, 50:] = [255, 255, 255]
    tile[:50, 50:] = [0, 0, 255]  # Red
    tile[50:, :50] = [0, 0, 255]

    room_h, room_w = 800, 800
    test_corners = [
        Corner(x=200.0, y=300.0),
        Corner(x=600.0, y=300.0),
        Corner(x=750.0, y=700.0),
        Corner(x=50.0, y=700.0),
    ]

    test_mask = np.zeros((room_h, room_w), dtype=np.uint8)
    pts = np.array([[c.x, c.y] for c in test_corners], dtype=np.int32).reshape((-1, 1, 2))
    cv2.fillPoly(test_mask, [pts], 255)

    try:
        warped_output = warp_tile_to_floor(tile, test_corners, (room_h, room_w), test_mask)
        cv2.imwrite('test_warp_output.jpg', warped_output)
        print("Success! Test output saved to test_warp_output.jpg")
    except Exception as exc:
        print(f"Error during test: {exc}")
