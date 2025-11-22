# 🏠 Local Development Setup

This guide mirrors the Railway deployment setup for local development.

## Prerequisites

- Python 3.13+ (same as Railway)
- Node.js 22+ (same as Railway)
- MySQL 8.0+

---

## 🗄️ **1. Setup MySQL Database**

### macOS (Homebrew):
```bash
# Install MySQL
brew install mysql

# Start MySQL service
brew services start mysql

# Secure installation (set root password)
mysql_secure_installation

# Create database
mysql -u root -p
```

```sql
CREATE DATABASE ragam_bahasa_db;
CREATE USER 'rbnuser'@'localhost' IDENTIFIED BY 'your_password_here';
GRANT ALL PRIVILEGES ON ragam_bahasa_db.* TO 'rbnuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## ⚙️ **2. Configure Environment Variables**

### Backend (.env in project root):
```bash
# Copy example
cp .env.example .env

# Edit .env
nano .env
```

**Update with local values:**
```env
# Database
DATABASE_URL=mysql+pymysql://rbnuser:your_password_here@localhost:3306/ragam_bahasa_db

# JWT Settings
SECRET_KEY=your-local-secret-key-minimum-32-characters-long
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS (allow frontend)
CORS_ORIGINS=http://localhost:5173

# App
PROJECT_NAME=Ragam Bahasa Nusantara API
VERSION=1.0.0
DEBUG=True
```

### Frontend (.env.local):
```bash
# Create frontend env
cat > .env.local <<EOF
VITE_API_URL=http://localhost:8000
EOF
```

---

## 🐍 **3. Setup Python Backend**

```bash
# Navigate to backend
cd backend

# Create virtual environment (Python 3.13)
python3.13 -m venv .venv

# Activate venv
source .venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Test database connection
python -c "from app.database import engine; print('✅ DB Connected!')"
```

---

## 📦 **4. Setup Node.js Frontend**

```bash
# Navigate to root (frontend is in root)
cd ..

# Install dependencies
npm install

# Build (test)
npm run build
```

---

## 🚀 **5. Run Development Servers**

### Option A: Separate Terminals

**Terminal 1 - Backend:**
```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/api/docs

---

### Option B: Use Existing Scripts

```bash
# Start all services
./start-all.sh

# Or individually:
./manage-backend.sh start
./manage-frontend.sh start
```

---

## 🧪 **6. Test Setup**

```bash
# Test backend health
curl http://localhost:8000/health

# Test frontend
open http://localhost:5173

# Test API
./test-api.sh
```

---

## 📝 **Quick Reference**

| Component | Port | URL |
|-----------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Backend API | 8000 | http://localhost:8000 |
| API Docs | 8000 | http://localhost:8000/api/docs |
| MySQL | 3306 | localhost:3306 |

---

## 🔄 **Sync with Railway**

**Pull latest from Railway config:**
```bash
# Frontend env from Railway
railway variables --json > .env.railway

# Backend env from Railway (via Railway dashboard)
```

**Push local changes to Railway:**
```bash
git add .
git commit -m "Your changes"
git push origin feature/integrated
# Railway auto-deploys via GitHub mirror
```

---

## 🛠️ **Troubleshooting**

**Backend won't start:**
```bash
# Check Python version
python --version  # Should be 3.13+

# Check DATABASE_URL
echo $DATABASE_URL  # or check .env file

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

**Frontend won't build:**
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

**Database connection error:**
```bash
# Verify MySQL is running
brew services list | grep mysql

# Test connection
mysql -u rbnuser -p ragam_bahasa_db
```

---

## ✅ **Environment Parity Checklist**

- [ ] Python 3.13+
- [ ] Node.js 22+  
- [ ] MySQL 8.0+
- [ ] `.env` configured with local DB
- [ ] `.env.local` with `VITE_API_URL=http://localhost:8000`
- [ ] Backend runs on port 8000
- [ ] Frontend runs on port 5173
- [ ] Database seeded with initial data
- [ ] CORS allows localhost:5173

---

**Happy coding! 🎉**
