"""
End-to-end test for the full CV pipeline.
Run with: python test_e2e.py
Uses a real room image URL and tile image URL from the internet.
"""
import requests
import time

CV_SERVICE_URL = "http://localhost:8000"

# Public test images
ROOM_IMAGE_URL = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200"
TILE_IMAGE_URL = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"


def test_health():
    res = requests.get(f"{CV_SERVICE_URL}/health")
    assert res.status_code == 200
    print("✅ Health check passed")


def test_visualize():
    payload = {
        "room_image_url": ROOM_IMAGE_URL,
        "tile_image_url": TILE_IMAGE_URL,
        "floor_corners": [
            {"x": 100, "y": 400},
            {"x": 700, "y": 400},
            {"x": 800, "y": 600},
            {"x": 50, "y": 600}
        ],
        "floor_point": {"x": 400, "y": 500}
    }

    print("🔄 Sending visualization request...")
    start = time.time()
    res = requests.post(f"{CV_SERVICE_URL}/visualize", json=payload, timeout=120)
    elapsed = int((time.time() - start) * 1000)

    if res.status_code == 200:
        data = res.json()
        print(f"✅ Visualization succeeded in {elapsed}ms")
        print(f"   Result URL: {data['result_image_url']}")
        print(f"   Mask URL: {data['mask_image_url']}")
        print(f"   Processing time: {data['processing_time_ms']}ms")
    else:
        print(f"❌ Failed: {res.status_code} — {res.text}")


if __name__ == '__main__':
    test_health()
    test_visualize()
