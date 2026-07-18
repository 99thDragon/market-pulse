"""Add Wikipedia images to the locked demo weeks without regenerating them.

For each week's existing web_context notes, a cheap model call proposes an
image topic per note, then we fetch the Wikipedia thumbnail and attach it.
Content is untouched; the analysis stays locked.
"""
import json
import os
import sys
import time

from anthropic import Anthropic

from app.analyst import _wiki_image
from app.snapshots import get_saved_analysis, save_analysis

client = Anthropic(api_key=os.getenv("ANALYST_API_KEY") or os.getenv("ANTHROPIC_API_KEY"))
WEEKS = sys.argv[1:] or ["2026-W29", "2026-W28", "2026-W27", "2026-W26", "2026-W25"]


def image_queries(notes: list[str]) -> list[str]:
    prompt = (
        "For each marketing-context note below, give a 2-4 word real-world topic that has a "
        "recognizable Wikipedia image (e.g. 'Amazon Prime Day', 'Black Friday shopping', 'Google Ads', "
        "'Email marketing'). If nothing concrete fits, use an empty string. "
        "Return ONLY a JSON array of strings, one per note, in the same order.\n\n"
        + "\n".join(f"{i + 1}. {n}" for i, n in enumerate(notes))
    )
    for _ in range(2):  # retry once if the reply isn't clean JSON
        msg = client.messages.create(model="claude-sonnet-5", max_tokens=400,
                                     messages=[{"role": "user", "content": prompt}])
        text = "".join(b.text for b in msg.content if b.type == "text")
        try:
            return json.loads(text[text.find("["):text.rfind("]") + 1])
        except (json.JSONDecodeError, ValueError):
            continue
    return [""] * len(notes)


for wk in WEEKS:
    a = get_saved_analysis(wk)
    if not a or not a.get("web_context"):
        print(f"{wk}: no web_context", flush=True)
        continue
    notes = [c.get("note", "") for c in a["web_context"]]
    try:
        queries = image_queries(notes)
    except Exception as exc:
        print(f"{wk}: query error {exc}", flush=True)
        continue
    added = []
    for c, q in zip(a["web_context"], queries):
        c.pop("image_query", None)
        if not q:
            continue
        img = _wiki_image(q)
        time.sleep(0.2)
        if img:
            c["image"] = img
            added.append(f"{q} -> {img}")
    save_analysis(a, wk)  # keeps locked=True (whole dict re-saved)
    print(f"{wk}: {len(added)}/{len(notes)} images", flush=True)
    for line in added:
        print("   ", line, flush=True)
print("done", flush=True)
