"""Build PDF reports for eye scan results (images + summary text)."""
import base64
import io
import logging
from pathlib import Path
import re
from typing import Optional

from PIL import Image
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import Image as RLImage, Paragraph, SimpleDocTemplate, Spacer

from app.services.gemini_service import gemini_service

logger = logging.getLogger(__name__)


def _decode_image(data: Optional[str]) -> Optional[bytes]:
    if not data or not str(data).strip():
        return None
    s = str(data).strip()
    if "," in s and s.startswith("data:"):
        s = s.split(",", 1)[1]
    try:
        return base64.b64decode(s, validate=False)
    except Exception as e:
        logger.warning("Failed to decode base64 image: %s", e)
        return None


def _image_flowable(raw: bytes, max_width: float = 5.25 * inch):
    try:
        bio = io.BytesIO(raw)
        pil = Image.open(bio).convert("RGB")
        out = io.BytesIO()
        pil.save(out, format="JPEG", quality=82)
        out.seek(0)
        w_px, h_px = pil.size
        if w_px <= 0 or h_px <= 0:
            return None
        disp_w = max_width
        disp_h = disp_w * h_px / w_px
        max_h = 6.5 * inch
        if disp_h > max_h:
            scale = max_h / disp_h
            disp_w *= scale
            disp_h *= scale
        out.seek(0)
        return RLImage(out, width=disp_w, height=disp_h)
    except Exception as e:
        logger.warning("Failed to build PDF image: %s", e)
        return None


def _summary_line(label: str, msg: str, confidence_text: str) -> str:
    # Normalize message so confidence appears once in a consistent format.
    safe_msg = (msg or "").strip()
    safe_msg = re.sub(
        r"\s*\(confidence:\s*[^)]*\)\s*$",
        "",
        safe_msg,
        flags=re.IGNORECASE,
    ).strip()
    return f"<b>{label}:</b> {safe_msg} (confidence: {confidence_text})"


def build_scan_report_pdf(
    patient_display_name: str,
    image_id: str,
    glaucoma_msg: str,
    dr_msg: str,
    glaucoma_confidence: Optional[float],
    dr_confidence: Optional[float],
    image_base64: Optional[str],
    glaucoma_heatmap_base64: Optional[str],
    glaucoma_overlay_base64: Optional[str],
    dr_heatmap_base64: Optional[str],
    dr_overlay_base64: Optional[str],
) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        title=f"DiagnoVision Scan Report — {image_id[:8]}",
        leftMargin=0.65 * inch,
        rightMargin=0.65 * inch,
        topMargin=0.65 * inch,
        bottomMargin=0.65 * inch,
    )
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "ScanTitle",
        parent=styles["Heading1"],
        fontSize=16,
        spaceAfter=12,
        textColor=colors.HexColor("#0f172a"),
    )
    h2 = ParagraphStyle(
        "ScanH2",
        parent=styles["Heading2"],
        fontSize=12,
        spaceBefore=10,
        spaceAfter=6,
        textColor=colors.HexColor("#334155"),
    )
    body = ParagraphStyle("ScanBody", parent=styles["Normal"], fontSize=10, leading=14)

    story = []
    story.append(Paragraph("DiagnoVision — Eye scan report", title_style))
    story.append(Paragraph(f"<b>Patient:</b> {patient_display_name or 'N/A'}", body))
    story.append(Paragraph(f"<b>Report ID:</b> {image_id}", body))
    story.append(Spacer(1, 0.2 * inch))

    story.append(Paragraph("Summary", h2))
    gc = f"{glaucoma_confidence:.1%}" if glaucoma_confidence is not None else "N/A"
    dc = f"{dr_confidence:.1%}" if dr_confidence is not None else "N/A"
    story.append(Paragraph(_summary_line("Glaucoma", glaucoma_msg, gc), body))
    story.append(Paragraph(_summary_line("Diabetic retinopathy", dr_msg, dc), body))
    story.append(Spacer(1, 0.15 * inch))

    story.append(Paragraph("AI clinical commentary (doctor-facing)", h2))
    ai_data = gemini_service.build_doctor_explanation(
        glaucoma_msg=glaucoma_msg,
        dr_msg=dr_msg,
        glaucoma_confidence=glaucoma_confidence,
        dr_confidence=dr_confidence,
    )
    if ai_data:
        summary = str(ai_data.get("clinical_summary", "")).strip()
        actions = ai_data.get("action_points") or []
        disclaimer = str(ai_data.get("disclaimer", "")).strip()
        if summary:
            story.append(Paragraph(summary, body))
            story.append(Spacer(1, 0.06 * inch))
        if isinstance(actions, list) and actions:
            for item in actions[:4]:
                line = str(item).strip()
                if line:
                    story.append(Paragraph(f"• {line}", body))
            story.append(Spacer(1, 0.06 * inch))
        if disclaimer:
            story.append(Paragraph(f"<i>{disclaimer}</i>", body))
        else:
            story.append(
                Paragraph(
                    "<i>AI-generated support text for clinician review only; not a diagnosis.</i>",
                    body,
                )
            )
    else:
        story.append(
            Paragraph(
                "AI clinical commentary is unavailable for this report.",
                body,
            )
        )
        story.append(
            Paragraph(
                "<i>AI-generated support text is optional and does not replace physician judgment.</i>",
                body,
            )
        )
    story.append(Spacer(1, 0.15 * inch))

    sections = [
        ("Original retinal image", image_base64),
        ("Glaucoma — heatmap", glaucoma_heatmap_base64),
        ("Glaucoma — overlay", glaucoma_overlay_base64),
        ("Diabetic retinopathy — heatmap", dr_heatmap_base64),
        ("Diabetic retinopathy — overlay", dr_overlay_base64),
    ]

    for caption, b64 in sections:
        story.append(Paragraph(caption, h2))
        raw = _decode_image(b64)
        if raw:
            flow = _image_flowable(raw)
            if flow:
                story.append(flow)
            else:
                story.append(Paragraph("(Image could not be embedded)", body))
        else:
            story.append(Paragraph("(No image for this panel)", body))
        story.append(Spacer(1, 0.12 * inch))

    story.append(Spacer(1, 0.2 * inch))
    story.append(
        Paragraph(
            "<i>This report was generated automatically by DiagnoVision. "
            "It does not replace clinical judgment.</i>",
            body,
        )
    )
    logo_path = Path(__file__).parent / "assets" / "logo.jpg"
    if logo_path.exists():
        try:
            story.append(Spacer(1, 0.08 * inch))
            with Image.open(str(logo_path)) as raw_logo:
                ratio = (raw_logo.height / raw_logo.width) if raw_logo.width else 1.0
            logo_w = 1.0 * inch
            logo_h = logo_w * ratio
            logo = RLImage(str(logo_path), width=logo_w, height=logo_h)
            logo.hAlign = "LEFT"
            story.append(logo)
        except Exception as e:
            logger.warning("Failed to embed footer logo: %s", e)

    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()
