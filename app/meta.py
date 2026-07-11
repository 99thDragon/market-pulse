import os

import requests
from dotenv import load_dotenv
from fastapi import APIRouter

load_dotenv()

router = APIRouter()

MOCK_RESPONSE = {
    "channel": "meta",
    "period": "2026-06-29 to 2026-07-05",
    "spend": 1240.50,
    "reach": 48200,
    "ctr": 1.9,
    "conversions": 86,
    "cost_per_conversion": 14.42,
    "source": "mock",
}


@router.get("/meta/performance")
def meta_performance():
    """Campaign metrics from the Meta Marketing API insights endpoint; falls
    back to mock data when no token is configured."""
    token = os.getenv("META_ACCESS_TOKEN")
    account_id = os.getenv("META_AD_ACCOUNT_ID")
    if not token or not account_id:
        return MOCK_RESPONSE

    try:
        resp = requests.get(
            f"https://graph.facebook.com/v21.0/{account_id}/insights",
            params={
                "access_token": token,
                "date_preset": "last_7d",
                "fields": "spend,reach,ctr,actions,cost_per_action_type",
            },
            timeout=15,
        )
        resp.raise_for_status()
    except requests.RequestException as exc:
        # Per PRD: an error is still a result — report it, never invent numbers
        return {"channel": "meta", "source": "meta", "error": str(exc)}

    rows = resp.json().get("data", [])
    if not rows:
        return {
            "channel": "meta",
            "source": "meta",
            "note": "No insights for the period (sandbox accounts often have no delivery data).",
        }

    row = rows[0]
    return {
        "channel": "meta",
        "source": "meta",
        "spend": float(row.get("spend", 0)),
        "reach": int(row.get("reach", 0)),
        "ctr": float(row.get("ctr", 0)),
        "actions": row.get("actions", []),
    }
