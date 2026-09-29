"""
main.py

Replaces the original stub -- adds CORS so the Next.js frontend
(localhost:3000) can actually call this API (localhost:8000). Without
this, the browser blocks the requests entirely (cross-origin
restriction), even though curl/Postman would work fine.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router

app = FastAPI(title="Zatoona Worker")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # add your deployed frontend URL here later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/health")
def health():
    return {"status": "ok"}