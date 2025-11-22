#!/bin/bash

# ====================================================================
# Frontend Service Management Script
# Control: start, stop, restart, rebuild, logs
# ====================================================================

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

SERVICE="frontend"
CONTAINER="ragam-frontend"

show_help() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}Frontend Service Manager${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    echo "Usage: ./manage-frontend.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start       Start frontend service"
    echo "  stop        Stop frontend service"
    echo "  restart     Restart frontend service"
    echo "  rebuild     Rebuild and restart frontend"
    echo "  logs        View frontend logs"
    echo "  status      Check frontend status"
    echo "  help        Show this help message"
    echo ""
}

start_service() {
    echo -e "${BLUE}🚀 Starting Frontend...${NC}"
    docker-compose up -d $SERVICE
    sleep 2
    echo -e "${GREEN}✅ Frontend started${NC}"
    echo -e "${BLUE}Access at: http://localhost:3000${NC}"
}

stop_service() {
    echo -e "${YELLOW}🛑 Stopping Frontend...${NC}"
    docker-compose stop $SERVICE
    echo -e "${GREEN}✅ Frontend stopped${NC}"
}

restart_service() {
    echo -e "${YELLOW}🔄 Restarting Frontend...${NC}"
    docker-compose restart $SERVICE
    sleep 2
    echo -e "${GREEN}✅ Frontend restarted${NC}"
    echo -e "${BLUE}Access at: http://localhost:3000${NC}"
}

rebuild_service() {
    echo -e "${BLUE}🔨 Rebuilding Frontend...${NC}"
    docker-compose up -d --build $SERVICE
    echo -e "${GREEN}✅ Frontend rebuilt and started${NC}"
    echo -e "${BLUE}Access at: http://localhost:3000${NC}"
}

view_logs() {
    echo -e "${BLUE}📋 Frontend Logs (Ctrl+C to exit)${NC}"
    echo ""
    docker-compose logs -f $SERVICE
}

check_status() {
    echo -e "${BLUE}📊 Frontend Status:${NC}"
    echo ""
    docker-compose ps $SERVICE
    echo ""
    
    # Check if container is running
    if [ "$(docker ps -q -f name=$CONTAINER)" ]; then
        echo -e "${GREEN}✅ Frontend is running${NC}"
        echo -e "${BLUE}Access at: http://localhost:3000${NC}"
        
        # Try to curl
        if curl -s http://localhost:3000 > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Frontend is responding${NC}"
        else
            echo -e "${YELLOW}⚠️  Frontend container running but not responding${NC}"
        fi
    else
        echo -e "${RED}❌ Frontend is not running${NC}"
    fi
}

# Main
case "$1" in
    start)
        start_service
        ;;
    stop)
        stop_service
        ;;
    restart)
        restart_service
        ;;
    rebuild)
        rebuild_service
        ;;
    logs)
        view_logs
        ;;
    status)
        check_status
        ;;
    help|--help|-h|"")
        show_help
        ;;
    *)
        echo -e "${RED}❌ Unknown command: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
