from fastapi import FastAPI
from app import crm, email

app = FastAPI(title="Market Pulse")
app.include_router(email.router)
app.include_router(crm.router)

@app.get("/health")
def health():
    return {"status": "ok"}