# CompliSource Backend - FastAPI

This is the Python FastAPI backend for CompliSource. It handles authentication, compliance engine processing, and blockchain integration.

## 🚀 Quick Start

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Run the Server
```bash
python main.py
```

The server will start at: http://127.0.0.1:8000

### API Documentation
Visit http://127.0.0.1:8000/docs for interactive API documentation (Swagger UI)

## 📁 Files Overview

```
backend/
├── auth.py           # User authentication & JWT tokens
├── blockchain.py     # Blockchain integration for proofs
├── engine.py         # Compliance rules engine
├── main.py          # FastAPI application & endpoints
├── model.py         # Data models and schemas
└── requirements.txt  # Python dependencies
```

## 🔌 API Endpoints

### Authentication

#### POST `/auth/login`
Login with email and password
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
Returns JWT token

#### GET `/me`
Get current user information (requires authentication)
```
Headers: Authorization: Bearer <token>
```

### Compliance Engine

#### POST `/engine/run`
Upload CSV and run compliance checks
```
Form Data:
- file: CSV file upload

Headers: Authorization: Bearer <token>
```

Returns:
```json
{
  "score": 85.5,
  "violations": [...],
  "proof_hash": "0x1234...",
  "tx_hash": "0xabcd..."
}
```

## 🛠️ Core Modules

### auth.py
- User authentication
- JWT token generation/validation
- Password hashing
- User session management

### engine.py
- Compliance rule modules
- CSV parsing and validation
- Violation detection
- Scoring algorithm

**Available Modules:**
- GST Validator
- Cash Limit Checker
- TDS Validator
- Custom rule modules

### blockchain.py
- Smart contract interaction
- Proof hash generation
- On-chain recording
- Transaction verification

### model.py
- Pydantic models
- Data validation
- API schemas
- Database models (if using DB)

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Request validation
- Secure file upload handling

## 📊 Data Processing Flow

1. **Upload**: User uploads CSV file
2. **Parse**: Backend parses CSV data
3. **Validate**: Run compliance modules
4. **Score**: Calculate compliance score
5. **Proof**: Generate cryptographic proof
6. **Blockchain**: Record proof on-chain (optional)
7. **Response**: Return results to frontend

## 🧪 Testing

### Test with Sample Files
Use the sample CSV files in `../samples/`:
```bash
# Sample files available:
- sample_small.csv       # Quick test
- sample_mixed.csv       # Mixed scenarios  
- sample_edge_cases.csv  # Edge cases
```

### Test API with curl
```bash
# Login
curl -X POST http://127.0.0.1:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Run engine (replace TOKEN with actual token)
curl -X POST http://127.0.0.1:8000/engine/run \
  -H "Authorization: Bearer TOKEN" \
  -F "file=@../samples/sample_small.csv"
```

## ⚙️ Configuration

### Environment Variables
Create `.env` file:
```env
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///./compliance.db
BLOCKCHAIN_RPC=http://localhost:8545
BLOCKCHAIN_CONTRACT=0x...
```

### CORS Configuration
Currently configured for:
- http://localhost:3000 (Vite dev server)
- http://localhost:5173 (Alternative Vite port)

Update in `main.py` if needed:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📦 Dependencies

Main packages in `requirements.txt`:
- **fastapi** - Web framework
- **uvicorn** - ASGI server
- **pydantic** - Data validation
- **python-jose** - JWT tokens
- **passlib** - Password hashing
- **python-multipart** - File uploads
- **pandas** - CSV processing
- **web3** - Blockchain integration

## 🚀 Production Deployment

### Using Uvicorn
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Using Gunicorn
```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Docker
```dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Change port in main.py
uvicorn.run(app, host="0.0.0.0", port=8001)
```

**CORS errors:**
Add your frontend URL to CORS origins in `main.py`

**Dependencies error:**
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Blockchain connection failed:**
Check if local blockchain node is running or update RPC URL

## 📚 Adding Custom Compliance Modules

Create a new module in `engine.py`:

```python
def check_custom_rule(transaction):
    """
    Custom compliance check
    """
    if transaction['amount'] > 50000:
        return {
            'status': 'violation',
            'severity': 'high',
            'rule': 'custom_limit',
            'message': 'Amount exceeds custom limit'
        }
    return {'status': 'pass'}
```

Register in the engine:
```python
MODULES = [
    check_gst_validation,
    check_cash_limit,
    check_custom_rule,  # Add your module
]
```

## 📖 API Response Examples

### Successful Login
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Engine Run Result
```json
{
  "score": 92.5,
  "total_transactions": 150,
  "violations": [
    {
      "row": 45,
      "rule": "cash_limit",
      "severity": "medium",
      "message": "Cash transaction exceeds ₹2L limit"
    }
  ],
  "proof_hash": "0x7a3f9e2b1c4d8e5f6a9b3c7d2e1f8a4b5c9d6e3f7a2b8c1d4e9f5a6b2c3d7e8f",
  "tx_hash": "0xabc123..." # If blockchain enabled
}
```

---

**🔥 This backend powers the CompliSource compliance engine with authentication, file processing, and blockchain integration!**
