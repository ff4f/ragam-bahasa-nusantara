#!/bin/bash

# ====================================================================
# Ragam Bahasa Nusantara - Development Script
# Manage all services: Database, Backend, Frontend
# No Docker - Native services only
# ====================================================================

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Directories
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
PID_DIR="$PROJECT_ROOT/.pids"
LOG_DIR="$PROJECT_ROOT/.logs"

# Database config
DB_NAME="ragam_bahasa_db"
DB_USER="rbnuser"
DB_PASS="devpassword123"
DB_HOST="localhost"
DB_PORT="3306"

# Create necessary directories
mkdir -p "$PID_DIR" "$LOG_DIR"

# ====================================================================
# Helper Functions
# ====================================================================

print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# ====================================================================
# Database Functions
# ====================================================================

check_mysql_installed() {
    if command -v mysql &> /dev/null; then
        return 0
    else
        return 1
    fi
}

install_mysql() {
    print_info "MySQL not found. Installing via Homebrew..."
    
    if ! command -v brew &> /dev/null; then
        print_error "Homebrew not installed. Please install Homebrew first:"
        echo "  /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi
    
    brew install mysql
    print_success "MySQL installed"
}

start_mysql() {
    print_info "Starting MySQL service..."
    
    # Check if already running
    if brew services list | grep mysql | grep started &> /dev/null; then
        print_success "MySQL already running"
        return 0
    fi
    
    brew services start mysql
    sleep 3
    
    # Wait for MySQL to be ready
    local counter=0
    until mysql -u root -e "SELECT 1" &> /dev/null || [ $counter -eq 10 ]; do
        echo -n "."
        sleep 1
        counter=$((counter + 1))
    done
    echo ""
    
    if [ $counter -eq 10 ]; then
        print_error "MySQL failed to start"
        return 1
    fi
    
    print_success "MySQL started"
}

setup_database() {
    print_info "Setting up database..."
    
    # Create database and user
    mysql -u root << EOF 2>/dev/null || true
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'$DB_HOST' IDENTIFIED BY '$DB_PASS';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'$DB_HOST';
FLUSH PRIVILEGES;
EOF
    
    print_success "Database configured"
    
    # Run migrations
    if [ -d "$BACKEND_DIR/alembic" ]; then
        print_info "Running database migrations..."
        cd "$BACKEND_DIR"
        
        if [ -d ".venv" ]; then
            source .venv/bin/activate
            alembic upgrade head 2>&1 | tee "$LOG_DIR/migration.log"
            print_success "Migrations completed"
        else
            print_warning "Virtual environment not found. Skipping migrations."
        fi
        
        cd "$PROJECT_ROOT"
    fi
}

stop_mysql() {
    print_info "Stopping MySQL service..."
    brew services stop mysql
    print_success "MySQL stopped"
}

# ====================================================================
# Backend Functions
# ====================================================================

setup_backend() {
    print_info "Setting up backend..."
    cd "$BACKEND_DIR"
    
    # Create virtual environment if not exists
    if [ ! -d ".venv" ]; then
        print_info "Creating Python virtual environment..."
        python3 -m venv .venv
        print_success "Virtual environment created"
    fi
    
    # Activate and install dependencies
    source .venv/bin/activate
    
    print_info "Installing backend dependencies..."
    pip install -q -r requirements.txt
    print_success "Backend dependencies installed"
    
    cd "$PROJECT_ROOT"
}

start_backend() {
    print_info "Starting backend server..."
    cd "$BACKEND_DIR"
    
    # Check if already running
    if [ -f "$PID_DIR/backend.pid" ]; then
        local pid=$(cat "$PID_DIR/backend.pid")
        if ps -p $pid > /dev/null 2>&1; then
            print_success "Backend already running (PID: $pid)"
            cd "$PROJECT_ROOT"
            return 0
        fi
    fi
    
    source .venv/bin/activate
    
    # Start uvicorn in background
    nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload \
        > "$LOG_DIR/backend.log" 2>&1 &
    
    local pid=$!
    echo $pid > "$PID_DIR/backend.pid"
    
    # Wait for backend to be ready
    sleep 3
    
    if ps -p $pid > /dev/null 2>&1; then
        print_success "Backend started (PID: $pid, Port: 8000)"
    else
        print_error "Backend failed to start. Check logs: $LOG_DIR/backend.log"
        return 1
    fi
    
    cd "$PROJECT_ROOT"
}

stop_backend() {
    if [ -f "$PID_DIR/backend.pid" ]; then
        local pid=$(cat "$PID_DIR/backend.pid")
        if ps -p $pid > /dev/null 2>&1; then
            print_info "Stopping backend (PID: $pid)..."
            kill $pid
            rm "$PID_DIR/backend.pid"
            print_success "Backend stopped"
        else
            print_warning "Backend not running"
            rm "$PID_DIR/backend.pid"
        fi
    else
        print_warning "Backend PID file not found"
    fi
}

# ====================================================================
# Frontend Functions
# ====================================================================

setup_frontend() {
    print_info "Setting up frontend..."
    cd "$PROJECT_ROOT"
    
    if [ ! -d "node_modules" ]; then
        print_info "Installing frontend dependencies..."
        npm install
        print_success "Frontend dependencies installed"
    else
        print_success "Frontend dependencies already installed"
    fi
}

start_frontend() {
    print_info "Starting frontend server..."
    cd "$PROJECT_ROOT"
    
    # Check if already running
    if [ -f "$PID_DIR/frontend.pid" ]; then
        local pid=$(cat "$PID_DIR/frontend.pid")
        if ps -p $pid > /dev/null 2>&1; then
            print_success "Frontend already running (PID: $pid)"
            return 0
        fi
    fi
    
    # Start Vite in background
    nohup npm run dev > "$LOG_DIR/frontend.log" 2>&1 &
    
    local pid=$!
    echo $pid > "$PID_DIR/frontend.pid"
    
    # Wait for frontend to be ready
    sleep 3
    
    if ps -p $pid > /dev/null 2>&1; then
        print_success "Frontend started (PID: $pid, Port: 8080)"
    else
        print_error "Frontend failed to start. Check logs: $LOG_DIR/frontend.log"
        return 1
    fi
}

stop_frontend() {
    if [ -f "$PID_DIR/frontend.pid" ]; then
        local pid=$(cat "$PID_DIR/frontend.pid")
        if ps -p $pid > /dev/null 2>&1; then
            print_info "Stopping frontend (PID: $pid)..."
            kill $pid
            rm "$PID_DIR/frontend.pid"
            print_success "Frontend stopped"
        else
            print_warning "Frontend not running"
            rm "$PID_DIR/frontend.pid"
        fi
    else
        print_warning "Frontend PID file not found"
    fi
}

# ====================================================================
# Main Commands
# ====================================================================

cmd_start() {
    print_header "Starting All Services"
    
    # 1. Database
    if ! check_mysql_installed; then
        install_mysql
    fi
    
    start_mysql
    setup_database
    
    # 2. Backend
    setup_backend
    start_backend
    
    # 3. Frontend
    setup_frontend
    start_frontend
    
    echo ""
    print_header "All Services Started!"
    print_success "Backend:  http://localhost:8000"
    print_success "Frontend: http://localhost:8080"
    print_success "API Docs: http://localhost:8000/docs"
    echo ""
    print_info "View logs: ./dev.sh logs"
    print_info "Check status: ./dev.sh status"
}

cmd_stop() {
    print_header "Stopping All Services"
    
    stop_frontend
    stop_backend
    # Note: We don't stop MySQL as it's a system service
    
    print_success "All services stopped"
}

cmd_restart() {
    print_header "Restarting All Services"
    cmd_stop
    sleep 2
    cmd_start
}

cmd_status() {
    print_header "Service Status"
    
    # MySQL
    if brew services list | grep mysql | grep started &> /dev/null; then
        print_success "MySQL: Running"
    else
        print_error "MySQL: Not running"
    fi
    
    # Backend
    if [ -f "$PID_DIR/backend.pid" ]; then
        local pid=$(cat "$PID_DIR/backend.pid")
        if ps -p $pid > /dev/null 2>&1; then
            print_success "Backend: Running (PID: $pid, Port: 8000)"
        else
            print_error "Backend: Not running (stale PID file)"
        fi
    else
        print_error "Backend: Not running"
    fi
    
    # Frontend
    if [ -f "$PID_DIR/frontend.pid" ]; then
        local pid=$(cat "$PID_DIR/frontend.pid")
        if ps -p $pid > /dev/null 2>&1; then
            print_success "Frontend: Running (PID: $pid, Port: 8080)"
        else
            print_error "Frontend: Not running (stale PID file)"
        fi
    else
        print_error "Frontend: Not running"
    fi
}

cmd_logs() {
    print_header "Service Logs"
    
    echo -e "${BLUE}Select log to view:${NC}"
    echo "1) Backend"
    echo "2) Frontend"
    echo "3) Migration"
    echo "4) All (tail -f)"
    read -p "Choice: " choice
    
    case $choice in
        1)
            less +F "$LOG_DIR/backend.log"
            ;;
        2)
            less +F "$LOG_DIR/frontend.log"
            ;;
        3)
            less "$LOG_DIR/migration.log"
            ;;
        4)
            tail -f "$LOG_DIR/backend.log" "$LOG_DIR/frontend.log"
            ;;
        *)
            print_error "Invalid choice"
            ;;
    esac
}

cmd_db() {
    print_header "Database Shell"
    print_info "Connecting to database..."
    mysql -u $DB_USER -p$DB_PASS -h $DB_HOST $DB_NAME
}

cmd_help() {
    print_header "Ragam Bahasa Nusantara - Dev Script"
    
    echo "Usage: ./dev.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start       Start all services (database, backend, frontend)"
    echo "  stop        Stop all services"
    echo "  restart     Restart all services"
    echo "  status      Check service status"
    echo "  logs        View service logs"
    echo "  db          Access database shell"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./dev.sh start     # Start everything"
    echo "  ./dev.sh status    # Check what's running"
    echo "  ./dev.sh logs      # View logs"
    echo ""
}

# ====================================================================
# Main
# ====================================================================

case "${1:-help}" in
    start)
        cmd_start
        ;;
    stop)
        cmd_stop
        ;;
    restart)
        cmd_restart
        ;;
    status)
        cmd_status
        ;;
    logs)
        cmd_logs
        ;;
    db)
        cmd_db
        ;;
    help|--help|-h)
        cmd_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        cmd_help
        exit 1
        ;;
esac
