# backend/app/api/sessions.py
from fastapi import APIRouter

router = APIRouter(prefix="/api/sessions", tags=["Sessions"])

@router.get("")
async def list_sessions():
    return []

@router.post("")
async def create_session():
    return {"session_id": "mock-session-id", "title": "New Growth Session"}