from pathlib import Path

from agents.orchestrator import run_change_demo, run_portfolio
from product_graph.intake import parse_catalog_csv
from product_graph.models import ProductTwin
from regulation_graph.assess import assess_matrix
from storage.loader import load_platform_requirements, load_regulations
from verification.pyramid import can_assert_without_expert


def test_unknown_category_is_uncertain_not_pass():
    product = ProductTwin(sku="X-1", name="Widget", category="apparel", origin="CN")
    matrix = assess_matrix(
        [product],
        ["EU"],
        ["Amazon"],
        load_regulations(),
        load_platform_requirements(),
    )
    assert matrix[0].status == "UNCERTAIN"
    assert matrix[0].status != "PASS"


def test_wireless_without_red_is_blocked_in_eu():
    product = ProductTwin(
        sku="CLONE-SPEAKER",
        name="Any wireless audio",
        category="consumer_electronics",
        origin="CN",
        has_wireless=True,
        wireless_tech=["Bluetooth"],
        certifications=["CE-EMC"],
        target_countries=["EU"],
        target_platforms=["Amazon"],
    )
    matrix = assess_matrix([product], ["EU"], ["Amazon"], load_regulations(), load_platform_requirements())
    assert matrix[0].status == "BLOCKED"
    assert "eu-red-essential" in matrix[0].applicable_rules


def test_results_follow_attributes_not_sku_name():
    catalog = Path("data/products/demo_catalog.csv").read_text()
    original = [item for item in parse_catalog_csv(catalog) if item.sku == "BT-SPEAKER-01"][0]
    clone = original.model_copy(update={"sku": "DIFFERENT-ID", "name": "Totally Different Name"})
    a = assess_matrix([original], ["EU"], ["Amazon"], load_regulations(), load_platform_requirements())[0]
    b = assess_matrix([clone], ["EU"], ["Amazon"], load_regulations(), load_platform_requirements())[0]
    assert a.status == b.status
    assert a.applicable_rules == b.applicable_rules


def test_serum_indonesia_blocked_without_bpom():
    data = run_portfolio()
    cells = [item for item in data["matrix"] if item["sku"] == "SERUM-01" and item["country"] == "ID"]
    assert cells
    assert all(item["status"] == "BLOCKED" for item in cells)
    assert any("id-bpom-nie" in item["applicable_rules"] for item in cells)


def test_led_has_evidence_and_not_silent_pass_in_eu():
    data = run_portfolio()
    cells = [item for item in data["matrix"] if item["sku"] == "LED-LAMP-01" and item["country"] == "EU"]
    assert cells
    assert all(item["findings"] for item in cells)
    assert all(item["status"] != "UNCERTAIN" or item["findings"] for item in cells)


def test_change_affects_lighting_only():
    result = run_change_demo()
    assert result["impact"]["affected_skus"] == ["LED-LAMP-01"]
    lighting_keys = [key for key in result["impact"]["after"] if key.startswith("LED-LAMP-01|ID|")]
    assert lighting_keys
    assert any(result["impact"]["after"][key] == "WARNING" for key in lighting_keys)


def test_llm_evidence_cannot_assert_alone():
    assert can_assert_without_expert(["llm_interpretation"]) is False
    assert can_assert_without_expert(["official_regulation"]) is True


def test_false_safe_wireless_us_without_fcc():
    product = ProductTwin(
        sku="RADIO-1",
        name="BT gadget",
        category="consumer_electronics",
        origin="CN",
        has_wireless=True,
        target_countries=["US"],
        target_platforms=["Amazon"],
    )
    cell = assess_matrix([product], ["US"], ["Amazon"], load_regulations(), load_platform_requirements())[0]
    assert cell.status == "BLOCKED"
