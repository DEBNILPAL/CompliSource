# Quick Start Scripts

## Start Everything at Once

### Option 1: Manual (Two Terminals)

**Terminal 1 - Frontend:**
```bash
cd complisource-react
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd complisource/backend
python main.py
```

### Option 2: PowerShell Script

Save this as `start-app.ps1` in your PEC_Hacks folder:

```powershell
# Start backend in background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\complisource\backend'; python main.py"

# Start frontend in background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\complisource-react'; npm run dev"

Write-Host "✅ Backend starting on http://127.0.0.1:8000"
Write-Host "✅ Frontend starting on http://localhost:3000"
Write-Host ""
Write-Host "Press Ctrl+C in each terminal window to stop"
```

Run it:
```bash
.\start-app.ps1
```

## URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://127.0.0.1:8000
- **API Docs**: http://127.0.0.1:8000/docs

## Testing the App

1. Visit http://localhost:3000
2. Navigate through all pages
3. Try login (make sure backend is running)
4. Test dashboard file upload
5. Check responsive design (resize browser)

## Production Build

```bash
cd complisource-react
npm run build
```

This creates a `dist/` folder with optimized files ready for deployment.

## Deploy Options

### Static Hosting (Frontend Only)
- Vercel: `npm install -g vercel && vercel`
- Netlify: Drag & drop `dist/` folder
- GitHub Pages: Push `dist/` folder

### Full Stack
- Heroku
- AWS
- DigitalOcean
- Railway

---

**Note:** Make sure your backend is configured for production before deploying!
