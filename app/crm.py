import os
from collections import Counter

import requests
from dotenv import load_dotenv
from fastapi import APIRouter

load_dotenv()

router = APIRouter()

# na2-region tokens (pat-na2-...) must use the na2 API host
API_BASE = "https://api-na2.hubapi.com"

MOCK_RESPONSE = {
    "channel": "crm",
    "period": "2026-06-29 to 2026-07-05",
    "new_leads": 37,
    "deals": 9,
    "deals_by_stage": {"appointmentscheduled": 4, "qualifiedtobuy": 3, "closedwon": 2},
    "source": "mock",
}


@router.get("/crm/pipeline")
def crm_pipeline(limit: int = 100):
    """Lead and deal data from HubSpot CRM; falls back to mock data when no
    token is configured."""
    token = os.getenv("HUBSPOT_ACCESS_TOKEN")
    if not token:
        return MOCK_RESPONSE

    headers = {"Authorization": f"Bearer {token}"}
    try:
        contacts_resp = requests.get(
            f"{API_BASE}/crm/v3/objects/contacts",
            headers=headers,
            params={"limit": limit, "properties": "createdate"},
            timeout=15,
        )
        contacts_resp.raise_for_status()
        deals_resp = requests.get(
            f"{API_BASE}/crm/v3/objects/deals",
            headers=headers,
            params={"limit": limit, "properties": "dealname,dealstage,amount"},
            timeout=15,
        )
        deals_resp.raise_for_status()
    except requests.RequestException as exc:
        # Per PRD: an error is still a result — report it, never invent numbers
        return {"channel": "crm", "source": "hubspot", "error": str(exc)}

    contacts = contacts_resp.json().get("results", [])
    deals = deals_resp.json().get("results", [])
    stages = Counter(
        d["properties"].get("dealstage", "unknown") for d in deals if d.get("properties")
    )

    return {
        "channel": "crm",
        "source": "hubspot",
        "new_leads": len(contacts),
        "deals": len(deals),
        "deals_by_stage": dict(stages),
    }
