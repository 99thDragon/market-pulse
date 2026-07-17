from fastapi import FastAPI
from app import analyst, crm, email, google_ads, meta, report

app = FastAPI(title="Market Pulse")
app.include_router(email.router)
app.include_router(crm.router)
app.include_router(meta.router)
app.include_router(google_ads.router)
app.include_router(report.router)
app.include_router(analyst.router)

@app.get("/health")
def health():
    return {"status": "ok"}