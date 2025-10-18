# 📊 CompliSource React - Visual Architecture

## 🏗️ Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    USER'S BROWSER                                    │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │         React Frontend (http://localhost:3000)              │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │    │
│  │  │  Home    │  │ Features │  │Developers│  │  About   │  │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │    │
│  │  ┌──────────┐  ┌──────────┐                               │    │
│  │  │  Login   │  │Dashboard │                               │    │
│  │  └──────────┘  └──────────┘                               │    │
│  │                                                             │    │
│  │  Components: Header, Footer, Canvas, Typing Effect        │    │
│  └─────────────────────┬───────────────────────────────────────┘    │
└────────────────────────┼───────────────────────────────────────────┘
                         │ HTTP Requests (Fetch API)
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│          Python Backend (http://127.0.0.1:8000)                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    FastAPI Server                             │  │
│  │  ┌────────────┐  ┌──────────┐  ┌─────────────┐             │  │
│  │  │   auth.py  │  │engine.py │  │blockchain.py│             │  │
│  │  │ JWT Auth   │  │Compliance│  │ On-chain    │             │  │
│  │  │ & Login    │  │ Rules    │  │ Proofs      │             │  │
│  │  └────────────┘  └──────────┘  └─────────────┘             │  │
│  │                                                               │  │
│  │  Endpoints: /auth/login, /me, /engine/run                   │  │
│  └───────────────────────┬───────────────────────────────────────┘  │
└──────────────────────────┼─────────────────────────────────────────┘
                           │ Web3 Connection
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│            Blockchain (Ethereum/Hardhat)                            │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                 CompliRegistry.sol                            │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │  function recordProof(bytes32 hash, string metadata) │   │  │
│  │  │  function getProof(uint256 proofId)                  │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  │                                                               │  │
│  │  Stores: Proof hashes, timestamps, metadata                 │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Folder Structure Visualization

```
complisource-react/                      ← ONE COMPLETE PACKAGE! 📦
│
├── 🎨 FRONTEND FILES
│   ├── index.html                       ← HTML entry point
│   ├── package.json                     ← Dependencies
│   ├── vite.config.js                   ← Vite config
│   │
│   ├── src/                             ← React source code
│   │   ├── main.jsx                     ← App entry point
│   │   ├── App.jsx                      ← Router setup
│   │   │
│   │   ├── components/                  ← Reusable components
│   │   │   ├── Header.jsx              ← Site header
│   │   │   ├── Footer.jsx              ← Site footer
│   │   │   ├── BackBar.jsx             ← Back button
│   │   │   ├── HeroCanvas.jsx          ← Animated canvas
│   │   │   └── TypingEffect.jsx        ← Typing animation
│   │   │
│   │   ├── pages/                       ← Page components
│   │   │   ├── HomePage.jsx            ← / route
│   │   │   ├── FeaturesPage.jsx        ← /features
│   │   │   ├── DevelopersPage.jsx      ← /developers
│   │   │   ├── AboutPage.jsx           ← /about
│   │   │   ├── LoginPage.jsx           ← /login
│   │   │   └── DashboardPage.jsx       ← /dashboard
│   │   │
│   │   └── assets/                      ← Static assets
│   │       └── css/
│   │           └── styles.css           ← All original CSS
│   │
│   └── public/                          ← Public assets
│       └── assets/
│           └── img/
│               └── logo.svg             ← Logo image
│
├── 🔌 BACKEND FILES
│   └── backend/                         ← Python API
│       ├── main.py                      ← FastAPI app
│       ├── auth.py                      ← Authentication
│       ├── engine.py                    ← Compliance engine
│       ├── blockchain.py                ← Blockchain integration
│       ├── model.py                     ← Data models
│       ├── requirements.txt             ← Python packages
│       └── README.md                    ← Backend docs
│
├── ⛓️ BLOCKCHAIN FILES
│   └── blockchain/                      ← Smart contracts
│       ├── contracts/
│       │   └── CompliRegistry.sol       ← Main contract
│       ├── scripts/
│       │   └── deploy.js                ← Deployment
│       ├── hardhat.config.js            ← Hardhat config
│       ├── package.json                 ← Node packages
│       └── README.md                    ← Blockchain docs
│
├── 📄 SAMPLE FILES
│   └── samples/                         ← Test data
│       ├── sample_small.csv             ← Quick test
│       ├── sample_mixed.csv             ← Mixed data
│       └── sample_edge_cases.csv        ← Edge cases
│
└── 📚 DOCUMENTATION
    ├── README.md                        ← Main overview
    ├── COMPLETE_GUIDE.md                ← Full tutorial ⭐
    ├── SETUP_GUIDE.md                   ← Setup steps
    ├── COMPARISON.md                    ← HTML vs React
    ├── QUICKSTART.md                    ← Quick commands
    └── CHECKLIST.md                     ← Testing guide
```

---

## 🔄 Data Flow Diagram

```
┌─────────┐
│  USER   │
└────┬────┘
     │
     │ 1. Opens browser
     ▼
┌─────────────────────┐
│   React Frontend    │  http://localhost:3000
│  (Vite Dev Server)  │
└──────┬──────────────┘
       │
       │ 2. Navigates to /login
       │ 3. Enters credentials
       │ 4. Submits form
       │
       │ POST /auth/login
       ▼
┌─────────────────────┐
│  FastAPI Backend    │  http://127.0.0.1:8000
│     (Uvicorn)       │
└──────┬──────────────┘
       │
       │ 5. Validates credentials
       │ 6. Generates JWT token
       │ 7. Returns token
       │
       ▼
┌─────────────────────┐
│   React Frontend    │
│ (stores in localStorage)
└──────┬──────────────┘
       │
       │ 8. Redirects to /dashboard
       │ 9. User uploads CSV file
       │ 10. Clicks "Run Engine"
       │
       │ POST /engine/run + file
       ▼
┌─────────────────────┐
│  FastAPI Backend    │
└──────┬──────────────┘
       │
       │ 11. Parses CSV
       │ 12. Runs compliance modules
       │ 13. Calculates score
       │ 14. Generates proof hash
       │
       │ web3.eth.contract.recordProof()
       ▼
┌─────────────────────┐
│  Smart Contract     │
│  (CompliRegistry)   │
└──────┬──────────────┘
       │
       │ 15. Records proof on-chain
       │ 16. Emits event
       │ 17. Returns transaction hash
       │
       ▼
┌─────────────────────┐
│  FastAPI Backend    │
└──────┬──────────────┘
       │
       │ 18. Returns results:
       │     - score
       │     - violations
       │     - proof_hash
       │     - tx_hash
       │
       ▼
┌─────────────────────┐
│   React Frontend    │
│  (Displays results) │
└─────────────────────┘
```

---

## 🚦 Request Flow

### Login Flow
```
Frontend → Backend → Frontend
   │         │          │
   │  POST   │ Validate │
   │  /auth  │ + Create │ Store token
   │  /login │   JWT    │ in localStorage
   │         │          │
   └─────────┴──────────┘
```

### Dashboard Flow
```
Frontend → Backend → Blockchain → Backend → Frontend
   │         │          │            │          │
   │  POST   │  Parse   │  Record    │ Return  │ Display
   │ /engine │   CSV    │  Proof     │ Results │ Results
   │  /run   │ + Check  │  Hash      │         │
   │         │  Rules   │            │         │
   └─────────┴──────────┴────────────┴─────────┘
```

---

## 🎯 Component Hierarchy

```
App.jsx (Router)
│
├─ HomePage
│  ├─ Header
│  ├─ HeroCanvas
│  ├─ TypingEffect
│  └─ Footer
│
├─ FeaturesPage
│  ├─ Header
│  ├─ BackBar
│  └─ Footer
│
├─ DevelopersPage
│  ├─ Header
│  ├─ BackBar
│  └─ Footer
│
├─ AboutPage
│  ├─ Header
│  ├─ BackBar
│  └─ Footer
│
├─ LoginPage
│  ├─ Header
│  ├─ BackBar
│  └─ Footer
│
└─ DashboardPage
   ├─ Header
   ├─ BackBar
   └─ Footer
```

---

## 🔌 API Endpoint Map

```
Backend Server (http://127.0.0.1:8000)
│
├─ /auth/login (POST)
│  └─ Input: {email, password}
│  └─ Output: {token, user}
│
├─ /me (GET)
│  └─ Headers: Authorization: Bearer <token>
│  └─ Output: {user info}
│
├─ /engine/run (POST)
│  └─ Headers: Authorization: Bearer <token>
│  └─ Form Data: file (CSV)
│  └─ Output: {score, violations, proof_hash, tx_hash}
│
└─ /docs (GET)
   └─ Swagger UI documentation
```

---

## 📦 Package Dependencies

### Frontend (package.json)
```
React 18        → UI library
React Router 6  → Client routing
Vite 5          → Build tool
```

### Backend (requirements.txt)
```
FastAPI         → Web framework
Uvicorn         → ASGI server
Pydantic        → Data validation
Python-Jose     → JWT tokens
Passlib         → Password hashing
Pandas          → CSV processing
Web3            → Blockchain
```

### Blockchain (package.json)
```
Hardhat         → Dev environment
Ethers.js       → Ethereum library
@nomiclabs/...  → Hardhat plugins
```

---

## 🎨 Style Architecture

```
styles.css (Single source of truth)
│
├─ :root variables
│  ├─ --bg, --text, --primary
│  ├─ --accent, --accent-dark
│  └─ --shadow, --radius
│
├─ Base styles
│  ├─ *, html, body
│  └─ .container
│
├─ Components
│  ├─ .site-header
│  ├─ .site-footer
│  ├─ .btn (various types)
│  ├─ .card
│  └─ .nav
│
├─ Sections
│  ├─ .hero
│  ├─ .section
│  └─ .cta
│
└─ Responsive (@media)
   ├─ < 960px
   └─ < 720px
```

---

## 🚀 Startup Sequence

```
1. User runs: .\start-app.ps1
   │
   ├─ Opens Terminal 1
   │  └─ cd complisource-react/backend
   │     └─ python main.py
   │        └─ FastAPI starts on :8000 ✅
   │
   └─ Opens Terminal 2
      └─ cd complisource-react
         └─ npm run dev
            └─ Vite starts on :3000 ✅

2. User opens: http://localhost:3000
   └─ Browser loads React app ✅

3. User navigates and uses features ✅
```

---

## ✅ Verification Flowchart

```
Start
  │
  ├─ Files exist?
  │  ├─ Yes → Continue
  │  └─ No → Run setup
  │
  ├─ Dependencies installed?
  │  ├─ Yes → Continue
  │  └─ No → npm install / pip install
  │
  ├─ Backend running?
  │  ├─ Yes → Continue
  │  └─ No → python main.py
  │
  ├─ Frontend running?
  │  ├─ Yes → Continue
  │  └─ No → npm run dev
  │
  ├─ Pages load?
  │  ├─ Yes → Continue
  │  └─ No → Check console errors
  │
  ├─ Login works?
  │  ├─ Yes → Continue
  │  └─ No → Check backend connection
  │
  └─ Dashboard works?
     ├─ Yes → Success! ✅
     └─ No → Check authentication
```

---

**This visual guide shows how all parts of CompliSource work together!** 🎯
