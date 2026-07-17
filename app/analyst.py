"""AI Analyst — turns a weekly report into a visual data story.

The agent reads a week's report and CHOOSES the visualization that fits that
week's story (slope / callout / comparison), then writes a headline, a
seasonal read, and an action takeaway. It never emits markup — only a
structured chart spec the frontend renders — so there's no injection surface
and rendering is deterministic. Works for any week (current or historical),
cached per week on the project's $20 key.
"""

import json
import os
from datetime import date

from anthropic import Anthropic
from dotenv import load_dotenv
from fastapi import APIRouter

from app.report import weekly_report
from app.snapshots import current_week_id, get_saved_analysis, get_saved_report, save_analysis

load_dotenv()

router = APIRouter()

SYSTEM_PROMPT = """You are the Market Pulse AI Analyst. You turn a marketer's weekly cross-channel report into ONE clear visual story they can act on. Each week you CHOOSE the visualization that best fits that week's story.

You are given the week's report as JSON (channels with status and metrics; flags with metric, change, direction, cause) and the calendar month of the week. Use only the report data for numbers — never invent numbers or causes. If a change rests on a tiny sample or unreliable base, say so honestly rather than dramatizing it.

Choose exactly ONE chart type:
- "slope": when 2+ metrics moved and you want to show relative movement. Best default when several things changed.
- "callout": when ONE metric dominates the week's story, OR when nothing moved (a calm week). A single big number.
- "comparison": when two metrics moved in conflicting/opposing directions and the story is the tension between them.

Return ONLY a JSON object, no markdown fences, in exactly this shape (include only the chart block matching your chosen type):

{
  "headline": "<=12 words naming the single most important thing about this week>",
  "chart": {
    "type": "slope" | "callout" | "comparison",

    // if type == "slope":
    "title": "<short, e.g. 'What moved this week'>",
    "bars": [ { "label": "<Channel Metric>", "value": <signed % change number>, "display": "<+163%>", "direction": "up|down|conflict", "highlight": <exactly one true>, "note": "<<=10 words, only if essential>" } ],

    // if type == "callout":
    "metric": "<Channel Metric, or 'All channels' for a calm week>",
    "value": "<+50%  or  'Steady'>",
    "direction": "up|down|flat",
    "context": "<<=8 words, e.g. 'vs last week' or 'no flagged changes'>",

    // if type == "comparison":
    "title": "<short>",
    "pairs": [ { "label": "<Channel Metric>", "lastDisplay": "<last week value>", "thisDisplay": "<this week value>", "direction": "up|down" } ]
  },
  "seasonal": "<1 sentence: a typical seasonal pattern for this calendar month that could color how to read the week — framed as a general pattern (holiday shopping, summer slowdown, quarter-end push, new-year reset), NEVER as a claimed specific event>",
  "takeaway": "<1-2 sentences: what the marketer should do or watch, grounded in the data>"
}

For slope bars: only metrics that moved beyond normal variation, 2-6, sorted by absolute value, exactly one highlight:true (the one that matters most — not always the biggest; a huge swing on a tiny sample matters less than a real move). For a conflict flag with two numbers use the larger magnitude.

Keep every string tight and plain. No jargon, no hype."""


def _season_hint(week_id: str) -> str:
    try:
        y, w = week_id.split("-W")
        month = date.fromisocalendar(int(y), int(w), 1).strftime("%B")
        return f"This report is for the week of {month} {y}."
    except Exception:
        return ""


def generate_analysis(report: dict, week_id: str) -> dict:
    """Ask Claude to pick a chart and write the story for this report."""
    api_key = os.getenv("ANALYST_API_KEY") or os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        return {"error": "no API key set (ANALYST_API_KEY / ANTHROPIC_API_KEY)"}

    client = Anthropic(api_key=api_key)
    message = client.messages.create(
        model="claude-sonnet-5",
        max_tokens=2000,
        system=SYSTEM_PROMPT,
        messages=[{
            "role": "user",
            "content": f"{_season_hint(week_id)}\n\nReport:\n{json.dumps(report, indent=2)}",
        }],
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
def analyst(week: str | None = None, refresh: bool = False):
    """AI Analyst for a week (default: current). Picks a chart, adds a seasonal
    read. Cached per week; ?refresh=1 regenerates."""
    wk = week or current_week_id()
    if not refresh:
        cached = get_saved_analysis(wk)
        if cached:
            return {"analysis": cached, "cached": True, "week": wk}

    report = get_saved_report(wk)
    if not report and wk == current_week_id():
        report = (weekly_report(refresh=True) or {}).get("report")
    if not report:
        return {"analysis": None, "note": f"No report available for {wk}.", "week": wk}

    analysis = generate_analysis(report, wk)
    if "error" not in analysis:
        save_analysis(analysis, wk)
    return {"analysis": analysis, "cached": False, "week": wk}
