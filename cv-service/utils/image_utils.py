"""
image_utils.py — Image download, decode, encode, and compositing helpers.
"""

import io
import logging
from typing import Tuple

import cv2
import numpy as np
import requests
from PIL import Image

logger = logging.getLogger(__name__)

DOWNLOAD_TIMEOUT: int = 30


def url_to_numpy(url: str) -> np.ndarray:
    """
    Download image from URL and return as numpy RGB array.
    Handles redirects, timeouts, and bad responses.
    """
    if not url:
        raise ValueError("Image URL must not be empty")

    logger.info("Downloading image from URL: %s", url[:80])
    try:
        response = requests.get(url, timeout=DOWNLOAD_TIMEOUT, stream=True)
        response.raise_for_status()
    except Exception as e:
        logger.error("Failed to download image from %s: %s", url, e)
        raise ValueError(f"Failed to download image: {e}")

    try:
        image_bytes = io.BytesIO(response.content)
        pil_image = Image.open(image_bytes).convert("RGB")
        rgb_array = np.array(pil_image, dtype=np.uint8)
        if rgb_array is None or rgb_array.size == 0:
            raise ValueError("Decoded image is empty")
        return rgb_array
    except Exception as e:
        logger.error("Failed to decode image from %s: %s", url, e)
        raise ValueError(f"Failed to decode image: {e}")


def numpy_to_bytes(image_np: np.ndarray, format: str = 'PNG') -> bytes:
    """Convert numpy array to image bytes for upload."""
    try:
        pil_image = Image.fromarray(image_np)
        img_byte_arr = io.BytesIO()
        pil_image.save(img_byte_arr, format=format)
        return img_byte_arr.getvalue()
    except Exception as e:
        logger.error("Failed to convert numpy array to image bytes: %s", e)
        raise ValueError(f"Failed to encode image to bytes: {e}")


def resize_if_too_large(image_np: np.ndarray, max_dim: int = 1920) -> np.ndarray:
    """
    Resize image if largest dimension exceeds max_dim.
    Preserves aspect ratio.
    """
    h, w = image_np.shape[:2]
    if max(h, w) <= max_dim:
        return image_np

    scale = max_dim / max(h, w)
    new_w = int(w * scale)
    new_h = int(h * scale)

    logger.info("Resizing image from (%d, %d) to (%d, %d)", w, h, new_w, new_h)
    resized = cv2.resize(image_np, (new_w, new_h), interpolation=cv2.INTER_AREA)
    return resized


def tile_texture(texture: np.ndarray, target_h: int, target_w: int) -> np.ndarray:
    """
    Repeat tile texture to fill target dimensions.
    Uses np.tile for efficiency.
    """
    th, tw = texture.shape[:2]
    reps_y = int(np.ceil(target_h / th))
    reps_x = int(np.ceil(target_w / tw))

    logger.info("Tiling texture of size (%d, %d) to target (%d, %d)", tw, th, target_w, target_h)
    if texture.ndim == 3:
        tiled = np.tile(texture, (reps_y, reps_x, 1))
    else:
        tiled = np.tile(texture, (reps_y, reps_x))

    return tiled[:target_h, :target_w]


def apply_mask(base: np.ndarray, overlay: np.ndarray, mask: np.ndarray) -> np.ndarray:
    """
    Composite overlay onto base using binary mask.
    mask: 255 = use overlay, 0 = use base
    """
    if base.ndim == 3 and mask.ndim == 2:
        mask_3d = np.expand_dims(mask, axis=2)
    else:
        mask_3d = mask

    alpha = mask_3d.astype(np.float32) / 255.0
    result = overlay.astype(np.float32) * alpha + base.astype(np.float32) * (1.0 - alpha)
    return np.clip(result, 0, 255).astype(np.uint8)
