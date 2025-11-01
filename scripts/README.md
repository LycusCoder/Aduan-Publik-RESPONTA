# 📜 RESPONTA Scripts

Kumpulan utility scripts untuk development dan deployment RESPONTA.

---

## 🚀 start-app.sh

**Description:** One-command startup script untuk development lokal.

**Features:**
- ✅ Auto-detect project directory
- ✅ Check system requirements (PHP, Composer, Node.js, Yarn)
- ✅ Auto-create .env dari .env.example
- ✅ Auto-generate APP_KEY
- ✅ Setup database (create, migrate, seed)
- ✅ Install dependencies (composer + yarn)
- ✅ Build frontend assets
- ✅ Clear cache
- ✅ Start Laravel development server

**Usage:**
```bash
# Di root project
bash scripts/start-app.sh

# Atau dari mana saja
cd /path/to/responta
bash scripts/start-app.sh
```

**Requirements:**
- PHP 8.2+
- Composer
- Node.js 18+
- Yarn (atau npm)
- MySQL/MariaDB

**Interactive Prompts:**
- Seed database? (y/n) - 10 seconds timeout
- Rebuild frontend? (y/n) - 5 seconds timeout

---

## 🧪 verify-setup.sh

**Description:** Verify instalasi dan konfigurasi RESPONTA.

**Features:**
- Check PHP & Composer version
- Check MySQL/MariaDB service
- Test database connection
- Count database tables
- Verify models & migrations

**Usage:**
```bash
bash scripts/verify-setup.sh
```

---

## 🧪 test-api.sh

**Description:** Test API endpoints menggunakan curl.

**Features:**
- Test authentication endpoints
- Test kategori aduan endpoints
- Test aduan CRUD endpoints

**Usage:**
```bash
bash scripts/test-api.sh
```

---

## 🧪 test-api-phase3.sh

**Description:** Test API endpoints Phase 3 (Aduan Management).

**Usage:**
```bash
bash scripts/test-api-phase3.sh
```

---

## 🛠️ Troubleshooting

### Script tidak bisa menemukan .env

**Problem:** Script bilang ".env not found" padahal file ada

**Solution:**
```bash
# Pastikan jalankan dari root project
cd /path/to/responta
bash scripts/start-app.sh

# Atau buat .env manual
cp .env.example .env
php artisan key:generate
```

### Database connection failed

**Solution:**
```bash
# Check MySQL running
# macOS:
brew services list
brew services start mariadb

# Linux:
sudo systemctl status mysql
sudo systemctl start mysql

# Test connection
mysql -u root -e "SHOW DATABASES;"
```

### Port 8000 already in use

**Solution:**
```bash
# Kill existing process
lsof -ti:8000 | xargs kill -9

# Or use different port
php artisan serve --port=8001
```

### Frontend build failed

**Solution:**
```bash
# Check Node version (harus 18+)
node -v

# Clear cache & reinstall
rm -rf node_modules yarn.lock
yarn install
yarn build
```

---

## 📝 Notes

- Semua scripts harus dijalankan dari **root project directory**
- Scripts akan auto-detect project root jika dijalankan dari subfolder
- Untuk production deployment, gunakan dedicated deployment script (coming soon)

---

**Version:** 1.0.0  
**Last Updated:** 2025-11-01
