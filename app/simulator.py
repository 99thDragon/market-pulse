"""Artificial market simulator for channels without real delivery data.

Numbers are deterministic per (channel, ISO week): the same week always
returns the same metrics, so week-over-week comparisons behave like a real
account. Each week drifts from the last, with occasional shocks so the
report agent has genuine movements to flag. Output is always labeled
"source": "simulated" — never passed off as real.
"""

import hashlib
import random
from datetime import date, timedelta

EPOCH = (2026, 1)  # simulation starts at 2026-W01

BASES = {
    "meta": {"spend": 1150.0, "reach": 42000.0, "ctr": 1.8, "conversions": 78.0},
    "google_ads": {"spend": 2050.0, "clicks": 2900.0, "ctr": 3.0, "conversions": 128.0},
}

# (multiplier bounds for weekly drift, shock probability, shock multipliers)
DRIFT = (-0.07, 0.08)
SHOCK_PROB = 0.18
SHOCKS = [0.62, 0.75, 1.32, 1.5]


def _rng(channel: str, year: int, week: int) -> random.Random:
    seed = hashlib.sha256(f"market-pulse|{channel}|{year}-W{week:02d}".encode()).hexdigest()
    return random.Random(int(seed, 16))


def simulate_week(channel: str, year: int | None = None, week: int | None = None) -> dict:
    """Metrics for the given ISO week (default: current week)."""
    if year is None or week is None:
        iso = date.today().isocalendar()
        year, week = iso[0], iso[1]

    metrics = dict(BASES[channel])
    cursor = date.fromisocalendar(*EPOCH, 1)
    target = date.fromisocalendar(year, week, 1)

    while cursor <= target:
        iso = cursor.isocalendar()
        r = _rng(channel, iso[0], iso[1])
        for key in metrics:
            metrics[key] *= 1 + r.uniform(*DRIFT)
        if r.random() < SHOCK_PROB:
            shocked = r.choice(sorted(metrics))
            metrics[shocked] *= r.choice(SHOCKS)
        cursor += timedelta(weeks=1)

    conversions = max(1, round(metrics["conversions"]))
    result = {
        "channel": channel,
        "period": f"{year}-W{week:02d}",
        "spend": round(metrics["spend"], 2),
        "ctr": round(metrics["ctr"], 2),
        "conversions": conversions,
        "cost_per_conversion": round(metrics["spend"] / conversions, 2),
        "source": "simulated",
    }
    if channel == "meta":
        result["reach"] = round(metrics["reach"])
    else:
        result["clicks"] = round(metrics["clicks"])
    return result
