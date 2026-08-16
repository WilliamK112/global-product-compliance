from __future__ import annotations

from pathlib import Path

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

from agents.action import remediation_plan
from agents.orchestrator import recheck_sku, run_change_demo, run_portfolio
from product_graph.intake import parse_catalog_csv
from regulation_graph.assess import MarketAccessState

STATIC = Path(__file__).resolve().parent / "static"

app = FastAPI(
    title="CanSell Market Access API",
    description="Product × country × platform × regulation. Not a legal opinion.",
    version="0.1.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class CatalogPayload(BaseModel):
    csv_text: str | None = None


class RecheckPayload(BaseModel):
    sku: str
    extra_certifications: list[str]


@app.get("/")
def demo_home():
    return FileResponse(STATIC / "index.html", headers={"Cache-Control": "no-store"})


@app.get("/pitch")
def pitch():
    pitch = Path(__file__).resolve().parents[2] / "submission" / "PITCH.html"
    return FileResponse(pitch)


@app.get("/health")
def health():
    return {"ok": True, "product": "CanSell", "disclaimer": "not_legal_advice"}


@app.get("/portfolio")
def portfolio():
    return run_portfolio()


@app.post("/catalog")
def catalog(payload: CatalogPayload):
    if not payload.csv_text:
        raise HTTPException(400, "csv_text is required")
    products = parse_catalog_csv(payload.csv_text)
    return run_portfolio(products)


@app.post("/catalog/upload")
async def catalog_upload(file: UploadFile = File(...)):
    text = (await file.read()).decode("utf-8")
    products = parse_catalog_csv(text)
    return run_portfolio(products)


@app.get("/cell/{sku}/{country}/{platform}")
def cell(sku: str, country: str, platform: str):
    data = run_portfolio()
    for item in data["matrix"]:
        if item["sku"] == sku and item["country"] == country and item["platform"] == platform:
            state = MarketAccessState(**item)
            return {**item, "remediation": remediation_plan(state)}
    raise HTTPException(404, "Cell not found")


@app.post("/recheck")
def recheck(payload: RecheckPayload):
    try:
        return recheck_sku(payload.sku, payload.extra_certifications)
    except KeyError as exc:
        raise HTTPException(404, f"Unknown SKU {exc}") from exc


@app.get("/changes/demo")
def changes_demo():
    return run_change_demo()
