FROM python:3.11-slim

# system libs needed by OpenCV / Paddle
RUN apt-get update && apt-get install -y --no-install-recommends \
      libgl1 libglib2.0-0 libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Hugging Face Spaces runs containers as user 1000
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH \
    PYTHONUNBUFFERED=1 \
    FLAGS_use_mkldnn=0
WORKDIR /home/user/app

# CPU-only PyTorch first (much smaller than the CUDA build)
RUN pip install --no-cache-dir torch==2.8.0 torchvision==0.23.0 \
      --index-url https://download.pytorch.org/whl/cpu

COPY --chown=user requirements.docker.txt .
RUN pip install --no-cache-dir -r requirements.docker.txt

COPY --chown=user . .

# Bake the TrOCR weights into the image so the first request isn't a download
RUN python -c "from transformers import TrOCRProcessor, VisionEncoderDecoderModel; \
m='microsoft/trocr-base-handwritten'; TrOCRProcessor.from_pretrained(m); VisionEncoderDecoderModel.from_pretrained(m)"

# Warm the PaddleOCR models too (non-fatal if it can't)
RUN python -c "import app.ocr" || echo "PaddleOCR warm-up skipped; models will download on first request"

EXPOSE 7860
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
