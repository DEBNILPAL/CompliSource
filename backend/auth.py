import os
import hmac
import time
import base64
import hashlib
from fastapi import Header, HTTPException
from pydantic import BaseModel
from typing import Optional

SECRET = os.getenv("COMPLISOURCE_SECRET", "dev-secret-change-me").encode()
TOKEN_TTL = int(os.getenv("TOKEN_TTL_SECONDS", "86400"))  # 1 day

class AuthUser(BaseModel):
    email: str

def _sign(msg: bytes) -> str:
    sig = hmac.new(SECRET, msg, hashlib.sha256).digest()
    return base64.urlsafe_b64encode(sig).decode().rstrip('=')

def issue_token(email: str) -> str:
    ts = str(int(time.time()))
    payload = f"{email}|{ts}".encode()
    sig = _sign(payload)
    token = base64.urlsafe_b64encode(payload).decode().rstrip('=') + "." + sig
    return token

def _b64decode(data: str) -> bytes:
    pad = '=' * (-len(data) % 4)
    return base64.urlsafe_b64decode(data + pad)

async def verify_token(authorization: Optional[str] = Header(None)) -> AuthUser:
    if not authorization or not authorization.lower().startswith('bearer '):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    token = authorization.split(' ', 1)[1]
    try:
        payload_b64, sig = token.split('.')
        payload = _b64decode(payload_b64)
        expected = _sign(payload)
        if not hmac.compare_digest(sig, expected):
            raise ValueError('bad signature')
        email, ts_s = payload.decode().split('|', 1)
        ts = int(ts_s)
        if int(time.time()) - ts > TOKEN_TTL:
            raise ValueError('token expired')
        return AuthUser(email=email)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
