FROM python:3.11-slim

RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH \
    PYTHONUNBUFFERED=1 \
    HF_HOME=/home/user/.cache/huggingface
WORKDIR /home/user/app

# CPU-only PyTorch (the CUDA build is far too big for a free CPU Space)
RUN pip install --no-cache-dir torch==2.8.0 --index-url https://download.pytorch.org/whl/cpu

COPY --chown=user requirements.docker.txt .
RUN pip install --no-cache-dir -r requirements.docker.txt

# Bake the model into the image so startup doesn't re-download ~3.5 GB
RUN python -c "from huggingface_hub import snapshot_download; snapshot_download('Qwen/Qwen3-1.7B')"

COPY --chown=user . .

EXPOSE 7860
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
