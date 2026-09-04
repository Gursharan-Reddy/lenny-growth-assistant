from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import chat, sessions, health

app = FastAPI(
    title="The Lenny Growth Assistant API",
    version="1.0.0",
    description="Enterprise-grade RAG web application unlocking Lenny's Podcast knowledge."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(sessions.router)
app.include_router(chat.router)

@app.get("/")
async def root():
    return {"status": "online", "service": "Lenny Growth Assistant Backend"}