"""Weekly snapshot storage — the agent's memory between runs.

Two tools per the Week-over-Week Baselines PRD:
  get_prior_snapshot   (read)  — most recent prior week's metrics
  save_weekly_snapshot (write) — upsert this week's metrics, the agent's
                                 only write capability, scoped to this table.

Talks to Supabase via PostgREST with the requests library, matching the
pattern of every other tool. If storage is unreachable, callers must
degrade honestly: report "baseline unavailable", never invent one.
"""

import os
from datetime import date

import requests
from dotenv import load_dotenv

load_dotenv()

TABLE = "weekly_snapshots"


def current_week_id(today: date | None = None) -> str:
    iso = (today or date.today()).isocalendar()
    return f"{iso[0]}-W{iso[1]:02d}"


def _config():
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_KEY")
    if not url or not key:
        return None
    return {
        "endpoint": f"{url.rstrip('/')}/rest/v1/{TABLE}",
        "headers": {
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
        },
    }


def get_prior_snapshot(before_week: str | None = None) -> dict:
    """The most recent saved week strictly before `before_week` (default: now).

    Returns {"week_id": ..., "channels": {channel: metrics}} or
    {"week_id": None, "channels": {}} when no baseline exists, or
    {"error": ...} when storage is unreachable.
    """
    cfg = _config()
    if cfg is None:
        return {"error": "snapshot storage not configured (SUPABASE_URL / SUPABASE_SERVICE_KEY missing)"}

    cutoff = before_week or current_week_id()
    try:
        resp = requests.get(
            cfg["endpoint"],
            headers=cfg["headers"],
            params={"week_id": f"lt.{cutoff}", "order": "week_id.desc", "limit": 8},
            timeout=15,
        )
        resp.raise_for_status()
    except requests.RequestException as exc:
        return {"error": f"snapshot storage unreachable: {exc}"}

    rows = resp.json()
    if not rows:
        return {"week_id": None, "channels": {}}

    latest_week = rows[0]["week_id"]
    channels = {r["channel"]: r["metrics"] for r in rows if r["week_id"] == latest_week}
    return {"week_id": latest_week, "channels": channels}


def save_weekly_snapshot(channel_data: dict, week_id: str | None = None) -> dict:
    """Upsert one row per channel for the given week (default: current week).

    Channels whose data contains an error are skipped — a failed pull must
    never become next week's baseline.
    """
    cfg = _config()
    if cfg is None:
        return {"error": "snapshot storage not configured (SUPABASE_URL / SUPABASE_SERVICE_KEY missing)"}

    wk = week_id or current_week_id()
    rows = [
        {"week_id": wk, "channel": channel, "metrics": metrics}
        for channel, metrics in channel_data.items()
        if isinstance(metrics, dict) and "error" not in metrics
    ]
    if not rows:
        return {"error": "no clean channel data to save", "week_id": wk}

    try:
        resp = requests.post(
            cfg["endpoint"],
            headers={**cfg["headers"], "Prefer": "resolution=merge-duplicates"},
            params={"on_conflict": "week_id,channel"},
            json=rows,
            timeout=15,
        )
        resp.raise_for_status()
    except requests.RequestException as exc:
        return {"error": f"snapshot save failed: {exc}", "week_id": wk}

    return {"week_id": wk, "saved_channels": [r["channel"] for r in rows]}
