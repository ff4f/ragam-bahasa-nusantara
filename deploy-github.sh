#!/bin/bash

# Push Current Branch to GitHub and Deploy via Railway
# For users who login to Railway with GitHub account

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)

echo -e "${GREEN}🚀 Deploy to Railway via GitHub${NC}"
echo -e "${YELLOW}Current Branch: ${CURRENT_BRANCH}${NC}"
echo ""

# Check if GitHub remote exists
if ! git remote | grep -q "github"; then
    echo -e "${RED}⚠️  GitHub remote not found${NC}"
    echo ""
    echo -e "${YELLOW}Setting up GitHub remote...${NC}"
    read -p "Enter your GitHub repository URL (e.g., https://github.com/username/repo.git): " github_url
    
    # Add GitHub remote
    git remote add github $github_url
    echo -e "${GREEN}✅ GitHub remote added${NC}"
else
    echo -e "${GREEN}✅ GitHub remote found${NC}"
fi

echo ""
echo -e "${BLUE}GitHub Remote:${NC}"
git remote -v | grep github

echo ""
echo -e "${YELLOW}This will:${NC}"
echo "1. Push branch '${CURRENT_BRANCH}' to GitHub"
echo "2. Railway will auto-deploy from GitHub (if configured)"
echo ""

read -p "Continue? (y/n): " confirm

if [ "$confirm" != "y" ]; then
    echo -e "${RED}Cancelled${NC}"
    exit 0
fi

# Push to GitHub
echo ""
echo -e "${YELLOW}Pushing to GitHub...${NC}"
git push github $CURRENT_BRANCH --force

echo ""
echo -e "${GREEN}✅ Pushed to GitHub!${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Open Railway Dashboard: https://railway.app/dashboard"
echo "2. Go to your project"
echo "3. Railway should auto-deploy from GitHub"
echo ""
echo -e "${BLUE}Or configure Railway to watch this branch:${NC}"
echo "   - Railway Dashboard → Settings → Deployments"
echo "   - Set Branch: ${CURRENT_BRANCH}"
echo ""

# Ask if user wants to open Railway dashboard
read -p "Open Railway dashboard now? (y/n): " open_dashboard

if [ "$open_dashboard" == "y" ]; then
    if command -v railway &> /dev/null; then
        railway open
    else
        echo "Opening browser..."
        open "https://railway.app/dashboard"
    fi
fi
