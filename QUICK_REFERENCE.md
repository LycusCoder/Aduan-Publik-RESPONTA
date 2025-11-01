# 🚀 RESPONTA - Quick Reference Card

**Project:** RESPONTA - Sistem Pelaporan Aduan Warga  
**Version:** 1.0.0 | **Phase:** 2/6 (33% complete)

---

## 📖 Must-Read Docs

| Priority | File | Description |
|----------|------|-------------|
| ⭐⭐⭐ | `docs/golden-rules.md` | **START HERE!** Setup & conventions |
| ⭐⭐ | `README.md` | Project overview |
| ⭐⭐ | `docs/DATABASE_SCHEMA.md` | DB structure |
| ⭐ | `docs/API_DOCUMENTATION.md` | API endpoints |

---

## ⚡ Quick Commands

```bash
# Setup (First Time)
composer install
cp .env.example .env
php artisan key:generate
mysql -u root -e "CREATE DATABASE responta;"
php artisan migrate --seed

# Daily Development
php artisan serve              # Start server (localhost:8000)
php artisan tinker             # REPL for testing
php artisan migrate:fresh --seed  # Reset DB

# Testing
bash scripts/verify-setup.sh   # Health check
php artisan route:list         # Show all routes
```

---

## 🗄️ Database Info

```
Database: responta
Tables: 13
Key Models: User, KategoriAduan, Aduan, FotoAduan

Test Login:
  No HP: 081234567890
  Password: password123
```

---

## 🔐 Auth System

- ❌ NO email login
- ✅ Login with: `no_hp` + `password`
- ✅ OTP verification for registration
- ✅ Laravel Sanctum (API tokens)

---

## 📊 Current Status

```
✅ Phase 0: Documentation
✅ Phase 1: Database & Models
🚧 Phase 2: Authentication API (Next)
⏳ Phase 3: Aduan CRUD
⏳ Phase 4: File Upload
⏳ Phase 5: Admin Panel
```

---

## 🆘 Troubleshooting

**MySQL Access Denied?**
```bash
mysql -u root -e "SET PASSWORD FOR 'root'@'localhost' = PASSWORD('');"
mysql -u root -e "FLUSH PRIVILEGES;"
```

**Class Not Found?**
```bash
composer dump-autoload
php artisan config:clear
```

---

## 🔗 Links

- Full Setup: `docs/golden-rules.md`
- DB Schema: `docs/DATABASE_SCHEMA.md`
- API Docs: `docs/API_DOCUMENTATION.md`
- Phase Reports: `docs/phase/`

---

**🌟 Golden Rule:** Always read `docs/golden-rules.md` in new conversations!
