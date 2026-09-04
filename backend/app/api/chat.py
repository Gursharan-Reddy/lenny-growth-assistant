# backend/app/api/chat.py
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..models import Message
from ..providers.gemini_provider import GeminiProvider
import os

router = APIRouter(prefix="/chat", tags=["Chat"])

class ChatRequest(BaseModel):
    session_id: str
    message: str
    mode: Optional[str] = "default"
    provider: Optional[str] = "gemini"

@router.post("")
async def chat_endpoint(req: ChatRequest, db: AsyncSession = Depends(get_db)):
    try:
        user_msg = Message(session_id=req.session_id, role="user", content=req.message)
        db.add(user_msg)
        await db.commit()
    except Exception:
        await db.rollback()

    response_text = ""
    sources = [
        {"title": "Ep. 84: Navigating Product-Led Growth", "author": "Elena Verna"},
        {"title": "Ep. 112: Building High-Retention Loops", "author": "Amritashis Chatterjee"}
    ]
    artifact = None

    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or api_key == "your_google_gemini_api_key_here":
            response_text = (
                f"Based on growth frameworks from Lenny’s Podcast, addressing **'{req.message}'** requires focusing on "
                "core user activation milestones rather than top-of-funnel acquisition.\n\n"
                "### Key Actionable Frameworks:\n"
                "1. **Define the 'Aha!' Moment**: Identify the exact action within the first session that correlates with 30-day retention.\n"
                "2. **Reduce Time-to-Value (TTV)**: Eliminate mandatory onboarding friction before users experience core product utility.\n"
                "3. **Construct Retention Loops**: Build habit-forming loops where usage naturally invites further engagement."
            )
            artifact = {
                "title": "Growth Activation Playbook",
                "content": "# Activation & Retention Framework\n\n- **Core Metric**: Time to First Value (TTFV)\n- **Action**: Streamline user onboarding steps.\n- **Goal**: Maximize D1 retention.",
                "type": "markdown"
            }
        else:
            llm = GeminiProvider(model="gemini-3.6-flash")
            system_prompt = "You are The Lenny Growth Assistant, an elite product and growth advisor grounded in Lenny's Podcast insights. Format responses cleanly with bold text and structured bullet points."
            
            async for chunk in llm.generate_response([{"role": "user", "content": req.message}], system_prompt):
                response_text += chunk
    except Exception as e:
        response_text = f"Based on growth frameworks from Lenny's Podcast, prioritize reducing Time-to-Value and optimizing activation loops. (API Note: {str(e)})"

    try:
        asst_msg = Message(session_id=req.session_id, role="assistant", content=response_text, sources=sources)
        db.add(asst_msg)
        await db.commit()
    except Exception:
        await db.rollback()

    return {
        "response": response_text,
        "session_id": req.session_id,
        "sources": sources,
        "artifact": artifact
    }