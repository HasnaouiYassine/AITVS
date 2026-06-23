# TileVision CV Service

AI-powered tile visualizer — a FastAPI microservice that processes room images and applies tile textures using computer vision (SAM2 segmentation, perspective warping, and alpha blending).

## Architecture

```
POST /visualize
  ┌──────────────┐
  │  Download     │  room + tile images from URLs
  │  Images       │
  └──────┬───────┘
         ▼
  ┌──────────────┐
  │  Segment      │  SAM2 floor mask (or polygon fallback)
  │  Floor        │
  └──────┬───────┘
         ▼
  ┌──────────────┐
  │  Perspective  │  warp tile texture to floor plane
  │  Warp         │
  └──────┬───────┘
         ▼
  ┌──────────────┐
  │  Blend &      │  alpha-composite with feathered edges
  │  Composite    │
  └──────┬───────┘
         ▼
  ┌──────────────┐
  │  Upload to    │  result + mask → Cloudinary
  │  Cloudinary   │
  └──────────────┘
```

## Quick Start

### 1. Clone & install dependencies

```bash
cd cv-service
python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt

# Clone and install SAM2 (Note: Rename directory to sam2_repo to avoid import overshadowing)
git clone https://github.com/facebookresearch/sam2.git sam2_repo
cd sam2_repo
pip install -e .
cd ..

# Download the small checkpoint (CPU-friendly)
mkdir checkpoints
# Windows (PowerShell)
Invoke-WebRequest -Uri "https://dl.fbaipublicfiles.com/segment_anything_2/072824/sam2_hiera_small.pt" -OutFile "checkpoints/sam2_hiera_small.pt"
# macOS / Linux / Git Bash
wget -O checkpoints/sam2_hiera_small.pt https://dl.fbaipublicfiles.com/segment_anything_2/072824/sam2_hiera_small.pt
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env and fill in your Cloudinary credentials
```

### 3. Run the service

```bash
uvicorn main:app --reload --port 8000
```

The service will be available at `http://localhost:8000`.

## API Endpoints

### Health Check

```bash
curl http://localhost:8000/health
```

**Response:**
```json
{
  "status": "ok",
  "version": "0.1.0"
}
```

### Visualize (Stub)

```bash
curl -X POST http://localhost:8000/visualize \
  -H "Content-Type: application/json" \
  -d '{
    "room_image_url": "https://example.com/room.jpg",
    "tile_image_url": "https://example.com/tile.jpg",
    "floor_corners": [
      {"x": 100, "y": 400},
      {"x": 500, "y": 400},
      {"x": 550, "y": 600},
      {"x": 50,  "y": 600}
    ]
  }'
```

**Response:**
```json
{
  "result_image_url": "https://res.cloudinary.com/demo/image/upload/sample.jpg",
  "mask_image_url": "https://res.cloudinary.com/demo/image/upload/sample.jpg",
  "processing_time_ms": 0
}
```

### Interactive API Docs

- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | *(required)* |
| `CLOUDINARY_API_KEY` | Cloudinary API key | *(required)* |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | *(required)* |
| `SAM2_CHECKPOINT` | Path to SAM2 model checkpoint | `checkpoints/sam2_hiera_small.pt` |
| `SAM2_CONFIG` | SAM2 model config YAML filename | `sam2_hiera_s.yaml` |
| `ALLOWED_ORIGINS` | Comma-separated list of CORS origins | `http://localhost:3000` |
| `PORT` | Port to run the service on | `8000` |

## Project Structure

```
cv-service/
├── main.py                 # FastAPI app entry point
├── pipeline/
│   ├── __init__.py
│   ├── segmentation.py     # Floor segmentation (SAM2 / polygon)
│   ├── perspective.py      # Perspective warp for tile textures
│   ├── blending.py         # Alpha blending with feathered edges
│   └── compositor.py       # End-to-end pipeline orchestrator
├── utils/
│   ├── __init__.py
│   ├── image_utils.py      # Image download, encode, resize
│   └── cloudinary_utils.py # Cloudinary upload / delete helpers
├── models/
│   ├── __init__.py
│   └── schemas.py          # Pydantic request / response models
├── checkpoints/            # Model weights (gitignored)
├── requirements.txt
├── .env.example
├── .gitignore
├── Dockerfile
└── README.md
```

## Docker

```bash
docker build -t tilevision-cv .
docker run -p 8000:8000 --env-file .env tilevision-cv
```

## Roadmap

- **Task 1** ✅ Service scaffold + stub endpoint
- **Task 2** ✅ SAM2 floor segmentation
- **Task 3** — Perspective tile warping
- **Task 4** — Blending, shadow preservation, and final compositing
