from fastapi import FastAPI
from app import email                  

app = FastAPI(title="Market Pulse")
app.include_router(email.router)       

@app.get("/health")
def health():
    return {"status": "ok"}