from pydantic import BaseModel, Field

class AIChatRequest(BaseModel):
    message: str = Field(
        ...,
        description="The user's question or command.",
        json_schema_extra={"example": "Suggest ways to reduce our carbon emissions."}
    )
    history: list[dict] = Field(
        default=[],
        description="Conversation history of the last few messages.",
        json_schema_extra={"example": [{"role": "user", "content": "Hi"}, {"role": "assistant", "content": "Hello!"}]}
    )

class AIChatResponseData(BaseModel):
    response: str
    prompt_used: str

class AIChatResponse(BaseModel):
    success: bool
    message: str
    data: AIChatResponseData
