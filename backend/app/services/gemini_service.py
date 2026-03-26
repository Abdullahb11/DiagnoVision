import json
import logging
from typing import Optional

import httpx

from app.config import settings

logger = logging.getLogger(__name__)

class GeminiService:
    """Generate concise clinician-facing commentary for scan reports."""

    def __init__(self):
        self.enabled = bool(settings.GEMINI_API_KEY)
        self.model_name = settings.GEMINI_MODEL
        self.api_key = settings.GEMINI_API_KEY
        if not self.enabled:
            logger.info("Gemini disabled: GEMINI_API_KEY missing")

    @staticmethod
    def _failed_result(reason: str) -> dict:
        return {
            "clinical_summary": f"Chat model did not work for this report ({reason}).",
            "action_points": [],
            "disclaimer": "This is AI-generated support text for clinicians and is not a diagnosis.",
        }

    def build_doctor_explanation(
        self,
        glaucoma_msg: str,
        dr_msg: str,
        glaucoma_confidence: Optional[float],
        dr_confidence: Optional[float],
    ) -> Optional[dict]:
        gc = f"{glaucoma_confidence:.1%}" if glaucoma_confidence is not None else "N/A"
        dc = f"{dr_confidence:.1%}" if dr_confidence is not None else "N/A"

        if not self.enabled or not self.api_key:
            return self._failed_result("missing_api_key")

        prompt = f"""
You are assisting an ophthalmologist.
Given model outputs below, produce concise clinician-facing interpretation.

Glaucoma output: {glaucoma_msg}
Glaucoma confidence: {gc}
Diabetic retinopathy output: {dr_msg}
DR confidence: {dc}

Return valid JSON only with keys:
- clinical_summary (4-6 sentences, professional ophthalmology wording with rationale)
- action_points (array of 3-5 short bullets with next-step suggestions)
- disclaimer (must clearly state this is AI-generated support text and not a diagnosis)
"""
        try:
            url = (
                f"https://generativelanguage.googleapis.com/v1beta/models/"
                f"{self.model_name}:generateContent?key={self.api_key}"
            )
            payload = {
                "contents": [
                    {"parts": [{"text": prompt}]}
                ],
                "generationConfig": {
                    "temperature": 0.2,
                },
            }
            with httpx.Client(timeout=20.0) as client:
                resp = client.post(url, json=payload)
            if resp.status_code >= 400:
                logger.warning("Gemini API HTTP %s: %s", resp.status_code, resp.text[:500])
                return self._failed_result(f"http_{resp.status_code}")

            body = resp.json()
            candidates = body.get("candidates") or []
            text = ""
            if candidates:
                parts = (
                    candidates[0]
                    .get("content", {})
                    .get("parts", [])
                )
                for p in parts:
                    if isinstance(p, dict) and p.get("text"):
                        text += str(p["text"])
            text = text.strip()
            if not text:
                return self._failed_result("empty_response")

            start = text.find("{")
            end = text.rfind("}")
            if start >= 0 and end > start:
                text = text[start : end + 1]
            data = json.loads(text)
            if not isinstance(data, dict):
                return self._failed_result("invalid_json")
            if "disclaimer" not in data or not str(data.get("disclaimer", "")).strip():
                data["disclaimer"] = (
                    "This is AI-generated support text for clinicians and is not a diagnosis."
                )
            return data
        except Exception as e:
            logger.warning("Gemini explanation generation failed: %s", e)
            return self._failed_result("request_failed")


gemini_service = GeminiService()

