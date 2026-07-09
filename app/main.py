from fastapi import FastAPI

app = FastAPI(title="Market Pulse")

@app.get("/health")
def health():
    return {"status": "ok"}