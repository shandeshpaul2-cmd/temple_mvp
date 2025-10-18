#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Deterministic certificate generator (HTML -> PDF).

- Uses Jinja2 to render HTML with strict escaping.
- Uses Playwright (Chromium) to print to A4 PDF with print backgrounds enabled.
- Optional fallback to WeasyPrint if Playwright isn't available.
- Optional template "layout lock" via expected SHA-256 hash.
- Sanitizes/validates inputs and formats currency/dates consistently.
- Ships with a CLI (so you can test it quickly) and a tiny example template you can replace with your exact certificate HTML.
"""

from __future__ import annotations

import hashlib
import json
import os
import re
import sys
import tempfile
from dataclasses import dataclass
from datetime import datetime, date
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path
from typing import Optional, Dict, Any

# ---- Optional engines (Playwright preferred) --------------------------------
_PLAYWRIGHT_AVAILABLE = True
try:
    from playwright.sync_api import sync_playwright  # type: ignore
except Exception:
    _PLAYWRIGHT_AVAILABLE = False

_WEASY_AVAILABLE = True
try:
    from weasyprint import HTML  # type: ignore
except Exception:
    _WEASY_AVAILABLE = False

# ---- Jinja2 templating -------------------------------------------------------
from jinja2 import Environment, FileSystemLoader, StrictUndefined, select_autoescape
from markupsafe import Markup

# ------------------------------------------------------------------------------
# Data model & validation
# ------------------------------------------------------------------------------

INR_SYMBOL = "₹"


@dataclass(frozen=True)
class CertificateData:
    donor_name: str
    amount_in_inr: Decimal
    donation_id: str
    donation_date: date
    # Optional fields you might use in your template:
    org_name: str = "Shri Raghavendra Swamy Brundavana Sannidhi, Halasuru"
    org_subtitle: str = "Guru Seva Mandali (Regd.)"
    show_80g_note: bool = True
    payment_mode: Optional[str] = None  # e.g. "Razorpay", "UPI", "Bank Transfer"
    extra_meta: Optional[Dict[str, Any]] = None  # any additional JSON-able details


class ValidationError(ValueError):
    pass


def _strip_and_collapse(s: str) -> str:
    """Trim and collapse inner whitespace to single spaces (non-breaking where needed)."""
    s = re.sub(r"\s+", " ", s.strip())
    # Protect accidental line breaks inside names like "A. B. Kumar"
    return s


def validate_data(d: CertificateData) -> CertificateData:
    name = _strip_and_collapse(d.donor_name)
    if not name or len(name) > 100:
        raise ValidationError("donor_name must be 1..100 visible characters.")
    if any(c in name for c in "<>{}"):
        raise ValidationError("donor_name must not contain HTML/template delimiters.")

    if d.amount_in_inr <= 0:
        raise ValidationError("amount_in_inr must be > 0.")
    if not d.donation_id or len(d.donation_id) > 64:
        raise ValidationError("donation_id must be 1..64 chars.")
    if not isinstance(d.donation_date, date):
        raise ValidationError("donation_date must be a date.")

    # normalize to a safer, formatted dataclass (immutably create a new one)
    rounded_amount = (d.amount_in_inr.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))
    return CertificateData(
        donor_name=name,
        amount_in_inr=rounded_amount,
        donation_id=d.donation_id.strip(),
        donation_date=d.donation_date,
        org_name=d.org_name,
        org_subtitle=d.org_subtitle,
        show_80g_note=d.show_80g_note,
        payment_mode=d.payment_mode,
        extra_meta=d.extra_meta,
    )


# ------------------------------------------------------------------------------
# Templating
# ------------------------------------------------------------------------------

class TemplateRenderer:
    def __init__(self, template_dir: Path):
        self.env = Environment(
            loader=FileSystemLoader(str(template_dir)),
            undefined=StrictUndefined,
            autoescape=select_autoescape(["html", "xml"]),
            trim_blocks=True,
            lstrip_blocks=True,
        )
        # Jinja filters
        self.env.filters["inr"] = self._fmt_inr
        self.env.filters["date_dmy"] = self._fmt_date_dmy
        self.env.filters["json"] = lambda v: Markup(json.dumps(v, ensure_ascii=False))

    @staticmethod
    def _fmt_inr(value: Decimal) -> str:
        # ₹ with grouping: 12,34,567.89 (Indian numbering)
        q = str(value)
        whole, dot, frac = q.partition(".")
        # Indian grouping for whole part
        if len(whole) > 3:
            head = whole[:-3]
            tail = whole[-3:]
            head = re.sub(r"(\d)(?=(\d{2})+(?!\d))", r"\1,", head)
            whole = f"{head},{tail}"
        return f"{INR_SYMBOL}{whole}{dot}{frac[:2] if frac else '00'}"

    @staticmethod
    def _fmt_date_dmy(d: date) -> str:
        return d.strftime("%d %b %Y")  # e.g. 17 Oct 2025

    def render(self, template_name: str, context: Dict[str, Any]) -> str:
        tpl = self.env.get_template(template_name)
        return tpl.render(**context)


# ------------------------------------------------------------------------------
# Engines
# ------------------------------------------------------------------------------

class PdfEngineBase:
    def render_pdf(self, html: str, out_path: Path) -> None:
        raise NotImplementedError()


class PlaywrightEngine(PdfEngineBase):
    def render_pdf(self, html: str, out_path: Path) -> None:
        if not _PLAYWRIGHT_AVAILABLE:
            raise RuntimeError("Playwright not available.")
        with tempfile.TemporaryDirectory() as tmp:
            html_path = Path(tmp) / "doc.html"
            html_path.write_text(html, encoding="utf-8")

            with sync_playwright() as p:
                browser = p.chromium.launch()
                page = browser.new_page()
                page.goto(f"file://{html_path}", wait_until="load")
                # Ensure fonts/images fully loaded
                page.wait_for_load_state("networkidle")
                # Print to A4; printBackground keeps your background images/colors.
                page.pdf(
                    path=str(out_path),
                    print_background=True,
                    prefer_css_page_size=True,  # trust @page size
                )
                browser.close()


class WeasyPrintEngine(PdfEngineBase):
    def render_pdf(self, html: str, out_path: Path) -> None:
        if not _WEASY_AVAILABLE:
            raise RuntimeError("WeasyPrint not available.")
        HTML(string=html, base_url=os.getcwd()).write_pdf(str(out_path))


def pick_engine(prefer: str = "playwright") -> PdfEngineBase:
    prefer = prefer.lower()
    if prefer == "playwright" and _PLAYWRIGHT_AVAILABLE:
        return PlaywrightEngine()
    if prefer == "weasyprint" and _WEASY_AVAILABLE:
        return WeasyPrintEngine()
    # fallback
    if _PLAYWRIGHT_AVAILABLE:
        return PlaywrightEngine()
    if _WEASY_AVAILABLE:
        return WeasyPrintEngine()
    raise RuntimeError(
        "No PDF engine available. Install either Playwright (and `playwright install chromium`) "
        "or WeasyPrint (with its system deps)."
    )


# ------------------------------------------------------------------------------
# Generator
# ------------------------------------------------------------------------------

class CertificateGenerator:
    """
    Render a locked-layout certificate PDF from an HTML template.
    """

    def __init__(
        self,
        template_dir: Path,
        template_name: str,
        engine: Optional[PdfEngineBase] = None,
        expected_template_sha256: Optional[str] = None,  # lock layout if provided
    ):
        self.template_dir = template_dir
        self.template_name = template_name
        self.renderer = TemplateRenderer(template_dir)
        self.engine = engine or pick_engine("playwright")
        self.expected_hash = expected_template_sha256

        if self.expected_hash:
            self._assert_template_hash()

    def _assert_template_hash(self) -> None:
        tpl_path = self.template_dir / self.template_name
        h = hashlib.sha256(tpl_path.read_bytes()).hexdigest()
        if h.lower() != self.expected_hash.lower():
            raise RuntimeError(
                f"Template layout hash mismatch!\n"
                f"Expected: {self.expected_hash}\n"
                f"Actual:   {h}\n"
                f"Refusing to render to prevent unintended layout changes."
            )

    def generate(self, data: CertificateData, out_pdf: Path) -> Path:
        clean = validate_data(data)

        context = {
            "donor_name": clean.donor_name,
            "amount": clean.amount_in_inr,
            "donation_id": clean.donation_id,
            "donation_date": clean.donation_date,
            "org_name": clean.org_name,
            "org_subtitle": clean.org_subtitle,
            "show_80g_note": clean.show_80g_note,
            "payment_mode": clean.payment_mode,
            "extra_meta": clean.extra_meta or {},
            # deterministic, human-friendly render time (NOT embedded in PDF metadata)
            "rendered_at": datetime.utcnow().strftime("%d %b %Y, %H:%M UTC"),
        }

        html = self.renderer.render(self.template_name, context)
        out_pdf.parent.mkdir(parents=True, exist_ok=True)
        self.engine.render_pdf(html, out_pdf)
        return out_pdf


# ------------------------------------------------------------------------------
# CLI utility (quick test)
# ------------------------------------------------------------------------------

def _cli():
    import argparse

    parser = argparse.ArgumentParser(description="Generate donation certificate PDF.")
    parser.add_argument("--template-dir", default="templates", help="Directory with HTML template")
    parser.add_argument("--template-name", default="certificate_template.html", help="Template file name")
    parser.add_argument("--out", required=True, help="Output PDF path")
    parser.add_argument("--donor", required=True, help="Donor name")
    parser.add_argument("--amount", required=True, help="Amount in INR (e.g., 1500.00)")
    parser.add_argument("--donation-id", required=True, help="Donation/Receipt ID")
    parser.add_argument("--date", required=True, help="Donation date YYYY-MM-DD")
    parser.add_argument("--payment-mode", default=None, help="UPI / Razorpay / Bank Transfer")
    parser.add_argument("--lock-hash", default=None, help="Optional SHA-256 of the template to lock layout")
    parser.add_argument("--engine", default="playwright", choices=["playwright", "weasyprint"], help="PDF engine preference")

    args = parser.parse_args()

    data = CertificateData(
        donor_name=args.donor,
        amount_in_inr=Decimal(args.amount),
        donation_id=args.donation_id,
        donation_date=datetime.strptime(args.date, "%Y-%m-%d").date(),
        payment_mode=args.payment_mode,
    )

    gen = CertificateGenerator(
        template_dir=Path(args.template_dir),
        template_name=args.template_name,
        engine=pick_engine(args.engine),
        expected_template_sha256=args.lock_hash,
    )

    out = gen.generate(data, Path(args.out))
    print(f"✅ PDF generated: {out}")


if __name__ == "__main__":
    _cli()
