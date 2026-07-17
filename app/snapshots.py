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

# Reserved "channel" values: cached artifacts, not real channels. Stored in
# the same table per week so the UI loads instantly instead of regenerating.
REPORT_KIND = "_report"
ANALYST_KIND = "_analyst"
RESERVED_KINDS = (REPORT_KIND, ANALYST_KIND)


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
            params={
                "week_id": f"lt.{cutoff}",
                "channel": f"not.in.({','.join(RESERVED_KINDS)})",
                "order": "week_id.desc",
                "limit": 8,
            },
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


def _save_artifact(kind: str, payload: dict, week_id: str | None = None) -> dict:
    """Cache one artifact row (report, analysis) for the week (upsert)."""
    return save_weekly_snapshot({kind: payload}, week_id=week_id)


def _get_artifact(kind: str, week_id: str | None = None) -> dict | None:
    """The cached artifact of `kind` for the week, or None (also None on
    storage errors — a cache miss just means the caller regenerates)."""
    cfg = _config()
    if cfg is None:
        return None
    try:
        resp = requests.get(
            cfg["endpoint"],
            headers=cfg["headers"],
            params={
                "week_id": f"eq.{week_id or current_week_id()}",
                "channel": f"eq.{kind}",
                "select": "metrics",
                "limit": 1,
            },
            timeout=15,
        )
        resp.raise_for_status()
    except requests.RequestException:
        return None
    rows = resp.json()
    return rows[0]["metrics"] if rows else None


def save_report(report: dict, week_id: str | None = None) -> dict:
    return _save_artifact(REPORT_KIND, report, week_id)


def get_saved_report(week_id: str | None = None) -> dict | None:
    return _get_artifact(REPORT_KIND, week_id)


def save_analysis(analysis: dict, week_id: str | None = None) -> dict:
    return _save_artifact(ANALYST_KIND, analysis, week_id)


def get_saved_analysis(week_id: str | None = None) -> dict | None:
    return _get_artifact(ANALYST_KIND, week_id)


def list_channel_history(rows_limit: int = 200) -> dict:
    """All real-channel snapshots grouped by week: {week_id: {channel: metrics}}.
    Reserved artifact kinds (reports, analyses) are excluded."""
    cfg = _config()
    if cfg is None:
        return {}
    try:
        resp = requests.get(
            cfg["endpoint"],
            headers=cfg["headers"],
            params={
                "channel": f"not.in.({','.join(RESERVED_KINDS)})",
                "select": "week_id,channel,metrics",
                "order": "week_id.asc",
                "limit": rows_limit,
            },
            timeout=15,
        )
        resp.raise_for_status()
    except requests.RequestException:
        return {}
    weeks: dict = {}
    for row in resp.json():
        weeks.setdefault(row["week_id"], {})[row["channel"]] = row["metrics"]
    return weeks


def list_saved_reports(limit: int = 12) -> list:
    """Cached reports, newest first — feeds the archive page."""
    cfg = _config()
    if cfg is None:
        return []
    try:
        resp = requests.get(
            cfg["endpoint"],
            headers=cfg["headers"],
            params={
                "channel": f"eq.{REPORT_KIND}",
                "select": "week_id,captured_at,metrics",
                "order": "week_id.desc",
                "limit": limit,
            },
            timeout=15,
        )
        resp.raise_for_status()
    except requests.RequestException:
        return []
    return resp.json()
