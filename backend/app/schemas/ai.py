from pydantic import BaseModel, Field

class AIChatRequest(BaseModel):
    message: str = Field(
        ...,
        description="The user's question or command.",
        json_schema_extra={"example": "Suggest ways to reduce our carbon emissions."}
    )

class AIChatResponseData(BaseModel):
    response: str
    prompt_used: str

class AIChatResponse(BaseModel):
    success: bool
    message: str
    data: AIChatResponseData
