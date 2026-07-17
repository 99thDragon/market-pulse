"""Seed ~6 months of mock weekly history into the snapshot store.

Fills the report archive and gives the heatmap enough weeks to be meaningful.
Runs against the shared Supabase, so seeding once populates local AND prod.

  python scripts/seed_history.py            # seed the default 25 prior weeks
  python scripts/seed_history.py --weeks 30

Only touches simulated history. The current real week (live Mailchimp/HubSpot
data + Claude report) is left untouched.
"""

import argparse
import sys
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.simulator import simulate_week  # noqa: E402
from app.snapshots import current_week_id, save_report, save_weekly_snapshot  # noqa: E402

CHANNELS = ["google_ads", "meta", "email", "crm"]
NAMES = {"google_ads": "Google Ads", "meta": "Meta", "email": "Email", "crm": "CRM"}

# key metrics compared week-over-week for flagging
KEY_METRICS = {
    "google_ads": [("ctr", "CTR", "%"), ("conversions", "Conversions", ""), ("spend", "Spend", "$")],
    "meta": [("ctr", "CTR", "%"), ("conversions", "Conversions", ""), ("spend", "Spend", "$")],
    "email": [("open_rate", "Open Rate", "%"), ("click_rate", "Click Rate", "%"), ("sends", "Sends", "")],
    "crm": [("new_leads", "New Leads", ""), ("deals", "Deal Count", "")],
}

# metrics shown in each channel's detail card
DISPLAY = {
    "google_ads": [("Spend", lambda m: f"${m['spend']:,.0f}"), ("Clicks", lambda m: f"{m['clicks']:,}"),
                   ("CTR", lambda m: f"{m['ctr']}%"), ("Conversions", lambda m: str(m["conversions"]))],
    "meta": [("Spend", lambda m: f"${m['spend']:,.0f}"), ("Reach", lambda m: f"{m['reach']:,}"),
             ("CTR", lambda m: f"{m['ctr']}%"), ("Conversions", lambda m: str(m["conversions"]))],
    "email": [("Sends", lambda m: f"{m['sends']:,}"), ("Open Rate", lambda m: f"{m['open_rate']}%"),
              ("Click Rate", lambda m: f"{m['click_rate']}%"), ("Unsubscribes", lambda m: str(m["unsubscribes"]))],
    "crm": [("New Leads", lambda m: str(m["new_leads"])), ("Deals", lambda m: str(m["deals"]))],
}


def week_id_offset(weeks_back: int) -> tuple[str, int, int]:
    monday = date.fromisocalendar(*[int(x) for x in current_week_id().replace("W", "").split("-")], 1)
    target = monday - timedelta(weeks=weeks_back)
    iso = target.isocalendar()
    return f"{iso[0]}-W{iso[1]:02d}", iso[0], iso[1]


def build_report(week_id: str, this_wk: dict, prior_wk: dict | None) -> dict:
    channels, flags = [], []
    for cid in CHANNELS:
        cur = this_wk[cid]
        metrics = [{"label": lbl, "value": fmt(cur)} for lbl, fmt in DISPLAY[cid]]
        channel_flags = 0
        if prior_wk:
            prev = prior_wk[cid]
            for key, label, unit in KEY_METRICS[cid]:
                if key not in cur or key not in prev or not prev[key]:
                    continue
                change = (cur[key] - prev[key]) / prev[key] * 100
                if abs(change) > 10:
                    direction = "up" if change > 0 else "down"
                    cause = f"{label} moved from {prev[key]} to {cur[key]} versus the prior week."
                    flags.append({
                        "metric": f"{NAMES[cid]} {label}",
                        "change": f"{change:+.0f}%",
                        "direction": direction,
                        "cause": cause,
                        "source": f"{NAMES[cid]} · vs prior week",
                        "_abs": abs(change),
                    })
                    channel_flags += 1
        channels.append({
            "id": cid, "name": NAMES[cid],
            "status": "flagged" if channel_flags else "normal",
            "source": "simulated", "metrics": metrics,
        })
    flags.sort(key=lambda f: f.pop("_abs"), reverse=True)
    flags = flags[:5]
    return {
        "period": week_id,
        "generatedAt": _synthetic_monday(week_id),
        "baseline_week": prior_wk["_week"] if prior_wk else None,
        "channels": channels,
        "flags": flags,
    }


def _synthetic_monday(week_id: str) -> str:
    y, w = week_id.split("-W")
    monday = date.fromisocalendar(int(y), int(w), 1)
    return datetime(monday.year, monday.month, monday.day, 6, 2, tzinfo=timezone.utc).isoformat()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--weeks", type=int, default=25, help="how many prior weeks to seed")
    args = ap.parse_args()

    # Build snapshots for weeks [oldest .. one-before-current].
    order = list(range(args.weeks, 0, -1))  # e.g. 25,24,...,1
    weeks = [week_id_offset(n) for n in order]

    snapshots: dict[str, dict] = {}
    for week_id, y, w in weeks:
        data = {cid: simulate_week(cid, y, w) for cid in CHANNELS}
        res = save_weekly_snapshot(data, week_id=week_id)
        data["_week"] = week_id
        snapshots[week_id] = data
        print(f"snapshot {week_id}: {res.get('saved_channels', res.get('error'))}")

    # Build a report per week, comparing to the prior seeded week.
    prev = None
    for week_id, _, _ in weeks:
        report = build_report(week_id, snapshots[week_id], prev)
        save_report(report, week_id=week_id)
        print(f"report   {week_id}: {len(report['flags'])} flags (baseline {report['baseline_week']})")
        prev = snapshots[week_id]

    print(f"\nSeeded {len(weeks)} weeks: {weeks[0][0]} .. {weeks[-1][0]}")


if __name__ == "__main__":
    main()
