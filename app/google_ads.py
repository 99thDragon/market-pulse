import os

from dotenv import load_dotenv
from fastapi import APIRouter

load_dotenv()

router = APIRouter()

MOCK_RESPONSE = {
    "channel": "google_ads",
    "period": "2026-06-29 to 2026-07-05",
    "spend": 2180.00,
    "clicks": 3140,
    "ctr": 3.2,
    "conversions": 142,
    "cost_per_conversion": 15.35,
    "source": "mock",
}


@router.get("/google-ads/performance")
def google_ads_performance():
    """Google Ads campaign metrics. Mock-only for now — the real connector
    is blocked on a Google Ads test account (see AdScale's GoogleAdsConnector
    for the working REST/GAQL pattern to port once creds are ready)."""
    if not os.getenv("GOOGLE_ADS_DEVELOPER_TOKEN"):
        return MOCK_RESPONSE
    return {
        "channel": "google_ads",
        "source": "google_ads",
        "note": "Credentials present but live connector not yet implemented.",
    }
