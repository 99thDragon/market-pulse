from fastapi import FastAPI

from app.main import app as backend

# Vercel serves this file for /api/* requests; the backend's routes are
# defined without the /api prefix, so mount it there.
app = FastAPI()
app.mount("/api", backend)
