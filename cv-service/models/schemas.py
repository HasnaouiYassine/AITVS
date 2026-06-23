from pydantic import BaseModel, HttpUrl
from typing import List, Optional


class Corner(BaseModel):
    x: float
    y: float


class VisualizeRequest(BaseModel):
    room_image_url: str
    tile_image_url: str
    floor_corners: List[Corner]   # exactly 4 corners from user clicks
    floor_point: Optional[Corner] = None  # optional SAM2 point hint


class VisualizeResponse(BaseModel):
    result_image_url: str
    mask_image_url: str
    processing_time_ms: int


class HealthResponse(BaseModel):
    status: str
    version: str
