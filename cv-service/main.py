"""
TileVision CV Service — FastAPI application entry point.

A computer vision microservice that processes room images and applies
tile textures using segmentation, perspective warping, and blending.
The Next.js frontend calls POST /visualize with a room image URL,
tile image URL, and floor corner coordinates.
"""

import logging
import os
import time
from typing import Any, Dict

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from models.schemas import (
    HealthResponse,
    VisualizeRequest,
    VisualizeResponse,
)
from pipeline.segmentation import get_segmentor
from pipeline.perspective import warp_tile_to_floor
from pipeline.blending import blend_shadows
from pipeline.compositor import composite_result
from utils.image_utils import url_to_numpy, resize_if_too_large
from utils.cloudinary_utils import init_cloudinary, upload_image_async

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

load_dotenv()

APP_VERSION: str = "0.1.0"
ALLOWED_ORIGINS: list[str] = os.getenv("ALLOWED_ORIGINS", "*").split(",")
PORT: int = int(os.getenv("PORT", "8000"))

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("tilevision")

# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------

app = FastAPI(
    title="TileVision CV Service",
    description=(
        "AI-powered tile visualizer — processes room images and applies "
        "tile textures using computer vision (SAM2 segmentation, perspective "
        "warping, and alpha blending)."
    ),
    version=APP_VERSION,
)

# -- CORS -------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Global exception handler
# ---------------------------------------------------------------------------


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catch-all handler that returns every unhandled error as JSON."""
    logger.error("Unhandled exception on %s %s: %s", request.method, request.url.path, exc, exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "error": str(exc),
        },
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    """Return HTTP exceptions as structured JSON."""
    logger.warning("HTTP %d on %s %s: %s", exc.status_code, request.method, request.url.path, exc.detail)
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )


# ---------------------------------------------------------------------------
# Startup event
# ---------------------------------------------------------------------------


@app.on_event("startup")
async def startup_event() -> None:
    """Log service startup and perform initial configuration."""
    logger.info("=" * 60)
    logger.info("TileVision CV Service started")
    logger.info("Version : %s", APP_VERSION)
    logger.info("CORS    : %s", ALLOWED_ORIGINS)
    logger.info("Port    : %d", PORT)
    logger.info("=" * 60)

    # 1. Init Cloudinary
    try:
        init_cloudinary()
        logger.info("Cloudinary initialized successfully")
    except Exception as e:
        logger.error("Failed to initialize Cloudinary: %s", e)

    # 2. Load SAM2 (with fallback)
    checkpoint = os.getenv("SAM2_CHECKPOINT", "checkpoints/sam2_hiera_small.pt")
    config = os.getenv("SAM2_CONFIG", "sam2_hiera_s.yaml")

    try:
        segmentor = get_segmentor()
        segmentor.load_model(checkpoint, config)
        logger.info("SAM2 loaded successfully")
    except Exception as e:
        logger.warning("SAM2 not loaded: %s. Will use polygon fallback.", e)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check() -> HealthResponse:
    """
    Health-check endpoint.

    Returns the current service status and version string.
    """
    logger.info("Health check requested")
    return HealthResponse(status="ok", version=APP_VERSION)


@app.post("/visualize", response_model=VisualizeResponse, tags=["Visualization"])
async def visualize(req: VisualizeRequest) -> VisualizeResponse:
    """
    Process a room image and apply a tile texture.

    Args:
        req: The visualization request body containing room image URL,
             tile image URL, floor corners, and an optional point hint.

    Returns:
        VisualizeResponse with result image URL, mask URL, and timing.
    """
    start_time = time.time()
    try:
        # Step 1: Download images
        logger.info("Downloading room image...")
        room_img = url_to_numpy(req.room_image_url)
        room_img = resize_if_too_large(room_img, max_dim=1920)

        logger.info("Downloading tile image...")
        tile_img = url_to_numpy(req.tile_image_url)

        # Step 2: Generate floor mask
        logger.info("Generating floor mask...")
        segmentor = get_segmentor()
        mask_time_start = time.time()
        use_sam2 = False
        mask = None

        if req.floor_point and segmentor._predictor is not None:
            try:
                mask = segmentor.generate_mask(
                    room_img,
                    (req.floor_point.x, req.floor_point.y)
                )
                use_sam2 = True
                logger.info("SAM2 segmentation took %d ms", int((time.time() - mask_time_start) * 1000))
            except Exception as e:
                logger.warning("SAM2 segmentation failed: %s. Falling back to polygon.", e)

        if not use_sam2:
            if len(req.floor_corners) != 4:
                raise ValueError(f"Exactly 4 floor corners required for polygon fallback, got {len(req.floor_corners)}")
            mask = segmentor.generate_mask_from_corners(room_img, req.floor_corners)
            logger.info("Polygon fallback mask generation took %d ms", int((time.time() - mask_time_start) * 1000))

        # Step 3: Warp tile to floor perspective
        logger.info("Warping tile texture...")
        warped_tile = warp_tile_to_floor(tile_img, req.floor_corners, room_img.shape[:2], mask)

        # Step 4: Blend shadows and lighting
        logger.info("Blending shadows...")
        blended_tile = blend_shadows(room_img, warped_tile, mask)

        # Step 5: Composite final result
        logger.info("Compositing result...")
        result_img = composite_result(room_img, blended_tile, mask)

        # Step 6: Upload both mask and result to Cloudinary
        logger.info("Uploading results...")
        import time as t
        timestamp = int(t.time())
        result_url = await upload_image_async(result_img, "tilevision/results", f"result_{timestamp}")
        mask_url = await upload_image_async(mask, "tilevision/masks", f"mask_{timestamp}")

        processing_ms = int((time.time() - start_time) * 1000)
        logger.info(f"Total processing time: {processing_ms}ms")

        return VisualizeResponse(
            result_image_url=result_url,
            mask_image_url=mask_url,
            processing_time_ms=processing_ms
        )

    except ValueError as e:
        logger.error("Validation error in visualization pipeline: %s", e)
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Pipeline failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Visualization pipeline failed")


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=PORT,
        reload=True,
        log_level="info",
    )
