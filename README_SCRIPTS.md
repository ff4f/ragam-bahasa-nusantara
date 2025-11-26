# 📦 Monolith Scripts Package - Summary

Kumpulan lengkap script untuk menjalankan RANA secara monolith tanpa Docker.

## 🎯 Tujuan

Menjalankan **semua service** berdasarkan **urutan dan prioritas** yang tepat dalam **satu environment** tanpa Docker.

## 📂 File-file yang Dibuat

### 1. 🚀 Core Scripts

| File | Fungsi | Prioritas |
|------|--------|-----------|
| `run-monolith.sh` | Start semua services (MySQL → Backend → Frontend) | ⭐⭐⭐⭐⭐ |
| `stop-monolith.sh` | Stop semua services dengan graceful shutdown | ⭐⭐⭐⭐ |
| `restart-monolith.sh` | Restart semua services | ⭐⭐⭐⭐ |
| `status-monolith.sh` | Check status dan health semua services | ⭐⭐⭐⭐⭐ |
| `view-logs.sh` | Interactive log viewer | ⭐⭐⭐ |
| `dev-helper.sh` | Interactive menu untuk semua fungsi | ⭐⭐⭐⭐⭐ |

### 2. 📚 Documentation

| File | Konten |
|------|--------|
| `MONOLITH_DEPLOYMENT.md` | Full documentation lengkap (14KB) |
| `QUICK_START_MONOLITH.md` | Quick reference guide |
| `README_SCRIPTS.md` | File ini |

### 3. 📊 Generated Directories

```
logs/               # Log files untuk backend & frontend
├── backend.log
└── frontend.log

pids/               # Process ID tracking
├── backend.pid
└── frontend.pid
```

## 🎯 Urutan Prioritas Service

```
PRIORITAS 1: MySQL Database (Port 3306)
    ↓ Database Ready
PRIORITAS 2: Backend API (Port 8000)
    ↓ API Ready
PRIORITAS 3: Frontend (Port 5173)
    ↓ All Services Running
```

**Kenapa urutan ini?**
- Backend butuh MySQL untuk database connection
- Frontend butuh Backend untuk API calls
- Jika urutan salah, service akan gagal start

## 🚀 Quick Start

### Pertama Kali

```bash
# 1. Setup database (sekali saja)
mysql -u root -p
```

```sql
CREATE DATABASE ragam_bahasa_db;
CREATE USER 'rbnuser'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON ragam_bahasa_db.* TO 'rbnuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

```bash
# 2. Konfigurasi environment
cp .env.example .env
# Edit .env dengan database credentials yang benar

# 3. Start services
./run-monolith.sh
```

### Daily Usage (Recommended)

```bash
# Gunakan interactive menu (PALING MUDAH!)
./dev-helper.sh
```

### Manual Commands

```bash
# Start
./run-monolith.sh

# Check status
./status-monolith.sh

# View logs
./view-logs.sh

# Stop
./stop-monolith.sh

# Restart
./restart-monolith.sh
```

## 🎨 Features

### ✅ Automated Features

- ✅ **Auto-detect** MySQL status dan start jika perlu
- ✅ **Auto-create** virtual environment untuk Python
- ✅ **Auto-install** dependencies jika belum ada
- ✅ **Auto-create** .env.local untuk frontend
- ✅ **Health checks** untuk semua services
- ✅ **PID tracking** untuk process management
- ✅ **Log management** dengan separate files
- ✅ **Graceful shutdown** dengan cleanup

### 🎯 Smart Features

- 🎯 **Port conflict detection** dan auto-kill
- 🎯 **Stale PID cleanup** jika process mati
- 🎯 **MySQL service detection** berdasarkan OS (macOS/Linux)
- 🎯 **Wait mechanism** dengan timeout untuk setiap service
- 🎯 **Colored output** untuk readability
- 🎯 **Interactive confirmations** untuk destructive actions

### 📊 Monitoring Features

- 📊 Real-time **health checks**
- 📊 **Service status** dengan PID tracking
- 📊 **Port availability** checking
- 📊 **Response time** monitoring
- 📊 **Version information** display
- 📊 **Log viewing** dengan multiple options

## 📖 Detailed Script Documentation

### 1. run-monolith.sh

**Apa yang dilakukan:**
1. Check MySQL (start jika perlu)
2. Verify .env files
3. Setup Python virtual environment
4. Install backend dependencies
5. Start Backend (uvicorn)
6. Start Frontend (vite)
7. Health check semua services
8. Display access points

**Output:**
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
✅ Backend is running (PID: 12345)
   API: http://localhost:8000
   Docs: http://localhost:8000/api/docs

[4/5] 🎨 Starting Frontend (Vite)...
✅ Frontend is running (PID: 12346)
   URL: http://localhost:5173

[5/5] 📊 Services Status:
✅ MySQL Database  - Running
✅ Backend API     - Running (PID: 12345)
✅ Frontend        - Running (PID: 12346)

========================================
✨ All services started successfully!
========================================
```

### 2. stop-monolith.sh

**Apa yang dilakukan:**
1. Stop Frontend (reverse order)
2. Stop Backend
3. Optional: Stop MySQL (dengan konfirmasi)
4. Cleanup PID files
5. Kill remaining processes on ports

**Safety features:**
- Konfirmasi sebelum stop MySQL
- Graceful shutdown
- Port cleanup
- Stale PID removal

### 3. status-monolith.sh

**Apa yang dilakukan:**
1. Check MySQL status + version
2. Check Backend dengan health endpoint
3. Check Frontend accessibility
4. Display semua info dengan visual indicators
5. Summary status semua services

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

[3/3] Frontend (Vite):
   ✅ Status: Running
   🆔 PID: 12346
   📍 Port: 5173
   🌐 Accessible: http://localhost:5173

🎉 All services are running!
```

### 4. view-logs.sh

**Interactive log viewer dengan pilihan:**
1. Backend log only
2. Frontend log only
3. Both (split screen) - requires multitail
4. Both (sequential)

### 5. dev-helper.sh

**Interactive menu system** dengan 12+ options:
- Service management (start/stop/restart/status)
- Log viewing
- Quick actions (open browser, health check)
- Documentation access

**Recommended untuk daily usage!**

## 🔧 Troubleshooting

### MySQL Error

```bash
# Check MySQL
brew services list | grep mysql

# Restart MySQL
brew services restart mysql

# Test connection
mysql -u rbnuser -p ragam_bahasa_db
```

### Backend Error

```bash
# Check logs
tail -f logs/backend.log

# Check Python version
python3 --version

# Reinstall dependencies
cd backend
source .venv/bin/activate
pip install -r requirements.txt --force-reinstall
```

### Frontend Error

```bash
# Check logs
tail -f logs/frontend.log

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Port Conflicts

```bash
# Kill port 8000 (Backend)
kill $(lsof -ti:8000)

# Kill port 5173 (Frontend)
kill $(lsof -ti:5173)

# Kill port 3306 (MySQL)
kill $(lsof -ti:3306)
```

## 🎯 Best Practices

### Development Workflow

```bash
# Morning: Start development
./dev-helper.sh
# Choose option 1: Start All Services

# During development: Monitor
./status-monolith.sh  # Check status
tail -f logs/backend.log  # Watch logs

# Evening: Stop services
./stop-monolith.sh
```

### When to Use Each Script

| Scenario | Script | Reason |
|----------|--------|--------|
| Daily work | `dev-helper.sh` | Interactive menu, easiest |
| CI/CD | `run-monolith.sh` | Automated, non-interactive |
| Quick check | `status-monolith.sh` | Fast status overview |
| Debugging | `view-logs.sh` | Interactive log viewer |
| Emergency stop | `stop-monolith.sh` | Clean shutdown |

## 📊 Comparison: Monolith vs Docker

| Aspect | Monolith | Docker |
|--------|----------|--------|
| **Setup Time** | ~5 menit | ~2 menit |
| **Startup Time** | ~10-15 detik | ~30-60 detik |
| **Resources** | Lighter | Heavier |
| **Debugging** | Easier (direct access) | Harder (need exec) |
| **Logs** | Direct file access | docker logs |
| **Port Conflicts** | Possible | Isolated |
| **Production** | ❌ Not recommended | ✅ Recommended |
| **Development** | ✅ Recommended | ✅ Also good |

## 🔗 Access Points

| Service | Port | URL | Health Check |
|---------|------|-----|--------------|
| **Frontend** | 5173 | http://localhost:5173 | `curl -I http://localhost:5173` |
| **Backend** | 8000 | http://localhost:8000 | `curl http://localhost:8000/health` |
| **API Docs** | 8000 | http://localhost:8000/api/docs | Browser |
| **MySQL** | 3306 | localhost:3306 | `mysql -u rbnuser -p` |

## 💡 Tips & Tricks

### Auto-start on Login (macOS)

Add to `~/.zshrc` or `~/.bash_profile`:

```bash
alias rana-start='cd /path/to/ragam-bahasa-nusantara && ./run-monolith.sh'
alias rana-stop='cd /path/to/ragam-bahasa-nusantara && ./stop-monolith.sh'
alias rana-status='cd /path/to/ragam-bahasa-nusantara && ./status-monolith.sh'
alias rana-dev='cd /path/to/ragam-bahasa-nusantara && ./dev-helper.sh'
```

### Watch Logs in Real-time

```bash
# Terminal 1: Backend logs
tail -f logs/backend.log

# Terminal 2: Frontend logs
tail -f logs/frontend.log

# Or use multitail (brew install multitail)
multitail logs/backend.log logs/frontend.log
```

### Quick Health Check

```bash
# One-liner untuk check semua
curl -s http://localhost:8000/health && \
curl -sI http://localhost:5173 && \
mysql -u rbnuser -p -e "USE ragam_bahasa_db; SHOW TABLES;"
```

## 📝 Script Permissions

Semua script sudah diberi execute permission:

```bash
-rwxr-xr-x  run-monolith.sh
-rwxr-xr-x  stop-monolith.sh
-rwxr-xr-x  restart-monolith.sh
-rwxr-xr-x  status-monolith.sh
-rwxr-xr-x  view-logs.sh
-rwxr-xr-x  dev-helper.sh
```

Jika perlu re-apply:

```bash
chmod +x *.sh
```

## 🎓 Advanced Usage

### Custom Ports

Edit di `run-monolith.sh`:

```bash
BACKEND_PORT=8000   # Change to your port
FRONTEND_PORT=5173  # Change to your port
```

Jangan lupa update `.env.local` juga:

```bash
VITE_API_URL=http://localhost:YOUR_BACKEND_PORT
```

### Run in Background (Daemon Mode)

Script sudah running in background by default dengan `nohup`.

PID files disimpan di:
- `pids/backend.pid`
- `pids/frontend.pid`

### Custom Log Location

Edit di script:

```bash
LOG_DIR="logs"              # Change to your path
BACKEND_LOG="$LOG_DIR/backend.log"
FRONTEND_LOG="$LOG_DIR/frontend.log"
```

## ❓ FAQ

**Q: Apakah harus install MySQL sendiri?**  
A: Ya, MySQL harus diinstall manual. Script hanya auto-start jika sudah terinstall.

**Q: Bisa running tanpa .env file?**  
A: Tidak. .env file wajib untuk database credentials.

**Q: Apakah data hilang setiap restart?**  
A: Tidak. Data tersimpan di MySQL yang persistent.

**Q: Bisa running di Windows?**  
A: Script ini untuk Unix (macOS/Linux). Untuk Windows gunakan WSL atau Docker.

**Q: Kenapa harus urutan MySQL → Backend → Frontend?**  
A: Karena dependency chain. Backend butuh DB, Frontend butuh API.

**Q: Kalau cuma mau jalanin Backend saja bisa?**  
A: Bisa, tapi MySQL harus running dulu. Edit script atau jalankan manual.

## 📞 Support & Documentation

- **Quick Start**: [QUICK_START_MONOLITH.md](./QUICK_START_MONOLITH.md)
- **Full Docs**: [MONOLITH_DEPLOYMENT.md](./MONOLITH_DEPLOYMENT.md)
- **This File**: `README_SCRIPTS.md`

## 🎉 Kesimpulan

Package ini menyediakan **complete solution** untuk development monolith dengan:

✅ **6 powerful scripts**  
✅ **Automated dependency management**  
✅ **Smart health checking**  
✅ **Interactive menu system**  
✅ **Comprehensive logging**  
✅ **Detailed documentation**  

**Recommended usage**: `./dev-helper.sh` untuk kemudahan maksimal!

---

**Created**: 2025-11-25  
**Version**: 1.0.0  
**Author**: Antigravity AI  
**Project**: RANA - Ragam Bahasa Nusantara
