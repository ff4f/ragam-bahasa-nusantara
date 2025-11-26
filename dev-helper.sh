#!/bin/bash

# ====================================================================
# RANA Development Helper
# Menu interaktif untuk manage semua services
# ====================================================================

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

show_header() {
    clear
    echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║                                                           ║${NC}"
    echo -e "${CYAN}║         🚀 RANA - Development Helper Menu 🚀              ║${NC}"
    echo -e "${CYAN}║     Ragam Bahasa Nusantara - Monolith Mode                ║${NC}"
    echo -e "${CYAN}║                                                           ║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

show_menu() {
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  Service Management${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "  ${GREEN}1.${NC} 🚀 Start All Services (Monolith)"
    echo -e "  ${GREEN}2.${NC} 🛑 Stop All Services"
    echo -e "  ${GREEN}3.${NC} 🔄 Restart All Services"
    echo -e "  ${GREEN}4.${NC} 📊 Check Services Status"
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  Logs & Monitoring${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "  ${YELLOW}5.${NC} 📋 View Logs (Interactive)"
    echo -e "  ${YELLOW}6.${NC} 📄 View Backend Logs"
    echo -e "  ${YELLOW}7.${NC} 📄 View Frontend Logs"
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  Quick Actions${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "  ${CYAN}8.${NC} 🌐 Open Frontend (Browser)"
    echo -e "  ${CYAN}9.${NC} 📚 Open API Docs (Browser)"
    echo -e "  ${CYAN}10.${NC} ❤️  Check Backend Health"
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  Documentation${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "  ${CYAN}11.${NC} 📖 Quick Start Guide"
    echo -e "  ${CYAN}12.${NC} 📖 Full Documentation"
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "  ${RED}0.${NC} 🚪 Exit"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo ""
}

wait_for_key() {
    echo ""
    echo -e "${YELLOW}Press any key to continue...${NC}"
    read -n 1 -s
}

# Main loop
while true; do
    show_header
    show_menu
    
    read -p "$(echo -e ${CYAN}Choose an option: ${NC})" choice
    echo ""
    
    case $choice in
        1)
            echo -e "${GREEN}🚀 Starting all services...${NC}"
            echo ""
            ./run-monolith.sh
            wait_for_key
            ;;
        2)
            echo -e "${YELLOW}🛑 Stopping all services...${NC}"
            echo ""
            ./stop-monolith.sh
            wait_for_key
            ;;
        3)
            echo -e "${YELLOW}🔄 Restarting all services...${NC}"
            echo ""
            ./restart-monolith.sh
            wait_for_key
            ;;
        4)
            echo -e "${BLUE}📊 Checking services status...${NC}"
            echo ""
            ./status-monolith.sh
            wait_for_key
            ;;
        5)
            echo -e "${BLUE}📋 Opening log viewer...${NC}"
            echo ""
            ./view-logs.sh
            ;;
        6)
            echo -e "${BLUE}📄 Backend Logs (Ctrl+C to exit)${NC}"
            echo ""
            tail -f logs/backend.log
            ;;
        7)
            echo -e "${BLUE}📄 Frontend Logs (Ctrl+C to exit)${NC}"
            echo ""
            tail -f logs/frontend.log
            ;;
        8)
            echo -e "${GREEN}🌐 Opening Frontend in browser...${NC}"
            open http://localhost:5173
            echo -e "${GREEN}✅ Browser opened${NC}"
            wait_for_key
            ;;
        9)
            echo -e "${GREEN}📚 Opening API Documentation...${NC}"
            open http://localhost:8000/api/docs
            echo -e "${GREEN}✅ Browser opened${NC}"
            wait_for_key
            ;;
        10)
            echo -e "${BLUE}❤️  Checking Backend Health...${NC}"
            echo ""
            HEALTH=$(curl -s http://localhost:8000/health 2>/dev/null)
            if [ $? -eq 0 ]; then
                echo -e "${GREEN}✅ Backend is healthy!${NC}"
                echo -e "${BLUE}Response: $HEALTH${NC}"
            else
                echo -e "${RED}❌ Backend is not responding${NC}"
                echo -e "${YELLOW}Make sure backend is running: ./run-monolith.sh${NC}"
            fi
            wait_for_key
            ;;
        11)
            echo -e "${BLUE}📖 Quick Start Guide${NC}"
            echo ""
            cat QUICK_START_MONOLITH.md
            wait_for_key
            ;;
        12)
            echo -e "${BLUE}📖 Opening Full Documentation...${NC}"
            if command -v less &> /dev/null; then
                less MONOLITH_DEPLOYMENT.md
            else
                cat MONOLITH_DEPLOYMENT.md
                wait_for_key
            fi
            ;;
        0)
            echo -e "${GREEN}👋 Goodbye!${NC}"
            echo ""
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Invalid option. Please choose 0-12.${NC}"
            wait_for_key
            ;;
    esac
done
