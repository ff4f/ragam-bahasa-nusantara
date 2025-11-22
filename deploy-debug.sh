#!/bin/bash

# Manual Railway Deployment - Step by Step Debugging
# This script helps debug the deployment issue

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}🔧 Railway Manual Deploy - Debug Mode${NC}"
echo ""

# Step 1: Check current directory and files
echo -e "${YELLOW}Step 1: Verify Backend Structure${NC}"
echo "Current location: $(pwd)"
echo ""
echo "Backend directory contents:"
ls -la backend/
echo ""
echo "Backend/app directory contents:"
ls -la backend/app/ | head -10
echo ""

# Step 2: Check Dockerfile
echo -e "${YELLOW}Step 2: Verify Dockerfile${NC}"
echo "Dockerfile COPY commands:"
grep "COPY" backend/Dockerfile
echo ""

# Step 3: Test local Docker build
echo -e "${YELLOW}Step 3: Test Local Docker Build${NC}"
read -p "Do you want to test Docker build locally first? (y/n): " test_local

if [ "$test_local" == "y" ]; then
    echo "Building Docker image locally..."
    cd backend
    docker build -t rana-backend-test . || {
        echo -e "${RED}❌ Local Docker build failed!${NC}"
        echo "This means the Dockerfile has issues. Fix before deploying to Railway."
        exit 1
    }
    echo -e "${GREEN}✅ Local Docker build successful!${NC}"
    echo "If local build works, Railway should work too."
    cd ..
    echo ""
fi

# Step 4: Railway Login Check
echo -e "${YELLOW}Step 4: Check Railway Login${NC}"
if command -v railway &> /dev/null; then
    echo "Railway CLI: Installed ✅"
else
    echo -e "${RED}Railway CLI not installed${NC}"
    read -p "Install now? (y/n): " install_cli
    if [ "$install_cli" == "y" ]; then
        npm install -g @railway/cli
    else
        exit 1
    fi
fi

# Step 5: Link to project
echo ""
echo -e "${YELLOW}Step 5: Link to Railway Project${NC}"
echo "Your Railway project: rana-demo"
echo "URL: https://railway.com/project/f1cfeafc-614c-49af-8f11-f90a825fe30f"
echo ""

read -p "Do you want to link to this project? (y/n): " link_project

if [ "$link_project" == "y" ]; then
    railway link f1cfeafc-614c-49af-8f11-f90a825fe30f
    echo -e "${GREEN}✅ Linked to project${NC}"
fi

# Step 6: Deploy Backend
echo ""
echo -e "${YELLOW}Step 6: Deploy Backend${NC}"
echo "This will deploy from: backend/"
echo ""

read -p "Ready to deploy backend? (y/n): " deploy_backend

if [ "$deploy_backend" == "y" ]; then
    echo ""
    echo -e "${BLUE}Deploying...${NC}"
    echo ""
    
    cd backend
    
    # Show what will be uploaded
    echo "Files that will be uploaded:"
    ls -la
    echo ""
    
    # Deploy
    railway up
    
    DEPLOY_STATUS=$?
    cd ..
    
    if [ $DEPLOY_STATUS -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅✅✅ DEPLOYMENT SUCCESSFUL! ✅✅✅${NC}"
        echo ""
        echo "View your app:"
        railway open
    else
        echo ""
        echo -e "${RED}❌ Deployment failed${NC}"
        echo ""
        echo "Debug steps:"
        echo "1. Check build logs in Railway dashboard"
        echo "2. Verify Dockerfile is correct"
        echo "3. Try local Docker build: cd backend && docker build -t test ."
        echo ""
        echo "Open Railway dashboard to see detailed logs:"
        railway open
    fi
fi

echo ""
echo -e "${BLUE}=== Debug Complete ===${NC}"
