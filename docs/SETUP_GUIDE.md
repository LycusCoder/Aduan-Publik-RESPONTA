# 🚀 Setup Guide - RESPONTA

## System Requirements

### Minimum Requirements

- **PHP:** 8.2 or higher
- **Composer:** 2.5 or higher
- **Node.js:** 18.x or higher
- **npm/yarn:** Latest version
- **Database:** MySQL 8.0+ or PostgreSQL 15+
- **Web Server:** Apache 2.4+ / Nginx 1.20+
- **Storage:** Minimum 2GB for application + database
- **Memory:** 512MB RAM minimum (2GB recommended)

### PHP Extensions Required

```bash
- php-mbstring
- php-xml
- php-bcmath
- php-curl
- php-gd          # Untuk image processing
- php-zip
- php-mysql       # Jika pakai MySQL
- php-pgsql       # Jika pakai PostgreSQL
- php-redis       # Optional, untuk cache
```

---

## 💻 Installation Guide

### 1. Clone Repository

```bash
git clone https://github.com/your-org/responta.git
cd responta
```

### 2. Install Backend Dependencies

```bash
composer install
```

**Dependencies yang akan terinstall:**
- Laravel Framework 12.x
- Laravel Sanctum (API Authentication)
- Intervention Image (Image Processing)
- Laravel Pint (Code Formatting)
- PHPUnit (Testing)

### 3. Install Frontend Dependencies

```bash
npm install
# atau
yarn install
```

**Dependencies yang akan terinstall:**
- Vue.js 3 / React 18
- Inertia.js
- Leaflet.js (Maps)
- Tailwind CSS
- Vite (Build Tool)

### 4. Environment Configuration

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 5. Database Configuration

Edit file `.env` sesuai dengan database Anda:

**Untuk MySQL:**
```env
APP_NAME="RESPONTA"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=responta
DB_USERNAME=root
DB_PASSWORD=your_password
```

**Untuk PostgreSQL:**
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=responta
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

### 6. Create Database

**MySQL:**
```bash
mysql -u root -p
```
```sql
CREATE DATABASE responta CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

**PostgreSQL:**
```bash
psql -U postgres
```
```sql
CREATE DATABASE responta;
\q
```

### 7. Run Database Migrations

```bash
# Run migrations
php artisan migrate

# Run migrations with seeders
php artisan migrate --seed
```

**Seeders akan membuat:**
- Kategori aduan default (Jalan Rusak, Lampu Mati, dll)
- User demo untuk testing

### 8. Storage Link

```bash
# Create symbolic link untuk public storage
php artisan storage:link
```

Ini akan membuat symbolic link dari `public/storage` ke `storage/app/public`.

### 9. File Permissions

```bash
# Set permissions untuk storage dan bootstrap/cache
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### 10. Run Development Server

**Terminal 1 - Backend:**
```bash
php artisan serve
```
Backend akan berjalan di: `http://localhost:8000`

**Terminal 2 - Frontend:**
```bash
npm run dev
# atau
yarn dev
```
Frontend akan berjalan di: `http://localhost:5173`

**Atau menggunakan Composer Script (Recommended):**
```bash
composer run dev
```
Ini akan menjalankan backend, frontend, queue, dan logs secara bersamaan.

---

## 🔧 Configuration

### Laravel Sanctum Configuration

**config/sanctum.php:**
```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1')),
```

**config/cors.php:**
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:5173')],
'supports_credentials' => true,
```

### File Upload Configuration

**config/filesystems.php:**
```php
'disks' => [
    'public' => [
        'driver' => 'local',
        'root' => storage_path('app/public'),
        'url' => env('APP_URL').'/storage',
        'visibility' => 'public',
    ],
],
```

**php.ini settings:**
```ini
upload_max_filesize = 2M
post_max_size = 8M
max_execution_time = 60
memory_limit = 256M
```

### Queue Configuration

**Untuk production, gunakan Redis:**
```env
QUEUE_CONNECTION=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

**Untuk development, gunakan database:**
```env
QUEUE_CONNECTION=database
```

**Run queue worker:**
```bash
php artisan queue:work
```

---

## 🔑 API Configuration

### SMS OTP Provider (Optional)

Pilih salah satu provider SMS untuk OTP:

**1. Twilio:**
```env
SMS_PROVIDER=twilio
TWILIO_SID=your_account_sid
TWILIO_TOKEN=your_auth_token
TWILIO_FROM=+1234567890
```

**2. Nexmo/Vonage:**
```env
SMS_PROVIDER=nexmo
NEXMO_KEY=your_api_key
NEXMO_SECRET=your_api_secret
NEXMO_FROM=RESPONTA
```

**3. Local SMS Gateway:**
```env
SMS_PROVIDER=local
SMS_GATEWAY_URL=http://your-gateway.com/api/send
SMS_GATEWAY_KEY=your_api_key
```

### Map & Geocoding Provider

**1. OpenStreetMap (Free):**
```env
MAP_PROVIDER=osm
GEOCODING_PROVIDER=nominatim
NOMINATIM_URL=https://nominatim.openstreetmap.org
```

**2. Google Maps (Berbayar):**
```env
MAP_PROVIDER=google
GOOGLE_MAPS_API_KEY=your_api_key
```

### NIK Validation API (Optional)

Integrasi dengan Disdukcapil untuk validasi NIK:

```env
DISDUKCAPIL_API_URL=https://api.disdukcapil.go.id
DISDUKCAPIL_API_KEY=your_api_key
DISDUKCAPIL_API_SECRET=your_api_secret
```

---

## 🧪 Testing

### Run All Tests

```bash
php artisan test
```

### Run Specific Test Suite

```bash
# Feature tests
php artisan test --testsuite=Feature

# Unit tests
php artisan test --testsuite=Unit
```

### Run with Coverage

```bash
php artisan test --coverage
```

### Create Test Database

```env
# .env.testing
DB_CONNECTION=mysql
DB_DATABASE=responta_test
```

```bash
# Create test database
mysql -u root -p -e "CREATE DATABASE responta_test;"

# Run tests with test database
php artisan test --env=testing
```

---

## 📊 Seeding Demo Data

### Seed Kategori Aduan

```bash
php artisan db:seed --class=KategoriAduanSeeder
```

### Seed Demo Users

```bash
php artisan db:seed --class=UserSeeder
```

**Demo User Credentials:**
```
Nomor HP: 081234567890
Password: password123
```

### Seed Demo Aduan (Optional)

```bash
php artisan db:seed --class=AduanSeeder
```

### Seed All

```bash
php artisan db:seed
```

---

## 🐛 Troubleshooting

### Problem: Migration Error

**Error:**
```
SQLSTATE[42000]: Syntax error or access violation: 1071 Specified key was too long
```

**Solution:**
Tambahkan di `app/Providers/AppServiceProvider.php`:
```php
use Illuminate\Support\Facades\Schema;

public function boot()
{
    Schema::defaultStringLength(191);
}
```

### Problem: Storage Permission Denied

**Error:**
```
failed to open stream: Permission denied
```

**Solution:**
```bash
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

### Problem: Vite Not Found

**Error:**
```
Vite manifest not found
```

**Solution:**
```bash
npm install
npm run build
```

### Problem: CORS Error

**Error:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution:**
Pastikan di `.env`:
```env
FRONTEND_URL=http://localhost:5173
SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
```

Dan di `config/cors.php`:
```php
'supports_credentials' => true,
```

### Problem: Image Upload Failed

**Error:**
```
The file exceeds your upload_max_filesize ini directive
```

**Solution:**
Edit `php.ini`:
```ini
upload_max_filesize = 2M
post_max_size = 8M
```

Restart web server:
```bash
sudo service apache2 restart
# atau
sudo service nginx restart
```

---

## 📝 Code Quality Tools

### Laravel Pint (Code Formatting)

```bash
# Check code style
./vendor/bin/pint --test

# Auto-fix code style
./vendor/bin/pint
```

### PHPStan (Static Analysis)

```bash
./vendor/bin/phpstan analyse
```

### ESLint (JavaScript)

```bash
npm run lint
```

---

## 🚀 Quick Development Commands

```bash
# Clear all cache
php artisan optimize:clear

# Cache config
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache views
php artisan view:cache

# Generate IDE helper
php artisan ide-helper:generate

# List all routes
php artisan route:list

# Create controller
php artisan make:controller API/AduanController --api

# Create model with migration
php artisan make:model Aduan -m

# Create request
php artisan make:request StoreAduanRequest

# Create resource
php artisan make:resource AduanResource

# Create test
php artisan make:test AduanTest
```

---

## 🔗 Useful Links

- **Laravel Documentation:** https://laravel.com/docs/11.x
- **Laravel Sanctum:** https://laravel.com/docs/11.x/sanctum
- **Inertia.js:** https://inertiajs.com/
- **Leaflet.js:** https://leafletjs.com/
- **Tailwind CSS:** https://tailwindcss.com/
- **Vue.js:** https://vuejs.org/

---

## ✅ Setup Checklist

- [ ] PHP 8.2+ installed
- [ ] Composer installed
- [ ] Node.js & npm installed
- [ ] Database (MySQL/PostgreSQL) installed
- [ ] Repository cloned
- [ ] Composer dependencies installed
- [ ] npm dependencies installed
- [ ] .env file configured
- [ ] Database created
- [ ] Migrations run
- [ ] Seeders run
- [ ] Storage link created
- [ ] File permissions set
- [ ] Development server running
- [ ] Tests passing

---

**Version:** 0.1.0  
**Last Updated:** 2025-01-31  
**For Support:** support@responta.id
