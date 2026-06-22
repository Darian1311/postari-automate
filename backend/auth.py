import os
import json
from datetime import datetime, timedelta, timezone
from typing import Optional

import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "SCHIMBA-ASTA-INAINTE-DE-PRODUCTIE")
ALGORITHM = "HS256"
TOKEN_EXPIRE_HOURS = 8

bearer_scheme = HTTPBearer()


def _load_users() -> dict[str, str]:
    raw = os.getenv("USERS_JSON", "[]")
    try:
        users = json.loads(raw)
        return {u["username"]: u["password_hash"] for u in users}
    except Exception:
        return {}


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def authenticate_user(username: str, password: str) -> Optional[str]:
    users = _load_users()
    hashed = users.get(username)
    if not hashed or not verify_password(password, hashed):
        return None
    return username


def create_access_token(username: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=TOKEN_EXPIRE_HOURS)
    return jwt.encode({"sub": username, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)


def require_auth(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> str:
    exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Autentificare necesară",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if not username:
            raise exc
        return username
    except JWTError:
        raise exc
