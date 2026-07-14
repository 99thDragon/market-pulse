import os

from dotenv import load_dotenv
from fastapi import APIRouter

from app.meta import _parse_week
from app.simulator import simulate_week

load_dotenv()

router = APIRouter()


@router.get("/google-ads/performance")
def google_ads_performance(week: str | None = None):
    """Google Ads campaign metrics. Runs on the artificial market simulator
    (labeled "simulated", deterministic per ISO week) until real API access
    clears — see AdScale's GoogleAdsConnector for the REST/GAQL pattern to
    port once creds are ready."""
    if not os.getenv("GOOGLE_ADS_DEVELOPER_TOKEN"):
        return simulate_week("google_ads", *_parse_week(week))
    return {
        "channel": "google_ads",
        "source": "google_ads",
        "note": "Credentials present but live connector not yet implemented.",
    }
