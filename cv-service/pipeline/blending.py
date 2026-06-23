"""
blending.py — Image blending, shadow extraction, and ambient color transfer.

Captures luminance gradients, lighting, and shadows from the original room floor,
and composites them onto the warped tile layer with realistic edge transitions.
"""

import logging
import time

import cv2
import numpy as np

logger = logging.getLogger(__name__)


def extract_floor_luminance(room_img: np.ndarray, mask: np.ndarray) -> np.ndarray:
    """
    Extract the luminance/brightness map of the original floor.
    This captures shadows, lighting gradients, and ambient color.

    Steps:
    1. Convert room_img to LAB color space
    2. Extract L channel (luminance)
    3. Apply CLAHE for local contrast normalization
    4. Mask to floor area only
    5. Normalize to 0-1 float range
    6. Return luminance map (H, W) float32
    """
    start_time = time.time()
    logger.info("Extracting floor luminance...")

    # 1. Convert room_img to LAB color space
    lab = cv2.cvtColor(room_img, cv2.COLOR_RGB2LAB)

    # 2. Extract L channel (luminance)
    l_channel = lab[:, :, 0]

    # 3. Apply CLAHE for local contrast normalization
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    cl = clahe.apply(l_channel)

    # 4. Mask to floor area only
    cl_masked = cv2.bitwise_and(cl, cl, mask=mask)

    # 5. Normalize to 0-1 float range
    luminance_map = cl_masked.astype(np.float32) / 255.0

    logger.info("Floor luminance extracted in %d ms", int((time.time() - start_time) * 1000))
    return luminance_map


def apply_luminance_to_tile(
    warped_tile: np.ndarray,
    luminance_map: np.ndarray,
    mask: np.ndarray,
    strength: float = 0.55
) -> np.ndarray:
    """
    Multiply tile colors by room luminance to simulate real lighting.

    Args:
        warped_tile: projected tile (H, W, 3) uint8
        luminance_map: floor brightness map (H, W) float32, range 0-1
        mask: binary floor mask
        strength: blend strength 0-1 (0=no effect, 1=full luminance)
                  0.55 is a good default — preserves tile color while adding shadow

    Steps:
    1. Convert warped_tile to float32
    2. Expand luminance_map to 3 channels
    3. Normalize luminance to center around 1.0 (so average lit areas stay same)
    4. Blend: result = tile * (1 + strength * (luminance - 1))
    5. Clip to 0-255, convert back to uint8
    6. Apply mask
    """
    start_time = time.time()
    logger.info("Applying floor luminance to warped tile with strength %.2f...", strength)

    # 1. Convert warped_tile to float32
    tile_float = warped_tile.astype(np.float32)

    # 2. Expand luminance_map to 3 channels
    if luminance_map.ndim == 2:
        luminance_map_3d = np.expand_dims(luminance_map, axis=2)
    else:
        luminance_map_3d = luminance_map

    # 3. Normalize luminance to center around 1.0 (so average lit areas stay same)
    mask_pixels = luminance_map[mask > 0]
    if mask_pixels.size > 0:
        mean_luminance = np.mean(mask_pixels)
    else:
        mean_luminance = 0.5

    if mean_luminance > 0:
        normalized_luminance = luminance_map_3d / mean_luminance
    else:
        normalized_luminance = luminance_map_3d

    # 4. Blend: result = tile * (1 + strength * (luminance - 1))
    blend_factor = 1.0 + strength * (normalized_luminance - 1.0)
    result = tile_float * blend_factor

    # 5. Clip to 0-255, convert back to uint8
    result = np.clip(result, 0, 255).astype(np.uint8)

    # 6. Apply mask
    result_masked = cv2.bitwise_and(result, result, mask=mask)

    logger.info("Luminance applied in %d ms", int((time.time() - start_time) * 1000))
    return result_masked


def add_edge_shadow(
    blended_tile: np.ndarray,
    mask: np.ndarray,
    shadow_strength: float = 0.3
) -> np.ndarray:
    """
    Add subtle shadow along the floor mask edges.
    This makes the transition between tile and wall/furniture look natural.

    Steps:
    1. Dilate mask slightly
    2. Erode mask slightly
    3. Difference = edge region
    4. Darken blended_tile in edge region by shadow_strength
    5. Return result
    """
    start_time = time.time()
    logger.info("Adding edge shadow with strength %.2f...", shadow_strength)

    # 1. Dilate mask slightly
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    dilated = cv2.dilate(mask, kernel, iterations=1)

    # 2. Erode mask slightly
    eroded = cv2.erode(mask, kernel, iterations=1)

    # 3. Difference = edge region
    edge_region = cv2.subtract(dilated, eroded)

    # Make sure we only affect the tiled floor area itself
    edge_mask = cv2.bitwise_and(edge_region, mask)

    # 4. Darken blended_tile in edge region by shadow_strength (factor = 1 - shadow_strength)
    result = blended_tile.copy()
    factor = 1.0 - shadow_strength

    if result.ndim == 3:
        for c in range(3):
            result[:, :, c] = np.where(edge_mask > 0, np.clip(result[:, :, c] * factor, 0, 255), result[:, :, c])
    else:
        result = np.where(edge_mask > 0, np.clip(result * factor, 0, 255), result)

    logger.info("Edge shadows added in %d ms", int((time.time() - start_time) * 1000))
    return result.astype(np.uint8)


def blend_shadows(
    room_img: np.ndarray,
    warped_tile: np.ndarray,
    mask: np.ndarray,
    luminance_strength: float = 0.55,
    edge_shadow: float = 0.3
) -> np.ndarray:
    """
    Main blending function. Combines luminance transfer + edge shadow.

    Returns: blended_tile same shape as warped_tile, ready for compositing
    """
    logger.info("Starting shadow blending...")
    start_time = time.time()

    # 1. Extract floor luminance from original room
    luminance_map = extract_floor_luminance(room_img, mask)

    # 2. Apply luminance to warped tile
    blended_tile = apply_luminance_to_tile(warped_tile, luminance_map, mask, strength=luminance_strength)

    # 3. Add edge shadows
    result = add_edge_shadow(blended_tile, mask, shadow_strength=edge_shadow)

    logger.info("Blending completed in %d ms", int((time.time() - start_time) * 1000))
    return result
