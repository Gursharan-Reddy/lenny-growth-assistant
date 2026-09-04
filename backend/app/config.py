# backend/app/config.py
import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = os.getenv(
        "DATABASE_URL", 
        "postgresql+psycopg://postgres:password123@localhost:5432/lenny_assistant"
    )
    default_llm_provider: str = os.getenv("DEFAULT_LLM_PROVIDER", "gemini")
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")

    @property
    def DATABASE_URL(self) -> str:
        return self.database_url

    class Config:
        env_file = ".env"
        extra = "ignore"

def get_settings():
    return Settings()