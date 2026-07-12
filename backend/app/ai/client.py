import os
import logging
from functools import lru_cache
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

logger = logging.getLogger("ecosphere.ai")

load_dotenv()

PROMPTS_DIR = Path(__file__).resolve().parent.parent / "prompts"


@lru_cache(maxsize=16)
def get_prompt_template(filename: str) -> str:
    """Load a prompt template from disk and cache it in memory."""
    filepath = PROMPTS_DIR / filename
    if not filepath.exists():
        logger.error(f"Prompt template '{filename}' not found at {filepath}")
        raise FileNotFoundError(f"Prompt template '{filename}' not found.")
    logger.info(f"Loaded prompt template '{filename}' from disk (cached)")
    return filepath.read_text(encoding="utf-8")


def _build_client() -> genai.Client:
    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key or api_key == "YOUR_GEMINI_API_KEY_HERE":
        logger.warning("GEMINI_API_KEY is not configured. AI features will fail.")
    return genai.Client(api_key=api_key)


class EcoSphereAIClient:
    """Core AI wrapper for the EcoSphere platform using the google-genai SDK."""

    MODEL = "gemini-2.5-flash"
    TEMPERATURE = 0.2
    TIMEOUT = 30.0

    def __init__(self):
        self._client = _build_client()
        try:
            self._system_instruction = get_prompt_template("system_prompt.txt")
        except Exception as e:
            logger.warning(f"Could not load system prompt: {e}")
            self._system_instruction = None

    def _config(self) -> types.GenerateContentConfig:
        return types.GenerateContentConfig(
            temperature=self.TEMPERATURE,
            system_instruction=self._system_instruction,
        )

    def _build_prompt(self, prompt_name: str, context: str, user_input: str) -> str:
        template = get_prompt_template(prompt_name)
        return f"{template}\n\n[CONTEXT]\n{context}\n\n[USER INPUT]\n{user_input}"

    def generate(self, prompt_name: str, context: str, user_input: str) -> str:
        """Synchronously generate ESG content. Never raises — returns error string on failure."""
        try:
            prompt = self._build_prompt(prompt_name, context, user_input)
            response = self._client.models.generate_content(
                model=self.MODEL,
                contents=prompt,
                config=self._config(),
            )
            return response.text
        except Exception as e:
            logger.error(f"AI generate error: {e}")
            return f"Error: Could not generate AI response. ({e})"

    async def generate_async(self, prompt_name: str, context: str, user_input: str) -> str:
        """Asynchronously generate ESG content. Never raises — returns error string on failure."""
        try:
            prompt = self._build_prompt(prompt_name, context, user_input)
            response = await self._client.aio.models.generate_content(
                model=self.MODEL,
                contents=prompt,
                config=self._config(),
            )
            return response.text
        except Exception as e:
            logger.error(f"AI generate_async error: {e}")
            return f"Error: Could not generate AI response. ({e})"
