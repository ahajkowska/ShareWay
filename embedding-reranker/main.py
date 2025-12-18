import os
from io import BytesIO
from typing import List, Optional, Tuple

import requests
import torch
from fastapi import FastAPI, HTTPException
from PIL import Image
from pydantic import BaseModel, Field
from transformers import CLIPModel, CLIPProcessor

MODEL_ID = os.getenv("MODEL_ID", "openai/clip-vit-base-patch32")
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
MAX_CANDIDATES = int(os.getenv("MAX_CANDIDATES", "50"))
REQUEST_TIMEOUT = float(os.getenv("REQUEST_TIMEOUT", "10.0"))

app = FastAPI(title="Embedding Reranker", version="0.2.0")


class Candidate(BaseModel):
    index: int
    url: str
    alt: Optional[str] = ""


class RerankRequest(BaseModel):
    prompt: str = Field(..., description="User prompt/destination text")
    candidates: List[Candidate] = Field(
        ..., description="List of image candidates with URLs and optional alt"
    )


class RerankResponse(BaseModel):
    indices: List[int]
    scores: List[float]


_clip_model: Optional[CLIPModel] = None
_clip_processor: Optional[CLIPProcessor] = None


def get_clip() -> Tuple[CLIPModel, CLIPProcessor]:
    """Lazy-load CLIP model & processor."""
    global _clip_model, _clip_processor
    if _clip_model is None or _clip_processor is None:
        try:
            model = CLIPModel.from_pretrained(MODEL_ID)
            processor = CLIPProcessor.from_pretrained(MODEL_ID)
        except Exception as exc:  # noqa: BLE001
            raise RuntimeError(f"Failed to load model {MODEL_ID}: {exc}") from exc

        model.to(DEVICE)
        model.eval()
        _clip_model = model
        _clip_processor = processor
    return _clip_model, _clip_processor


def fetch_image(url: str) -> Optional[Image.Image]:
    """Pobierz obraz z URL i skonwertuj do RGB. Zwraca None przy błędzie."""
    try:
        res = requests.get(url, timeout=REQUEST_TIMEOUT)
        res.raise_for_status()
        img = Image.open(BytesIO(res.content)).convert("RGB")
        img.thumbnail((1024, 1024))
        return img
    except Exception:
        return None


def score_candidates(prompt: str, candidates: List[Candidate]) -> RerankResponse:
    model, processor = get_clip()

    candidates = candidates[:MAX_CANDIDATES]

    images: List[Image.Image] = []
    valid_indices: List[int] = []

    for cand in candidates:
        img = fetch_image(cand.url)
        if img is not None:
            images.append(img)
            valid_indices.append(cand.index)

    if not images:
        raise HTTPException(
            status_code=400, detail="No candidates with fetchable images"
        )

    inputs = processor(
        text=[prompt],
        images=images,
        return_tensors="pt",
        padding=True,
    ).to(DEVICE)

    with torch.no_grad():
        outputs = model(**inputs)
        logits_per_image = outputs.logits_per_image
        scores = logits_per_image[:, 0].softmax(dim=0).cpu().tolist()

    paired = sorted(zip(valid_indices, scores), key=lambda x: x[1], reverse=True)
    indices, sorted_scores = zip(*paired)
    return RerankResponse(indices=list(indices), scores=list(sorted_scores))


@app.post("/rerank", response_model=RerankResponse)
def rerank(body: RerankRequest) -> RerankResponse:
    if not body.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt is required")
    if not body.candidates:
        raise HTTPException(status_code=400, detail="Candidates are required")
    if len(body.candidates) > MAX_CANDIDATES:
        raise HTTPException(
            status_code=400,
            detail=f"Too many candidates (max {MAX_CANDIDATES})",
        )

    return score_candidates(body.prompt, body.candidates)


@app.get("/health")
def health():
    return {"status": "ok", "model": MODEL_ID, "device": DEVICE}
