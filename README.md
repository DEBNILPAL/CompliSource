# CompliSource - React Version (Complete Package)

This is the **complete, self-contained** React + Vite version of CompliSource with everything included:
- ✅ React frontend with Vite
- ✅ Python FastAPI backend
- ✅ Blockchain smart contracts (Solidity)
- ✅ Sample CSV files for testing

**The website looks and works exactly the same as the original HTML version!**

## 🚀 Quick Start

### One-Command Start (Recommended)
From the root PEC_Hacks folder:
```bash
.\start-app.ps1
```

This opens two terminal windows:
1. Backend API server (FastAPI)
2. Frontend dev server (React + Vite)

### Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Access Points
- 🌐 **Frontend**: http://localhost:3000
- 📡 **Backend API**: http://127.0.0.1:8000
- 📚 **API Documentation**: http://127.0.0.1:8000/docs

## 📁 Complete Project Structure

```
complisource-react/
├── backend/                  # Python FastAPI Backend
│   ├── auth.py              # Authentication logic
│   ├── blockchain.py        # Blockchain integration
│   ├── engine.py            # Compliance engine
│   ├── main.py              # FastAPI server
│   ├── model.py             # Data models
│   └── requirements.txt     # Python dependencies
│
├── blockchain/              # Ethereum Smart Contracts
│   ├── contracts/
│   │   └── CompliRegistry.sol
│   ├── scripts/
│   │   └── deploy.js
│   ├── hardhat.config.js
│   └── package.json
│
├── samples/                 # Test Data
│   ├── sample_small.csv
│   ├── sample_mixed.csv
│   └── sample_edge_cases.csv
│
├── src/                     # React Frontend
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── BackBar.jsx
│   │   ├── HeroCanvas.jsx
│   │   └── TypingEffect.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── FeaturesPage.jsx
│   │   ├── DevelopersPage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── LoginPage.jsx
│   │   └── DashboardPage.jsx
│   ├── assets/css/
│   │   └── styles.css
│   ├── App.jsx
│   └── main.jsx
│
├── public/
│   └── assets/img/
│
├── package.json             # Frontend dependencies
└── vite.config.js          # Vite configuration
```

## 🔧 Setup Instructions

### 1. Install Frontend Dependencies
```bash
npm install
```

### 2. Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 3. Setup Blockchain (Optional)
```bash
cd blockchain
npm install
```

### 4. Start the Application
```bash
# From root: complisource-react/
npm run dev                  # Start frontend

# In another terminal
cd backend
python main.py              # Start backend
```

## � Features

### Frontend (React + Vite)
- ✅ Modern React 18 with hooks
- ✅ Client-side routing with React Router
- ✅ Animated hero section with canvas
- ✅ Typing effect animation
- ✅ Responsive design (mobile-friendly)
- ✅ All original styling preserved

### Backend (FastAPI)
- ✅ User authentication with JWT
- ✅ Compliance engine with modular rules
- ✅ CSV file upload and processing
- ✅ Blockchain integration for proofs
- ✅ RESTful API with automatic docs

### Blockchain (Solidity + Hardhat)
- ✅ Smart contract for compliance registry
- ✅ On-chain proof storage
- ✅ Deployment scripts
- ✅ Local testing support

## 📝 Testing the Application

### Test Flow
1. **Visit Homepage**: http://localhost:3000
2. **Navigate**: Click through Features, Developers, About pages
3. **Login**: Use the login page (backend must be running)
4. **Dashboard**: 
   - Upload a CSV file from `samples/` folder
   - Click "Run Engine"
   - View compliance score and violations

### Sample Files Available
- `sample_small.csv` - Small dataset (good for quick tests)
- `sample_mixed.csv` - Mixed compliance scenarios
- `sample_edge_cases.csv` - Edge cases and violations

## �️ Development

### Frontend Development
```bash
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Development
```bash
cd backend
python main.py       # Runs on port 8000
# Visit http://127.0.0.1:8000/docs for API documentation
```

### Blockchain Development
```bash
cd blockchain
npx hardhat compile  # Compile contracts
npx hardhat test     # Run tests
npx hardhat node     # Start local blockchain
```

## 🌐 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `GET /me` - Get current user info

### Compliance Engine
- `POST /engine/run` - Run compliance check on uploaded CSV

## 🎨 Key Pages

| Route | Description | Features |
|-------|-------------|----------|
| `/` | Home | Hero animation, overview sections |
| `/features` | Features | Detailed feature explanations |
| `/developers` | Developers | Contribution guide, tech stack |
| `/about` | About | Mission, team information |
| `/login` | Login | User authentication form |
| `/dashboard` | Dashboard | File upload, engine execution |

## 🔐 Environment Variables

Create a `.env` file in the backend folder if needed:
```env
# Backend Configuration
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
BLOCKCHAIN_RPC=your_blockchain_rpc_url
```

## � Build & Deploy

### Frontend Production Build
```bash
npm run build
# Output in: dist/
```

Deploy `dist/` folder to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting

### Backend Deployment
Deploy FastAPI backend to:
- Heroku
- Railway
- DigitalOcean
- AWS EC2

## 🐛 Troubleshooting

**Backend not starting?**
```bash
cd backend
pip install -r requirements.txt
python main.py
```

**Frontend errors?**
```bash
rm -rf node_modules
npm install
npm run dev
```

**Port already in use?**
- Frontend: Edit `vite.config.js` to change port
- Backend: Edit `main.py` to change port

**CORS errors?**
Backend needs CORS configured for http://localhost:3000

## 📚 Documentation Files

- **SETUP_GUIDE.md** - Detailed setup instructions
- **COMPARISON.md** - HTML vs React comparison
- **QUICKSTART.md** - Quick commands reference
- **CHECKLIST.md** - Testing checklist

## 🎊 What's Preserved from HTML Version

Everything looks and works exactly the same:
- ✅ Design - Pixel-perfect match
- ✅ CSS - All styles preserved  
- ✅ Colors - Same color scheme
- ✅ Animations - Same effects
- ✅ Functionality - Login, dashboard, file upload
- ✅ API Integration - Same endpoints
- ✅ Responsive - Same breakpoints

## 🚀 Next Steps

1. Test all pages at http://localhost:3000
2. Try login and dashboard features
3. Upload sample CSV files
4. Check responsive design (resize browser)
5. Review API docs at http://127.0.0.1:8000/docs
6. Build your own compliance modules!

## 📞 Support

Check documentation files for help:
- Setup issues → SETUP_GUIDE.md
- Understanding changes → COMPARISON.md
- Quick commands → QUICKSTART.md
- Testing → CHECKLIST.md

---

## 🌐 Real-World Blockchain Integration

### Overview
CompliSource supports blockchain-anchored proof storage for immutable, verifiable audit trails. This adds transparency and tamper-proof evidence to compliance runs.

### Supported Networks
- **Local (Hardhat)**: For development and testing.
- **Sepolia (Ethereum Testnet)**: For testing with real transactions.
- **Mainnet**: For production (requires real ETH).

### Deployment to Testnet (Sepolia)

1. **Get API Keys**:
   - **Alchemy**: Free API key from [https://www.alchemy.com/](https://www.alchemy.com/) for RPC URL.
   - **Etherscan**: API key from [https://etherscan.io/](https://etherscan.io/) for contract verification.

2. **Set Environment Variables** (in `blockchain/` folder):
   ```bash
   SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
   PRIVATE_KEY=your_wallet_private_key
   ETHERSCAN_API_KEY=your_etherscan_api_key
   ```

3. **Deploy Contract**:
   ```bash
   cd blockchain
   npx hardhat run scripts/deploy.js --network sepolia
   ```
   Note the deployed address:
   ```
   CompliRegistry deployed to: 0xYourContractAddress
   ```

4. **Verify Contract on Etherscan**:
   ```bash
   npx hardhat verify --network sepolia 0xYourContractAddress
   ```

5. **Update Backend Environment** (Windows PowerShell):
   ```bash
   $env:ETH_RPC_URL = "https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY"
   $env:PRIVATE_KEY = "your_wallet_private_key"
   $env:REGISTRY_ADDRESS = "0xYourContractAddress"
   $env:CHAIN_ID = "11155111"
   ```

### How It Works in Production
1. User uploads CSV and runs compliance check via `/dashboard`.
2. Backend computes SHA-256 proof hash.
3. If blockchain env vars are set, anchors hash on-chain via `CompliRegistry.sol`.
4. Returns real `tx_hash` and Etherscan explorer link.
5. Frontend displays verifiable proof report with on-chain verification.

### Security & Best Practices
- **Gas Optimization**: Contracts use minimal gas for anchoring.
- **Privacy**: Only hashes are on-chain; transaction data remains off-chain.
- **Auditability**: Reproducible proofs for regulatory reviews.
- **Testing**: Always test on Sepolia before Mainnet deployment.

### Troubleshooting Blockchain
- **Deployment Fails**: Ensure sufficient test ETH in wallet and correct API keys.
- **Backend Errors**: Check env vars and network connectivity.
- **Transaction Not Found**: Verify contract address and chain ID in backend.

For detailed blockchain docs, see `blockchain/README.md`.

---

**⛓️ Blockchain integration enables transparent, verifiable compliance for real-world audits!**
