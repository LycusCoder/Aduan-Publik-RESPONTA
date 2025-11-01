#!/bin/bash

# RESPONTA - Quick Setup Verification Script
# This script verifies that all required components are properly set up
# Automatically reads database credentials from .env file

echo "========================================"
echo "  RESPONTA Setup Verification"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to read .env file
get_env_value() {
    local key=$1
    local env_file=".env"
    
    if [ -f "$env_file" ]; then
        # Read value from .env, handle quotes and comments
        value=$(grep "^${key}=" "$env_file" | cut -d '=' -f2- | sed 's/^"//;s/"$//' | sed "s/^'//;s/'$//" | sed 's/#.*//' | xargs)
        echo "$value"
    else
        echo ""
    fi
}

# Function to mask password for display
mask_password() {
    local password=$1
    if [ -z "$password" ]; then
        echo "(empty)"
    elif [ ${#password} -le 2 ]; then
        echo "**"
    else
        echo "$(echo "$password" | head -c 2)****"
    fi
}

# Check PHP
echo -n "Checking PHP... "
if command -v php &> /dev/null; then
    PHP_VERSION=$(php -r "echo PHP_VERSION;")
    echo -e "${GREEN}✓ PHP ${PHP_VERSION}${NC}"
else
    echo -e "${RED}✗ PHP not found${NC}"
    exit 1
fi

# Check Composer
echo -n "Checking Composer... "
if command -v composer &> /dev/null; then
    COMPOSER_VERSION=$(composer --version | cut -d' ' -f3)
    echo -e "${GREEN}✓ Composer ${COMPOSER_VERSION}${NC}"
else
    echo -e "${RED}✗ Composer not found${NC}"
    exit 1
fi

# Check MySQL/MariaDB
echo -n "Checking MySQL/MariaDB... "
if command -v mysql &> /dev/null; then
    MYSQL_VERSION=$(mysql --version | awk '{print $3}')
    echo -e "${GREEN}✓ MySQL ${MYSQL_VERSION}${NC}"
    
    # Check if service is running
    if service mariadb status > /dev/null 2>&1 || service mysql status > /dev/null 2>&1; then
        echo -e "  ${GREEN}✓ Service is running${NC}"
    else
        echo -e "  ${YELLOW}! Service not running. Start with: service mariadb start${NC}"
    fi
else
    echo -e "${RED}✗ MySQL not found${NC}"
    exit 1
fi

# Check .env file
echo -n "Checking .env file... "
if [ -f .env ]; then
    echo -e "${GREEN}✓ Found${NC}"
    
    # Check if APP_KEY is set
    APP_KEY=$(get_env_value "APP_KEY")
    if [[ "$APP_KEY" == base64:* ]]; then
        echo -e "  ${GREEN}✓ APP_KEY is set${NC}"
    else
        echo -e "  ${YELLOW}! APP_KEY not set. Run: php artisan key:generate${NC}"
    fi
    
    # Read database configuration
    echo -e "\n${BLUE}📊 Database Configuration (from .env):${NC}"
    DB_CONNECTION=$(get_env_value "DB_CONNECTION")
    DB_HOST=$(get_env_value "DB_HOST")
    DB_PORT=$(get_env_value "DB_PORT")
    DB_DATABASE=$(get_env_value "DB_DATABASE")
    DB_USERNAME=$(get_env_value "DB_USERNAME")
    DB_PASSWORD=$(get_env_value "DB_PASSWORD")
    
    echo -e "  Connection: ${GREEN}$DB_CONNECTION${NC}"
    echo -e "  Host: ${GREEN}$DB_HOST:$DB_PORT${NC}"
    echo -e "  Database: ${GREEN}$DB_DATABASE${NC}"
    echo -e "  Username: ${GREEN}$DB_USERNAME${NC}"
    echo -e "  Password: ${GREEN}$(mask_password "$DB_PASSWORD")${NC}"
    echo ""
else
    echo -e "${RED}✗ Not found${NC}"
    echo -e "  ${YELLOW}Copy from .env.example: cp .env.example .env${NC}"
    exit 1
fi

# Check database connection
echo -n "Checking database connection... "
if [ -z "$DB_DATABASE" ]; then
    echo -e "${RED}✗ DB_DATABASE not set in .env${NC}"
    exit 1
fi

# Build MySQL connection command based on .env
MYSQL_CMD="mysql"
[ -n "$DB_HOST" ] && [ "$DB_HOST" != "127.0.0.1" ] && MYSQL_CMD="$MYSQL_CMD -h $DB_HOST"
[ -n "$DB_PORT" ] && [ "$DB_PORT" != "3306" ] && MYSQL_CMD="$MYSQL_CMD -P $DB_PORT"
[ -n "$DB_USERNAME" ] && MYSQL_CMD="$MYSQL_CMD -u $DB_USERNAME"
[ -n "$DB_PASSWORD" ] && MYSQL_CMD="$MYSQL_CMD -p$DB_PASSWORD"

# Test connection
if $MYSQL_CMD -e "SELECT 1;" &> /dev/null; then
    echo -e "${GREEN}✓ Connected successfully${NC}"
    
    # Check if database exists
    echo -n "Checking database '$DB_DATABASE'... "
    if $MYSQL_CMD -e "USE $DB_DATABASE;" &> /dev/null; then
        echo -e "${GREEN}✓ Exists${NC}"
        
        # Count tables
        TABLE_COUNT=$($MYSQL_CMD $DB_DATABASE -e "SHOW TABLES;" 2>/dev/null | wc -l)
        TABLE_COUNT=$((TABLE_COUNT - 1)) # Remove header
        
        if [ $TABLE_COUNT -gt 0 ]; then
            echo -e "  ${GREEN}✓ $TABLE_COUNT tables found${NC}"
            
            # Check for key tables
            echo -n "  Checking key tables... "
            REQUIRED_TABLES=("users" "kategori_aduan" "aduan" "foto_aduan")
            MISSING_TABLES=()
            
            for table in "${REQUIRED_TABLES[@]}"; do
                if ! $MYSQL_CMD $DB_DATABASE -e "SHOW TABLES LIKE '$table';" 2>/dev/null | grep -q "$table"; then
                    MISSING_TABLES+=("$table")
                fi
            done
            
            if [ ${#MISSING_TABLES[@]} -eq 0 ]; then
                echo -e "${GREEN}✓ All key tables exist${NC}"
            else
                echo -e "${YELLOW}! Missing: ${MISSING_TABLES[*]}${NC}"
                echo -e "    ${YELLOW}Run: php artisan migrate${NC}"
            fi
        else
            echo -e "  ${YELLOW}! No tables found${NC}"
            echo -e "    ${YELLOW}Run: php artisan migrate --seed${NC}"
        fi
    else
        echo -e "${YELLOW}! Not found${NC}"
        echo -e "  ${YELLOW}Create with: mysql -u $DB_USERNAME -p -e \"CREATE DATABASE $DB_DATABASE;\"${NC}"
    fi
else
    echo -e "${RED}✗ Connection failed${NC}"
    echo -e "  ${RED}Check your database credentials in .env${NC}"
    echo -e "  ${RED}Make sure MySQL/MariaDB service is running${NC}"
    echo -e "  ${YELLOW}User: $DB_USERNAME | Host: $DB_HOST:$DB_PORT${NC}"
    exit 1
fi

# Check vendor directory
echo -n "Checking dependencies... "
if [ -d vendor ]; then
    echo -e "${GREEN}✓ Vendor directory exists${NC}"
else
    echo -e "${YELLOW}! Run: composer install${NC}"
fi

# Check key models
echo -n "Checking models... "
MODELS=("User" "KategoriAduan" "Aduan" "FotoAduan")
MISSING=0
for model in "${MODELS[@]}"; do
    if [ ! -f "app/Models/$model.php" ]; then
        echo -e "${RED}✗ $model.php not found${NC}"
        MISSING=1
    fi
done
if [ $MISSING -eq 0 ]; then
    echo -e "${GREEN}✓ All 4 models exist${NC}"
fi

# Check migrations
echo -n "Checking migrations... "
MIGRATION_COUNT=$(ls -1 database/migrations/*.php 2>/dev/null | wc -l)
if [ $MIGRATION_COUNT -ge 8 ]; then
    echo -e "${GREEN}✓ $MIGRATION_COUNT migrations found${NC}"
else
    echo -e "${YELLOW}! Only $MIGRATION_COUNT migrations found (expected 8+)${NC}"
fi

# Check documentation
echo -n "Checking documentation... "
DOCS=("docs/golden-rules.md" "docs/DATABASE_SCHEMA.md" "docs/API_DOCUMENTATION.md")
MISSING_DOCS=0
for doc in "${DOCS[@]}"; do
    if [ ! -f "$doc" ]; then
        echo -e "${RED}✗ $doc not found${NC}"
        MISSING_DOCS=1
    fi
done
if [ $MISSING_DOCS -eq 0 ]; then
    echo -e "${GREEN}✓ All key docs exist${NC}"
fi

echo ""
echo "========================================"
echo "  Verification Complete!"
echo "========================================"
echo ""
echo "📚 Key Documentation:"
echo "  - README.md"
echo "  - docs/golden-rules.md ⭐"
echo "  - docs/DATABASE_SCHEMA.md"
echo ""
echo "🔧 Useful Commands:"
echo "  php artisan migrate --seed   # Setup database"
echo "  php artisan serve            # Start server"
echo "  php artisan tinker           # Interactive REPL"
echo ""
echo "💡 Database Info:"
echo "  Connection: $DB_CONNECTION://$DB_HOST:$DB_PORT"
echo "  Database: $DB_DATABASE"
echo "  Username: $DB_USERNAME"
echo ""
