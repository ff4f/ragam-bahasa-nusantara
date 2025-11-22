#!/bin/bash

# Railway Deployment Script
# This script helps you deploy to Railway from local machine

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Railway Deployment Script${NC}"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI is not installed${NC}"
    echo -e "${YELLOW}Installing Railway CLI...${NC}"
    npm install -g @railway/cli
    echo -e "${GREEN}✅ Railway CLI installed${NC}"
fi

# Function to show menu
show_menu() {
    echo ""
    echo "Select an option:"
    echo "1) Login to Railway"
    echo "2) Initialize/Link Railway Project"
    echo "3) Setup Environment Variables"
    echo "4) Deploy Backend"
    echo "5) Deploy Frontend"
    echo "6) Deploy All Services"
    echo "7) View Logs"
    echo "8) Check Status"
    echo "9) Open Railway Dashboard"
    echo "10) Setup MySQL Database"
    echo "0) Exit"
    echo ""
    read -p "Enter your choice: " choice
}

# Login to Railway
login_railway() {
    echo -e "${YELLOW}Logging in to Railway...${NC}"
    railway login
    echo -e "${GREEN}✅ Successfully logged in${NC}"
}

# Initialize or link project
init_project() {
    echo ""
    echo "1) Create new Railway project"
    echo "2) Link to existing project"
    read -p "Enter your choice: " proj_choice
    
    if [ "$proj_choice" == "1" ]; then
        echo -e "${YELLOW}Creating new Railway project...${NC}"
        railway init
    else
        echo -e "${YELLOW}Linking to existing project...${NC}"
        read -p "Enter your Railway Project ID: " project_id
        railway link $project_id
    fi
    echo -e "${GREEN}✅ Project setup complete${NC}"
}

# Setup environment variables
setup_env() {
    echo -e "${YELLOW}Setting up environment variables...${NC}"
    echo ""
    echo "You can either:"
    echo "1) Set variables one by one"
    echo "2) Upload from .env file"
    echo "3) Open Railway dashboard to set manually"
    read -p "Enter your choice: " env_choice
    
    if [ "$env_choice" == "1" ]; then
        # Set variables one by one
        read -p "Enter SECRET_KEY: " secret_key
        railway variables set SECRET_KEY="$secret_key"
        
        read -p "Enter DATABASE_URL: " database_url
        railway variables set DATABASE_URL="$database_url"
        
        railway variables set ALGORITHM="HS256"
        railway variables set ACCESS_TOKEN_EXPIRE_MINUTES="30"
        railway variables set DEBUG="False"
        
        echo -e "${GREEN}✅ Environment variables set${NC}"
    elif [ "$env_choice" == "2" ]; then
        if [ -f ".env" ]; then
            echo -e "${YELLOW}Uploading .env file...${NC}"
            # Parse .env and set variables
            while IFS='=' read -r key value; do
                # Skip comments and empty lines
                if [[ ! $key =~ ^# && -n $key ]]; then
                    # Remove quotes if present
                    value=$(echo "$value" | sed -e 's/^"//' -e 's/"$//')
                    railway variables set "$key=$value"
                fi
            done < .env
            echo -e "${GREEN}✅ Environment variables uploaded${NC}"
        else
            echo -e "${RED}❌ .env file not found${NC}"
        fi
    else
        railway open
    fi
}

# Deploy backend
deploy_backend() {
    echo -e "${YELLOW}Deploying backend to Railway...${NC}"
    cd backend
    railway up
    cd ..
    echo -e "${GREEN}✅ Backend deployed successfully${NC}"
}

# Deploy frontend
deploy_frontend() {
    echo -e "${YELLOW}Deploying frontend to Railway...${NC}"
    railway up
    echo -e "${GREEN}✅ Frontend deployed successfully${NC}"
}

# Deploy all services
deploy_all() {
    echo -e "${YELLOW}Deploying all services to Railway...${NC}"
    deploy_backend
    deploy_frontend
    echo -e "${GREEN}✅ All services deployed${NC}"
}

# View logs
view_logs() {
    echo ""
    echo "1) Backend logs"
    echo "2) Frontend logs"
    read -p "Enter your choice: " log_choice
    
    if [ "$log_choice" == "1" ]; then
        railway logs --service backend
    else
        railway logs --service frontend
    fi
}

# Check status
check_status() {
    echo -e "${YELLOW}Checking Railway status...${NC}"
    railway status
    echo ""
    railway variables
}

# Open dashboard
open_dashboard() {
    echo -e "${YELLOW}Opening Railway dashboard...${NC}"
    railway open
}

# Setup MySQL
setup_mysql() {
    echo -e "${YELLOW}Setting up MySQL database...${NC}"
    echo ""
    echo "Railway will provision a MySQL database."
    echo "This will automatically set DATABASE_URL environment variable."
    echo ""
    read -p "Continue? (y/n): " confirm
    
    if [ "$confirm" == "y" ]; then
        railway add
        echo -e "${GREEN}✅ MySQL database added${NC}"
        echo -e "${YELLOW}Database credentials:${NC}"
        railway variables | grep DATABASE
    fi
}

# Main loop
while true; do
    show_menu
    
    case $choice in
        1) login_railway ;;
        2) init_project ;;
        3) setup_env ;;
        4) deploy_backend ;;
        5) deploy_frontend ;;
        6) deploy_all ;;
        7) view_logs ;;
        8) check_status ;;
        9) open_dashboard ;;
        10) setup_mysql ;;
        0) 
            echo -e "${GREEN}👋 Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid option${NC}"
            ;;
    esac
done
