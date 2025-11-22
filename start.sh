#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Ragam Bahasa Nusantara Stack...${NC}"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    echo -e "${BLUE}Creating .env from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created${NC}"
    echo ""
fi

# Start Docker Compose
echo -e "${BLUE}🐳 Starting Docker containers...${NC}"
docker-compose up --build

echo ""
echo -e "${GREEN}✅ Application started successfully!${NC}"
echo ""
echo -e "${BLUE}📍 Access points:${NC}"
echo -e "   Frontend: http://localhost:3000"
echo -e "   Backend API: http://localhost:8069"
echo -e "   API Docs: http://localhost:8069/api/docs"
echo -e "   MySQL: localhost:3306"
echo ""
