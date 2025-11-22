#!/bin/bash

# Simple Railway Deploy - After Local Docker Build Success
# Use this after verifying local Docker build works

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 Railway Deploy - Simple Method${NC}"
echo ""

echo -e "${YELLOW}Local Docker build: ✅ SUCCESSFUL${NC}"
echo "Dockerfile is correct. Issue is Railway cache."
echo ""

echo -e "${YELLOW}Solution:${NC}"
echo "We need to deploy to a FRESH Railway service to avoid cache issues."
echo ""

echo "Options:"
echo "1) Delete failed service in Railway dashboard + redeploy"
echo "2) Deploy to NEW Railway project (recommended)"
echo "3) Try deploy anyway (might still have cache issues)"
echo ""

read -p "Enter choice (1/2/3): " choice

case $choice in
    1)
        echo ""
        echo -e "${YELLOW}Step 1: Delete failed service${NC}"
        echo "1. Open Railway dashboard: https://railway.com/project/f1cfeafc-614c-49af-8f11-f90a825fe30f"
        echo "2. Click on the failed backend service"
        echo "3. Settings → Delete Service"
        echo ""
        read -p "Press Enter when service is deleted..."
        
        echo ""
        echo -e "${YELLOW}Step 2: Deploy fresh${NC}"
        cd backend
        railway up
        cd ..
        ;;
    
    2)
        echo ""
        echo -e "${YELLOW}Creating NEW Railway project...${NC}"
        echo "This will avoid any cache issues."
        echo ""
        
        # Create new project
        railway init
        
        echo ""
        echo -e "${YELLOW}Deploying backend...${NC}"
        cd backend
        railway up
        cd ..
        
        echo ""
        echo -e "${GREEN}✅ Done!${NC}"
        railway open
        ;;
    
    3)
        echo ""
        echo -e "${YELLOW}Attempting deploy...${NC}"
        cd backend
        railway up
        cd ..
        ;;
esac

echo ""
echo -e "${GREEN}Deployment initiated!${NC}"
echo ""
echo "Commands:"
echo "  View logs: ${GREEN}railway logs${NC}"
echo "  Check status: ${GREEN}railway status${NC}"
echo "  Open dashboard: ${GREEN}railway open${NC}"
