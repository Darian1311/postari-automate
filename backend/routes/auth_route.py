from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel
from slowapi import Limiter
from slowapi.util import get_remote_address

from auth import authenticate_user, create_access_token

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/auth/login")
@limiter.limit("5/minute")
async def login(request: Request, body: LoginRequest):
    username = authenticate_user(body.username, body.password)
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Utilizator sau parolă incorecte.",
        )
    token = create_access_token(username)
    return {"access_token": token, "token_type": "bearer", "username": username}
