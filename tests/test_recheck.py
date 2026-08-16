from agents.orchestrator import recheck_sku, run_portfolio


def test_speaker_eu_blocked_then_improves_with_red_and_rp():
    before = run_portfolio()
    eu = [c for c in before["matrix"] if c["sku"] == "BT-SPEAKER-01" and c["country"] == "EU"]
    assert eu and all(c["status"] == "BLOCKED" for c in eu)
    result = recheck_sku("BT-SPEAKER-01", ["CE-RED", "EU-RP"])
    after = [c for c in result["portfolio"]["matrix"] if c["sku"] == "BT-SPEAKER-01" and c["country"] == "EU"]
    assert after
    assert all(c["status"] != "BLOCKED" for c in after)
    assert any(key.endswith("|EU|Amazon") or "|EU|" in key for key in result["moved"])


def test_recheck_does_not_pass_unknown_category():
    from product_graph.models import ProductTwin
    from agents.orchestrator import run_portfolio as _run

    product = ProductTwin(sku="TEE-1", name="Cotton tee", category="apparel", origin="CN")
    data = _run([product])
    assert data["matrix"][0]["status"] == "UNCERTAIN"
