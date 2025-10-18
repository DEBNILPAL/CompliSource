import os
import hashlib
import csv
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
from starlette.responses import JSONResponse
from starlette.responses import StreamingResponse
from fastapi import BackgroundTasks

# Local modules
from auth import issue_token, verify_token, AuthUser
import bcrypt
from engine import run_engine
from blockchain import anchor_proof_if_configured
import rag
from finance_tools import is_finance_query, answer_finance

app = FastAPI(title="CompliSource API", version="0.1.0")

# CORS - Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Very simple in-memory user store for demo purposes (email -> profile)
USERS: Dict[str, Dict] = {}
USERS_PATH = os.path.join(os.path.dirname(__file__), 'users.json')

def _load_users() -> None:
    global USERS
    try:
        import json
        if os.path.exists(USERS_PATH):
            with open(USERS_PATH, 'r', encoding='utf-8') as f:
                USERS = json.load(f)
        else:
            USERS = {}
    except Exception:
        USERS = {}

def _save_users() -> None:
    try:
        import json
        with open(USERS_PATH, 'w', encoding='utf-8') as f:
            json.dump(USERS, f)
    except Exception:
        pass

class LoginBody(BaseModel):
    email: str
    password: str

class RegisterBody(BaseModel):
    username: str
    email: str
    password: str
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    business_name: Optional[str] = None
    gstin: Optional[str] = None

class AnchorBody(BaseModel):
    proof_hash: str

class ChatBody(BaseModel):
    message: str
    violations: Optional[List[Dict]] = None
    score: Optional[int] = None

@app.post("/auth/register")
def register(body: RegisterBody):
    # Demo registration: accept any valid data; in real apps, save to database
    if not body.username or not body.email or not body.password:
        raise HTTPException(status_code=400, detail="All fields required")
    if len(body.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    # In a real app, save to a database and hash the password
    if body.email in USERS:
        raise HTTPException(status_code=400, detail="User already exists")
    pwd_hash = bcrypt.hashpw(body.password.encode(), bcrypt.gensalt()).decode()
    USERS[body.email] = {
        "username": body.username,
        "email": body.email,
        # Store bcrypt hash only
        "password_hash": pwd_hash,
        "created_at": int(__import__('time').time()),
        "name": body.name or None,
        "phone": body.phone or None,
        "address": body.address or None,
        "business_name": body.business_name or None,
        "gstin": body.gstin or None,
    }
    _save_users()
    return {"message": "User registered successfully", "email": body.email}

@app.post("/auth/login")
def login(body: LoginBody):
    # Require existing user and matching password (demo-level)
    if not body.email or not body.password:
        raise HTTPException(status_code=400, detail="Email and password required")
    user = USERS.get(body.email)
    if not user:
        raise HTTPException(status_code=404, detail="Account not registered")
    stored_hash = user.get("password_hash")
    # Backward-compat: if older 'password' key exists, accept it and migrate
    if not stored_hash and user.get("password"):
        if user.get("password") != body.password:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        # Migrate to bcrypt
        user.pop("password", None)
        user["password_hash"] = bcrypt.hashpw(body.password.encode(), bcrypt.gensalt()).decode()
        _save_users()
    else:
        try:
            ok = bcrypt.checkpw(body.password.encode(), stored_hash.encode()) if stored_hash else False
        except Exception:
            ok = False
        if not ok:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    token = issue_token(body.email)
    return {"token": token}

@app.get("/me")
def me(user: AuthUser = Depends(verify_token)):
    return {"email": user.email}

@app.post("/auth/refresh")
def refresh(user: AuthUser = Depends(verify_token)):
    # Issue a fresh token extending validity
    token = issue_token(user.email)
    return {"token": token}

@app.get("/profile")
def profile(user: AuthUser = Depends(verify_token)):
    data = USERS.get(user.email)
    if not data:
        # Backward compatibility if user existed before USERS was populated
        return {"email": user.email}
    # Do not return password
    return {
        "email": data.get("email"),
        "username": data.get("username"),
        "created_at": data.get("created_at"),
        "name": data.get("name"),
        "phone": data.get("phone"),
        "address": data.get("address"),
        "business_name": data.get("business_name"),
        "gstin": data.get("gstin"),
    }

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

@app.on_event("startup")
def build_rag_index():
    # Load users from disk for persistence across restarts
    _load_users()
    # Index Markdown/TXT docs under project root for minimal RAG
    try:
        root = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
        rag.build_index(root)
    except Exception as e:
        # Silent failure keeps API running even if sklearn is missing
        pass

@app.post("/rag/reindex")
def rag_reindex(user: AuthUser = Depends(verify_token)):
    try:
        root = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
        rag.build_index(root)
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def _stream_text_chunks(text: str, chunk_size: int = 64):
    # Simple text chunker for streaming responses
    text = text or ""
    for i in range(0, len(text), chunk_size):
        yield text[i:i+chunk_size]

@app.post("/chat")
def chat(body: ChatBody, user: AuthUser = Depends(verify_token)):
    if not body.message or not body.message.strip():
        raise HTTPException(status_code=400, detail="message is required")

    q = body.message.strip()
    # Finance intent
    if is_finance_query(q):
        resp = answer_finance(q, violations=body.violations or [], score=body.score)
        return StreamingResponse(_stream_text_chunks(resp), media_type="text/plain")

    # RAG intent
    try:
        hits = rag.retrieve(q, k=3)
    except Exception:
        hits = []
    if not hits:
        fallback = (
            "I couldn't find relevant documents to answer that. "
            "Please provide more context or ensure the knowledge base is indexed."
        )
        return StreamingResponse(_stream_text_chunks(fallback), media_type="text/plain")

    # Compose a simple cited answer
    lines = [
        "Here's what I found:",
        "",
    ]
    for i, (path, snippet, score) in enumerate(hits, start=1):
        lines.append(f"[{i}] {os.path.relpath(path, os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir)))} (score {score:.2f})")
        lines.append(f" → {snippet}")
        lines.append("")
    lines.append("These references were retrieved from your project docs.")
    answer_text = "\n".join(lines)
    return StreamingResponse(_stream_text_chunks(answer_text), media_type="text/plain")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
