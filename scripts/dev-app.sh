#!/bin/bash

# 🔥 RESPONTA - Development Mode Script
# Start Laravel + Vite dev server with hot reload for real-time development

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Auto-detect project root directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Change to project root
cd "$PROJECT_ROOT"

# Clear screen for better visibility
clear

echo -e "${MAGENTA}╔════════════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║                                                ║${NC}"
echo -e "${MAGENTA}║   🔥 RESPONTA - Development Mode 🔥           ║${NC}"
echo -e "${MAGENTA}║   Hot Reload Enabled for Real-time Dev        ║${NC}"
echo -e "${MAGENTA}║                                                ║${NC}"
echo -e "${MAGENTA}╚════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}📁 Project Directory:${NC} $PROJECT_ROOT"
echo ""

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Stopping development servers...${NC}"
    
    # Kill Laravel server
    if [ ! -z "$LARAVEL_PID" ]; then
        kill $LARAVEL_PID 2>/dev/null || true
        echo -e "${GREEN}✓${NC} Laravel server stopped"
    fi
    
    # Kill Vite dev server
    if [ ! -z "$VITE_PID" ]; then
        kill $VITE_PID 2>/dev/null || true
        echo -e "${GREEN}✓${NC} Vite dev server stopped"
    fi
    
    # Kill any remaining php artisan serve processes
    pkill -f "php artisan serve" 2>/dev/null || true
    
    # Kill any remaining vite processes
    pkill -f "vite" 2>/dev/null || true
    
    echo -e "${GREEN}✓${NC} Development servers stopped successfully"
    exit 0
}

# Trap SIGINT (Ctrl+C) and SIGTERM
trap cleanup SIGINT SIGTERM

echo -e "${YELLOW}📋 Step 1: Quick System Check${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check PHP
if ! command -v php &> /dev/null; then
    echo -e "${RED}✗${NC} PHP not found. Please run scripts/start-app.sh first for initial setup."
    exit 1
fi
echo -e "${GREEN}✓${NC} PHP $(php -v | head -n 1 | cut -d " " -f 2 | cut -d "." -f 1,2) ready"

# Check Composer
if ! command -v composer &> /dev/null; then
    echo -e "${RED}✗${NC} Composer not found. Please run scripts/start-app.sh first for initial setup."
    exit 1
fi
echo -e "${GREEN}✓${NC} Composer ready"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗${NC} Node.js not found. Please run scripts/start-app.sh first for initial setup."
    exit 1
fi
echo -e "${GREEN}✓${NC} Node.js $(node -v) ready"

# Check Yarn
if ! command -v yarn &> /dev/null; then
    echo -e "${RED}✗${NC} Yarn not found. Please run scripts/start-app.sh first for initial setup."
    exit 1
fi
echo -e "${GREEN}✓${NC} Yarn ready"

echo ""
echo -e "${YELLOW}📦 Step 2: Dependencies Check${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if vendor directory exists
if [ ! -d "vendor" ]; then
    echo -e "${YELLOW}⚠${NC}  Composer dependencies not installed. Installing..."
    composer install --no-interaction
    echo -e "${GREEN}✓${NC} Composer dependencies installed"
else
    echo -e "${GREEN}✓${NC} Composer dependencies found"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠${NC}  Node dependencies not installed. Installing..."
    yarn install
    echo -e "${GREEN}✓${NC} Node dependencies installed"
else
    echo -e "${GREEN}✓${NC} Node dependencies found"
fi

echo ""
echo -e "${YELLOW}⚙️  Step 3: Environment Setup${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check .env file
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠${NC}  .env file not found. Copying from .env.example..."
    cp .env.example .env
    php artisan key:generate
    echo -e "${GREEN}✓${NC} .env file created and app key generated"
else
    echo -e "${GREEN}✓${NC} .env file exists"
fi

# Check if app key is set
if ! grep -q "APP_KEY=base64:" .env; then
    echo -e "${YELLOW}⚠${NC}  App key not set. Generating..."
    php artisan key:generate
    echo -e "${GREEN}✓${NC} App key generated"
else
    echo -e "${GREEN}✓${NC} App key configured"
fi

echo ""
echo -e "${YELLOW}🗄️  Step 4: Database Check${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check database connection
if php artisan db:show &> /dev/null; then
    echo -e "${GREEN}✓${NC} Database connection successful"
    
    # Check if migrations are needed
    if ! php artisan migrate:status &> /dev/null; then
        echo -e "${YELLOW}⚠${NC}  Running migrations..."
        php artisan migrate --force
        echo -e "${GREEN}✓${NC} Migrations completed"
    else
        echo -e "${GREEN}✓${NC} Database migrations up to date"
    fi
else
    echo -e "${YELLOW}⚠${NC}  Database connection failed or not configured"
    echo -e "${CYAN}ℹ${NC}  You can continue development and configure database later"
fi

echo ""
echo -e "${YELLOW}🧹 Step 5: Cache Cleanup${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

php artisan config:clear > /dev/null 2>&1
php artisan cache:clear > /dev/null 2>&1
php artisan route:clear > /dev/null 2>&1
php artisan view:clear > /dev/null 2>&1
echo -e "${GREEN}✓${NC} All caches cleared"

echo ""
echo -e "${CYAN}════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🚀 Starting Development Servers...${NC}"
echo -e "${CYAN}════════════════════════════════════════════════${NC}"
echo ""

# Create logs directory if not exists
mkdir -p storage/logs

# Start Laravel development server
echo -e "${BLUE}[Laravel]${NC} Starting backend server on ${GREEN}http://localhost:8000${NC}"
php artisan serve --host=0.0.0.0 --port=8000 > storage/logs/laravel-dev.log 2>&1 &
LARAVEL_PID=$!

# Wait a bit for Laravel to start
sleep 2

# Check if Laravel started successfully
if kill -0 $LARAVEL_PID 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Laravel server started (PID: $LARAVEL_PID)"
else
    echo -e "${RED}✗${NC} Failed to start Laravel server"
    echo -e "${YELLOW}Check storage/logs/laravel-dev.log for errors${NC}"
    exit 1
fi

# Start Vite development server
echo -e "${BLUE}[Vite]${NC} Starting frontend dev server with hot reload"
yarn dev > storage/logs/vite-dev.log 2>&1 &
VITE_PID=$!

# Wait a bit for Vite to start
sleep 3

# Check if Vite started successfully
if kill -0 $VITE_PID 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Vite dev server started (PID: $VITE_PID)"
else
    echo -e "${RED}✗${NC} Failed to start Vite server"
    echo -e "${YELLOW}Check storage/logs/vite-dev.log for errors${NC}"
    cleanup
    exit 1
fi

echo ""
echo -e "${CYAN}════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✨ Development Environment Ready! ✨${NC}"
echo -e "${CYAN}════════════════════════════════════════════════${NC}"
echo ""
echo -e "${MAGENTA}📡 Server URLs:${NC}"
echo -e "   ${CYAN}Backend (Laravel):${NC}  http://localhost:8000"
echo -e "   ${CYAN}Frontend (Vite):${NC}    http://localhost:5173"
echo ""
echo -e "${MAGENTA}🔥 Hot Reload Features:${NC}"
echo -e "   ${GREEN}✓${NC} Frontend: Auto-reload on file changes (React/TS/CSS)"
echo -e "   ${GREEN}✓${NC} Backend: Changes apply on next request"
echo ""
echo -e "${MAGENTA}📝 Development Tips:${NC}"
echo -e "   • Edit files in ${CYAN}resources/js/${NC} for frontend"
echo -e "   • Edit files in ${CYAN}app/${NC} for backend"
echo -e "   • View logs: ${CYAN}tail -f storage/logs/laravel-dev.log${NC}"
echo -e "   • Vite logs: ${CYAN}tail -f storage/logs/vite-dev.log${NC}"
echo ""
echo -e "${MAGENTA}⌨️  Commands:${NC}"
echo -e "   • Press ${YELLOW}Ctrl+C${NC} to stop all servers"
echo -e "   • Run ${CYAN}php artisan${NC} commands in a new terminal"
echo ""
echo -e "${CYAN}════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}👀 Watching for file changes...${NC}"
echo ""

# Follow logs in real-time (interleaved)
tail -f storage/logs/laravel-dev.log storage/logs/vite-dev.log 2>/dev/null &
TAIL_PID=$!

# Wait for user interrupt
wait $LARAVEL_PID $VITE_PID

# Cleanup on exit
cleanup
