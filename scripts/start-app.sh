#!/bin/bash

# 🚀 RESPONTA - Start Application Script
# This script verifies setup and starts the Laravel + React application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                ║${NC}"
echo -e "${BLUE}║   🚀 RESPONTA - Application Startup Script    ║${NC}"
echo -e "${BLUE}║   Sistem Pelaporan Aduan Warga                ║${NC}"
echo -e "${BLUE}║                                                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Auto-detect project root directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Change to project root
cd "$PROJECT_ROOT"

echo -e "${GREEN}📁 Project Directory:${NC} $PROJECT_ROOT"
echo ""

echo -e "${YELLOW}📋 Step 1: System Requirements Check${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check PHP
if command -v php &> /dev/null; then
    PHP_VERSION=$(php -v | head -n 1 | cut -d " " -f 2 | cut -d "." -f 1,2)
    echo -e "${GREEN}✓${NC} PHP $PHP_VERSION installed"
else
    echo -e "${RED}✗${NC} PHP not found. Installing..."
    apt-get update && apt-get install -y php php-cli php-mbstring php-xml php-zip php-mysql
fi

# Check Composer
if command -v composer &> /dev/null; then
    COMPOSER_VERSION=$(composer --version | cut -d " " -f 3)
    echo -e "${GREEN}✓${NC} Composer $COMPOSER_VERSION installed"
else
    echo -e "${RED}✗${NC} Composer not found. Installing..."
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
fi

# Check Node.js & Yarn
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js $NODE_VERSION installed"
else
    echo -e "${RED}✗${NC} Node.js not found. Please install Node.js 18+"
    exit 1
fi

if command -v yarn &> /dev/null; then
    YARN_VERSION=$(yarn -v)
    echo -e "${GREEN}✓${NC} Yarn $YARN_VERSION installed"
else
    echo -e "${YELLOW}⚠${NC}  Yarn not found. Installing..."
    npm install -g yarn
fi

echo ""

echo -e "${YELLOW}📋 Step 2: Environment Setup${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check and create .env file
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        echo -e "${YELLOW}⚠${NC}  .env file not found. Copying from .env.example..."
        cp .env.example .env
        echo -e "${GREEN}✓${NC} .env file created"
    else
        echo -e "${RED}✗${NC} .env.example not found. Cannot create .env file"
        exit 1
    fi
else
    echo -e "${GREEN}✓${NC} .env file exists"
fi

# Pastikan Application Key ada dan konfigurasi di-refresh (FIX MISSING_APP_KEY_EXCEPTION)
echo -e "${BLUE}🔑 Ensuring application key is generated...${NC}"
php artisan key:generate --force > /dev/null 2>&1
echo -e "${GREEN}✓${NC} Application key verified/generated"

# Clear config cache agar kunci baru langsung terbaca oleh seeder di Step 3
echo -e "${BLUE}🧹 Clearing configuration cache...${NC}"
php artisan config:clear > /dev/null 2>&1
echo -e "${GREEN}✓${NC} Config cache cleared"

echo ""

echo -e "${YELLOW}📋 Step 3: Database Connection Check${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Ask if user wants to setup database
echo -e "${BLUE}❓ Do you want to setup/check database connection? (y/n)${NC} [default: y]"
read -t 10 -n 1 DB_SETUP_CHOICE
echo ""

if [ "$DB_SETUP_CHOICE" = "n" ] || [ "$DB_SETUP_CHOICE" = "N" ]; then
    echo -e "${YELLOW}⚠${NC}  Skipping database setup"
    echo -e "${BLUE}ℹ${NC}  You can setup database manually later:"
    echo "   1. Create database: mysql -u root -e 'CREATE DATABASE responta;'"
    echo "   2. Run migrations: php artisan migrate"
    echo "   3. Seed database: php artisan db:seed"
else
    # Start MySQL/MariaDB if not running
    if ! service mariadb status &> /dev/null; then
        if ! service mysql status &> /dev/null; then
            echo -e "${YELLOW}⚠${NC}  MySQL/MariaDB not running. Please start it manually:"
            echo "   macOS: brew services start mariadb"
            echo "   Linux: sudo systemctl start mysql"
            echo ""
            echo -e "${BLUE}❓ Continue without database? (y/n)${NC}"
            read -t 10 -n 1 SKIP_DB
            echo ""
            if [ "$SKIP_DB" = "y" ] || [ "$SKIP_DB" = "Y" ]; then
                echo -e "${YELLOW}⚠${NC}  Skipping database setup"
            else
                exit 1
            fi
        else
            echo -e "${GREEN}✓${NC} MySQL is running"
        fi
    else
        echo -e "${GREEN}✓${NC} MariaDB is running"
    fi

    # Read database config from .env (only active lines, no comments)
    if [ -f .env ]; then
        DB_DATABASE=$(grep -E "^DB_DATABASE=" .env | cut -d '=' -f2- | tr -d '"' | tr -d "'")
        DB_USERNAME=$(grep -E "^DB_USERNAME=" .env | cut -d '=' -f2- | tr -d '"' | tr -d "'")
        DB_HOST=$(grep -E "^DB_HOST=" .env | cut -d '=' -f2- | tr -d '"' | tr -d "'")
        DB_PORT=$(grep -E "^DB_PORT=" .env | cut -d '=' -f2- | tr -d '"' | tr -d "'")
        DB_PASSWORD=$(grep -E "^DB_PASSWORD=" .env | cut -d '=' -f2- | tr -d '"' | tr -d "'")
        
        echo -e "${BLUE}📊 Database Configuration:${NC}"
        echo "   Host: $DB_HOST:$DB_PORT"
        echo "   Database: $DB_DATABASE"
        echo "   Username: $DB_USERNAME"
        echo ""
    
    # Test database connection
    DB_PASS_ARG=""
    if [ -n "$DB_PASSWORD" ]; then
        DB_PASS_ARG="-p$DB_PASSWORD"
    fi
    
    if mysql -u"$DB_USERNAME" $DB_PASS_ARG -h"$DB_HOST" -P"$DB_PORT" -e "USE $DB_DATABASE" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} Database connection successful"
        
        # Count tables
        TABLE_COUNT=$(mysql -u"$DB_USERNAME" $DB_PASS_ARG -h"$DB_HOST" -P"$DB_PORT" -D"$DB_DATABASE" -e "SHOW TABLES" 2>/dev/null | wc -l)
        TABLE_COUNT=$((TABLE_COUNT - 1))
        
        if [ "$TABLE_COUNT" -gt 0 ]; then
            echo -e "${GREEN}✓${NC} Found $TABLE_COUNT tables in database"
            
            # Ask if want to fresh migrate
            echo -e "${BLUE}❓ Run fresh migration? (will delete all data) (y/n)${NC} [default: n]"
            read -t 10 -n 1 FRESH_MIGRATE
            echo ""
            
            if [ "$FRESH_MIGRATE" = "y" ] || [ "$FRESH_MIGRATE" = "Y" ]; then
                echo -e "${YELLOW}⚠${NC}  Running fresh migration (this will delete all data)..."
                php artisan migrate:fresh --force
                
                echo -e "${BLUE}❓ Seed database with sample data? (y/n)${NC} [default: y]"
                read -t 10 -n 1 SEED_CHOICE
                echo ""
                
                if [ "$SEED_CHOICE" != "n" ] && [ "$SEED_CHOICE" != "N" ]; then
                    echo -e "${BLUE}🌱 Seeding database...${NC}"
                    php artisan db:seed --force
                    echo -e "${GREEN}✓${NC} Database seeded successfully"
                fi
            fi
        else
            echo -e "${YELLOW}⚠${NC}  No tables found. Running migrations..."
            php artisan migrate --force
            
            # Ask if user wants to seed
            echo -e "${BLUE}❓ Seed database with sample data? (y/n)${NC} [default: y]"
            read -t 10 -n 1 SEED_CHOICE
            echo ""
            
            if [ "$SEED_CHOICE" != "n" ] && [ "$SEED_CHOICE" != "N" ]; then
                echo -e "${BLUE}🌱 Seeding database...${NC}"
                php artisan db:seed --force
                echo -e "${GREEN}✓${NC} Database seeded successfully"
            else
                echo -e "${YELLOW}⚠${NC}  Skipping database seeding"
            fi
        fi
    else
        echo -e "${RED}✗${NC} Cannot connect to database"
        echo -e "${YELLOW}ℹ${NC}  Possible reasons:"
        echo "   1. Wrong credentials (check .env file)"
        echo "   2. Database doesn't exist"
        echo "   3. MySQL/MariaDB not running"
        echo ""
        echo -e "${BLUE}❓ Try to create database '$DB_DATABASE'? (y/n)${NC}"
        read -t 10 -n 1 CREATE_DB
        echo ""
        
        if [ "$CREATE_DB" != "n" ] && [ "$CREATE_DB" != "N" ]; then
            echo -e "${YELLOW}ℹ${NC}  Creating database..."
            if mysql -u"$DB_USERNAME" $DB_PASS_ARG -h"$DB_HOST" -P"$DB_PORT" -e "CREATE DATABASE IF NOT EXISTS $DB_DATABASE" 2>/dev/null; then
                echo -e "${GREEN}✓${NC} Database created"
                echo -e "${BLUE}📦 Running migrations...${NC}"
                php artisan migrate --force
                
                echo -e "${BLUE}❓ Seed database with sample data? (y/n)${NC}"
                read -t 10 -n 1 SEED_CHOICE
                echo ""
                
                if [ "$SEED_CHOICE" != "n" ] && [ "$SEED_CHOICE" != "N" ]; then
                    echo -e "${BLUE}🌱 Seeding database...${NC}"
                    php artisan db:seed --force
                    echo -e "${GREEN}✓${NC} Database seeded successfully"
                fi
            else
                echo -e "${RED}✗${NC} Failed to create database"
                echo -e "${YELLOW}ℹ${NC}  Please check:"
                echo "   - MySQL user '$DB_USERNAME' has CREATE DATABASE permission"
                echo "   - MySQL password is correct"
                echo ""
                echo -e "${BLUE}❓ Continue without database? (y/n)${NC}"
                read -t 10 -n 1 SKIP_DB_FINAL
                echo ""
                if [ "$SKIP_DB_FINAL" != "y" ] && [ "$SKIP_DB_FINAL" != "Y" ]; then
                    exit 1
                fi
            fi
        else
            echo -e "${YELLOW}⚠${NC}  Skipping database creation"
            echo -e "${BLUE}ℹ${NC}  Create database manually:"
            echo "   mysql -u $DB_USERNAME -e \"CREATE DATABASE $DB_DATABASE;\""
            echo "   php artisan migrate"
        fi
    fi
else
    echo -e "${RED}✗${NC} .env file not found and cannot be created"
    exit 1
fi
fi # <--- INI FI PENUTUP YANG HILANG (Menutup blok if/else yang dimulai di baris 76)

echo ""

echo -e "${YELLOW}📋 Step 4: Dependencies Check${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check composer dependencies
if [ ! -d "vendor" ]; then
    echo -e "${YELLOW}⚠${NC}  Composer dependencies not installed. Installing..."
    composer install --no-interaction --prefer-dist
else
    echo -e "${GREEN}✓${NC} Composer dependencies installed"
fi

# Check node dependencies
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠${NC}  Node dependencies not installed. Installing..."
    yarn install
else
    echo -e "${GREEN}✓${NC} Node dependencies installed"
fi

echo ""

echo -e "${YELLOW}📋 Step 5: Build Frontend Assets${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if build exists
if [ ! -d "public/build" ]; then
    echo -e "${YELLOW}⚠${NC}  Frontend assets not built. Building..."
    yarn build
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} Frontend build successful"
    else
        echo -e "${RED}✗${NC} Frontend build failed"
        echo -e "${YELLOW}ℹ${NC}  You can still run the app, but assets may not load correctly"
    fi
else
    echo -e "${GREEN}✓${NC} Frontend assets already built"
    
    # Check if source files are newer than build
    if [ -n "$(find resources/js -newer public/build -type f 2>/dev/null)" ]; then
        echo -e "${YELLOW}⚠${NC}  Source files are newer than build"
        echo -e "${BLUE}❓ Rebuild frontend assets? (y/n) ${NC}[default: n]"
        read -t 5 -n 1 REBUILD_CHOICE
        echo ""
        
        if [ "$REBUILD_CHOICE" = "y" ] || [ "$REBUILD_CHOICE" = "Y" ]; then
            echo -e "${BLUE}🔨 Rebuilding...${NC}"
            yarn build
            echo -e "${GREEN}✓${NC} Frontend rebuilt successfully"
        else
            echo -e "${BLUE}ℹ${NC}  Using existing build. Run 'yarn build' to rebuild manually."
        fi
    else
        echo -e "${BLUE}ℹ${NC}  To rebuild: run 'yarn build' manually"
    fi
fi

echo ""

echo -e "${YELLOW}📋 Step 6: Clear Cache${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Config cache sudah di-clear di Step 2, tapi di sini diulang untuk safety
php artisan config:clear > /dev/null 2>&1
echo -e "${GREEN}✓${NC} Config cache cleared"

php artisan cache:clear > /dev/null 2>&1
echo -e "${GREEN}✓${NC} Application cache cleared"

php artisan route:clear > /dev/null 2>&1
echo -e "${GREEN}✓${NC} Route cache cleared"

echo ""

echo -e "${YELLOW}📋 Step 7: Application Summary${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo -e "${BLUE}📱 Application:${NC} RESPONTA - Sistem Pelaporan Aduan Warga"
echo -e "${BLUE}🔧 Backend:${NC} Laravel 12 + PHP $PHP_VERSION"
echo -e "${BLUE}⚛️  Frontend:${NC} React 19 + TypeScript + Tailwind CSS"
echo -e "${BLUE}🗄️  Database:${NC} MariaDB ($DB_DATABASE)"
echo -e "${BLUE}📊 Phase:${NC} Phase 4 Complete (66.67% overall progress)"

echo ""

echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                ║${NC}"
echo -e "${GREEN}║   ✅ All checks passed! Starting server...     ║${NC}"
echo -e "${GREEN}║                                                ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"

echo ""
echo -e "${BLUE}🔑 Test Credentials:${NC}"
echo "   Nomor HP: 081234567890"
echo "   Password: password123"
echo ""

echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🚀 Starting Laravel Server...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📍 Access the application at:${NC}"
echo -e "   ${GREEN}http://localhost:8000${NC}"
echo ""
echo -e "${YELLOW}💡 Tips:${NC}"
echo "   - Press Ctrl+C to stop the server"
echo "   - For hot reload: run 'yarn dev' in another terminal"
echo "   - View logs: tail -f storage/logs/laravel.log"
echo ""

# Start Laravel server
php artisan serve --host=0.0.0.0 --port=8000