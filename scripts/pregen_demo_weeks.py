"""Offline full-quality pre-generation for demo weeks.

Runs the deep path (default effort → web search + bespoke SVG) with an outer
retry to survive the occasional invalid-JSON response, then locks each result
so production serves it instantly. Not time-limited like the serverless path.
"""
import sys
from app.analyst import generate_analysis
from app.snapshots import get_saved_report, save_analysis

WEEKS = sys.argv[1:] or ["2026-W28", "2026-W27", "2026-W26", "2026-W25"]


def build(wk: str, tries: int = 3) -> bool:
    rep = get_saved_report(wk)
    if not rep:
        print(f"{wk}: no report — skipped", flush=True)
        return False
    for attempt in range(1, tries + 1):
        a = generate_analysis(rep, wk)
        if not a.get("error") and a.get("svg"):
            a["locked"] = True
            save_analysis(a, wk)
            print(
                f"{wk}: OK on attempt {attempt} — svg={len(a['svg'])} "
                f"web_ctx={len(a.get('web_context', []))} LOCKED",
                flush=True,
            )
            return True
        print(f"{wk}: attempt {attempt} failed ({a.get('error') or 'no svg'})", flush=True)
    print(f"{wk}: GAVE UP after {tries} attempts", flush=True)
    return False


for w in WEEKS:
    build(w)
print("done", flush=True)
