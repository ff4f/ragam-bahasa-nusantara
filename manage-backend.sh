#!/bin/bash

# ====================================================================
# Backend Service Management Script
# Control: start, stop, restart, rebuild, logs
# ====================================================================

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

SERVICE="backend"
CONTAINER="ragam-backend"

show_help() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}Backend Service Manager${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    echo "Usage: ./manage-backend.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start       Start backend service"
    echo "  stop        Stop backend service"
    echo "  restart     Restart backend service"
    echo "  rebuild     Rebuild and restart backend"
    echo "  logs        View backend logs"
    echo "  status      Check backend status"
    echo "  shell       Access backend shell"
    echo "  help        Show this help message"
    echo ""
}

start_service() {
    echo -e "${BLUE}🚀 Starting Backend...${NC}"
    
    # Check if MySQL is running
    if ! docker-compose ps mysql | grep -q "healthy"; then
        echo -e "${YELLOW}⚠️  MySQL is not healthy. Starting MySQL first...${NC}"
        docker-compose up -d mysql
        echo -e "${YELLOW}⏳ Waiting for MySQL...${NC}"
        sleep 5
    fi
    
    docker-compose up -d $SERVICE
    sleep 3
    
    # Check health
    if curl -s http://localhost:8069/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend started and healthy${NC}"
    else
        echo -e "${YELLOW}⚠️  Backend started but may need more time${NC}"
    fi
    
    echo -e "${BLUE}Access API at: http://localhost:8069${NC}"
    echo -e "${BLUE}API Docs at: http://localhost:8069/api/docs${NC}"
}

stop_service() {
    echo -e "${YELLOW}🛑 Stopping Backend...${NC}"
    docker-compose stop $SERVICE
    echo -e "${GREEN}✅ Backend stopped${NC}"
}

restart_service() {
    echo -e "${YELLOW}🔄 Restarting Backend...${NC}"
    docker-compose restart $SERVICE
    sleep 3
    
    # Check health
    if curl -s http://localhost:8069/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend restarted and healthy${NC}"
    else
        echo -e "${YELLOW}⚠️  Backend restarted but may need more time${NC}"
    fi
    
    echo -e "${BLUE}Access API at: http://localhost:8069${NC}"
}

rebuild_service() {
    echo -e "${BLUE}🔨 Rebuilding Backend...${NC}"
    docker-compose up -d --build $SERVICE
    sleep 5
    
    # Check health
    if curl -s http://localhost:8069/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend rebuilt and healthy${NC}"
    else
        echo -e "${YELLOW}⚠️  Backend rebuilt but may need more time${NC}"
    fi
    
    echo -e "${BLUE}Access API at: http://localhost:8069${NC}"
}

view_logs() {
    echo -e "${BLUE}📋 Backend Logs (Ctrl+C to exit)${NC}"
    echo ""
    docker-compose logs -f $SERVICE
}

check_status() {
    echo -e "${BLUE}📊 Backend Status:${NC}"
    echo ""
    docker-compose ps $SERVICE
    echo ""
    
    # Check if container is running
    if [ "$(docker ps -q -f name=$CONTAINER)" ]; then
        echo -e "${GREEN}✅ Backend container is running${NC}"
        
        # Try health check
        if curl -s http://localhost:8069/health > /dev/null 2>&1; then
            HEALTH=$(curl -s http://localhost:8069/health)
            echo -e "${GREEN}✅ Backend is healthy${NC}"
            echo -e "${BLUE}Health check response: $HEALTH${NC}"
            echo -e "${BLUE}API: http://localhost:8069${NC}"
            echo -e "${BLUE}Docs: http://localhost:8069/api/docs${NC}"
        else
            echo -e "${RED}❌ Backend is not responding to health check${NC}"
            echo -e "${YELLOW}💡 Check logs: ./manage-backend.sh logs${NC}"
        fi
    else
        echo -e "${RED}❌ Backend is not running${NC}"
    fi
}

access_shell() {
    echo -e "${BLUE}🐚 Accessing Backend Shell...${NC}"
    echo -e "${YELLOW}Type 'exit' to leave the shell${NC}"
    echo ""
    docker-compose exec $SERVICE bash
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
    shell)
        access_shell
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
