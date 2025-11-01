<p align="center">
  <img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo">
</p>

<h1 align="center">RESPONTA</h1>
<h3 align="center">Sistem Pelaporan & Penanganan Aduan Warga</h3>

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-12-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel 12">
  <img src="https://img.shields.io/badge/PHP-8.2-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP 8.2">
  <img src="https://img.shields.io/badge/MySQL-10.11-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/Status-In%20Development-yellow?style=for-the-badge" alt="Status">
</p>

---

## 📖 Tentang RESPONTA

**RESPONTA** adalah platform digital untuk memudahkan warga dalam melaporkan dan memantau penanganan keluhan/aduan terkait infrastruktur kota seperti:

- 🛣️ Jalan rusak atau berlubang
- 💡 Lampu jalan mati
- 🗑️ Sampah menumpuk
- 🚰 Drainase tersumbat
- 🌳 Pohon tumbang
- Dan lainnya...

**Fitur Utama:**
- ✅ Pelaporan aduan dengan foto dan GPS location
- ✅ Tracking status real-time (Baru → Diverifikasi → Diproses → Selesai)
- ✅ Notifikasi update via SMS/Push notification
- ✅ History aduan per user
- ✅ Admin dashboard untuk verifikasi dan penanganan

---

## 🚀 Quick Start

### Prerequisites

- PHP 8.2 or higher
- Composer 2.8+
- MySQL/MariaDB 10.11+
- Git

### Installation

```bash
# Clone repository
git clone <repository-url>
cd responta

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate app key
php artisan key:generate

# Configure database in .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=responta
DB_USERNAME=root
DB_PASSWORD=

# Create database
mysql -u root -e "CREATE DATABASE IF NOT EXISTS responta;"

# Run migrations & seeders
php artisan migrate --seed

# Start development server
php artisan serve
```

**Server will run at:** `http://localhost:8000`

---

## 📂 Project Structure

```
responta/
├── app/
│   ├── Http/
│   │   ├── Controllers/      # API Controllers
│   │   └── Requests/         # Form Request Validations
│   ├── Models/               # Eloquent Models
│   │   ├── User.php
│   │   ├── KategoriAduan.php
│   │   ├── Aduan.php
│   │   └── FotoAduan.php
│   └── Services/             # Business Logic
├── database/
│   ├── migrations/           # Database Migrations
│   └── seeders/              # Database Seeders
├── routes/
│   ├── api.php               # API Routes (Primary)
│   └── web.php               # Web Routes
├── docs/                     # Documentation
│   ├── golden-rules.md       # Project Golden Rules ⭐
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_SCHEMA.md
│   └── phase/                # Phase Completion Reports
└── README.md                 # This file
```

---

## 🗄️ Database Schema

### Main Tables

| Table | Description | Records |
|-------|-------------|----------|
| `users` | Warga/Citizens data | 5 (seeded) |
| `kategori_aduan` | Complaint categories | 8 (seeded) |
| `aduan` | Complaints/Reports | - |
| `foto_aduan` | Complaint photos (max 3) | - |
| `personal_access_tokens` | API authentication tokens | - |

### Key Relationships

```
User (1) ----< (many) Aduan
KategoriAduan (1) ----< (many) Aduan  
Aduan (1) ----< (many) FotoAduan
```

**See full schema:** [`docs/DATABASE_SCHEMA.md`](docs/DATABASE_SCHEMA.md)

---

## 🔐 Authentication

**System:** Laravel Sanctum (API Token Authentication)

**Login Method:**
- ❌ NO email-based login
- ✅ Login using `no_hp` (phone number) + `password`
- ✅ OTP verification for registration
- ✅ NIK (ID number) encrypted in database

**Test Credentials:**
```
No HP: 081234567890
Password: password123
```

---

## 🧪 Testing

### Using Artisan Tinker

```bash
# Open Tinker REPL
php artisan tinker

# Test models
>>> $user = App\Models\User::first();
>>> echo $user->name;

# Test relationships
>>> $aduan = App\Models\Aduan::with('user', 'kategoriAduan')->first();
>>> echo $aduan->user->name;

# Test spatial query (nearby aduan)
>>> $nearby = App\Models\Aduan::nearby(-6.2088, 106.8456, 5)->get();
```

### Fresh Database

```bash
# Drop all tables, re-migrate, and seed
php artisan migrate:fresh --seed
```

---

## 📋 Development Phases

### ✅ Completed

- [x] **Phase 0:** Documentation & Project Setup
- [x] **Phase 1:** Database Migrations & Eloquent Models
  - 5 migrations created
  - 4 models with relationships
  - Auto-generate nomor_tiket: `ADU-YYYYMMDD-XXX`
  - Spatial queries for nearby aduan
  - 2 seeders (Users & Kategori)

### 🚧 In Progress

- [ ] **Phase 2:** Authentication API (Register, Login, OTP)
- [ ] **Phase 3:** Aduan CRUD API
- [ ] **Phase 4:** File Upload & Image Processing
- [ ] **Phase 5:** Admin Dashboard
- [ ] **Phase 6:** Testing & Deployment

**Progress:** 33% (2/6 phases completed)

**See full roadmap:** [`docs/DEVELOPMENT_ROADMAP.md`](docs/DEVELOPMENT_ROADMAP.md)

---

## 🔧 Useful Commands

```bash
# Development
php artisan serve              # Start dev server
php artisan tinker             # Interactive REPL

# Database
php artisan migrate            # Run migrations
php artisan migrate:fresh      # Fresh start (drop all tables)
php artisan db:seed            # Run seeders

# Cache
php artisan config:clear       # Clear config cache
php artisan cache:clear        # Clear app cache
php artisan route:list         # Show all routes

# Code Generation
php artisan make:model Post -m          # Model + migration
php artisan make:controller PostController --api
php artisan make:request StorePostRequest
```

---

## 📚 Documentation

| File | Description |
|------|-------------|
| **[docs/golden-rules.md](docs/golden-rules.md)** | ⭐ **Project conventions & setup guide** |
| [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) | Complete database schema |
| [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) | API endpoints documentation |
| [docs/DEVELOPMENT_ROADMAP.md](docs/DEVELOPMENT_ROADMAP.md) | Development timeline |
| [docs/SETUP_GUIDE.md](docs/SETUP_GUIDE.md) | Detailed setup instructions |
| [docs/phase/](docs/phase/) | Phase completion reports |

---

## 🛠️ Tech Stack

**Backend:**
- Laravel 12.0 (PHP 8.2+)
- Laravel Sanctum (API Authentication)
- Eloquent ORM
- MariaDB 10.11 / MySQL 8.0+

**Development Tools:**
- Composer 2.8+
- Artisan CLI
- Tinker (REPL)

**Future Frontend:**
- React / Vue / Inertia.js (TBD)
- Tailwind CSS
- Mobile: React Native / Flutter (TBD)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

**Please read [`docs/golden-rules.md`](docs/golden-rules.md) before contributing!**

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Team

**Project Start:** 2025-01-31  
**Status:** Active Development  
**Current Phase:** Phase 2 (Authentication API)

---

## 📞 Support

For questions or issues:
1. Check [`docs/golden-rules.md`](docs/golden-rules.md)
2. Read API documentation in [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md)
3. Review phase reports in [`docs/phase/`](docs/phase/)
4. Open an issue on GitHub

---

<p align="center">Made with ❤️ for Better City Infrastructure</p>
<p align="center">Powered by Laravel 12</p>