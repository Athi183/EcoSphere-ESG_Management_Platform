import logging
from sqlalchemy.orm import Session
from app.services.dashboard import get_dashboard_data
from app.ai.client import EcoSphereAIClient

logger = logging.getLogger("ecosphere.ai_service")

def build_dashboard_context(db: Session) -> str:
    """Fetches dashboard data and formats it into human-readable text."""
    dashboard = get_dashboard_data(db)
    
    # Format Summary
    context = "Dashboard Summary\n"
    context += f"Total Emissions: {dashboard.summary.total_emissions} kg CO₂\n"
    context += f"Total Transactions: {dashboard.summary.total_transactions}\n"
    context += f"Top Department: {dashboard.summary.top_department or 'N/A'}\n"
    context += f"Top Emission Source: {dashboard.summary.top_emission_source or 'N/A'}\n\n"
    
    # Format Department Breakdown
    context += "Department Breakdown\n"
    for dept in dashboard.charts.emissions_by_department:
        context += f"- {dept.department}: {dept.emissions} kg CO₂\n"
    
    context += "\nRecent Transactions\n"
    for tx in dashboard.recent_transactions:
        # Pydantic schemas might have slightly different shapes, we handle them carefully.
        # recent_transactions is a list of RecentTransactionData which has department and emission_source
        dept_name = tx.department.name
        source_name = tx.emission_source.source_name
        unit = tx.emission_source.unit
        qty = tx.quantity
        calc_em = tx.calculated_emission
        context += f"- {dept_name} | {source_name} | {qty} {unit} | {calc_em} kg CO₂\n"
        
    return context

def determine_prompt(user_message: str) -> str:
    """Determines which prompt template to use based on keywords in the message."""
    msg = user_message.lower().strip()
    
    # Greetings
    if msg in ["hi", "hello", "hey", "good morning", "good evening"] or msg.startswith(("hi ", "hello ", "hey ")):
        return "greeting_prompt.txt"
        
    # Identity
    if any(k in msg for k in ["who are you", "what can you do", "help"]):
        return "identity_prompt.txt"
        
    # Thanks
    if msg in ["thanks", "thank you", "great", "awesome"] or "thank you" in msg or "thanks" in msg:
        return "thankyou_prompt.txt"
        
    # Small talk
    if any(k in msg for k in ["how are you", "nice to meet you", "good night"]):
        return "smalltalk_prompt.txt"
        
    # Dashboard Questions
    if "executive_report" in msg or "report_type" in msg:
        return "executive_report_prompt.txt"
    elif "summary" in msg:
        return "summary_prompt.txt"
    elif any(k in msg for k in ["recommend", "reduce", "improve"]):
        return "recommendations_prompt.txt"
    elif "report" in msg:
        return "report_prompt.txt"
    elif "insight" in msg or "analyze" in msg or "highest" in msg:
        return "insights_prompt.txt"
    else:
        return "summary_prompt.txt" # Default fallback per requirements

def generate_ai_response(db: Session, message: str, history: list = None, report_context: dict = None) -> tuple[str, str, str]:
    """
    Orchestrates the AI flow.
    Returns: (ai_response_text, prompt_used, error_msg)
    """
    if history is None:
        history = []
        
    try:
        # 1. Select prompt
        prompt_name = determine_prompt(message)
        
        # 2. Build human readable context only if necessary
        if report_context is not None:
            import json
            context_str = json.dumps(report_context, indent=2)
        elif prompt_name in ["greeting_prompt.txt", "identity_prompt.txt", "thankyou_prompt.txt", "smalltalk_prompt.txt"]:
            context_str = "No dashboard context provided for this intent."
        else:
            context_str = build_dashboard_context(db)
        
        # 3. Call Gemini
        client = EcoSphereAIClient()
        response_text = client.generate(
            prompt_name=prompt_name,
            context=context_str,
            user_input=message,
            history=history
        )
        
        # If response_text starts with "Error:", it was caught inside EcoSphereAIClient.generate
        if response_text.startswith("Error:"):
            logger.error(f"Gemini API returned an internal error string: {response_text}")
            return "", "", "AI service is temporarily unavailable."
            
        return response_text, prompt_name.replace("_prompt.txt", ""), ""
        
    except Exception as e:
        logger.error(f"Error in generate_ai_response: {e}")
        return "", "", "AI service is temporarily unavailable."
