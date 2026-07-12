import os
import sys
import asyncio
from pathlib import Path

# Adjust path to import backend app components
sys.path.append(str(Path(__file__).resolve().parent.parent / "backend"))

from app.ai.client import EcoSphereAIClient, get_prompt_template

def print_banner(text):
    print("=" * 60)
    print(f" {text}")
    print("=" * 60)

def test_prompt_loading():
    print_banner("1. Testing In-Memory Prompt Caching")
    
    prompts = [
        "system_prompt.txt",
        "report_prompt.txt",
        "insights_prompt.txt",
        "recommendations_prompt.txt",
        "summary_prompt.txt"
    ]
    
    for p in prompts:
        try:
            content = get_prompt_template(p)
            print(f"[SUCCESS] Loaded: {p} (length: {len(content)} characters)")
        except Exception as e:
            print(f"[FAILED] Failed to load {p}: {e}")

async def test_generation():
    print_banner("2. Testing ESG AI Response Generation")
    
    client = EcoSphereAIClient()
    
    # Check if API Key is configured
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "YOUR_GEMINI_API_KEY_HERE":
        print("WARNING: GEMINI_API_KEY is not set or is using a placeholder.")
        print("The generation test will likely fail or raise an API Key error.")
        print("Set GEMINI_API_KEY in backend/.env to run the full integration test.")
        print("Continuing test to observe error handling and safety wrappers...")
    
    # Test Data: Let's test insights_prompt with a mock corporate ESG dataset
    mock_esg_context = """
    Year: 2025
    Scope 1 Emissions: 1,200 MT CO2e (Up 15% from 2024 due to new facility)
    Scope 2 Emissions: 850 MT CO2e (Down 10% from 2024 due to solar installations)
    Employee Turnover Rate: 12% (Industry average: 15%)
    Diversity in Management: 40% female, 60% male (Target: 50% female by 2027)
    Regulatory Violations: 0
    """
    
    user_query = "Summarize the carbon emissions trend and suggest if we are on track for net-zero."
    
    print("\n--- Synchronous call (insights_prompt) ---")
    response_sync = client.generate(
        prompt_name="insights_prompt.txt",
        context=mock_esg_context,
        user_input=user_query
    )
    print("AI Response:")
    print(response_sync)
    
    print("\n--- Asynchronous call (recommendations_prompt) ---")
    response_async = await client.generate_async(
        prompt_name="recommendations_prompt.txt",
        context=mock_esg_context,
        user_input="How can we address the 15% increase in Scope 1 emissions?"
    )
    print("AI Response:")
    print(response_async)

if __name__ == "__main__":
    test_prompt_loading()
    
    # Run async loop
    asyncio.run(test_generation())
