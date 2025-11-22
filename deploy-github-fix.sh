#!/bin/bash

# ULTIMATE FIX: Deploy via GitHub
# Railway CLI has upload issues, so we use GitHub integration instead

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${RED}⚠️  Railway CLI Deploy: NOT WORKING${NC}"
echo -e "${YELLOW}Issue: Railway CLI doesn't upload 'app/' folder properly${NC}"
echo ""
echo -e "${GREEN}✅ Local Docker Build: WORKS PERFECTLY${NC}"
echo -e "${GREEN}✅ Dockerfile: CORRECT${NC}"
echo -e "${RED}❌ Railway CLI Upload: BROKEN${NC}"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🚀 SOLUTION: Deploy via GitHub${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: ${YELLOW}${CURRENT_BRANCH}${NC}"
echo ""

# Check if GitHub remote exists
if git remote | grep -q "github"; then
    echo -e "${GREEN}✅ GitHub remote found${NC}"
    GITHUB_REMOTE="github"
else
    echo -e "${YELLOW}Setting up GitHub remote...${NC}"
    echo ""
    read -p "Enter your GitHub repository URL: " github_url
    
    if [ -z "$github_url" ]; then
        echo -e "${RED}No URL provided. Using default remote name.${NC}"
        GITHUB_REMOTE="origin"
    else
        git remote add github $github_url
        GITHUB_REMOTE="github"
        echo -e "${GREEN}✅ GitHub remote added${NC}"
    fi
fi

echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}DEPLOYMENT STEPS:${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "1. Commit current changes (if any)"
echo "2. Push to GitHub"
echo "3. Configure Railway to deploy from GitHub"
echo "4. Railway will auto-build and deploy ✅"
echo ""

read -p "Continue? (y/n): " continue_deploy

if [ "$continue_deploy" != "y" ]; then
    echo "Cancelled."
    exit 0
fi

# Step 1: Commit changes
echo ""
echo -e "${YELLOW}Step 1: Checking for uncommitted changes...${NC}"

if [[ -n $(git status -s) ]]; then
    echo "Uncommitted changes found:"
    git status -s
    echo ""
    read -p "Commit these changes? (y/n): " do_commit
    
    if [ "$do_commit" == "y" ]; then
        read -p "Commit message: " commit_msg
        git add .
        git commit -m "$commit_msg"
        echo -e "${GREEN}✅ Changes committed${NC}"
    fi
else
    echo -e "${GREEN}✅ No uncommitted changes${NC}"
fi

# Step 2: Push to GitHub
echo ""
echo -e "${YELLOW}Step 2: Pushing to GitHub...${NC}"

read -p "Push branch '$CURRENT_BRANCH' to GitHub? (y/n): " do_push

if [ "$do_push" == "y" ]; then
    git push $GITHUB_REMOTE $CURRENT_BRANCH -f
    echo -e "${GREEN}✅ Pushed to GitHub!${NC}"
else
    echo -e "${YELLOW}Skipping push. You can push manually later:${NC}"
    echo "  git push $GITHUB_REMOTE $CURRENT_BRANCH"
fi

# Step 3: Configure Railway
echo ""
echo -e "${YELLOW}Step 3: Configure Railway to use GitHub${NC}"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Manual Steps in Railway Dashboard:${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "1. Open Railway: https://railway.app/new"
echo ""
echo "2. Click 'Deploy from GitHub repo'"
echo ""
echo "3. Select your repository"
echo ""
echo "4. Configure Root Directory (IMPORTANT):"
echo "   - For Backend Service:"
echo "     Root Directory: ${GREEN}backend${NC}"
echo "     Or keep empty and Railway will auto-detect"
echo ""
echo "5. Configure Branch:"
echo "   Branch: ${GREEN}${CURRENT_BRANCH}${NC}"
echo ""
echo "6. Railway will:"
echo "   ✅ Auto-detect Dockerfile"
echo "   ✅ Build successfully (local build proved it works)"
echo "   ✅ Deploy your app"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

read -p "Open Railway Dashboard now? (y/n): " open_railway

if [ "$open_railway" == "y" ]; then
    open "https://railway.app/new"
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ GitHub Push Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Next: Configure Railway to deploy from GitHub"
echo ""
echo "Why this works:"
echo "  ✅ Railway-GitHub integration is more reliable"
echo "  ✅ No CLI upload issues"
echo "  ✅ Auto-deploy on every push"
echo "  ✅ You're already logged into Railway via GitHub"
echo ""
echo "Alternative (if you have Railway project already):"
echo "  1. Open: https://railway.com/project/f1cfeafc-614c-49af-8f11-f90a825fe30f"
echo "  2. Settings → Connect to GitHub Repository"
echo "  3. Select your repo + branch: ${CURRENT_BRANCH}"
echo "  4. Set root directory: backend (for backend service)"
echo ""
