from fastapi import APIRouter

router = APIRouter()

@router.get("/email/performance")
def email_performance():
    return {
        "channel": "email",
        "period": "2026-06-29 to 2026-07-05",
        "sends": 4820,
        "open_rate": 38.4,
        "click_rate": 4.1,
        "unsubscribes": 12,
        "source": "mock",
    }