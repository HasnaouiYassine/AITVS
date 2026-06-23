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
async def visualize(request: VisualizeRequest) -> VisualizeResponse:
    """
    Process a room image and apply a tile texture.

    **Stub implementation** — returns a hardcoded mock response.
    Will be replaced with the real pipeline in Tasks 2-4.

    Args:
        request: The visualization request body containing room image URL,
                 tile image URL, floor corners, and an optional point hint.

    Returns:
        VisualizeResponse with result image URL, mask URL, and timing.
    """
    logger.info("Processing visualization request...")
    logger.info("  Room image URL  : %s", request.room_image_url)
    logger.info("  Tile image URL  : %s", request.tile_image_url)
    logger.info("  Floor corners   : %s", [(c.x, c.y) for c in request.floor_corners])
    logger.info("  Floor point     : %s", request.floor_point)

    # Validate corner count
    if len(request.floor_corners) != 4:
        raise HTTPException(
            status_code=422,
            detail=f"Exactly 4 floor corners required, got {len(request.floor_corners)}",
        )

    # ------------------------------------------------------------------
    # STUB: Return a hardcoded mock response.
    # Replace with `pipeline.compositor.run_visualization_pipeline()` call.
    # ------------------------------------------------------------------
    start_time: float = time.time()

    # Simulate processing delay (remove when real pipeline is wired)
    mock_processing_ms: int = int((time.time() - start_time) * 1000)

    logger.info("Visualization stub complete in %d ms", mock_processing_ms)

    return VisualizeResponse(
        result_image_url="https://res.cloudinary.com/demo/image/upload/sample.jpg",
        mask_image_url="https://res.cloudinary.com/demo/image/upload/sample.jpg",
        processing_time_ms=mock_processing_ms,
    )


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
