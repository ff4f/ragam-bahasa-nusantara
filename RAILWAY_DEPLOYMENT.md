# 🚀 Railway Deployment Guide (Native Buildpack - No Docker)

## 📋 Overview

Project kamu siap deploy ke Railway dengan native buildpack (tanpa Docker).

**Struktur:**
- Backend: FastAPI (Python) di folder `backend/`
- Frontend: React + Vite di root project
- Database: MySQL (Railway managed)

---

## ✅ Prerequisites

1. Code sudah di GitHub: `ff4f/ragam-bahasa-nusantara`
2. Branch: `feature/integrated` (auto-update dari GitLab CI/CD)
3. Railway account (login via GitHub)

---

## 🔧 Deploy Backend (FastAPI)

### Step 1: Create Backend Service

1. Go to: https://railway.app/new
2. Click **"Deploy from GitHub repo"**
3. Select: `ff4f/ragam-bahasa-nusantara`
4. Branch: `feature/integrated`

### Step 2: Configure Backend

**Settings → Source:**
- **Root Directory**: `backend`

**Settings → Deploy:**
- **Custom Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

**Settings → Variables:**
Add these variables:
```env
SECRET_KEY=your-secret-key-min-32-characters
DATABASE_URL=${{MySQL.DATABASE_URL}}
DEBUG=False
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Step 3: Add MySQL Database

1. In same project, click **"New"** → **"Database"** → **"Add MySQL"**
2. Railway auto-creates MySQL instance
3. Variable `DATABASE_URL` auto-linked to backend

### Step 4: Generate Public Domain

**Settings → Networking:**
- Click **"Generate Domain"**
- You'll get: `backend-production-xxxx.up.railway.app`

### Step 5: Deploy

- Railway auto-detects Python via `requirements.txt`
- Auto-installs dependencies
- Starts with custom command
- Done! ✅

**Expected time:** 2-3 minutes

---

## 🎨 Deploy Frontend (React + Vite)

### Step 1: Create Frontend Service

1. In same project, click **"New"** → **"GitHub Repo"**
2. Select same repo: `ff4f/ragam-bahasa-nusantara`  
3. Branch: `feature/integrated`

### Step 2: Configure Frontend

**Settings → Source:**
- **Root Directory**: `/` (leave empty or put `/`)

**✅ Already configured in code:**
- Build command: `npm run build` (from `railway.json`)
- Start command: `npm start` (serves with SPA routing support)
- Output directory: `dist/`

**⚠️ CRITICAL: SPA Routing Fix**

Project sudah include fix untuk SPA routing:
- `package.json`: Script `start` menggunakan `http-server` dengan `--proxy` flag
- `railway.json`: Configuration untuk Railway buildpack
- `.railwayignore`: Prevent build artifacts dari di-upload

Fix ini mengatasi masalah:
- ✅ 404 error pada routes (/about, /auth, dll)
- ✅ Missing asset files
- ✅ Inconsistent builds

### Step 3: Set Environment Variable (Optional)

If frontend needs backend URL:

**Settings → Variables:**
```env
VITE_API_URL=https://backend-production-xxxx.up.railway.app
```

*(Replace with your actual backend URL)*

### Step 4: Generate Public Domain

**Settings → Networking:**
- Click **"Generate Domain"**
- You'll get: `frontend-production-yyyy.up.railway.app`

### Step 5: Deploy

- Railway auto-detects Vite
- Auto-builds
- Serves static files
- Done! ✅

**Expected time:** 3-4 minutes

---

## 🔗 Connect Frontend to Backend

Update frontend code to use backend URL:

```typescript
// src/services/api.ts (or wherever you configure axios)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8069';
```

Then redeploy frontend.

---

## 🎯 Project Structure in Railway

After setup, you'll have:

```
📦 Railway Project: ragam-bahasa-nusantara
  ├─ 🐍 backend (FastAPI)
  │   ├─ URL: backend-production-xxxx.up.railway.app
  │   └─ Port: $PORT (auto-assigned)
  │
  ├─ ⚛️ frontend (React + Vite)
  │   └─ URL: frontend-production-yyyy.up.railway.app
  │
  └─ 🗄️ MySQL
      └─ Auto-linked to backend
```

---

## 🔄 Auto-Deploy Workflow

GitLab CI/CD already configured:

```
1. Push code ke GitLab
   ↓
2. GitLab CI/CD mirrors to GitHub
   ↓
3. Railway detects GitHub update
   ↓
4. Railway auto-rebuilds & redeploys
   ↓
5. Live! 🎉
```

**You just push to GitLab, everything else is automatic!**

---

## 🛠️ Troubleshooting

### Backend Issues

**Problem:** Build fails
- **Check:** `requirements.txt` is valid
- **Check:** Start command is correct
- **Fix:** View build logs for specific error

**Problem:** App crashes after deploy
- **Check:** Environment variables are set
- **Check:** `DATABASE_URL` is linked to MySQL
- **Fix:** View deploy logs

**Problem:** Can't connect to database
- **Check:** MySQL service is running
- **Check:** `DATABASE_URL` variable exists
- **Fix:** Restart backend service

### Frontend Issues

**Problem:** Build fails
- **Check:** `package.json` and `package-lock.json` are committed
- **Check:** Node version compatible
- **Fix:** Check build logs

**Problem:** 404 Error on Routes (/about, /auth, etc) - SPA Routing**
- **Cause:** http-server default tidak support SPA routing
- **Fix:** ✅ Sudah diatasi dengan:
  - `package.json` → `start` script menggunakan `--proxy` flag
  - `railway.json` → Config start command
- **Verify:**
  ```bash
  # Test locally
  npm run build
  npm start
  # Buka http://localhost:8080/about (seharusnya tidak 404)
  ```

**Problem:** Blank page after deploy
- **Check:** Build output directory is `dist/`
- **Check:** `index.html` exists in `dist/`
- **Fix:** Redeploy

**Problem:** Can't reach backend API
- **Check:** `VITE_API_URL` is set correctly
- **Check:** Backend is running
- **Check:** CORS is configured in backend
- **Fix:** Update CORS settings:

```python
# backend/app/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://frontend-production-yyyy.up.railway.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📊 Monitoring

**Check Deployment Status:**
- Railway Dashboard → Click service → **Deployments**

**View Logs:**
- Click deployment → **View Logs**
- Types: Build Logs, Deploy Logs, Application Logs

**Check Metrics:**
- Service → **Metrics**
- CPU, Memory, Network usage

---

## 🔐 Security Checklist

- [ ] `SECRET_KEY` is strong & unique (min 32 chars)
- [ ] `DEBUG=False` in production
- [ ] Database password is strong
- [ ] CORS configured properly
- [ ] Environment variables are set (not hardcoded)

---

## 💰 Cost Estimate

**Railway Free Tier:**
- $5 credit/month
- Enough for small projects

**This setup:**
- Backend: ~$2-3/month
- Frontend: ~$1-2/month
- MySQL: ~$1/month
- **Total: ~$4-6/month** (within free tier!)

---

## ✅ Success Checklist

### Pre-Deploy:
- [ ] Code pushed to GitLab
- [ ] GitLab CI/CD mirror working
- [ ] Code in GitHub
- [ ] Railway account ready

### Backend:
- [ ] Service created
- [ ] Root Directory: `backend`
- [ ] Start command set
- [ ] Variables configured
- [ ] MySQL added
- [ ] Domain generated
- [ ] Health check: `/health` returns 200

### Frontend:
- [ ] Service created
- [ ] Root Directory: `/`
- [ ] Build success
- [ ] Static files served
- [ ] Domain generated
- [ ] Can reach backend API

### Integration:
- [ ] Frontend can call backend
- [ ] Database connected
- [ ] Auto-deploy working
- [ ] All features functional

---

## 🎉 You're Done!

Congratulations! Your application is now deployed on Railway with:
- ✅ Auto-deploy from GitLab → GitHub → Railway
- ✅ Fast native builds (no Docker overhead)
- ✅ Scalable infrastructure
- ✅ Easy monitoring & logs

---

**Questions or issues?** Check Railway logs or documentation: https://docs.railway.app

**Good luck! 🚀**
