# backend/app/providers/gemini_provider.py
import os
from typing import List, Dict
from google import genai
from .base import BaseLLMProvider

class GeminiProvider(BaseLLMProvider):
    def __init__(self, model: str = "gemini-3.6-flash"):
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = model

    async def generate_response(
        self,
        messages: List[Dict[str, str]],
        system_prompt: str,
        temperature: float = 0.3
    ) -> str:
        contents = []
        if system_prompt:
            contents.append(f"System: {system_prompt}")

        for m in messages:
            role_prefix = "User" if m["role"] == "user" else "Model"
            contents.append(f"{role_prefix}: {m['content']}")

        # Use standard generate_content instead of stream to return instantly
        response = self.client.models.generate_content(
            model=self.model,
            contents="\n".join(contents),
        )
        return response.text