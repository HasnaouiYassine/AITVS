import logging
from typing import Optional, Tuple

import cv2
import numpy as np
import torch

from sam2.build_sam import build_sam2
from sam2.sam2_image_predictor import SAM2ImagePredictor

logger = logging.getLogger(__name__)


class FloorSegmentor:
    """
    Singleton class that loads SAM2 once and reuses it.
    Loading SAM2 takes ~5 seconds so we do it at startup.
    """
    _instance = None
    _predictor = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def load_model(self, checkpoint_path: str, config_name: str):
        """Load SAM2 model. Call once at startup."""
        # Resolve config name path relative to sam2 pkg search path
        resolved_config = config_name
        if not resolved_config.startswith("configs/"):
            if resolved_config.startswith("sam2_hiera_"):
                resolved_config = f"configs/sam2/{resolved_config}"
            elif resolved_config.startswith("sam2.1_hiera_"):
                resolved_config = f"configs/sam2.1/{resolved_config}"

        device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(
            "Loading SAM2 model on device: %s using config: %s and checkpoint: %s",
            device, resolved_config, checkpoint_path
        )

        try:
            model = build_sam2(resolved_config, checkpoint_path, device=device)
            self._predictor = SAM2ImagePredictor(model)
            logger.info("SAM2 model loaded successfully.")
        except Exception as e:
            logger.error("Failed to load SAM2 model: %s", e)
            raise e

    def generate_mask(
        self,
        image_np: np.ndarray,
        point: Tuple[float, float],
        point_label: int = 1
    ) -> np.ndarray:
        """
        Generate binary floor mask from a single point prompt.

        Args:
            image_np: RGB image as numpy array (H, W, 3)
            point: (x, y) coordinates of click on floor
            point_label: 1 = foreground (we want this area)

        Returns:
            binary_mask: uint8 numpy array (H, W), 255=floor, 0=other
        """
        if self._predictor is None:
            raise RuntimeError("SAM2 predictor is not loaded. Call load_model first.")

        logger.info("Generating mask using SAM2 for point: %s", point)

        # 1. Set image on predictor
        self._predictor.set_image(image_np)

        # 2. Predict with point coords and point labels
        point_coords = np.array([[point[0], point[1]]], dtype=np.float32)
        point_labels = np.array([point_label], dtype=np.int32)

        masks, scores, logits = self._predictor.predict(
            point_coords=point_coords,
            point_labels=point_labels,
            multimask_output=True
        )

        # 3. Select best mask (highest score)
        best_idx = np.argmax(scores)
        best_mask = masks[best_idx]
        logger.info("Selected mask %d with score: %.4f", best_idx, scores[best_idx])

        # 4. Convert bool mask to uint8 (0 or 255)
        binary_mask = (best_mask.astype(np.uint8)) * 255

        # 5. Morphological cleanup: closing to fill gaps, opening to remove noise
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
        binary_mask = cv2.morphologyEx(binary_mask, cv2.MORPH_CLOSE, kernel)
        binary_mask = cv2.morphologyEx(binary_mask, cv2.MORPH_OPEN, kernel)

        return binary_mask

    def generate_mask_from_corners(
        self,
        image_np: np.ndarray,
        corners: list
    ) -> np.ndarray:
        """
        Fallback: generate mask from 4 corner points using polygon fill.
        Used when SAM2 is not available or fails.

        Args:
            image_np: RGB image as numpy array
            corners: list of {x, y} dicts or Corner objects

        Returns:
            binary_mask: uint8 numpy array (H, W), 255=floor, 0=other
        """
        logger.info("Generating mask from corners polygon fallback.")
        h, w = image_np.shape[:2]
        mask = np.zeros((h, w), dtype=np.uint8)

        pts = []
        for c in corners:
            if hasattr(c, "x") and hasattr(c, "y"):
                pts.append([c.x, c.y])
            elif isinstance(c, dict) and "x" in c and "y" in c:
                pts.append([c["x"], c["y"]])
            else:
                pts.append([c[0], c[1]])

        pts_np = np.array(pts, dtype=np.int32).reshape((-1, 1, 2))
        cv2.fillPoly(mask, [pts_np], 255)
        return mask


def get_segmentor() -> FloorSegmentor:
    """Get or create the singleton segmentor instance."""
    return FloorSegmentor()
