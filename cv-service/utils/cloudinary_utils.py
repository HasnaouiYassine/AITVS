"""
cloudinary_utils.py — Cloudinary upload and optimization utilities.
"""

import asyncio
import logging
import os
from functools import partial
from typing import Optional

import cv2
import numpy as np
import cloudinary
import cloudinary.uploader
import cloudinary.utils

logger = logging.getLogger(__name__)

# Track configuration state
_cloudinary_configured: bool = False


def init_cloudinary():
    """Initialize Cloudinary from env vars. Call once at startup."""
    global _cloudinary_configured

    cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME")
    api_key = os.getenv("CLOUDINARY_API_KEY")
    api_secret = os.getenv("CLOUDINARY_API_SECRET")

    if not all([cloud_name, api_key, api_secret]):
        logger.warning(
            "Cloudinary credentials are not fully set in the environment. "
            "Uploads will fail until CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, "
            "and CLOUDINARY_API_SECRET are configured."
        )
        return

    cloudinary.config(
        cloud_name=cloud_name,
        api_key=api_key,
        api_secret=api_secret,
        secure=True
    )
    _cloudinary_configured = True
    logger.info("Cloudinary SDK initialized successfully for cloud: %s", cloud_name)


def upload_numpy_image(
    image_np: np.ndarray,
    folder: str,
    public_id: str,
    format: str = "jpg",
    quality: int = 90
) -> str:
    """
    Upload numpy image array to Cloudinary.

    Args:
        image_np: numpy RGB image (or grayscale mask)
        folder: Cloudinary folder path e.g. 'tilevision/results'
        public_id: unique filename without extension
        format: 'jpg' or 'png' (jpg for results, png for masks)
        quality: JPEG quality 1-100

    Returns:
        secure_url: full Cloudinary URL
    """
    if not _cloudinary_configured:
        init_cloudinary()
        if not _cloudinary_configured:
            raise RuntimeError("Cloudinary is not configured. Please check environment variables.")

    logger.info(
        "Uploading numpy image to Cloudinary folder '%s' with public_id '%s' (format: %s)...",
        folder, public_id, format
    )

    # 1. Convert numpy RGB→BGR if needed (OpenCV imencode expects BGR or grayscale)
    if image_np.ndim == 3 and image_np.shape[2] == 3:
        bgr_image = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)
    else:
        bgr_image = image_np

    # 2. Encode to bytes (cv2.imencode)
    ext = f".{format}"
    params = []
    if format.lower() in ["jpg", "jpeg"]:
        params = [cv2.IMWRITE_JPEG_QUALITY, quality]

    success, buffer = cv2.imencode(ext, bgr_image, params)
    if not success:
        raise ValueError(f"Failed to encode image to {format}")

    image_bytes = buffer.tobytes()

    # 3. Upload bytes to Cloudinary
    upload_options = {
        "folder": folder,
        "public_id": public_id,
        "resource_type": "image",
    }
    
    result = cloudinary.uploader.upload(image_bytes, **upload_options)
    secure_url = result.get("secure_url", "")
    logger.info("Upload successful. Secure URL: %s", secure_url)
    return secure_url


async def upload_image_async(
    image_np: np.ndarray,
    folder: str,
    public_id: str
) -> str:
    """
    Async wrapper for upload_numpy_image.
    Runs in thread pool so it doesn't block FastAPI event loop.
    """
    loop = asyncio.get_event_loop()
    # Grayscale masks upload as png, colored images as jpg
    fmt = "png" if (image_np.ndim == 2 or (image_np.ndim == 3 and image_np.shape[2] == 1)) else "jpg"
    upload_func = partial(upload_numpy_image, image_np, folder, public_id, format=fmt)
    return await loop.run_in_executor(None, upload_func)


def delete_image(public_id: str) -> bool:
    """Delete image from Cloudinary by public_id. Returns True if successful."""
    if not _cloudinary_configured:
        init_cloudinary()

    logger.info("Deleting image from Cloudinary with public_id '%s'...", public_id)
    try:
        result = cloudinary.uploader.destroy(public_id)
        success = result.get("result") == "ok"
        logger.info("Deletion result for '%s': %s", public_id, result.get("result"))
        return success
    except Exception as exc:
        logger.error("Failed to delete image '%s': %s", public_id, exc)
        return False


def get_optimized_url(public_id: str, width: int = 800) -> str:
    """
    Generate an optimized Cloudinary URL with auto quality and resizing.
    Used to serve result images faster to the frontend.
    """
    url, _ = cloudinary.utils.cloudinary_url(
        public_id,
        width=width,
        crop="scale",
        quality="auto",
        fetch_format="auto"
    )
    return url
