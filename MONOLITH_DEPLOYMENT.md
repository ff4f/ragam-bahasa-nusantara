# 🚀 Monolith Deployment Guide

Panduan lengkap untuk menjalankan RANA (Ragam Bahasa Nusantara) secara **monolith** tanpa Docker.

## 📋 Daftar Isi

- [Prerequisites](#prerequisites)
- [Setup Awal](#setup-awal)
- [Urutan dan Prioritas Service](#urutan-dan-prioritas-service)
- [Cara Penggunaan](#cara-penggunaan)
- [Management Scripts](#management-scripts)
- [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

Pastikan sudah terinstall:

1. **MySQL 8.0+**
   ```bash
   # macOS
   brew install mysql
   brew services start mysql
   
   # Linux
   sudo apt-get install mysql-server
   sudo systemctl start mysql
   ```

2. **Python 3.13+**
   ```bash
   python3 --version
   ```

3. **Node.js 22+**
   ```bash
   node --version
   npm --version
   ```

---

## ⚙️ Setup Awal

### 1. Setup Database

```bash
# Login ke MySQL
mysql -u root -p

# Jalankan perintah SQL berikut:
```

```sql
CREATE DATABASE ragam_bahasa_db;
CREATE USER 'rbnuser'@'localhost' IDENTIFIED BY 'your_password_here';
GRANT ALL PRIVILEGES ON ragam_bahasa_db.* TO 'rbnuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2. Konfigurasi Environment Variables

#### Backend (.env)

```bash
# Copy dari example
cp .env.example .env

# Edit .env dan sesuaikan:
nano .env
```

**Isi .env:**
```env
# Database
DATABASE_URL=mysql+pymysql://rbnuser:your_password_here@localhost:3306/ragam_bahasa_db

# JWT Settings
SECRET_KEY=your-local-secret-key-minimum-32-characters-long
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=http://localhost:5173

# App
PROJECT_NAME=Ragam Bahasa Nusantara API
VERSION=1.0.0
DEBUG=True
```

#### Frontend (.env.local)

Script akan otomatis membuat jika belum ada, atau buat manual:

```bash
echo "VITE_API_URL=http://localhost:8000" > .env.local
```

### 3. Install Dependencies

Script `run-monolith.sh` akan otomatis menginstall dependencies, tapi bisa juga manual:

**Backend:**
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cd ..
```

**Frontend:**
```bash
npm install
```

---

## 🎯 Urutan dan Prioritas Service

Script dirancang dengan urutan prioritas sebagai berikut:

### Visual Diagram

![RANA Monolith Startup Flow](/Users/0xfikridev/.gemini/antigravity/brain/02f865bb-d07e-472b-a41c-e43f5d1c4d31/monolith_startup_flow_1764037842492.png)

### ASCII Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    URUTAN STARTUP                           │
└─────────────────────────────────────────────────────────────┘

╔═══════════════════════════════════════════════════════════╗
║ PRIORITAS 1: MySQL Database                               ║
║ - Harus jalan terlebih dahulu                             ║
║ - Port: 3306                                              ║
║ - Dependency: Tidak ada                                   ║
╚═══════════════════════════════════════════════════════════╝
                          ↓
╔═══════════════════════════════════════════════════════════╗
║ PRIORITAS 2: Backend API (FastAPI/Python)                ║
║ - Butuh MySQL untuk koneksi database                     ║
║ - Port: 8000                                              ║
║ - Dependency: MySQL                                       ║
║ - Auto-seeding data saat startup                          ║
╚═══════════════════════════════════════════════════════════╝
                          ↓
╔═══════════════════════════════════════════════════════════╗
║ PRIORITAS 3: Frontend (Vite/React)                       ║
║ - Butuh Backend untuk API calls                          ║
║ - Port: 5173                                              ║
║ - Dependency: Backend API                                 ║
╚═══════════════════════════════════════════════════════════╝
```

### Kenapa urutan ini penting?

1. **MySQL First**: Backend tidak bisa start tanpa database connection
2. **Backend Second**: Frontend akan error jika API tidak tersedia
3. **Frontend Last**: Frontend hanya consume API, tidak ada service yang depend padanya

---

## 🎮 Cara Penggunaan

### Quick Start

```bash
# Start semua services
./run-monolith.sh
```

Output yang diharapkan:

```
========================================
🚀 RANA - Monolith Startup
========================================

[1/5] 🗄️  Checking MySQL Database...
✅ MySQL is running and database 'ragam_bahasa_db' is accessible

[2/5] 📋 Checking environment configuration...
✅ .env file exists
✅ .env.local exists

[3/5] ⚙️  Starting Backend (FastAPI)...
Python version: 3.13
✅ Backend is running (PID: 12345)
   API: http://localhost:8000
   Docs: http://localhost:8000/api/docs

[4/5] 🎨 Starting Frontend (Vite)...
Node.js version: v22.x.x
✅ Frontend is running (PID: 12346)
   URL: http://localhost:5173

[5/5] 📊 Services Status:
✅ MySQL Database  - Running
✅ Backend API     - Running (PID: 12345)
✅ Frontend        - Running (PID: 12346)

========================================
✨ All services started successfully!
========================================

📍 Access Points:
   Frontend:     http://localhost:5173
   Backend API:  http://localhost:8000
   API Docs:     http://localhost:8000/api/docs
   MySQL:        localhost:3306
```

### Check Status

```bash
# Cek status semua services
./status-monolith.sh
```

### Stop Services

```bash
# Stop semua services
./stop-monolith.sh
```

### Restart Services

```bash
# Restart semua services
./restart-monolith.sh
```

---

## 📚 Management Scripts

### 1. `run-monolith.sh` - Start All Services

**Fungsi:**
- Check dan start MySQL (jika belum running)
- Verify environment configuration
- Install dependencies (jika belum)
- Start Backend dengan uvicorn
- Start Frontend dengan vite
- Health checks untuk semua services

**Auto-features:**
- ✅ Auto-create virtual environment
- ✅ Auto-install dependencies
- ✅ Auto-create .env.local
- ✅ Health monitoring
- ✅ PID tracking

### 2. `stop-monolith.sh` - Stop All Services

**Fungsi:**
- Stop Frontend (prioritas pertama untuk stop)
- Stop Backend
- Optional: Stop MySQL (dengan konfirmasi)
- Cleanup PID files
- Kill processes by port (jika PID tidak ada)

**Safety features:**
- ✅ Graceful shutdown
- ✅ Port cleanup
- ✅ Konfirmasi untuk stop MySQL

### 3. `restart-monolith.sh` - Restart All Services

**Fungsi:**
- Stop semua services
- Wait 3 detik
- Start semua services

### 4. `status-monolith.sh` - Check Services Status

**Fungsi:**
- Check MySQL status dengan versi
- Check Backend dengan health endpoint
- Check Frontend dengan accessibility test
- Summary dengan visual indicators

**Output:**
```
========================================
📊 RANA - Services Status
========================================

[1/3] MySQL Database:
   ✅ Status: Running
   📍 Port: 3306
   📦 Version: mysql  Ver 8.0.x

[2/3] Backend API (FastAPI):
   ✅ Status: Running
   🆔 PID: 12345
   📍 Port: 8000
   ❤️  Health: {"status":"healthy","version":"1.0.0"}
   🌐 API: http://localhost:8000
   📚 Docs: http://localhost:8000/api/docs

[3/3] Frontend (Vite):
   ✅ Status: Running
   🆔 PID: 12346
   📍 Port: 5173
   🌐 Accessible: http://localhost:5173

========================================
📌 Summary
========================================
   ✅ MySQL Database
   ✅ Backend API
   ✅ Frontend

🎉 All services are running!
```

---

## 📁 File Structure

```
ragam-bahasa-nusantara/
├── run-monolith.sh         # 🚀 Start all services
├── stop-monolith.sh        # 🛑 Stop all services
├── restart-monolith.sh     # 🔄 Restart all services
├── status-monolith.sh      # 📊 Check status
├── .env                    # Backend environment
├── .env.local              # Frontend environment
├── backend/
│   ├── app/
│   │   └── main.py        # FastAPI application
│   ├── requirements.txt
│   └── .venv/             # Virtual environment
├── logs/
│   ├── backend.log        # Backend logs
│   └── frontend.log       # Frontend logs
└── pids/
    ├── backend.pid        # Backend process ID
    └── frontend.pid       # Frontend process ID
```

---

## 🔧 Troubleshooting

### MySQL tidak bisa connect

```bash
# Check MySQL status
brew services list | grep mysql  # macOS
sudo systemctl status mysql      # Linux

# Restart MySQL
brew services restart mysql      # macOS
sudo systemctl restart mysql     # Linux

# Login manual dan check
mysql -u rbnuser -p ragam_bahasa_db
```

### Backend gagal start

```bash
# Check logs
tail -f logs/backend.log

# Check Python version
python3 --version

# Reinstall dependencies
cd backend
source .venv/bin/activate
pip install -r requirements.txt --force-reinstall

# Check DATABASE_URL di .env
cat .env | grep DATABASE_URL
```

### Frontend gagal start

```bash
# Check logs
tail -f logs/frontend.log

# Check Node version
node --version

# Reinstall dependencies
rm -rf node_modules
npm install

# Check .env.local
cat .env.local
```

### Port sudah digunakan

```bash
# Check port 8000 (Backend)
lsof -ti:8000
kill $(lsof -ti:8000)

# Check port 5173 (Frontend)
lsof -ti:5173
kill $(lsof -ti:5173)

# Check port 3306 (MySQL)
lsof -ti:3306
```

### Services zombie (PID masih ada tapi tidak running)

```bash
# Cleanup manual
rm -rf pids/*.pid

# Kill by port
kill $(lsof -ti:8000)  # Backend
kill $(lsof -ti:5173)  # Frontend

# Restart
./run-monolith.sh
```

---

## 🎯 Best Practices

### Development Workflow

```bash
# 1. Start semua services
./run-monolith.sh

# 2. Coding...

# 3. Check status kapanpun
./status-monolith.sh

# 4. View logs (buka terminal baru)
tail -f logs/backend.log
tail -f logs/frontend.log

# 5. Restart jika ada perubahan major
./restart-monolith.sh

# 6. Stop saat selesai
./stop-monolith.sh
```

### Monitoring Logs

```bash
# Real-time backend logs
tail -f logs/backend.log

# Real-time frontend logs
tail -f logs/frontend.log

# Both logs
tail -f logs/backend.log & tail -f logs/frontend.log

# Last 100 lines
tail -n 100 logs/backend.log
```

### Quick Health Check

```bash
# Backend health
curl http://localhost:8000/health

# Frontend accessible
curl -I http://localhost:5173

# Database accessible
mysql -u rbnuser -p -e "USE ragam_bahasa_db; SHOW TABLES;"
```

---

## 📊 Perbandingan dengan Docker

| Aspek | Monolith | Docker |
|-------|----------|--------|
| **Setup** | Manual install MySQL, Python, Node | `docker-compose up` |
| **Startup Time** | ~10-15 detik | ~30-60 detik |
| **Resource Usage** | Lebih ringan | Lebih berat |
| **Debugging** | Lebih mudah | Perlu masuk container |
| **Logs** | Direct file access | `docker logs` |
| **Port Conflict** | Mungkin konflik | Isolated |
| **Deployment** | Development only | Production ready |

---

## 🔗 Quick Reference

| Component | Port | URL | Health Check |
|-----------|------|-----|--------------|
| Frontend | 5173 | http://localhost:5173 | `curl -I http://localhost:5173` |
| Backend API | 8000 | http://localhost:8000 | `curl http://localhost:8000/health` |
| API Docs | 8000 | http://localhost:8000/api/docs | Browser access |
| MySQL | 3306 | localhost:3306 | `mysql -u rbnuser -p` |

---

## 🎓 Advanced Usage

### Custom Ports

Edit script `run-monolith.sh`:

```bash
# Line 16-18
BACKEND_PORT=8000   # Change to your port
FRONTEND_PORT=5173  # Change to your port
```

### Auto-start on Boot (macOS)

```bash
# Create launchd plist
cat > ~/Library/LaunchAgents/com.rana.monolith.plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.rana.monolith</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>/Users/YOUR_USERNAME/work/project/ragam-bahasa-nusantara/run-monolith.sh</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>
EOF

# Load
launchctl load ~/Library/LaunchAgents/com.rana.monolith.plist
```

---

## ❓ FAQ

**Q: Apakah harus stop Docker services dulu?**  
A: Ya, jika ada Docker services yang menggunakan port yang sama (3306, 8000, 5173).

**Q: Bisakah running sebagian services saja?**  
A: Bisa, tapi harus sesuai urutan prioritas. Misal Backend saja tidak bisa jalan tanpa MySQL.

**Q: Bagaimana cara deploy ke production?**  
A: Untuk production, disarankan gunakan Docker atau Railway. Monolith lebih cocok untuk development.

**Q: Apakah data akan hilang setiap restart?**  
A: Tidak, data tersimpan di MySQL yang persistent. Kecuali MySQL di-stop dan di-reset.

**Q: Bisa running di Windows?**  
A: Script ini untuk Unix-based (macOS/Linux). Untuk Windows, perlu adaptasi atau gunakan WSL.

---

## 📞 Support

Jika menemukan masalah:

1. Check logs: `tail -f logs/*.log`
2. Check status: `./status-monolith.sh`
3. Restart: `./restart-monolith.sh`
4. Check troubleshooting section

---

**Happy coding! 🎉**

*Last updated: 2025-11-25*
