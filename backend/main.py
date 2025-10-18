import os
import hashlib
import csv
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
from starlette.responses import JSONResponse

# Local modules
from auth import issue_token, verify_token, AuthUser
from engine import run_engine
from blockchain import anchor_proof_if_configured

app = FastAPI(title="CompliSource API", version="0.1.0")

# CORS - Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginBody(BaseModel):
    email: str
    password: str

class RegisterBody(BaseModel):
    username: str
    email: str
    password: str

class AnchorBody(BaseModel):
    proof_hash: str

@app.post("/auth/register")
def register(body: RegisterBody):
    # Demo registration: accept any valid data; in real apps, save to database
    if not body.username or not body.email or not body.password:
        raise HTTPException(status_code=400, detail="All fields required")
    if len(body.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    # In a real app, you would save the user to a database here
    return {"message": "User registered successfully", "email": body.email}

@app.post("/auth/login")
def login(body: LoginBody):
    # Demo auth: accept any non-empty email/password; in real apps validate securely
    if not body.email or not body.password:
        raise HTTPException(status_code=400, detail="Email and password required")
    token = issue_token(body.email)
    return {"token": token}

@app.get("/me")
def me(user: AuthUser = Depends(verify_token)):
    return {"email": user.email}

@app.post("/engine/run")
def engine_run(file: UploadFile = File(...), user: AuthUser = Depends(verify_token)):
    # Read CSV bytes and compute proof hash
    raw = file.file.read()
    proof_hash = hashlib.sha256(raw).hexdigest()

    # Parse limited CSV content (first 2000 rows to keep light)
    file.file.seek(0)
    reader = csv.DictReader((line.decode('utf-8', errors='ignore') for line in file.file))
    records: List[Dict[str, str]] = []
    for i, row in enumerate(reader):
        records.append(row)
        if i > 2000:
            break

    score, violations = run_engine(records)

    # Derive module stats from violations
    record_count = len(records)
    stats = {
        "gst_invalid_count": 0,
        "tds_missing_count": 0,
        "cash_limit_exceeded_count": 0,
        "cash_structuring_suspected_count": 0,
        "date_errors_count": 0,
        "duplicates_count": 0,
    }
    for v in violations:
        t = v.get("type")
        if t in ("gstin_invalid_length", "gstin_format_invalid"):
            stats["gst_invalid_count"] += 1
        elif t == "tds_missing_for_high_amount":
            stats["tds_missing_count"] += 1
        elif t == "cash_limit_exceeded":
            stats["cash_limit_exceeded_count"] += 1
        elif t == "cash_structuring_suspected":
            stats["cash_structuring_suspected_count"] += 1
        elif t in ("date_parse_error", "date_in_future", "date_unusually_old"):
            stats["date_errors_count"] += 1
        elif t == "duplicate_invoice":
            stats["duplicates_count"] += 1

    # Optional blockchain anchoring (env-driven; no external requests if not configured)
    tx_hash: Optional[str] = anchor_proof_if_configured(proof_hash)

    return JSONResponse({
        "score": score,
        "violations": violations,
        "proof_hash": proof_hash,
        "tx_hash": tx_hash,
        "record_count": record_count,
        "module_stats": stats
    })

@app.post("/engine/anchor")
def engine_anchor(body: AnchorBody, user: AuthUser = Depends(verify_token)):
    if not body.proof_hash or len(body.proof_hash) < 10:
        raise HTTPException(status_code=400, detail="Invalid proof_hash")
    tx_hash: Optional[str] = anchor_proof_if_configured(body.proof_hash)
    return {"tx_hash": tx_hash}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
