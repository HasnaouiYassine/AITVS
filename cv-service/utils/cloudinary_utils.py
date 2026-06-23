"""
cloudinary_utils.py — Cloudinary upload / management helpers.

Handles configuring the Cloudinary SDK and uploading processed
images (results and masks) to the cloud for retrieval by the
Next.js frontend.
"""

import logging
import os
from typing import Optional

import cloudinary
import cloudinary.uploader

logger = logging.getLogger(__name__)

# Track whether Cloudinary has been configured
_cloudinary_configured: bool = False


def configure_cloudinary() -> None:
    """
    Configure the Cloudinary SDK from environment variables.

    Reads CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and
    CLOUDINARY_API_SECRET from the environment.

    Raises:
        ValueError: If any required environment variable is missing.
    """
    global _cloudinary_configured

    cloud_name: str = os.getenv("CLOUDINARY_CLOUD_NAME", "")
    api_key: str = os.getenv("CLOUDINARY_API_KEY", "")
    api_secret: str = os.getenv("CLOUDINARY_API_SECRET", "")

    if not all([cloud_name, api_key, api_secret]):
        logger.warning(
            "Cloudinary credentials not fully configured — "
            "uploads will fail until CLOUDINARY_CLOUD_NAME, "
            "CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set."
        )
        return

    cloudinary.config(
        cloud_name=cloud_name,
        api_key=api_key,
        api_secret=api_secret,
        secure=True,
    )
    _cloudinary_configured = True
    logger.info("Cloudinary configured for cloud: %s", cloud_name)


def upload_image(
    image_bytes: bytes,
    folder: str = "tilevision",
    public_id: Optional[str] = None,
) -> str:
    """
    Upload an image (as bytes) to Cloudinary.

    Args:
        image_bytes: Raw image bytes (PNG or JPEG).
        folder: Cloudinary folder to upload into.
        public_id: Optional custom public ID for the asset.

    Returns:
        The secure URL of the uploaded image.

    Raises:
        RuntimeError: If Cloudinary is not configured.
        cloudinary.exceptions.Error: If the upload fails.
    """
    if not _cloudinary_configured:
        configure_cloudinary()
        if not _cloudinary_configured:
            raise RuntimeError(
                "Cloudinary is not configured. "
                "Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, "
                "and CLOUDINARY_API_SECRET environment variables."
            )

    logger.info(
        "Uploading image to Cloudinary — folder: %s, size: %d bytes",
        folder, len(image_bytes),
    )

    upload_options: dict = {
        "folder": folder,
        "resource_type": "image",
    }
    if public_id:
        upload_options["public_id"] = public_id

    result = cloudinary.uploader.upload(image_bytes, **upload_options)
    secure_url: str = result.get("secure_url", "")

    logger.info("Upload successful — URL: %s", secure_url)
    return secure_url


def delete_image(public_id: str) -> bool:
    """
    Delete an image from Cloudinary by its public ID.

    Args:
        public_id: The public ID of the image to delete.

    Returns:
        True if deletion was successful, False otherwise.
    """
    if not _cloudinary_configured:
        configure_cloudinary()

    logger.info("Deleting Cloudinary image: %s", public_id)

    try:
        result = cloudinary.uploader.destroy(public_id)
        success: bool = result.get("result") == "ok"
        logger.info("Deletion %s for: %s", "succeeded" if success else "failed", public_id)
        return success
    except Exception as exc:
        logger.error("Failed to delete image %s: %s", public_id, exc)
        return False
