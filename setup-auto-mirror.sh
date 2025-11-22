#!/bin/bash

# Quick Setup: Auto-Mirror GitLab → GitHub → Railway
# This script helps you set up the auto-mirror workflow

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

clear
echo -e "${CYAN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                       ║${NC}"
echo -e "${CYAN}║   🔄 AUTO-MIRROR SETUP: GitLab → GitHub → Railway   ║${NC}"
echo -e "${CYAN}║                                                       ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}Workflow yang akan dibuat:${NC}"
echo ""
echo "  📝 Push ke GitLab"
echo "      ↓ (auto)"
echo "  🔄 Mirror ke GitHub  "
echo "      ↓ (auto)"
echo "  🚀 Railway Auto-Deploy"
echo "      ↓"
echo "  ✅ App Live!"
echo ""
echo -e "${GREEN}Fully automated! Kamu hanya perlu push ke GitLab!${NC}"
echo ""

read -p "Continue with setup? (y/n): " continue_setup

if [ "$continue_setup" != "y" ]; then
    echo "Setup cancelled."
    exit 0
fi

clear
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Step 1: GitHub Repository${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Buat GitHub repository untuk mirror:"
echo ""
echo "1. Buka: ${CYAN}https://github.com/new${NC}"
echo "2. Repository name: ${GREEN}ragam-bahasa-nusantara${NC}"
echo "3. Visibility: Public atau Private (terserah)"
echo "4. ${RED}DON'T${NC} initialize with README (biar kosong)"
echo "5. Click 'Create repository'"
echo ""

read -p "GitHub repository sudah dibuat? (y/n): " repo_created

if [ "$repo_created" != "y" ]; then
    echo ""
    echo "Silakan buat repository dulu, lalu run script ini lagi."
    exit 0
fi

# Get GitHub repo info
echo ""
read -p "GitHub username: " github_username
GITHUB_REPO="${github_username}/ragam-bahasa-nusantara"

echo ""
echo -e "${GREEN}✅ GitHub Repository: ${GITHUB_REPO}${NC}"

clear
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Step 2: GitHub Personal Access Token${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Generate GitHub token untuk auto-mirror:"
echo ""
echo "1. Buka: ${CYAN}https://github.com/settings/tokens/new${NC}"
echo "2. Note: ${GREEN}GitLab CI/CD Mirror${NC}"
echo "3. Expiration: ${YELLOW}No expiration${NC} (atau sesuai kebutuhan)"
echo "4. Scopes: Centang ${GREEN}repo${NC} (Full control)"
echo "5. Click 'Generate token'"
echo "6. ${RED}COPY TOKEN${NC} (hanya muncul sekali!)"
echo ""

read -p "Token sudah di-generate? (y/n): " token_generated

if [ "$token_generated" != "y" ]; then
    echo ""
    echo "Generate token dulu, lalu run script ini lagi."
    exit 0
fi

echo ""
echo -e "${YELLOW}Paste GitHub token:${NC}"
read -s github_token
echo ""

if [ -z "$github_token" ]; then
    echo -e "${RED}Token tidak boleh kosong!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Token received (length: ${#github_token})${NC}"

clear
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Step 3: GitLab CI/CD Variables${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Add variables di GitLab CI/CD:"
echo ""
echo "GitLab URL:"
echo "${CYAN}https://gitlab.com/zuhryrahmani/ragam-bahasa-nusantara/-/settings/ci_cd${NC}"
echo ""
echo "Go to: Settings → CI/CD → Variables → Expand → Add variable"
echo ""
echo -e "${YELLOW}Variable 1: GITHUB_TOKEN${NC}"
echo "  Key: GITHUB_TOKEN"
echo "  Value: ${github_token:0:10}..." 
echo "  Flags: ✅ Protected, ✅ Masked"
echo ""
echo -e "${YELLOW}Variable 2: GITHUB_REPO${NC}"
echo "  Key: GITHUB_REPO"
echo "  Value: ${GITHUB_REPO}"
echo "  Flags: ✅ Protected"
echo ""
echo "Add both variables, then continue."
echo ""

read -p "Variables sudah ditambahkan? (y/n): " vars_added

if [ "$vars_added" != "y" ]; then
    echo ""
    echo "Add variables dulu, lalu run script ini lagi."
    exit 0
fi

echo -e "${GREEN}✅ GitLab CI/CD variables configured${NC}"

clear
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Step 4: Test Mirror${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Test auto-mirror dengan push test commit:"
echo ""

read -p "Create test commit and push? (y/n): " test_commit

if [ "$test_commit" == "y" ]; then
    echo ""
    echo "Creating test commit..."
    
    # Add timestamp to README
    echo "" >> README.md
    echo "<!-- Auto-mirror test: $(date) -->" >> README.md
    
    git add README.md .gitlab-ci.yml AUTO_MIRROR_SETUP.md
    git commit -m "Setup auto-mirror GitLab → GitHub"
    
    echo ""
    echo -e "${YELLOW}Pushing to GitLab...${NC}"
    git push origin $(git branch --show-current)
    
    echo ""
    echo -e "${GREEN}✅ Pushed to GitLab!${NC}"
    echo ""
    echo "Check GitLab CI/CD pipeline:"
    echo "${CYAN}https://gitlab.com/zuhryrahmani/ragam-bahasa-nusantara/-/pipelines${NC}"
    echo ""
    echo "The 'mirror:github' job should run and push to GitHub."
    echo ""
fi

clear
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Step 5: Connect Railway to GitHub${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Setup Railway to auto-deploy from GitHub:"
echo ""
echo "1. Buka: ${CYAN}https://railway.app/new${NC}"
echo ""
echo "2. Click 'Deploy from GitHub repo'"
echo ""
echo "3. Select repository: ${GREEN}${GITHUB_REPO}${NC}"
echo ""
echo "4. Configure service:"
echo "   - Root Directory: ${GREEN}backend${NC}"
echo "   - Branch: ${GREEN}$(git branch --show-current)${NC}"
echo ""
echo "5. Add environment variables (see .env.railway)"
echo ""
echo "6. Railway will auto-build and deploy!"
echo ""

read -p "Open Railway dashboard now? (y/n): " open_railway

if [ "$open_railway" == "y" ]; then
    open "https://railway.app/new"
fi

clear
echo -e "${GREEN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                       ║${NC}"
echo -e "${GREEN}║              ✅ SETUP COMPLETE! 🎉                    ║${NC}"
echo -e "${GREEN}║                                                       ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}Workflow Summary:${NC}"
echo ""
echo "  1. ✅ GitHub repository: ${GITHUB_REPO}"
echo "  2. ✅ GitHub token generated"
echo "  3. ✅ GitLab CI/CD variables configured"
echo "  4. ✅ .gitlab-ci.yml updated with mirror job"
echo "  5. ⏳ Railway setup (complete in dashboard)"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}How It Works Now:${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${GREEN}git push origin $(git branch --show-current)${NC}"
echo "      ↓ automatic"
echo "  GitLab CI/CD mirrors to GitHub"
echo "      ↓ automatic  "
echo "  Railway detects change & deploys"
echo "      ↓"
echo "  ✅ App is live!"
echo ""
echo -e "${CYAN}You only push to GitLab, everything else is AUTOMATIC! ✨${NC}"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "1. Complete Railway setup in dashboard"
echo "2. Configure environment variables in Railway"
echo "3. Test by pushing to GitLab"
echo "4. Watch Railway auto-deploy! 🚀"
echo ""
echo -e "${YELLOW}Documentation:${NC}"
echo "  📖 ${CYAN}AUTO_MIRROR_SETUP.md${NC} - Complete setup guide"
echo ""
echo -e "${GREEN}Happy deploying! 🎉${NC}"
echo ""
