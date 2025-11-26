# 🚀 Development Guide

Quick start guide for running Ragam Bahasa Nusantara locally.

## Prerequisites

- macOS (for Homebrew)
- Node.js 18+ and npm
- Python 3.8+

**That's it!** MySQL will be auto-installed if needed.

---

## Quick Start

```bash
# Start everything (database, backend, frontend)
./dev.sh start

# Check status
./dev.sh status

# View logs
./dev.sh logs

# Stop everything
./dev.sh stop
```

---

## Commands

| Command | Description |
|---------|-------------|
| `./dev.sh start` | Start all services |
| `./dev.sh stop` | Stop all services |
| `./dev.sh restart` | Restart all services |
| `./dev.sh status` | Check service status |
| `./dev.sh logs` | View service logs |
| `./dev.sh db` | Access database shell |
| `./dev.sh help` | Show help |

---

## What Happens on First Run?

1. **MySQL**: Auto-installs via Homebrew if not found
2. **Database**: Creates `ragam_bahasa_db` and user
3. **Migrations**: Runs Alembic migrations automatically
4. **Backend**: Creates venv, installs dependencies, starts on port 8000
5. **Frontend**: Installs npm packages, starts on port 5173

---

## Accessing Services

After `./dev.sh start`:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Database**: `./dev.sh db`

---

## Logs

Logs are stored in `.logs/`:
- `backend.log` - Backend server logs
- `frontend.log` - Frontend dev server logs
- `migration.log` - Database migration logs

View with: `./dev.sh logs`

---

## Troubleshooting

### MySQL won't start
```bash
brew services restart mysql
```

### Backend fails
```bash
cd backend
source .venv/bin/activate
pip install -r requirements.txt
```

### Frontend fails
```bash
npm install
```

### Check what's running
```bash
./dev.sh status
```

---

## Railway Deployment

The same codebase works on Railway:
- Railway auto-detects Python/Node.js
- Uses Railway's MySQL service
- No Docker needed

See `RAILWAY_DEPLOYMENT.md` for details.

---

## Development Workflow

```bash
# Start dev environment
./dev.sh start

# Make changes to code
# Backend: auto-reloads (uvicorn --reload)
# Frontend: auto-reloads (Vite HMR)

# Check logs if needed
./dev.sh logs

# Access database if needed
./dev.sh db

# Stop when done
./dev.sh stop
```

---

## Clean Start

If you want to start fresh:

```bash
# Stop everything
./dev.sh stop

# Remove PIDs and logs
rm -rf .pids .logs

# Start again
./dev.sh start
```
