import os
from pathlib import Path

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer


# ---------------------------------------------------------
# Model source
# ---------------------------------------------------------
# Local development: if ./models/Qwen3-1.7B exists (downloaded with
#   hf download Qwen/Qwen3-1.7B --local-dir ./models/Qwen3-1.7B )
# it is used and nothing is downloaded.
#
# Deployment (Docker / Hugging Face Space): there is no local folder,
# so the model is loaded from the Hugging Face cache. The Dockerfile
# downloads it at build time, so startup stays fast.
# ---------------------------------------------------------

LOCAL_MODEL_PATH = Path(__file__).resolve().parent.parent / "models" / "Qwen3-1.7B"
USE_LOCAL = LOCAL_MODEL_PATH.exists()
MODEL_SOURCE = str(LOCAL_MODEL_PATH) if USE_LOCAL else os.getenv("QWEN_MODEL_ID", "Qwen/Qwen3-1.7B")

print(f"[qwen] loading model from: {MODEL_SOURCE} (local={USE_LOCAL}) | cuda={torch.cuda.is_available()}")

tokenizer = AutoTokenizer.from_pretrained(
    MODEL_SOURCE,
    local_files_only=USE_LOCAL
)

model = AutoModelForCausalLM.from_pretrained(
    MODEL_SOURCE,
    dtype="auto",
    device_map="auto",
    local_files_only=USE_LOCAL
)

model.eval()


def generate_response(
    prompt: str,
    max_new_tokens: int = 256
) -> str:
    """
    Send a prompt to Qwen and return only the generated text.

    This function intentionally knows nothing about grading.
    Its only responsibility is model inference.
    """

    messages = [
        {
            "role": "user",
            "content": prompt
        }
    ]

    text = tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=True,
        enable_thinking=False
    )

    inputs = tokenizer(
        [text],
        return_tensors="pt"
    ).to(model.device)

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=max_new_tokens,
            do_sample=False
        )

    # keep only the newly generated tokens
    generated_tokens = outputs[0][inputs.input_ids.shape[-1]:]

    response = tokenizer.decode(
        generated_tokens,
        skip_special_tokens=True
    )

    return response.strip()
