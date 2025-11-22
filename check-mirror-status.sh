#!/bin/bash

# Check Mirror Status
# Quick script to check if auto-mirror is working

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}🔍 Checking Auto-Mirror Status${NC}"
echo ""

# Get GitLab project info
GITLAB_PROJECT="zuhryrahmani/ragam-bahasa-nusantara"
GITHUB_REPO="ff4f/ragam-bahasa-nusantara"
BRANCH="feature/integrated"

echo -e "${YELLOW}GitLab Project:${NC} ${GITLAB_PROJECT}"
echo -e "${YELLOW}GitHub Repo:${NC} ${GITHUB_REPO}"
echo -e "${YELLOW}Branch:${NC} ${BRANCH}"
echo ""

# Check GitLab CI/CD Variables
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}1. GitLab CI/CD Variables${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Check: https://gitlab.com/${GITLAB_PROJECT}/-/settings/ci_cd"
echo ""
echo "Required variables:"
echo "  ✓ GITHUB_TOKEN (masked, protected)"
echo "  ✓ GITHUB_REPO (value: ${GITHUB_REPO})"
echo ""
read -p "Variables configured correctly? (y/n): " vars_ok

if [ "$vars_ok" != "y" ]; then
    echo -e "${RED}❌ Fix GitLab CI/CD variables first!${NC}"
    exit 1
fi

# Check GitLab Pipeline
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}2. GitLab CI/CD Pipeline${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Opening GitLab pipelines..."
open "https://gitlab.com/${GITLAB_PROJECT}/-/pipelines"
echo ""
echo "Check if:"
echo "  1. Pipeline is running/completed"
echo "  2. 'mirror:github' job exists"
echo "  3. 'mirror:github' job succeeded"
echo ""
read -p "Pipeline running successfully? (y/n/pending): " pipeline_status

case $pipeline_status in
    y)
        echo -e "${GREEN}✅ Pipeline success!${NC}"
        ;;
    pending)
        echo -e "${YELLOW}⏳ Pipeline pending/running${NC}"
        echo "Wait for it to complete, then check GitHub."
        exit 0
        ;;
    n)
        echo -e "${RED}❌ Pipeline failed!${NC}"
        echo ""
        echo "Common issues:"
        echo "  1. No GitLab Runner available"
        echo "  2. GITHUB_TOKEN or GITHUB_REPO incorrect"
        echo "  3. Branch not protected (for protected variables)"
        echo ""
        echo "Opening pipeline logs..."
        open "https://gitlab.com/${GITLAB_PROJECT}/-/pipelines"
        exit 1
        ;;
esac

# Check GitHub
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}3. GitHub Repository${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Opening GitHub repository..."
open "https://github.com/${GITHUB_REPO}"
echo ""
echo "Check if:"
echo "  1. Repository has code (not empty)"
echo "  2. Branch '${BRANCH}' exists"
echo "  3. Latest commit matches GitLab"
echo ""
read -p "GitHub repository updated? (y/n): " github_updated

if [ "$github_updated" == "y" ]; then
    echo -e "${GREEN}✅ Auto-mirror working!${NC}"
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}4. Connect Railway to GitHub${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Now you can connect Railway to GitHub:"
    echo ""
    echo "1. Open Railway: https://railway.app/new"
    echo "2. Click 'Deploy from GitHub repo'"
    echo "3. Select: ${GITHUB_REPO}"
    echo "4. Configure:"
    echo "   - Root Directory: backend"
    echo "   - Branch: ${BRANCH}"
    echo ""
    read -p "Open Railway now? (y/n): " open_railway
    
    if [ "$open_railway" == "y" ]; then
        open "https://railway.app/new"
    fi
    
    echo ""
    echo -e "${GREEN}✅ Setup complete! Every push to GitLab will auto-deploy to Railway!${NC}"
else
    echo -e "${RED}❌ GitHub repository still empty${NC}"
    echo ""
    echo "Troubleshooting steps:"
    echo ""
    echo "1. Check GitLab pipeline logs:"
    echo "   https://gitlab.com/${GITLAB_PROJECT}/-/pipelines"
    echo ""
    echo "2. Look for 'mirror:github' job"
    echo ""
    echo "3. Check error messages"
    echo ""
    echo "Common fixes:"
    echo "  • Ensure GitLab Runner is available"
    echo "  • Check GITHUB_TOKEN has 'repo' scope"
    echo "  • Verify GITHUB_REPO format: username/repo-name"
    echo "  • Make sure branch is protected (if using protected variables)"
    echo ""
    echo "4. Manual mirror (if needed):"
    echo "   git remote add github https://github.com/${GITHUB_REPO}.git"
    echo "   git push github ${BRANCH}"
    echo ""
fi
