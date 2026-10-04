import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

import pytest
from ml.nlp.multilingual_parser import nlp_parser

def test_nlp_english_extraction():
    text = "Huge waves breached the sea wall near Swargadwar. Water is flooding the road! 4 families trapped."
    res = nlp_parser.parse(text)

    assert res["hazard_type"] in ["COASTAL_FLOODING", "HIGH_WAVES", "INFRASTRUCTURE_DAMAGE"]
    assert "Swargadwar" in res["extracted_locations"]
    assert res["has_life_threat"] is True
    assert res["urgency_score"] >= 4
    assert res["language_detected"] == "ENGLISH"

def test_nlp_hindi_extraction():
    text = "समुद्र का पानी सड़क पर घुस गया है और ऊंची लहरें आ रही हैं, बचाओ मदद चाहिए!"
    res = nlp_parser.parse(text)

    assert res["hazard_type"] in ["COASTAL_FLOODING", "HIGH_WAVES"]
    assert res["has_life_threat"] is True
    assert res["urgency_score"] >= 4
    assert res["language_detected"] == "HINDI"

def test_nlp_hinglish_extraction():
    text = "Puri marine drive pe pani bhar gaya hai aur bahut badi lahar aa rahi hai."
    res = nlp_parser.parse(text)

    assert res["hazard_type"] in ["COASTAL_FLOODING", "HIGH_WAVES"]
    assert "Marine Drive" in res["extracted_locations"]

if __name__ == "__main__":
    sys.exit(pytest.main(["-v", __file__]))
