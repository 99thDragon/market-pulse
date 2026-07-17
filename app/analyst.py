"""AI Analyst — turns a weekly report into a visual data story.

The agent reads the cached report and asks Claude for a small, safe chart
spec (diverging change bars) plus a headline and an action takeaway. The
frontend renders the spec as SVG — Claude never emits markup, so there's
no injection surface and the output is deterministic to render.

Design follows the dataviz principle "form follows the question": the
week's report answers "what moved vs last week?", so the visualization is
a diverging bar chart of signed % changes, with the flagged metric that
matters most highlighted and its cause carried as the annotation.
"""

import json
import os

from anthropic import Anthropic
from dotenv import load_dotenv
from fastapi import APIRouter

from app.report import weekly_report
from app.snapshots import current_week_id, get_saved_analysis, get_saved_report, save_analysis

load_dotenv()

router = APIRouter()

SYSTEM_PROMPT = """You are the Market Pulse AI Analyst. You turn a marketer's weekly cross-channel report into ONE clear visual story they can act on.

You are given the week's report as JSON: channels (with status and metrics) and flags (each with metric, change, direction, cause). Use only this data. Never invent numbers or causes. If a change rests on a tiny sample or unreliable base (e.g. an open rate from 2 sends), say so honestly rather than dramatizing it.

Produce a diverging bar chart of the metrics that moved this week versus last week's baseline. Return ONLY a JSON object, no markdown fences, in exactly this shape:

{
  "headline": "<=12 words naming the single most important thing about this week>",
  "chart": {
    "title": "<short chart title, e.g. 'What moved vs 2026-W28'>",
    "unit": "%",
    "bars": [
      { "label": "<Channel Metric>", "value": <signed number, the % change>, "display": "<e.g. +163%>", "direction": "up|down|conflict", "highlight": <true for the one bar that matters most, false otherwise>, "note": "<<=10 words, only if a caveat is essential, else omit>" }
    ]
  },
  "takeaway": "<1-2 sentences: what the marketer should actually do or watch, grounded in the data>"
}

Rules for the bars:
- Include only metrics that actually moved beyond normal variation (the flagged ones). 2 to 6 bars, sorted by absolute value, largest first.
- value is the signed percentage as a number (e.g. -28 for a 28% drop). For a conflict flag with two numbers, use the larger-magnitude one and set direction "conflict".
- Exactly one bar has highlight: true — the one the marketer should look at first. It is not always the biggest number; a huge swing on a tiny sample may matter less than a real, trustworthy move.
- If no metric moved this week, return an empty bars array, a headline saying everything held steady, and a takeaway that this is a calm week.

Keep every string tight and plain. No jargon, no hype."""


def generate_analysis(report: dict) -> dict:
    """Ask Claude for the chart spec + narrative for this report."""
    # The AI Analyst runs on the project's dedicated $20 budget key when set,
    # falling back to the shared key so it still works without it.
    api_key = os.getenv("ANALYST_API_KEY") or os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        return {"error": "no API key set (ANALYST_API_KEY / ANTHROPIC_API_KEY)"}

    client = Anthropic(api_key=api_key)
    message = client.messages.create(
        model="claude-sonnet-5",
        max_tokens=2000,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": json.dumps(report, indent=2)}],
    )
    text = "".join(b.text for b in message.content if b.type == "text").strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        text = text[4:] if text.startswith("json") else text
    try:
        return json.loads(text)
    except json.JSONDecodeError as exc:
        return {"error": f"analysis was not valid JSON: {exc}", "raw": text}


@router.get("/analyst")
def analyst(refresh: bool = False):
    """The AI Analyst view: a chart spec + headline + takeaway for the week.
    Cached per week; ?refresh=1 regenerates."""
    if not refresh:
        cached = get_saved_analysis()
        if cached:
            return {"analysis": cached, "cached": True}

    report = get_saved_report()
    if not report:
        # No report cached yet — generate one first so the analyst has input.
        report = (weekly_report(refresh=True) or {}).get("report")
    if not report:
        return {"analysis": None, "note": "No report available to analyze yet."}

    analysis = generate_analysis(report)
    if "error" not in analysis:
        save_analysis(analysis)
    return {"analysis": analysis, "cached": False, "week": current_week_id()}
