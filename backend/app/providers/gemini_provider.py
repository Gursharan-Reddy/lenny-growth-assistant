import os
from typing import AsyncGenerator, List, Dict
from google import genai
from .base import BaseLLMProvider

class GeminiProvider(BaseLLMProvider):
    def __init__(self, model: str = "gemini-2.5-flash"):
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = model

    async def generate_response(
        self,
        messages: List[Dict[str, str]],
        system_prompt: str,
        temperature: float = 0.3
    ) -> AsyncGenerator[str, None]:
        # Convert message history format for Gemini SDK
        contents = []
        if system_prompt:
            contents.append(f"System: {system_prompt}")

        for m in messages:
            role_prefix = "User" if m["role"] == "user" else "Model"
            contents.append(f"{role_prefix}: {m['content']}")

        response = await self.client.aio.models.generate_content_stream(
            model=self.model,
            contents="\n".join(contents),
        )

        async for chunk in response:
            if chunk.text:
                yield chunk.text