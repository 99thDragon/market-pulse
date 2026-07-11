import os

import requests
from dotenv import load_dotenv
from fastapi import APIRouter

load_dotenv()

router = APIRouter()

MOCK_RESPONSE = {
    "channel": "email",
    "period": "2026-06-29 to 2026-07-05",
    "sends": 4820,
    "open_rate": 38.4,
    "click_rate": 4.1,
    "unsubscribes": 12,
    "source": "mock",
}


@router.get("/email/performance")
def email_performance(count: int = 10):
    """Email metrics from Mailchimp campaign reports; falls back to mock data
    when no API key is configured."""
    api_key = os.getenv("MAILCHIMP_API_KEY")
    prefix = os.getenv("MAILCHIMP_SERVER_PREFIX")
    if not api_key or not prefix:
        return MOCK_RESPONSE

    try:
        resp = requests.get(
            f"https://{prefix}.api.mailchimp.com/3.0/reports",
            auth=("anystring", api_key),
            params={"count": count},
            timeout=15,
        )
        resp.raise_for_status()
    except requests.RequestException as exc:
        # Per PRD: an error is still a result — report it, never invent numbers
        return {"channel": "email", "source": "mailchimp", "error": str(exc)}

    reports = resp.json().get("reports", [])
    if not reports:
        return {
            "channel": "email",
            "source": "mailchimp",
            "campaigns": 0,
            "note": "No campaign reports found yet — send a campaign to see real metrics.",
        }

    sends = sum(r.get("emails_sent", 0) for r in reports)
    unsubscribes = sum(r.get("unsubscribed", 0) for r in reports)
    open_rates = [r["opens"]["open_rate"] for r in reports if r.get("opens")]
    click_rates = [r["clicks"]["click_rate"] for r in reports if r.get("clicks")]

    return {
        "channel": "email",
        "source": "mailchimp",
        "campaigns": len(reports),
        "sends": sends,
        "open_rate": round(sum(open_rates) / len(open_rates) * 100, 1) if open_rates else 0,
        "click_rate": round(sum(click_rates) / len(click_rates) * 100, 1) if click_rates else 0,
        "unsubscribes": unsubscribes,
    }
