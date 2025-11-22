#!/bin/bash

# Deploy Current Branch to Railway
# Works with any branch, not just main/master

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)

echo -e "${GREEN}🚀 Railway Deployment - Current Branch${NC}"
echo -e "${YELLOW}Branch: ${CURRENT_BRANCH}${NC}"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI not installed${NC}"
    echo -e "${YELLOW}Installing Railway CLI...${NC}"
    npm install -g @railway/cli
    echo -e "${GREEN}✅ Railway CLI installed${NC}"
fi

# Login to Railway
echo -e "${YELLOW}Step 1: Login to Railway${NC}"
railway login --browserless
echo ""

# Link or create project
echo -e "${YELLOW}Step 2: Link to Railway Project${NC}"
echo "Do you want to:"
echo "1) Link to existing project"
echo "2) Create new project"
read -p "Enter choice (1/2): " project_choice

if [ "$project_choice" == "1" ]; then
    read -p "Enter Railway Project ID: " project_id
    railway link $project_id
else
    railway init
fi
echo ""

# Show current status
echo -e "${YELLOW}Step 3: Current Status${NC}"
railway status
echo ""

# Deploy
echo -e "${YELLOW}Step 4: Deploy${NC}"
echo "What do you want to deploy?"
echo "1) Backend only"
echo "2) Frontend only"
echo "3) Both backend and frontend"
read -p "Enter choice (1/2/3): " deploy_choice

case $deploy_choice in
    1)
        echo -e "${YELLOW}Deploying backend from branch: ${CURRENT_BRANCH}${NC}"
        cd backend
        railway up
        cd ..
        ;;
    2)
        echo -e "${YELLOW}Deploying frontend from branch: ${CURRENT_BRANCH}${NC}"
        railway up
        ;;
    3)
        echo -e "${YELLOW}Deploying both services from branch: ${CURRENT_BRANCH}${NC}"
        echo "Deploying backend..."
        cd backend
        railway up
        cd ..
        echo "Deploying frontend..."
        railway up
        ;;
esac

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${YELLOW}Branch deployed: ${CURRENT_BRANCH}${NC}"
echo ""
echo -e "View logs: ${GREEN}railway logs${NC}"
echo -e "Check status: ${GREEN}railway status${NC}"
echo -e "Open dashboard: ${GREEN}railway open${NC}"
