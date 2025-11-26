#!/bin/bash

# ====================================================================
# RANA Service Logs Viewer
# View semua logs dalam satu tampilan
# ====================================================================

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Log files
LOG_DIR="logs"
BACKEND_LOG="$LOG_DIR/backend.log"
FRONTEND_LOG="$LOG_DIR/frontend.log"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}📋 RANA - Logs Viewer${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}Pilih log yang ingin dilihat:${NC}"
echo -e "  ${BLUE}1.${NC} Backend Log"
echo -e "  ${BLUE}2.${NC} Frontend Log"
echo -e "  ${BLUE}3.${NC} Both (split screen)"
echo -e "  ${BLUE}4.${NC} Both (sequential)"
echo ""
read -p "Pilihan (1-4): " choice

case $choice in
    1)
        echo -e "${BLUE}📋 Backend Log (Ctrl+C to exit)${NC}"
        echo ""
        tail -f "$BACKEND_LOG"
        ;;
    2)
        echo -e "${BLUE}📋 Frontend Log (Ctrl+C to exit)${NC}"
        echo ""
        tail -f "$FRONTEND_LOG"
        ;;
    3)
        echo -e "${BLUE}📋 Both Logs - Split Screen${NC}"
        echo -e "${YELLOW}Note: Requires 'screen' or 'tmux'. Using multitail...${NC}"
        if command -v multitail &> /dev/null; then
            multitail "$BACKEND_LOG" "$FRONTEND_LOG"
        else
            echo -e "${RED}multitail not installed. Install with: brew install multitail${NC}"
            echo -e "${YELLOW}Showing sequential instead...${NC}"
            tail -f "$BACKEND_LOG" "$FRONTEND_LOG"
        fi
        ;;
    4)
        echo -e "${BLUE}📋 Both Logs - Sequential (Ctrl+C to exit)${NC}"
        echo ""
        tail -f "$BACKEND_LOG" "$FRONTEND_LOG"
        ;;
    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac
