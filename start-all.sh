#!/bin/bash

# ====================================================================
# RANA Full Stack Startup Script
# Menjalankan semua services (Database, Backend, Frontend) berurutan
# ====================================================================

set -e  # Exit on error

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🚀 RANA - Full Stack Startup${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Step 1: Check .env file
echo -e "${BLUE}📋 [1/6] Checking environment configuration...${NC}"
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found!${NC}"
    echo -e "${BLUE}Creating .env from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created${NC}"
else
    echo -e "${GREEN}✅ .env file exists${NC}"
fi
echo ""

# Step 2: Stop existing containers (if any)
echo -e "${BLUE}🛑 [2/6] Stopping existing containers...${NC}"
docker-compose down > /dev/null 2>&1 || true
echo -e "${GREEN}✅ Existing containers stopped${NC}"
echo ""

# Step 3: Start MySQL Database first
echo -e "${BLUE}🗄️  [3/6] Starting MySQL Database...${NC}"
docker-compose up -d mysql
echo -e "${YELLOW}⏳ Waiting for MySQL to be healthy...${NC}"
sleep 5

# Wait for MySQL to be healthy
MAX_WAIT=30
COUNTER=0
until [ "$(docker-compose ps mysql | grep 'healthy' | wc -l)" -eq 1 ] || [ $COUNTER -eq $MAX_WAIT ]; do
    echo -e "${YELLOW}   Waiting... ($COUNTER/$MAX_WAIT)${NC}"
    sleep 2
    COUNTER=$((COUNTER+1))
done

if [ $COUNTER -eq $MAX_WAIT ]; then
    echo -e "${RED}❌ MySQL failed to start properly${NC}"
    exit 1
fi
echo -e "${GREEN}✅ MySQL is ready!${NC}"
echo ""

# Step 4: Build and start Backend
echo -e "${BLUE}⚙️  [4/6] Building and starting Backend...${NC}"
docker-compose up -d --build backend
echo -e "${YELLOW}⏳ Waiting for Backend to start...${NC}"
sleep 5

# Wait for backend health check
COUNTER=0
until curl -s http://localhost:8069/health > /dev/null 2>&1 || [ $COUNTER -eq 15 ]; do
    echo -e "${YELLOW}   Waiting for backend... ($COUNTER/15)${NC}"
    sleep 2
    COUNTER=$((COUNTER+1))
done

if [ $COUNTER -eq 15 ]; then
    echo -e "${YELLOW}⚠️  Backend might need more time to start${NC}"
else
    echo -e "${GREEN}✅ Backend is ready!${NC}"
fi
echo ""

# Step 5: Build and start Frontend
echo -e "${BLUE}🎨 [5/6] Building and starting Frontend...${NC}"
docker-compose up -d --build frontend
echo -e "${YELLOW}⏳ Waiting for Frontend to start...${NC}"
sleep 3
echo -e "${GREEN}✅ Frontend is ready!${NC}"
echo ""

# Step 6: Display status
echo -e "${BLUE}📊 [6/6] Checking services status...${NC}"
docker-compose ps
echo ""

# Final summary
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✨ All services started successfully!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${BLUE}📍 Access Points:${NC}"
echo -e "   ${GREEN}Frontend:${NC}     http://localhost:3000"
echo -e "   ${GREEN}Backend API:${NC}  http://localhost:8069"
echo -e "   ${GREEN}API Docs:${NC}     http://localhost:8069/api/docs"
echo -e "   ${GREEN}MySQL:${NC}        localhost:3306"
echo ""
echo -e "${BLUE}🔧 Management Commands:${NC}"
echo -e "   ${YELLOW}./manage-frontend.sh${NC}  - Control frontend service"
echo -e "   ${YELLOW}./manage-backend.sh${NC}   - Control backend service"
echo -e "   ${YELLOW}./manage-database.sh${NC}  - Control database service"
echo -e "   ${YELLOW}docker-compose logs -f${NC} - View all logs"
echo ""
echo -e "${GREEN}Happy coding! 🎉${NC}"
echo ""
