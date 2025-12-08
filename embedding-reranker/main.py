import os
from io import BytesIO
from typing import List, Optional

import requests
import torch
from fastapi import FastAPI, HTTPException
from PIL import Image
from pydantic import BaseModel, Field
from transformers import CLIPModel, CLIPProcessor

MODEL_ID = os.getenv("MODEL_ID", "openai/clip-vit-base-patch32")
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"


class Candidate(BaseModel):
  index: int
  url: str
  alt: Optional[str] = ""


class RerankRequest(BaseModel):
  prompt: str = Field(..., description="User prompt/destination text")
  candidates: List[Candidate] = Field(..., description="List of image candidates with URLs and optional alt")


class RerankResponse(BaseModel):
  indices: List[int]
  scores: List[float]


app = FastAPI(title="Embedding Reranker", version="0.1.0")


def load_model():
  model = CLIPModel.from_pretrained(MODEL_ID)
  processor = CLIPProcessor.from_pretrained(MODEL_ID)
  model.to(DEVICE)
  model.eval()
  return model, processor


try:
  clip_model, clip_processor = load_model()
except Exception as exc:
  raise RuntimeError(f"Failed to load model {MODEL_ID}: {exc}") from exc


def fetch_image(url: str) -> Optional[Image.Image]:
  try:
    res = requests.get(url, timeout=10)
    res.raise_for_status()
    return Image.open(BytesIO(res.content)).convert("RGB")
  except Exception:
    return None


def score_candidates(prompt: str, candidates: List[Candidate]) -> RerankResponse:
  images = []
  valid_indices = []
  for cand in candidates:
    img = fetch_image(cand.url)
    if img:
      images.append(img)
      valid_indices.append(cand.index)

  if not images:
    raise HTTPException(status_code=400, detail="No candidates with fetchable images")

  inputs = clip_processor(
      text=[prompt],
      images=images,
      return_tensors="pt",
      padding=True
  ).to(DEVICE)

  with torch.no_grad():
    outputs = clip_model(**inputs)
    logits_per_image = outputs.logits_per_image  # shape (num_images, num_texts)
    scores = logits_per_image[:, 0].softmax(dim=0).cpu().tolist()

  paired = list(zip(valid_indices, scores))
  paired.sort(key=lambda x: x[1], reverse=True)
  indices, sorted_scores = zip(*paired)
  return RerankResponse(indices=list(indices), scores=list(sorted_scores))


@app.post("/rerank", response_model=RerankResponse)
def rerank(body: RerankRequest):
  if not body.prompt.strip():
    raise HTTPException(status_code=400, detail="Prompt is required")
  if not body.candidates:
    raise HTTPException(status_code=400, detail="Candidates are required")
  if len(body.candidates) > 50:
    raise HTTPException(status_code=400, detail="Too many candidates (max 50)")

  return score_candidates(body.prompt, body.candidates)


@app.get("/health")
def health():
  return {"status": "ok", "model": MODEL_ID, "device": DEVICE}
