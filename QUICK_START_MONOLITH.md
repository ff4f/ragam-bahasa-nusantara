# 🚀 Quick Start - Monolith Mode

## Setup (Hanya Sekali)

```bash
# 1. Install MySQL dan buat database
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
# 2. Konfigurasi .env
cp .env.example .env
# Edit DATABASE_URL di .env dengan password yang sesuai
```

## Daily Usage

```bash
# Start semua services (MySQL → Backend → Frontend)
./run-monolith.sh

# Check status
./status-monolith.sh

# Stop semua services
./stop-monolith.sh

# Restart
./restart-monolith.sh
```

## Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/api/docs

## Troubleshooting

```bash
# View logs
tail -f logs/backend.log
tail -f logs/frontend.log

# Kill port yang konflik
kill $(lsof -ti:8000)   # Backend
kill $(lsof -ti:5173)   # Frontend
```

## Urutan Prioritas

```
1. MySQL (Port 3306)    - Database
   ↓
2. Backend (Port 8000)  - API
   ↓
3. Frontend (Port 5173) - UI
```

📖 **Full docs**: [MONOLITH_DEPLOYMENT.md](./MONOLITH_DEPLOYMENT.md)
