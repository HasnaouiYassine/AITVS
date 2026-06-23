"""
image_utils.py — Image download, decode, and encode helpers.

Provides utility functions for fetching images from URLs,
decoding them into NumPy arrays, and encoding arrays back
to bytes for upload.
"""

import logging
from io import BytesIO

import cv2
import numpy as np
import requests
from PIL import Image

logger = logging.getLogger(__name__)

# Timeout for image downloads (seconds)
DOWNLOAD_TIMEOUT: int = 30


def download_image(url: str) -> np.ndarray:
    """
    Download an image from a URL and return it as a BGR NumPy array.

    Args:
        url: The HTTP(S) URL of the image to download.

    Returns:
        The image as a NumPy array in BGR colour space (H, W, C).

    Raises:
        ValueError: If the URL is empty or the image cannot be decoded.
        requests.RequestException: If the HTTP request fails.
    """
    if not url:
        raise ValueError("Image URL must not be empty")

    logger.info("Downloading image from: %s", url[:80])

    response = requests.get(url, timeout=DOWNLOAD_TIMEOUT, stream=True)
    response.raise_for_status()

    # Decode bytes → PIL → NumPy → BGR
    image_bytes = BytesIO(response.content)
    pil_image = Image.open(image_bytes).convert("RGB")
    rgb_array = np.array(pil_image, dtype=np.uint8)
    bgr_array = cv2.cvtColor(rgb_array, cv2.COLOR_RGB2BGR)

    if bgr_array is None or bgr_array.size == 0:
        raise ValueError(f"Failed to decode image from URL: {url}")

    logger.info("Image downloaded — shape: %s, dtype: %s", bgr_array.shape, bgr_array.dtype)
    return bgr_array


def encode_image_to_bytes(image: np.ndarray, fmt: str = ".png") -> bytes:
    """
    Encode a NumPy image array to bytes.

    Args:
        image: The image as a NumPy array (H, W, C) or (H, W).
        fmt: Output format (default ".png").

    Returns:
        The encoded image as bytes.

    Raises:
        ValueError: If encoding fails.
    """
    logger.info("Encoding image to %s format — shape: %s", fmt, image.shape)

    success, buffer = cv2.imencode(fmt, image)
    if not success:
        raise ValueError(f"Failed to encode image to {fmt}")

    encoded_bytes: bytes = buffer.tobytes()
    logger.info("Encoded image size: %d bytes", len(encoded_bytes))
    return encoded_bytes


def resize_image(
    image: np.ndarray, max_dimension: int = 1920
) -> np.ndarray:
    """
    Resize an image so its largest dimension does not exceed max_dimension.

    Args:
        image: Input image array (H, W, C).
        max_dimension: Maximum allowed size for width or height.

    Returns:
        The (potentially) resized image.
    """
    h, w = image.shape[:2]
    if max(h, w) <= max_dimension:
        logger.info("Image already within max dimension (%d); no resize needed", max_dimension)
        return image

    scale: float = max_dimension / max(h, w)
    new_w = int(w * scale)
    new_h = int(h * scale)
    resized = cv2.resize(image, (new_w, new_h), interpolation=cv2.INTER_AREA)
    logger.info("Resized image from (%d, %d) to (%d, %d)", w, h, new_w, new_h)
    return resized
