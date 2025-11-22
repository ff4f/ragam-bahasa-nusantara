#!/bin/bash

# Auto-Diagnostic: Check Mirror Status Without User Input
# This script automatically checks the mirror configuration

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
BLUE='\033[0;34m'
NC='\033[0m'

clear
echo -e "${CYAN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                       ║${NC}"
echo -e "${CYAN}║       🔍 AUTO-MIRROR DIAGNOSTIC REPORT                ║${NC}"
echo -e "${CYAN}║                                                       ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""

GITLAB_PROJECT="zuhryrahmani/ragam-bahasa-nusantara"
GITHUB_REPO="ff4f/ragam-bahasa-nusantara"
BRANCH="feature/integrated"

echo -e "${BLUE}Configuration:${NC}"
echo "  GitLab: ${GITLAB_PROJECT}"
echo "  GitHub: ${GITHUB_REPO}"
echo "  Branch: ${BRANCH}"
echo ""

# Check .gitlab-ci.yml
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}1. Checking .gitlab-ci.yml${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ -f ".gitlab-ci.yml" ]; then
    echo -e "  ${GREEN}✅${NC} .gitlab-ci.yml exists"
    
    # Check for mirror stage
    if grep -q "stage: mirror" .gitlab-ci.yml; then
        echo -e "  ${GREEN}✅${NC} Mirror stage configured"
    else
        echo -e "  ${RED}❌${NC} Mirror stage NOT found"
    fi
    
    # Check for mirror:github job
    if grep -q "mirror:github" .gitlab-ci.yml; then
        echo -e "  ${GREEN}✅${NC} mirror:github job exists"
    else
        echo -e "  ${RED}❌${NC} mirror:github job NOT found"
    fi
    
    # Check if feature/integrated is in only
    if grep -A5 "mirror:github" .gitlab-ci.yml | grep -q "feature/integrated"; then
        echo -e "  ${GREEN}✅${NC} Branch 'feature/integrated' included in mirror job"
    else
        echo -e "  ${YELLOW}⚠️${NC}  Branch 'feature/integrated' MAY not be in mirror job"
    fi
else
    echo -e "  ${RED}❌${NC} .gitlab-ci.yml NOT found!"
fi

echo ""

# Check Git remotes
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}2. Checking Git Remotes${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if git remote | grep -q "origin"; then
    echo -e "  ${GREEN}✅${NC} GitLab remote 'origin' configured"
    echo "     $(git remote get-url origin)"
else
    echo -e "  ${RED}❌${NC} GitLab remote NOT configured"
fi

if git remote | grep -q "github"; then
    echo -e "  ${GREEN}✅${NC} GitHub remote 'github' exists"
    echo "     $(git remote get-url github)"
    echo -e "  ${BLUE}ℹ️${NC}  Manual push available: git push github ${BRANCH}"
else
    echo -e "  ${YELLOW}⚠️${NC}  GitHub remote NOT configured (not required for CI/CD)"
    echo -e "  ${BLUE}ℹ️${NC}  To add: git remote add github https://github.com/${GITHUB_REPO}.git"
fi

echo ""

# Check current branch
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}3. Current Branch Status${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

CURRENT_BRANCH=$(git branch --show-current)
echo "  Current branch: ${GREEN}${CURRENT_BRANCH}${NC}"

if [ "$CURRENT_BRANCH" == "$BRANCH" ]; then
    echo -e "  ${GREEN}✅${NC} On correct branch"
else
    echo -e "  ${YELLOW}⚠️${NC}  Expected: ${BRANCH}"
    echo -e "  ${BLUE}ℹ️${NC}  Run: git checkout ${BRANCH}"
fi

# Check if up to date with remote
if git status | grep -q "Your branch is up to date"; then
    echo -e "  ${GREEN}✅${NC} Branch is up to date with remote"
elif git status | grep -q "Your branch is ahead"; then
    echo -e "  ${YELLOW}⚠️${NC}  Local changes not pushed"
    echo -e "  ${BLUE}ℹ️${NC}  Run: git push origin ${CURRENT_BRANCH}"
elif git status | grep -q "Your branch is behind"; then
    echo -e "  ${YELLOW}⚠️${NC}  Local branch is behind remote"
    echo -e "  ${BLUE}ℹ️${NC}  Run: git pull origin ${CURRENT_BRANCH}"
fi

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo -e "  ${YELLOW}⚠️${NC}  Uncommitted changes detected"
    echo -e "  ${BLUE}ℹ️${NC}  Run: git add . && git commit -m 'message'"
else
    echo -e "  ${GREEN}✅${NC} No uncommitted changes"
fi

echo ""

# Check latest commit
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}4. Latest Commit Info${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

LAST_COMMIT=$(git log -1 --pretty=format:"%h - %s (%cr)")
echo "  ${LAST_COMMIT}"
echo ""

# Summary
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}5. Next Steps${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${BLUE}To check GitLab pipeline:${NC}"
echo "  https://gitlab.com/${GITLAB_PROJECT}/-/pipelines"
echo ""

echo -e "${BLUE}To check GitHub repository:${NC}"
echo "  https://github.com/${GITHUB_REPO}"
echo ""

echo -e "${BLUE}To manually push to GitHub:${NC}"
if ! git remote | grep -q "github"; then
    echo "  git remote add github https://github.com/${GITHUB_REPO}.git"
fi
echo "  git push github ${BRANCH}"
echo ""

echo -e "${BLUE}To trigger GitLab pipeline manually:${NC}"
echo "  1. Go to: https://gitlab.com/${GITLAB_PROJECT}/-/pipelines"
echo "  2. Click 'Run pipeline'"
echo "  3. Select branch: ${BRANCH}"
echo "  4. Click 'Run pipeline'"
echo ""

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Common Issues & Fixes:${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${RED}Problem:${NC} GitHub repository still empty"
echo -e "${GREEN}Fix:${NC}"
echo "  1. Check GitLab CI/CD variables are set correctly"
echo "  2. Enable GitLab shared runners (Settings → CI/CD → Runners)"
echo "  3. Make branch '${BRANCH}' protected (if using protected variables)"
echo "  4. Manual push: git push github ${BRANCH}"
echo ""

echo -e "${RED}Problem:${NC} Pipeline not running"
echo -e "${GREEN}Fix:${NC}"
echo "  1. Enable shared runners in project settings"
echo "  2. Check .gitlab-ci.yml syntax"
echo "  3. Trigger pipeline manually"
echo ""

echo -e "${RED}Problem:${NC} Mirror job failed with auth error"
echo -e "${GREEN}Fix:${NC}"
echo "  1. Regenerate GitHub token with 'repo' scope"
echo "  2. Update GITHUB_TOKEN in GitLab CI/CD variables"
echo "  3. Verify GITHUB_REPO format: username/repo-name"
echo ""

echo -e "${CYAN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                       ║${NC}"
echo -e "${CYAN}║            🔍 DIAGNOSTIC COMPLETE                     ║${NC}"
echo -e "${CYAN}║                                                       ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""
