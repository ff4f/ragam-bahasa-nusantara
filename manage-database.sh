#!/bin/bash

# ====================================================================
# Database (MySQL) Service Management Script
# Control: start, stop, restart, logs, backup, restore
# ====================================================================

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

SERVICE="mysql"
CONTAINER="ragam-mysql"
DB_NAME="ragam_bahasa_db"
DB_USER="rana_user"
DB_PASSWORD="secure_password"

show_help() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}Database Service Manager${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    echo "Usage: ./manage-database.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start       Start database service"
    echo "  stop        Stop database service"
    echo "  restart     Restart database service"
    echo "  logs        View database logs"
    echo "  status      Check database status"
    echo "  shell       Access MySQL shell"
    echo "  backup      Backup database"
    echo "  query       Execute custom SQL query"
    echo "  help        Show this help message"
    echo ""
}

start_service() {
    echo -e "${BLUE}🚀 Starting MySQL Database...${NC}"
    docker-compose up -d $SERVICE
    echo -e "${YELLOW}⏳ Waiting for MySQL to be healthy...${NC}"
    sleep 5
    
    # Wait for MySQL to be healthy
    MAX_WAIT=30
    COUNTER=0
    until [ "$(docker-compose ps mysql | grep 'healthy' | wc -l)" -eq 1 ] || [ $COUNTER -eq $MAX_WAIT ]; do
        echo -e "${YELLOW}   Waiting... ($COUNTER/$MAX_WAIT)${NC}"
        sleep 2
        COUNTER=$((COUNTER+1))
    done
    
    if [ $COUNTER -eq $MAX_WAIT ]; then
        echo -e "${RED}❌ MySQL failed to start properly${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ MySQL is ready and healthy!${NC}"
    echo -e "${BLUE}MySQL Port: 3306${NC}"
}

stop_service() {
    echo -e "${YELLOW}🛑 Stopping MySQL Database...${NC}"
    echo -e "${YELLOW}⚠️  Warning: This will stop the database. Backend will not work.${NC}"
    read -p "Continue? (y/N) " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose stop $SERVICE
        echo -e "${GREEN}✅ MySQL stopped${NC}"
    else
        echo -e "${BLUE}Cancelled${NC}"
    fi
}

restart_service() {
    echo -e "${YELLOW}🔄 Restarting MySQL Database...${NC}"
    docker-compose restart $SERVICE
    echo -e "${YELLOW}⏳ Waiting for MySQL to be healthy...${NC}"
    sleep 5
    
    # Wait for healthy status
    COUNTER=0
    until [ "$(docker-compose ps mysql | grep 'healthy' | wc -l)" -eq 1 ] || [ $COUNTER -eq 15 ]; do
        echo -e "${YELLOW}   Waiting... ($COUNTER/15)${NC}"
        sleep 2
        COUNTER=$((COUNTER+1))
    done
    
    if [ $COUNTER -eq 15 ]; then
        echo -e "${YELLOW}⚠️  MySQL may need more time to be ready${NC}"
    else
        echo -e "${GREEN}✅ MySQL restarted and healthy!${NC}"
    fi
}

view_logs() {
    echo -e "${BLUE}📋 MySQL Logs (Ctrl+C to exit)${NC}"
    echo ""
    docker-compose logs -f $SERVICE
}

check_status() {
    echo -e "${BLUE}📊 Database Status:${NC}"
    echo ""
    docker-compose ps $SERVICE
    echo ""
    
    # Check if container is running
    if [ "$(docker ps -q -f name=$CONTAINER)" ]; then
        echo -e "${GREEN}✅ MySQL container is running${NC}"
        
        # Check if healthy
        if docker-compose ps mysql | grep -q "healthy"; then
            echo -e "${GREEN}✅ MySQL is healthy${NC}"
            
            # Get database info
            echo ""
            echo -e "${BLUE}Database Info:${NC}"
            docker-compose exec mysql mysql -u$DB_USER -p$DB_PASSWORD -e "SHOW DATABASES;" 2>/dev/null | grep $DB_NAME && \
                echo -e "${GREEN}✅ Database '$DB_NAME' exists${NC}"
            
            # Count tables
            TABLE_COUNT=$(docker-compose exec mysql mysql -u$DB_USER -p$DB_PASSWORD -D$DB_NAME -e "SHOW TABLES;" 2>/dev/null | wc -l)
            echo -e "${BLUE}Tables: $((TABLE_COUNT - 1))${NC}"
            
            echo ""
            echo -e "${BLUE}Connection Info:${NC}"
            echo -e "  Host: localhost"
            echo -e "  Port: 3306"
            echo -e "  Database: $DB_NAME"
            echo -e "  User: $DB_USER"
        else
            echo -e "${YELLOW}⚠️  MySQL is starting up...${NC}"
        fi
    else
        echo -e "${RED}❌ MySQL is not running${NC}"
    fi
}

access_shell() {
    echo -e "${BLUE}🐚 Accessing MySQL Shell...${NC}"
    echo -e "${YELLOW}Type 'exit' to leave the shell${NC}"
    echo ""
    docker-compose exec mysql mysql -u$DB_USER -p$DB_PASSWORD $DB_NAME
}

backup_database() {
    echo -e "${BLUE}💾 Creating Database Backup...${NC}"
    
    BACKUP_DIR="./backups"
    mkdir -p $BACKUP_DIR
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_backup_${TIMESTAMP}.sql"
    
    docker-compose exec -T mysql mysqldump -u$DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_FILE
    
    if [ -f $BACKUP_FILE ]; then
        FILE_SIZE=$(du -h $BACKUP_FILE | cut -f1)
        echo -e "${GREEN}✅ Backup created successfully!${NC}"
        echo -e "${BLUE}File: $BACKUP_FILE${NC}"
        echo -e "${BLUE}Size: $FILE_SIZE${NC}"
    else
        echo -e "${RED}❌ Backup failed${NC}"
    fi
}

execute_query() {
    echo -e "${BLUE}💻 Execute SQL Query${NC}"
    echo -e "${YELLOW}Enter your SQL query (or 'cancel' to abort):${NC}"
    read -p "SQL> " query
    
    if [ "$query" = "cancel" ]; then
        echo -e "${BLUE}Cancelled${NC}"
        return
    fi
    
    echo ""
    echo -e "${BLUE}Executing query...${NC}"
    docker-compose exec mysql mysql -u$DB_USER -p$DB_PASSWORD -D$DB_NAME -e "$query"
}

# Main
case "$1" in
    start)
        start_service
        ;;
    stop)
        stop_service
        ;;
    restart)
        restart_service
        ;;
    logs)
        view_logs
        ;;
    status)
        check_status
        ;;
    shell)
        access_shell
        ;;
    backup)
        backup_database
        ;;
    query)
        execute_query
        ;;
    help|--help|-h|"")
        show_help
        ;;
    *)
        echo -e "${RED}❌ Unknown command: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
