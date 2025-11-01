# 🌟 GOLDEN RULES - RESPONTA Project

**Last Updated:** 2025-01-31  
**Version:** 2.0.0  
**Project:** RESPONTA - Sistem Pelaporan Aduan Warga

---

## 📌 Project Overview

**RESPONTA** adalah sistem pelaporan dan penanganan aduan warga berbasis web/mobile yang memungkinkan warga melaporkan keluhan infrastruktur kota (jalan rusak, lampu mati, sampah, dll) dengan foto, lokasi GPS, dan tracking status real-time.

### Tech Stack
- **Backend:** Laravel 12 (PHP 8.2+)
- **Database:** MariaDB 10.11+ / MySQL 8.0+
- **Authentication:** Laravel Sanctum (API Token)
- **Frontend:** React 19 + TypeScript 5.9
- **Build Tool:** Vite 7.1
- **Styling:** Tailwind CSS 4.1
- **State Management:** React Query 5.90
- **Routing:** React Router 7.9
- **Maps:** Leaflet.js 1.9
- **ORM:** Eloquent
- **Validation:** Laravel Form Requests

---

## 🚀 Quick Start for New Conversations

### 1. Instant Start (Recommended)

```bash
# One command to verify & start everything!
bash scripts/start-app.sh
```

This script will:
- ✓ Check all system requirements
- ✓ Verify database connection
- ✓ Install missing dependencies
- ✓ Build frontend assets
- ✓ Start Laravel server

**Access:** http://localhost:8000

### 2. Manual Setup (If Needed)

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

### 3. Project Setup

```bash
cd /app

# Install dependencies (if not already)
composer install --no-interaction
yarn install

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

# Run migrations
php artisan migrate --force

# Seed database
php artisan db:seed --force

# Build frontend
yarn build
```

### 4. Verify Installation

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
│   ├── api.php              # API routes (backend)
│   └── web.php              # SPA catch-all route
├── resources/
│   ├── js/                  # React + TypeScript frontend
│   │   ├── app.tsx          # Entry point (mount React)
│   │   ├── App.tsx          # Main component (routing)
│   │   ├── types/           # TypeScript type definitions
│   │   ├── services/        # API service layer
│   │   ├── contexts/        # React contexts (AuthContext)
│   │   ├── utils/           # Utility functions
│   │   ├── components/      # Reusable components
│   │   │   ├── layout/      # AppLayout, GuestLayout
│   │   │   ├── ui/          # Button, Input, Alert, Badge
│   │   │   └── map/         # MapPicker (Leaflet)
│   │   └── pages/           # Application pages
│   │       ├── auth/        # Login, Register
│   │       ├── Dashboard.tsx
│   │       └── aduan/       # CreateAduan, ListAduan, DetailAduan
│   ├── views/
│   │   └── app.blade.php    # React mount point
│   └── css/
│       └── app.css          # Tailwind CSS
├── scripts/
│   ├── start-app.sh         # 🚀 One-command startup
│   ├── verify-setup.sh      # Verify installation
│   └── test-api.sh          # Test API endpoints
├── docs/
│   ├── phase/               # Phase completion reports
│   │   ├── phase-1-completion.md
│   │   ├── phase-2-completion.md
│   │   ├── phase-3-completion.md
│   │   └── phase-4-completion.md
│   ├── golden-rules.md      # This file
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_SCHEMA.md
│   ├── DEVELOPMENT_ROADMAP.md
│   └── SETUP_GUIDE.md
├── README.md                # Main project README
└── README_RESPONTA.md       # Original project overview
```

### 🔍 Important File Distinction

**Frontend Entry Points:**
- `resources/js/app.tsx` (lowercase) = **Entry point** - mounts React app ke DOM
- `resources/js/App.tsx` (PascalCase) = **Main component** - contains routing & app structure

**Why two files?**
- `app.tsx`: Handles ReactDOM.render, providers setup (QueryClient, BrowserRouter)
- `App.tsx`: Contains actual application logic, routes, and components
- This is standard React + Vite pattern - both are required!

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
- Frontend stores token in localStorage
- AuthContext manages global auth state

---

## 📝 Coding Standards

### Backend (Laravel)

#### Models

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

#### Controllers

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

#### API Routes

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

### Frontend (React + TypeScript)

#### TypeScript Types

```typescript
// Define interfaces in types/index.ts
export interface User {
    id: number;
    name: string;
    no_hp: string;
    // ... other fields
}

// Use types in components
interface DashboardProps {
    user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
    // Component logic
};
```

#### API Calls

```typescript
// Use services/api.ts
import { authService, aduanService } from '@/services/api';

// In component
const { data, isLoading } = useQuery({
    queryKey: ['aduan', id],
    queryFn: () => aduanService.getById(id)
});
```

#### Components

```typescript
// Use proper typing
import React, { ChangeEvent } from 'react';

interface InputProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    label: string;
}

const Input: React.FC<InputProps> = ({ value, onChange, label }) => {
    return (
        <div>
            <label>{label}</label>
            <input value={value} onChange={onChange} />
        </div>
    );
};
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

### Test API with cURL

```bash
# Login
curl -X POST http://localhost:8000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"no_hp":"081234567890","password":"password123"}'

# Get categories
curl http://localhost:8000/api/v1/kategori-aduan

# Get aduan (with auth)
curl http://localhost:8000/api/v1/aduan \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
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

### Frontend Commands

```bash
# Development (hot reload)
yarn dev

# Production build
yarn build

# Type checking
yarn tsc

# Install package
yarn add package-name
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
11. **Use TypeScript strict mode** in frontend
12. **Define types** for all API responses
13. **Use React Query** for data fetching
14. **Use Tailwind CSS** for styling
15. **Use script `start-app.sh`** for easy startup

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
11. **Never use `any` type** in TypeScript
12. **Never ignore TypeScript errors**
13. **Never hardcode API URLs** (use environment variables)
14. **Never delete `app.tsx` or `App.tsx`** (both are needed!)

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

#### Backend

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

#### Frontend

1. **Define Types** in `resources/js/types/index.ts`

2. **Create API Service** in `resources/js/services/api.ts`

3. **Create Component** in appropriate folder:
   - Page: `resources/js/pages/`
   - Layout: `resources/js/components/layout/`
   - UI: `resources/js/components/ui/`

4. **Add Route** in `resources/js/App.tsx`

5. **Test in Browser**

---

## 📋 Current Phase Status

### ✅ Completed Phases

- **Phase 1:** Database & Models ✅ (100%)
  - 5 migrations created
  - 4 models (User, KategoriAduan, Aduan, FotoAduan)
  - Seeders for test data
  
- **Phase 2:** Authentication API ✅ (100%)
  - Register, Login, Logout
  - OTP verification
  - Profile management
  
- **Phase 3:** Aduan CRUD API ✅ (100%)
  - Create, Read, Update, Delete aduan
  - Photo upload & compression
  - Filter, pagination, search
  
- **Phase 4:** Frontend Implementation ✅ (100%)
  - React + TypeScript setup
  - Authentication pages (Login, Register)
  - Dashboard with statistics
  - Aduan management (List, Create, Detail)
  - Interactive map (Leaflet.js)
  - Photo upload with preview

### 🚧 Upcoming Phases

- **Phase 5:** Admin Panel (Optional)
  - Admin authentication
  - User management
  - Kategori management
  - Aduan status updates
  - Admin notes
  
- **Phase 6:** Testing & Deployment
  - Unit tests
  - Integration tests
  - Server setup
  - SSL configuration
  - Performance optimization

**Progress:** 4/6 phases (66.67%)

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

### Frontend Build Error

```bash
# Clear node_modules and rebuild
rm -rf node_modules
yarn install
yarn build
```

### Port Already in Use

```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Or use different port
php artisan serve --port=8001
```

---

## 📚 Key Documentation Files

- **`README.md`** - Main project overview & quick start
- **`docs/golden-rules.md`** - This file (for AI agents & new devs)
- **`docs/DATABASE_SCHEMA.md`** - Complete database schema
- **`docs/API_DOCUMENTATION.md`** - API endpoints documentation
- **`docs/DEVELOPMENT_ROADMAP.md`** - Timeline & phases
- **`docs/phase/phase-1-completion.md`** - Phase 1 report
- **`docs/phase/phase-2-completion.md`** - Phase 2 report
- **`docs/phase/phase-3-completion.md`** - Phase 3 report
- **`docs/phase/phase-4-completion.md`** - Phase 4 report
- **`scripts/start-app.sh`** - 🚀 One-command startup script

---

## 🎯 Key Contacts & Links

**Project Owner:** [Your Name]  
**Started:** 2025-01-31  
**Phase 4 Complete:** 2025-11-01  
**Target Launch:** TBD  

---

## 📌 Quick Reference

### Test Data

```
Users: 5 dummy users
Kategori: 8 categories (Jalan Rusak, Lampu Mati, etc.)
Aduan: Test with tinker or create via UI
```

### Status Values (Aduan)

- `baru` - New complaint
- `diverifikasi` - Verified by admin
- `diproses` - Being processed
- `selesai` - Completed
- `ditolak` - Rejected

### Start Application

```bash
# Quick start (recommended)
bash scripts/start-app.sh

# Manual start
service mariadb start
cd /app
php artisan serve
```

**Access:** http://localhost:8000  
**Login:** 081234567890 / password123

---

**Remember:** This is the single source of truth for RESPONTA project setup and conventions. Always refer to this file when starting a new conversation or onboarding new team members!

**Last Updated:** 2025-11-01 | **Version:** 2.0.0
