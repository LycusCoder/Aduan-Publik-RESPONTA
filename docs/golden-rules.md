# 🌟 GOLDEN RULES - RESPONTA Project

**Last Updated:** 2025-01-31  
**Version:** 1.0.0  
**Project:** RESPONTA - Sistem Pelaporan Aduan Warga

---

## 📌 Project Overview

**RESPONTA** adalah sistem pelaporan dan penanganan aduan warga berbasis web/mobile yang memungkinkan warga melaporkan keluhan infrastruktur kota (jalan rusak, lampu mati, sampah, dll) dengan foto, lokasi GPS, dan tracking status real-time.

### Tech Stack
- **Backend:** Laravel 12 (PHP 8.2+)
- **Database:** MariaDB 10.11+ / MySQL 8.0+
- **Authentication:** Laravel Sanctum (API Token)
- **Frontend:** (To be determined - React/Vue/Inertia)
- **ORM:** Eloquent
- **Validation:** Laravel Form Requests

---

## 🚀 Quick Start for New Conversations

### 1. Environment Requirements

```bash
# Check if PHP and Composer already installed
php --version  # Should be 8.2+
composer --version

# If NOT installed, run:
apt-get update && apt-get install -y \
  php php-cli php-mbstring php-xml php-zip php-mysql \
  unzip curl

# Install Composer
curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install MySQL/MariaDB
apt-get install -y default-mysql-server default-mysql-client

# Start MySQL service
service mariadb start

# Set root password (empty)
mysql -u root -e "SET PASSWORD FOR 'root'@'localhost' = PASSWORD('');"
mysql -u root -e "FLUSH PRIVILEGES;"
```

### 2. Project Setup

```bash
cd /app

# Install dependencies (if not already)
composer install --no-interaction

# Copy .env if not exists
cp .env.example .env

# Edit .env - Configure your database credentials
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=responta        # Your database name
# DB_USERNAME=root            # Your MySQL username
# DB_PASSWORD=                # Your MySQL password

# Generate app key
php artisan key:generate

# Create database (adjust username if needed)
mysql -u root -e "CREATE DATABASE IF NOT EXISTS responta;"
# OR with password:
# mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS responta;"

# Run migrations
php artisan migrate --force

# Seed database
php artisan db:seed --force
```

### 3. Verify Installation

```bash
# Run automatic verification (reads credentials from .env)
bash scripts/verify-setup.sh

# This will check:
# ✓ PHP & Composer versions
# ✓ MySQL/MariaDB service
# ✓ Database connection (using .env credentials)
# ✓ Database tables (13 expected)
# ✓ Models, migrations, documentation
```

**Output Example:**
```
✓ PHP 8.2.29
✓ Composer 2.8.12
✓ MySQL connected
📊 Database Configuration (from .env):
  Connection: mysql
  Host: 127.0.0.1:3306
  Database: responta
  Username: root
  Password: (empty)
✓ All checks passed!
```

---

## 📂 Project Structure

```
/app/
├── app/
│   ├── Http/
│   │   ├── Controllers/     # API Controllers here
│   │   ├── Middleware/
│   │   └── Requests/        # Form Request Validations
│   ├── Models/              # Eloquent Models
│   │   ├── User.php
│   │   ├── KategoriAduan.php
│   │   ├── Aduan.php
│   │   └── FotoAduan.php
│   └── Services/            # Business Logic Services
├── database/
│   ├── migrations/          # Database migrations
│   ├── seeders/             # Database seeders
│   └── factories/           # Model factories
├── routes/
│   ├── api.php              # API routes (use this!)
│   └── web.php
├── docs/
│   ├── phase/               # Phase completion reports
│   ├── golden-rules.md      # This file
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_SCHEMA.md
│   ├── DEVELOPMENT_ROADMAP.md
│   └── SETUP_GUIDE.md
├── README.md                # Main project README
└── README_RESPONTA.md       # Original project overview
```

---

## 🗄️ Database Schema

### Tables Overview

| Table | Purpose | Key Features |
|-------|---------|-------------|
| `users` | Warga/Citizens | no_hp (unique), nik (encrypted) |
| `kategori_aduan` | Complaint categories | 8 default categories |
| `aduan` | Complaints/Reports | Auto nomor_tiket, GPS coordinates |
| `foto_aduan` | Complaint photos | Max 3 photos per aduan |
| `personal_access_tokens` | API tokens | Sanctum authentication |

### Key Relationships

```
User (1) ----< (many) Aduan
KategoriAduan (1) ----< (many) Aduan
Aduan (1) ----< (many) FotoAduan
```

### Auto-Generated Fields

- **nomor_tiket**: Format `ADU-YYYYMMDD-XXX` (auto-increment per day)
- **slug**: Auto-generated from nama (KategoriAduan)
- **tanggal_selesai**: Auto-set when status = 'selesai'

---

## 🔐 Authentication System

### Laravel Sanctum (API Token)

**Login Flow:**
1. User register with: `name`, `no_hp`, `nik`, `password`
2. OTP sent to `no_hp` for verification
3. After OTP verified, user can login with `no_hp` + `password`
4. API returns Sanctum token
5. All subsequent requests use: `Authorization: Bearer {token}`

**Important:**
- Login using `no_hp` (NOT email)
- NIK is encrypted in database
- Tokens stored in `personal_access_tokens` table

---

## 📝 Coding Standards

### Models

```php
// Always use fillable (NOT guarded)
protected $fillable = ['field1', 'field2'];

// Use casts for type conversion
protected function casts(): array {
    return [
        'is_active' => 'boolean',
        'nik' => 'encrypted',
    ];
}

// Define relationships
public function aduan(): HasMany {
    return $this->hasMany(Aduan::class);
}
```

### Controllers

```php
// Use Form Requests for validation
public function store(StoreAduanRequest $request) {
    // Business logic here
}

// Always return JSON for API
return response()->json([
    'success' => true,
    'data' => $aduan,
    'message' => 'Aduan created successfully'
], 201);
```

### API Routes

```php
// Use route groups
Route::prefix('v1')->group(function () {
    // Public routes
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    
    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/profile', [ProfileController::class, 'show']);
    });
});
```

---

## 🧪 Testing

### Manual Testing with Artisan Tinker

```bash
# Open Tinker REPL
php artisan tinker

# Test User model
$user = App\Models\User::first();
echo $user->name;

# Test relationships
$aduan = App\Models\Aduan::with('user', 'kategoriAduan')->first();
echo $aduan->user->name;

# Test nearby query
$nearby = App\Models\Aduan::nearby(-6.2088, 106.8456, 5)->get();
foreach ($nearby as $item) {
    echo $item->nomor_tiket . ': ' . $item->distance . 'km';
}
```

### Test Credentials

```
No HP: 081234567890
Password: password123
```

---

## 🔧 Common Artisan Commands

```bash
# Database
php artisan migrate              # Run migrations
php artisan migrate:fresh        # Drop all tables and re-run migrations
php artisan migrate:fresh --seed # Fresh migration + seed
php artisan db:seed              # Run seeders only

# Models & Controllers
php artisan make:model ModelName -m     # Model + migration
php artisan make:controller NameController --api  # API Controller
php artisan make:request StoreRequest   # Form Request
php artisan make:seeder TableSeeder     # Seeder

# Cache & Config
php artisan config:clear         # Clear config cache
php artisan cache:clear          # Clear app cache
php artisan route:list           # List all routes

# Development
php artisan serve                # Start dev server (localhost:8000)
php artisan tinker               # Interactive REPL
```

---

## 🚨 Important Rules

### DO's ✅

1. **Always use migrations** for database changes
2. **Use Form Requests** for validation
3. **Use Eloquent relationships** instead of manual joins
4. **Return JSON** for all API responses
5. **Use `.env`** for configuration, never hardcode
6. **Eager load relationships** to prevent N+1 queries
7. **Use transactions** for multi-table operations
8. **Add indexes** on foreign keys and search fields
9. **Validate NIK format** (16 digits)
10. **Validate no_hp format** (08xxxxxxxxxx)

### DON'Ts ❌

1. **Never commit `.env`** file
2. **Never use `email` field** (use `no_hp` instead)
3. **Never store plaintext passwords**
4. **Never expose NIK** in API responses (it's encrypted)
5. **Never skip validation**
6. **Never use `DB::raw()` without sanitization**
7. **Never modify seeded data** manually in production
8. **Never use `SELECT *`** when you need specific columns
9. **Never forget to add `api` middleware** to protected routes
10. **Never use `id` as public identifier** (use `nomor_tiket` instead)

---

## 📊 Database Connection (.env)

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=responta
DB_USERNAME=root
DB_PASSWORD=
```

---

## 🔄 Development Workflow

### For New Features

1. **Create Migration**
   ```bash
   php artisan make:migration create_table_name
   ```

2. **Create Model**
   ```bash
   php artisan make:model ModelName
   ```

3. **Create Controller**
   ```bash
   php artisan make:controller Api/ControllerName --api
   ```

4. **Create Form Request**
   ```bash
   php artisan make:request StoreModelRequest
   ```

5. **Add Routes** in `routes/api.php`

6. **Test with Tinker or Postman**

7. **Document API** in `docs/API_DOCUMENTATION.md`

---

## 📋 Current Phase Status

### ✅ Completed Phases

- **Phase 0:** Documentation & Setup ✅
- **Phase 1:** Database & Models ✅
  - Migrations created (5 files)
  - Models created (User, KategoriAduan, Aduan, FotoAduan)
  - Seeders created (KategoriAduan, User)
  - All tested and working

### 🚧 Upcoming Phases

- **Phase 2:** Authentication API (Register, Login, OTP)
- **Phase 3:** Aduan CRUD API
- **Phase 4:** File Upload (Photos)
- **Phase 5:** Admin Panel
- **Phase 6:** Testing & Deployment

**Progress:** 2/6 phases (33.33%)

See `docs/DEVELOPMENT_ROADMAP.md` for full timeline.

---

## 🐛 Troubleshooting

### MySQL Access Denied

```bash
mysql -u root -e "SET PASSWORD FOR 'root'@'localhost' = PASSWORD('');"
mysql -u root -e "FLUSH PRIVILEGES;"
```

### Composer Dependencies Issue

```bash
composer install --no-interaction --prefer-dist
composer dump-autoload
```

### Migration Error

```bash
# Rollback and retry
php artisan migrate:rollback
php artisan migrate

# Or fresh start
php artisan migrate:fresh --seed
```

### Class Not Found

```bash
composer dump-autoload
php artisan config:clear
php artisan cache:clear
```

---

## 📚 Key Documentation Files

- **`README.md`** - Main project overview & quick start
- **`docs/golden-rules.md`** - This file (for AI agents & new devs)
- **`docs/DATABASE_SCHEMA.md`** - Complete database schema
- **`docs/API_DOCUMENTATION.md`** - API endpoints documentation
- **`docs/DEVELOPMENT_ROADMAP.md`** - Timeline & phases
- **`docs/phase/phase-1-completion.md`** - Phase 1 report

---

## 🎯 Key Contacts & Links

**Project Owner:** [Your Name]  
**Started:** 2025-01-31  
**Target Launch:** TBD  

---

## 📌 Quick Reference

### Test Data

```
Users: 5 dummy users
Kategori: 8 categories (Jalan Rusak, Lampu Mati, etc.)
Aduan: Test with tinker
```

### Status Values (Aduan)

- `baru` - New complaint
- `diverifikasi` - Verified by admin
- `diproses` - Being processed
- `selesai` - Completed
- `ditolak` - Rejected

---

**Remember:** This is the single source of truth for RESPONTA project setup and conventions. Always refer to this file when starting a new conversation or onboarding new team members!

**Last Updated:** 2025-01-31 | **Version:** 1.0.0