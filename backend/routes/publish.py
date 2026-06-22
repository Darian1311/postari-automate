from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, field_validator

from auth import require_auth
from services.facebook_service import post_photo

router = APIRouter()


class PublishRequest(BaseModel):
    text: str
    image_base64: str

    @field_validator("text")
    @classmethod
    def text_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Textul postării nu poate fi gol.")
        if len(v) > 5000:
            raise ValueError("Textul depășește 5000 de caractere.")
        return v

    @field_validator("image_base64")
    @classmethod
    def image_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Imaginea lipsește.")
        return v


@router.post("/publish")
async def publish(req: PublishRequest, _user: str = Depends(require_auth)):
    try:
        result = post_photo(req.image_base64, req.text)
        return {"success": True, "post_id": result.get("id")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
