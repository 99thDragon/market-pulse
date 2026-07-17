"""Artificial market simulator for channels without real delivery data.

Numbers are deterministic per (channel, ISO week): the same week always
returns the same metrics, so week-over-week comparisons behave like a real
account. Each week drifts from the last, with occasional shocks so the
report agent has genuine movements to flag. Output is always labeled
"source": "simulated" — never passed off as real.

Meta and Google Ads are simulated in the live app (no real delivery data).
Email and CRM are simulated only for seeding historical mock weeks; the
live app uses real Mailchimp/HubSpot for the current week.
"""

import hashlib
import random
from datetime import date, timedelta

EPOCH = (2026, 1)  # simulation starts at 2026-W01

BASES = {
    "meta": {"spend": 1150.0, "reach": 42000.0, "ctr": 1.8, "conversions": 78.0},
    "google_ads": {"spend": 2050.0, "clicks": 2900.0, "ctr": 3.0, "conversions": 128.0},
    "email": {"sends": 2200.0, "open_rate": 34.0, "click_rate": 3.2, "unsubscribes": 8.0},
    "crm": {"new_leads": 42.0, "deals": 8.0},
}

# Keep drifted rates in believable bounds.
CLAMPS = {"open_rate": (8.0, 68.0), "click_rate": (0.6, 12.0), "ctr": (0.4, 9.0)}

# (multiplier bounds for weekly drift, shock probability, shock multipliers)
DRIFT = (-0.07, 0.08)
SHOCK_PROB = 0.18
SHOCKS = [0.62, 0.75, 1.32, 1.5]


def _rng(channel: str, year: int, week: int) -> random.Random:
    seed = hashlib.sha256(f"market-pulse|{channel}|{year}-W{week:02d}".encode()).hexdigest()
    return random.Random(int(seed, 16))


def _walk(channel: str, year: int, week: int) -> dict:
    """Drift the channel's baseline metrics forward to the target week."""
    metrics = dict(BASES[channel])
    cursor = date.fromisocalendar(*EPOCH, 1)
    target = date.fromisocalendar(year, week, 1)
    while cursor <= target:
        iso = cursor.isocalendar()
        r = _rng(channel, iso[0], iso[1])
        for key in metrics:
            metrics[key] *= 1 + r.uniform(*DRIFT)
            if key in CLAMPS:
                lo, hi = CLAMPS[key]
                metrics[key] = min(hi, max(lo, metrics[key]))
        if r.random() < SHOCK_PROB:
            shocked = r.choice(sorted(metrics))
            metrics[shocked] *= r.choice(SHOCKS)
            if shocked in CLAMPS:
                lo, hi = CLAMPS[shocked]
                metrics[shocked] = min(hi, max(lo, metrics[shocked]))
        cursor += timedelta(weeks=1)
    return metrics


def simulate_week(channel: str, year: int | None = None, week: int | None = None) -> dict:
    """Metrics for the given ISO week (default: current week), shaped to match
    that channel's real endpoint."""
    if year is None or week is None:
        iso = date.today().isocalendar()
        year, week = iso[0], iso[1]

    m = _walk(channel, year, week)
    period = f"{year}-W{week:02d}"

    if channel in ("meta", "google_ads"):
        conversions = max(1, round(m["conversions"]))
        result = {
            "channel": channel,
            "period": period,
            "spend": round(m["spend"], 2),
            "ctr": round(m["ctr"], 2),
            "conversions": conversions,
            "cost_per_conversion": round(m["spend"] / conversions, 2),
            "source": "simulated",
        }
        if channel == "meta":
            result["reach"] = round(m["reach"])
        else:
            result["clicks"] = round(m["clicks"])
        return result

    if channel == "email":
        return {
            "channel": "email",
            "period": period,
            "sends": round(m["sends"]),
            "open_rate": round(m["open_rate"], 1),
            "click_rate": round(m["click_rate"], 1),
            "unsubscribes": max(0, round(m["unsubscribes"])),
            "source": "simulated",
        }

    if channel == "crm":
        leads = max(1, round(m["new_leads"]))
        deals = max(0, round(m["deals"]))
        # Split deals across three stages deterministically.
        r = _rng("crm-stage", year, week)
        won = round(deals * r.uniform(0.15, 0.4))
        qualified = round((deals - won) * r.uniform(0.3, 0.6))
        scheduled = max(0, deals - won - qualified)
        return {
            "channel": "crm",
            "period": period,
            "new_leads": leads,
            "deals": deals,
            "deals_by_stage": {
                "appointmentscheduled": scheduled,
                "qualifiedtobuy": qualified,
                "closedwon": won,
            },
            "source": "simulated",
        }

    raise ValueError(f"unknown channel: {channel}")
