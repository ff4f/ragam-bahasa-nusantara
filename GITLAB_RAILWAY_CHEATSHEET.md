# GitLab CI/CD → Railway Quick Reference

## 🚀 Initial Setup (One-time)

### 1. Get Railway Token

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login (browserless mode to get token)
railway login --browserless
```

Copy the token yang muncul.

### 2. Setup GitLab CI/CD Variables

Go to: **GitLab → Project → Settings → CI/CD → Variables**

Add these variables:

| Variable | Value | Protected | Masked |
|----------|-------|-----------|--------|
| `RAILWAY_TOKEN` | Token dari step 1 | ✅ | ✅ |
| `RAILWAY_PROJECT_ID` | From Railway dashboard | ✅ | ❌ |
| `RAILWAY_APP_URL` | Your app URL | ❌ | ❌ |

### 3. Get Railway Project ID

```bash
# Login first
railway login

# Link to project or create new one
railway init

# Get project ID
railway status
```

Or check: **Railway Dashboard → Project Settings → General**

---

## 📝 Deployment Commands

### Automatic Deployment (via GitLab CI/CD)

```bash
# Just push to main branch
git add .
git commit -m "Deploy to Railway"
git push origin main
```

GitLab CI/CD will automatically deploy! ✨

### Manual Deployment (via CLI)

```bash
# Deploy all services
./deploy-railway.sh

# Or manually:
railway up
```

---

## 🔧 Railway CLI Commands

```bash
# Login
railway login

# Link to project
railway link [PROJECT_ID]

# Deploy
railway up

# Deploy specific service
railway up --service backend

# View logs
railway logs
railway logs --service backend

# Check status
railway status

# View environment variables
railway variables

# Set environment variable
railway variables set KEY=value

# Open dashboard
railway open

# Add MySQL
railway add
# Select MySQL from the list
```

---

## 🌍 Environment Variables

Set in Railway dashboard or via CLI:

```bash
railway variables set SECRET_KEY="your-secret-key"
railway variables set DATABASE_URL="mysql+pymysql://..."
railway variables set DEBUG="False"
```

Or use the deployment script:

```bash
./deploy-railway.sh
# Select option: 3) Setup Environment Variables
```

---

## 📊 GitLab Pipeline Status

Check deployment progress:

1. **GitLab → Project → CI/CD → Pipelines**
2. Click on the running pipeline
3. See logs for each job

Pipeline stages:
- ✅ Test (if enabled)
- 🚀 Deploy

---

## 🔍 Troubleshooting

### Pipeline Failed - Invalid Token

```bash
# Get new token
railway login --browserless

# Update in GitLab
GitLab → Settings → CI/CD → Variables → RAILWAY_TOKEN
```

### Build Failed

Check Railway logs:

```bash
railway logs
```

Or in Railway dashboard: **Deployments → Latest → Logs**

### Database Connection Error

Check DATABASE_URL:

```bash
railway variables | grep DATABASE
```

Update if needed:

```bash
railway variables set DATABASE_URL="mysql+pymysql://user:pass@host:port/db"
```

---

## 🎯 Deployment Workflow

```
Local Changes → Git Push → GitLab CI/CD → Railway Deploy → Live! 🎉
```

**Detailed flow:**

1. Make changes locally
2. Commit and push to GitLab
3. GitLab CI/CD detects push to `main`
4. Runs test stage (if configured)
5. Runs deployment stage
6. Railway CLI deploys services
7. Railway builds Docker images
8. Railway deploys containers
9. App is live!

---

## 📦 Services Structure

Your Railway project should have:

- **Backend Service**: FastAPI (Python)
  - Builds from: `backend/Dockerfile`
  - Port: Dynamic (Railway sets `$PORT`)
  
- **Frontend Service**: React (Vite)
  - Builds from: `Dockerfile`
  - Port: 80 (nginx)
  
- **MySQL Service**: Database
  - Provisioned via Railway plugin
  - Auto-sets `DATABASE_URL`

---

## 🔗 Useful Links

- [Railway Dashboard](https://railway.app/dashboard)
- [Railway CLI Docs](https://docs.railway.app/develop/cli)
- [GitLab CI/CD Docs](https://docs.gitlab.com/ee/ci/)

---

## 💡 Tips

1. **Always test locally first**
   ```bash
   docker-compose up
   ```

2. **Check logs immediately after deploy**
   ```bash
   railway logs
   ```

3. **Use Railway dashboard for quick checks**
   ```bash
   railway open
   ```

4. **Keep secrets in GitLab CI/CD Variables**, never commit them

5. **Use `.env.railway` as template** for production variables

---

## 🆘 Need Help?

1. Check Railway logs: `railway logs`
2. Check GitLab pipeline: CI/CD → Pipelines
3. Check Railway dashboard: Deployments tab
4. Run `./deploy-railway.sh` and try manual options

---

**Last Updated:** 2025-11-22
