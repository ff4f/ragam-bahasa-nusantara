# 🚀 Deploy Branch `feature/integrated` ke Railway

## Situasi Kamu:
- ✅ Railway login via **GitHub account** (authenticated)
- ✅ Current branch: **`feature/integrated`**
- ✅ Mau deploy branch ini, **bukan `main`**
- ✅ Branch `main` masih ada changes yang belum siap

---

## 🎯 Solusi: 3 Cara Deploy

### **Cara 1: Deploy Langsung via Railway CLI** ⭐ PALING CEPAT

Deploy branch `feature/integrated` langsung ke Railway:

```bash
# Run deployment script
./deploy-branch.sh
```

**Atau manual:**

```bash
# 1. Install Railway CLI (jika belum)
npm install -g @railway/cli

# 2. Login ke Railway
railway login
# Browser akan terbuka, login dengan GitHub kamu

# 3. Link ke Railway project
railway link
# Pilih project yang mau kamu deploy

# 4. Deploy backend
cd backend
railway up
cd ..

# 5. Deploy frontend (optional)
railway up
```

**✅ Keuntungan:**
- Langsung deploy dari branch sekarang
- Tidak perlu merge ke main
- Tidak perlu setup GitHub remote
- Bisa deploy kapan aja

---

### **Cara 2: Push ke GitHub → Railway Auto-Deploy** 🔥 UNTUK GITHUB USERS

Karena kamu login Railway pakai GitHub, cara ini paling smooth:

```bash
# Run GitHub deployment script
./deploy-github.sh
```

**Atau manual:**

```bash
# 1. Check apakah sudah ada GitHub remote
git remote -v

# 2. Jika belum ada, tambahkan GitHub remote
git remote add github https://github.com/username/ragam-bahasa-nusantara.git

# 3. Push branch ke GitHub
git push github feature/integrated

# 4. Configure Railway
# - Buka Railway Dashboard: https://railway.app/dashboard
# - Go to Project → Settings → Deployments
# - Set Branch: feature/integrated
# - Railway akan auto-deploy!
```

**Setup Railway untuk auto-deploy dari branch ini:**

1. Buka **Railway Dashboard** → Your Project
2. Go to **Settings** → **Deployments**
3. Cari **"Source"** atau **"Branch"** settings
4. Set branch to: **`feature/integrated`**
5. Save

Sekarang setiap push ke `feature/integrated` di GitHub = auto deploy! 🎉

**✅ Keuntungan:**
- Auto-deploy setiap push
- Native Railway-GitHub integration
- Lebih smooth untuk long-term
- Bisa rollback dengan mudah

---

### **Cara 3: GitLab CI/CD** (Jika kamu pakai GitLab)

File `.gitlab-ci.yml` sudah diupdate untuk support `feature/integrated`:

```bash
# Just push ke GitLab
git push origin feature/integrated
```

GitLab CI/CD akan auto-deploy dari branch ini!

**Note:** Perlu setup GitLab CI/CD variables dulu:
- `RAILWAY_TOKEN`
- `RAILWAY_PROJECT_ID`
- `RAILWAY_APP_URL`

(Lihat `GITLAB_RAILWAY_CHEATSHEET.md` untuk details)

---

## 📋 Rekomendasi Berdasarkan Situasi Kamu

### **Jika: Kamu mau deploy SEKARANG** ⚡
→ **Gunakan Cara 1** (Railway CLI)

```bash
./deploy-branch.sh
# Pilih backend/frontend/both
# Done in 2 minutes!
```

### **Jika: Kamu mau setup long-term auto-deploy** 🔄
→ **Gunakan Cara 2** (GitHub integration)

```bash
./deploy-github.sh
# Configure Railway branch
# Every push = auto deploy
```

### **Jika: Kamu pakai GitLab** 🦊
→ **Gunakan Cara 3** (GitLab CI/CD)

---

## 🛠️ Step-by-Step: Cara 1 (Recommended untuk kamu)

Karena kamu mau deploy **SEKARANG** dan login Railway dengan **GitHub**:

### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

### Step 2: Login

```bash
railway login
```

Browser akan buka, login dengan **GitHub account** yang sama.

### Step 3: Link Project

Ada 2 opsi:

**A. Link ke existing project:**
```bash
railway link
# Pilih project dari list
```

**B. Create new project:**
```bash
railway init
# Railway membuat project baru
```

### Step 4: Deploy

```bash
# Deploy backend
cd backend
railway up

# Kembali ke root
cd ..

# Deploy frontend (optional)
railway up
```

### Step 5: Monitor

```bash
# View logs
railway logs

# Check status
railway status

# Open dashboard
railway open
```

**DONE!** ✅ Branch `feature/integrated` sekarang live di Railway!

---

## 🔧 Environment Variables

Sebelum deploy, pastikan set environment variables di Railway:

```bash
# Via CLI
railway variables set SECRET_KEY="your-secret-key"
railway variables set DATABASE_URL="mysql+pymysql://..."
railway variables set DEBUG="False"

# Atau via Dashboard
railway open
# Go to Variables tab
```

Template ada di `.env.railway` file.

---

## 📊 Verify Deployment

After deployment:

```bash
# 1. Check deployment logs
railway logs

# 2. Get deployment URL
railway status

# 3. Test API
curl https://your-app.railway.app/health

# 4. Open in browser
railway open
```

---

## 🆘 Troubleshooting

### "railway: command not found"
```bash
npm install -g @railway/cli
```

### Login issues
```bash
# Try browserless login
railway login --browserless
# Copy token yang muncul
```

### Build fails
```bash
# Check logs
railway logs

# Check Dockerfile
cat backend/Dockerfile
```

### Cannot link project
```bash
# Get project ID dari Railway dashboard
# Then manually link:
railway link [PROJECT_ID]
```

---

## 💡 Pro Tips

1. **Deploy backend dulu**, test, baru frontend
   ```bash
   cd backend
   railway up
   # Test backend
   cd ..
   railway up  # Frontend
   ```

2. **Monitor logs** saat deployment pertama
   ```bash
   railway logs --follow
   ```

3. **Check environment variables**
   ```bash
   railway variables
   ```

4. **Use Railway dashboard** untuk quick checks
   ```bash
   railway open
   ```

---

## 🎯 Quick Commands

```bash
# Deploy current branch
./deploy-branch.sh

# Push to GitHub for auto-deploy
./deploy-github.sh

# Manual Railway CLI
railway login
railway link
railway up

# Monitor
railway logs
railway status
railway open
```

---

## ✅ After Deployment Checklist

- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully  
- [ ] Environment variables set correctly
- [ ] Database connected (if using MySQL)
- [ ] API endpoints working
- [ ] Health check passing (`/health`)
- [ ] Logs look normal

---

## 🔄 Workflow untuk Branch Development

```
feature/integrated (local)
    ↓
railway up (deploy)
    ↓
Railway builds & deploys
    ↓
Test deployment
    ↓
If OK → merge to main
    ↓
Deploy main to production
```

---

## 📞 Need Help?

**Deployment scripts:**
- `./deploy-branch.sh` - Deploy from any branch
- `./deploy-github.sh` - Push to GitHub + configure Railway

**Documentation:**
- `DEPLOYMENT_SUMMARY.md` - Overview all methods
- `RAILWAY_DEPLOYMENT.md` - Full guide
- `GITLAB_RAILWAY_CHEATSHEET.md` - Quick reference

**Railway CLI:**
```bash
railway help
railway login --help
railway up --help
```

---

**Current Status:** ✅ Ready to deploy from `feature/integrated`

**Next Step:** Run `./deploy-branch.sh` 🚀
