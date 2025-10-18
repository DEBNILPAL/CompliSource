# CompliSource React - Complete Setup & Usage Guide

## 📦 What You Have

**A complete, self-contained React application** with everything needed to run CompliSource:

```
complisource-react/
├── 🎨 Frontend (React + Vite)
├── 🔌 Backend (Python FastAPI) 
├── ⛓️ Blockchain (Solidity + Hardhat)
└── 📄 Sample Data (CSV files)
```

**Everything in one folder - No external dependencies needed!**

---

## 🚀 QUICK START (3 Steps)

### Step 1: Install Dependencies

**Frontend:**
```bash
cd complisource-react
npm install
```

**Backend:**
```bash
cd complisource-react/backend
pip install -r requirements.txt
```

**Blockchain (Optional):**
```bash
cd complisource-react/blockchain
npm install
```

### Step 2: Start Everything

**Use the automated script from root folder:**
```bash
cd ..
.\start-app.ps1
```

OR start manually:

**Terminal 1 - Backend:**
```bash
cd complisource-react/backend
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd complisource-react
npm run dev
```

### Step 3: Open & Test

Visit: http://localhost:3000

✅ **You're done!** The website is running with full backend support.

---

## 🎯 Complete Feature Testing Guide

### 1️⃣ Test Homepage
- Visit http://localhost:3000
- ✅ See animated hero section with typing effect
- ✅ Canvas network animation in background
- ✅ All sections load correctly

### 2️⃣ Test Navigation
- Click **Features** → View feature descriptions
- Click **Developers** → See contribution guide
- Click **About** → Read mission statement
- ✅ Navigation highlights active page
- ✅ Mobile menu works (resize browser)

### 3️⃣ Test Login (Backend Required)

**Backend must be running on port 8000!**

1. Click **Login** in header
2. Enter any email/password (backend handles validation)
3. Click **Sign In**
4. ✅ Should redirect to dashboard on success
5. ✅ Token stored in browser localStorage

### 4️⃣ Test Dashboard (Full Stack)

**Requirements:**
- ✅ Backend running
- ✅ Logged in (have token)

**Steps:**
1. Go to **Dashboard**
2. Click **Choose File**
3. Select a CSV from `complisource-react/samples/`:
   - `sample_small.csv` - Quick test
   - `sample_mixed.csv` - Mixed scenarios
   - `sample_edge_cases.csv` - Edge cases
4. Click **Run Engine**
5. ✅ See compliance score
6. ✅ See violation count
7. ✅ See proof hash
8. ✅ Expand violations for details

### 5️⃣ Test Responsive Design
- Resize browser window
- ✅ Mobile menu appears < 720px
- ✅ Cards stack on mobile
- ✅ All content remains accessible

---

## 📂 Project Structure Explained

### Frontend Files (`src/`)

```
src/
├── components/
│   ├── Header.jsx         # Navigation + logo
│   ├── Footer.jsx         # Footer links + socials
│   ├── BackBar.jsx        # Back button bar
│   ├── HeroCanvas.jsx     # Animated network canvas
│   └── TypingEffect.jsx   # Typing animation
│
├── pages/
│   ├── HomePage.jsx       # Landing page (/)
│   ├── FeaturesPage.jsx   # Features (/features)
│   ├── DevelopersPage.jsx # Developers (/developers)
│   ├── AboutPage.jsx      # About (/about)
│   ├── LoginPage.jsx      # Login form (/login)
│   └── DashboardPage.jsx  # Dashboard (/dashboard)
│
├── assets/css/
│   └── styles.css         # All original CSS
│
├── App.jsx                # Router setup
└── main.jsx               # Entry point
```

### Backend Files (`backend/`)

```
backend/
├── main.py           # FastAPI app + routes
├── auth.py          # JWT authentication
├── engine.py        # Compliance rules
├── blockchain.py    # Smart contract integration
├── model.py         # Data models
└── requirements.txt # Python packages
```

### Blockchain Files (`blockchain/`)

```
blockchain/
├── contracts/
│   └── CompliRegistry.sol  # Smart contract
├── scripts/
│   └── deploy.js          # Deployment script
└── hardhat.config.js      # Network config
```

---

## 🔌 API Endpoints

### Authentication
```
POST /auth/login
Body: {"email": "...", "password": "..."}
Returns: {"token": "..."}

GET /me
Headers: Authorization: Bearer <token>
Returns: User info
```

### Compliance Engine
```
POST /engine/run
Headers: Authorization: Bearer <token>
Form Data: file (CSV)
Returns: {score, violations, proof_hash, tx_hash}
```

### API Documentation
Visit: http://127.0.0.1:8000/docs

---

## 🎨 Design Verification Checklist

Compare with original HTML version:

- [ ] **Colors** - Teal accent (#00C49A), blue text (#0A2540)
- [ ] **Fonts** - Inter for body, Poppins for headings
- [ ] **Animations** - Hero canvas + typing effect work
- [ ] **Cards** - Proper shadows and rounded corners
- [ ] **Buttons** - Hover effects and gradients
- [ ] **Footer** - Animated gradient background
- [ ] **Responsive** - Mobile menu at 720px breakpoint

**Should look EXACTLY the same!**

---

## 🛠️ Development Commands

### Frontend
```bash
npm run dev       # Start dev server (port 3000)
npm run build     # Build for production
npm run preview   # Preview production build
```

### Backend
```bash
python main.py    # Start FastAPI server (port 8000)
# Visit http://127.0.0.1:8000/docs for API docs
```

### Blockchain
```bash
npx hardhat compile  # Compile contracts
npx hardhat test     # Run tests
npx hardhat node     # Start local blockchain
npx hardhat run scripts/deploy.js --network localhost
```

---

## 🐛 Common Issues & Solutions

### ❌ Backend won't start
**Problem:** Dependencies not installed
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### ❌ Frontend errors
**Problem:** Node modules missing
```bash
npm install
npm run dev
```

### ❌ Login not working
**Problem:** Backend not running or CORS issue
- ✅ Check backend is running on port 8000
- ✅ Check browser console for CORS errors
- ✅ Backend must allow http://localhost:3000

### ❌ Dashboard shows "Please login first"
**Problem:** No authentication token
- ✅ Login first at /login
- ✅ Check localStorage has 'cs_token'

### ❌ Port already in use
**Frontend:**
Edit `vite.config.js`, change port:
```javascript
server: { port: 3001 }
```

**Backend:**
Edit `main.py`, change port:
```python
uvicorn.run(app, port=8001)
```

### ❌ Images not showing
**Problem:** Assets not in public folder
```bash
# Should have: public/assets/img/logo.svg
# Copy if missing
```

### ❌ Styles not applied
**Problem:** CSS not imported
- Check `src/main.jsx` imports `./assets/css/styles.css`

---

## 📊 Testing Workflow

### 1. Visual Testing
- [ ] Visit each page
- [ ] Check animations work
- [ ] Verify responsive design
- [ ] Test navigation

### 2. Functional Testing
- [ ] Login with credentials
- [ ] Upload sample CSV
- [ ] Run compliance engine
- [ ] View results

### 3. API Testing
- [ ] Check /docs endpoint
- [ ] Test with curl/Postman
- [ ] Verify response formats

### 4. Browser Testing
- [ ] Chrome
- [ ] Firefox  
- [ ] Safari (if on Mac)
- [ ] Edge

---

## 🚀 Production Deployment

### Frontend (Static Files)

1. **Build:**
```bash
npm run build
# Creates: dist/ folder
```

2. **Deploy to:**
- **Vercel:** `npm i -g vercel && vercel`
- **Netlify:** Drag/drop `dist/` folder
- **GitHub Pages:** Push `dist/` to gh-pages branch

### Backend (API Server)

Deploy FastAPI to:
- **Railway:** Connect GitHub repo
- **Heroku:** Use Procfile
- **DigitalOcean:** Use App Platform
- **AWS:** EC2 or Elastic Beanstalk

### Environment Variables

**Frontend (.env):**
```env
VITE_API_BASE=https://your-api.com
```

**Backend (.env):**
```env
SECRET_KEY=your-secret-key
DATABASE_URL=your-database-url
BLOCKCHAIN_RPC=your-rpc-url
```

---

## 📚 Documentation Files

All documentation included:

| File | Description |
|------|-------------|
| `README.md` | Main project overview |
| `SETUP_GUIDE.md` | Detailed setup instructions |
| `COMPARISON.md` | HTML vs React comparison |
| `QUICKSTART.md` | Quick commands reference |
| `CHECKLIST.md` | Testing checklist |
| `backend/README.md` | Backend API documentation |
| `blockchain/README.md` | Smart contract documentation |

---

## 🎓 Learning Resources

### React
- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Vite Guide](https://vitejs.dev/guide/)

### Backend
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Python Tutorial](https://docs.python.org/3/tutorial/)

### Blockchain
- [Hardhat Documentation](https://hardhat.org/docs)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Ethers.js](https://docs.ethers.io/)

---

## ✅ Success Criteria

Your setup is complete when:

- ✅ Frontend loads at http://localhost:3000
- ✅ Backend API responds at http://127.0.0.1:8000
- ✅ All pages navigate correctly
- ✅ Animations work smoothly
- ✅ Login redirects to dashboard
- ✅ File upload processes CSV
- ✅ Compliance score displays
- ✅ Design matches original HTML exactly

---

## 🎊 You're All Set!

**Everything you need is in the `complisource-react` folder:**
- ✅ Modern React frontend with Vite
- ✅ Python FastAPI backend
- ✅ Blockchain smart contracts
- ✅ Sample test data
- ✅ Complete documentation

**Start building amazing compliance features! 🚀**

---

**Questions or issues?** Check the documentation files in each folder for detailed information.
