from pathlib import Path
import json
import subprocess

from agents.orchestrator import run_change_demo, run_portfolio

ROOT = Path(__file__).resolve().parents[1]


def test_web_seeds_match_python_source():
    assert (ROOT / "apps/web/data/regulations.json").read_text() == (ROOT / "data/regulations/seed.json").read_text()
    assert (ROOT / "apps/web/data/platforms.json").read_text() == (ROOT / "data/platforms/seed.json").read_text()
    assert (ROOT / "apps/web/data/demo_catalog.csv").read_text() == (ROOT / "data/products/demo_catalog.csv").read_text()


def test_ts_and_python_matrix_statuses_match():
    py = {
        f"{cell['sku']}|{cell['country']}|{cell['platform']}": cell["status"]
        for cell in run_portfolio()["matrix"]
    }
    raw = subprocess.check_output(
        ["npx", "--yes", "tsx", "scripts/dump-matrix.ts"],
        cwd=ROOT / "apps" / "web",
        timeout=60,
    )
    ts = json.loads(raw.decode())
    assert ts["matrix"] == py
    assert ts["affected"] == run_change_demo()["impact"]["affected_skus"]
    assert run_change_demo()["impact"]["affected_skus"] == ["LED-LAMP-01"]
