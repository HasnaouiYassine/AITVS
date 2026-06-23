FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (git needed for pip to clone SAM2 from GitHub)
RUN apt-get update && apt-get install -y git libgl1 libglib2.0-0t64 && rm -rf /var/lib/apt/lists/*

# Install CPU-only PyTorch FIRST (saves ~1.5 GB vs full CUDA build)
RUN pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu

# Install remaining dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

EXPOSE 8000

# Use shell form so $PORT env var is expanded at runtime (Render injects PORT)
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
