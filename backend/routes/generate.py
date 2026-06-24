from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile, File, Form
from typing import Optional
import json

from slowapi import Limiter
from slowapi.util import get_remote_address

from auth import require_auth
from utils.file_validator import validate_image
from services.claude_service import generate_promotion_text, generate_job_text
from services.image_service import generate_job_image
from services.image_processor import process_promotion_image

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)


@router.post("/generate/promotie")
@limiter.limit("30/hour")
async def generate_promotie(
    request: Request,
    produs: str = Form(...),
    pret: float = Form(...),
    discount: int = Form(...),
    magazine: str = Form(...),
    perioada: Optional[str] = Form(None),
    imagine: UploadFile = File(...),
    _user: str = Depends(require_auth),
):
    if not (1 <= discount <= 99):
        raise HTTPException(status_code=400, detail="Discount trebuie să fie între 1 și 99.")
    if pret <= 0:
        raise HTTPException(status_code=400, detail="Prețul trebuie să fie pozitiv.")

    try:
        magazine_list = json.loads(magazine)
        if not magazine_list:
            raise HTTPException(status_code=400, detail="Selectează cel puțin un magazin.")
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Format magazine invalid.")

    image_bytes = await imagine.read()
    validate_image(image_bytes)

    text = generate_promotion_text(produs.strip(), pret, discount, magazine_list, perioada)
    image_base64 = process_promotion_image(image_bytes, pret, discount)
    image_mime = "image/jpeg"

    return {"text": text, "image_base64": image_base64, "image_mime": image_mime}


@router.post("/generate/angajare")
@limiter.limit("30/hour")
async def generate_angajare(
    request: Request,
    post: str = Form(...),
    magazine: str = Form(...),
    cerinte: Optional[str] = Form(None),
    _user: str = Depends(require_auth),
):
    try:
        magazine_list = json.loads(magazine)
        if not magazine_list:
            raise HTTPException(status_code=400, detail="Selectează cel puțin un magazin.")
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Format magazine invalid.")

    text = generate_job_text(post.strip(), magazine_list, cerinte)
    image_base64 = generate_job_image(post.strip())

    return {"text": text, "image_base64": image_base64, "image_mime": "image/jpeg"}
