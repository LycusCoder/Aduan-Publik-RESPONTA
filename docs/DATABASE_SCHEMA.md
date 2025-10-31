# 📊 Database Schema - RESPONTA

## Overview

Database schema untuk sistem RESPONTA menggunakan relational database (MySQL/PostgreSQL) dengan fokus pada integritas data, performa query, dan skalabilitas.

---

## 📝 Tables Schema

### 1. users

**Description:** Tabel untuk menyimpan data warga yang terdaftar di sistem.

```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    no_hp VARCHAR(15) NOT NULL UNIQUE,
    nik VARCHAR(255) NOT NULL UNIQUE, -- Encrypted
    password VARCHAR(255) NOT NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_no_hp (no_hp),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Columns:**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | BIGINT UNSIGNED | NO | AUTO | Primary key |
| name | VARCHAR(255) | NO | - | Nama lengkap warga |
| no_hp | VARCHAR(15) | NO | - | Nomor HP (unique, untuk login) |
| nik | VARCHAR(255) | NO | - | NIK (encrypted, unique) |
| password | VARCHAR(255) | NO | - | Password (hashed) |
| remember_token | VARCHAR(100) | YES | NULL | Token remember me |
| created_at | TIMESTAMP | YES | NULL | Timestamp created |
| updated_at | TIMESTAMP | YES | NULL | Timestamp updated |

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE INDEX: `no_hp`, `nik`
- INDEX: `idx_no_hp`, `idx_created_at`

**Notes:**
- NIK disimpan dalam bentuk encrypted untuk keamanan data
- no_hp digunakan sebagai username untuk login
- Password di-hash menggunakan bcrypt

---

### 2. kategori_aduan

**Description:** Tabel master untuk kategori aduan.

```sql
CREATE TABLE kategori_aduan (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    icon VARCHAR(255) NULL,
    deskripsi TEXT NULL,
    dinas_terkait_id BIGINT UNSIGNED NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_slug (slug),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Columns:**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | BIGINT UNSIGNED | NO | AUTO | Primary key |
| nama | VARCHAR(255) | NO | - | Nama kategori (e.g., "Jalan Rusak") |
| slug | VARCHAR(255) | NO | - | URL-friendly slug (e.g., "jalan-rusak") |
| icon | VARCHAR(255) | YES | NULL | Nama file icon untuk UI |
| deskripsi | TEXT | YES | NULL | Deskripsi kategori |
| dinas_terkait_id | BIGINT UNSIGNED | YES | NULL | FK ke tabel dinas (modul 2) |
| is_active | BOOLEAN | NO | TRUE | Status aktif kategori |
| created_at | TIMESTAMP | YES | NULL | Timestamp created |
| updated_at | TIMESTAMP | YES | NULL | Timestamp updated |

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE INDEX: `slug`
- INDEX: `idx_slug`, `idx_is_active`

**Sample Data:**
```sql
INSERT INTO kategori_aduan (nama, slug, icon) VALUES
('Jalan Rusak', 'jalan-rusak', 'road-icon.svg'),
('Lampu Jalan Mati', 'lampu-jalan-mati', 'light-icon.svg'),
('Sampah Menumpuk', 'sampah-menumpuk', 'trash-icon.svg'),
('Drainase Tersumbat', 'drainase-tersumbat', 'drain-icon.svg'),
('Pohon Tumbang', 'pohon-tumbang', 'tree-icon.svg');
```

---

### 3. aduan

**Description:** Tabel utama untuk menyimpan data aduan dari warga.

```sql
CREATE TABLE aduan (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nomor_tiket VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT UNSIGNED NOT NULL,
    kategori_aduan_id BIGINT UNSIGNED NOT NULL,
    deskripsi TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    alamat TEXT NULL,
    status ENUM('baru', 'diverifikasi', 'diproses', 'selesai', 'ditolak') DEFAULT 'baru',
    catatan_admin TEXT NULL,
    tanggal_selesai TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (kategori_aduan_id) REFERENCES kategori_aduan(id) ON DELETE RESTRICT,
    
    INDEX idx_user_id (user_id),
    INDEX idx_kategori_aduan_id (kategori_aduan_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_nomor_tiket (nomor_tiket),
    SPATIAL INDEX idx_location (latitude, longitude) -- untuk spatial queries
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Columns:**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | BIGINT UNSIGNED | NO | AUTO | Primary key |
| nomor_tiket | VARCHAR(50) | NO | - | Nomor tiket unique (ADU-YYYYMMDD-XXX) |
| user_id | BIGINT UNSIGNED | NO | - | FK ke users.id (pembuat aduan) |
| kategori_aduan_id | BIGINT UNSIGNED | NO | - | FK ke kategori_aduan.id |
| deskripsi | TEXT | NO | - | Deskripsi lengkap aduan |
| latitude | DECIMAL(10,8) | NO | - | Koordinat latitude (-90 to 90) |
| longitude | DECIMAL(11,8) | NO | - | Koordinat longitude (-180 to 180) |
| alamat | TEXT | YES | NULL | Alamat hasil reverse geocoding |
| status | ENUM | NO | 'baru' | Status aduan |
| catatan_admin | TEXT | YES | NULL | Catatan dari admin/verifikator |
| tanggal_selesai | TIMESTAMP | YES | NULL | Tanggal aduan selesai |
| created_at | TIMESTAMP | YES | NULL | Timestamp created |
| updated_at | TIMESTAMP | YES | NULL | Timestamp updated |

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE INDEX: `nomor_tiket`
- FOREIGN KEY: `user_id` -> `users.id`, `kategori_aduan_id` -> `kategori_aduan.id`
- INDEX: `idx_user_id`, `idx_kategori_aduan_id`, `idx_status`, `idx_created_at`, `idx_nomor_tiket`
- SPATIAL INDEX: `idx_location` (untuk query berdasarkan jarak)

**Status Enum Values:**
- `baru`: Aduan baru masuk, belum diverifikasi
- `diverifikasi`: Aduan telah diverifikasi oleh admin
- `diproses`: Aduan sedang dalam proses penanganan
- `selesai`: Aduan telah selesai ditangani
- `ditolak`: Aduan ditolak (tidak valid/duplikat)

**Business Rules:**
- Nomor tiket auto-generated dengan format: ADU-YYYYMMDD-XXX
- Koordinat latitude harus antara -90 sampai 90
- Koordinat longitude harus antara -180 sampai 180
- Status default adalah 'baru'
- Alamat di-populate dari reverse geocoding API (Nominatim/Google Maps)

---

### 4. foto_aduan

**Description:** Tabel untuk menyimpan foto-foto bukti aduan.

```sql
CREATE TABLE foto_aduan (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    aduan_id BIGINT UNSIGNED NOT NULL,
    path VARCHAR(255) NOT NULL,
    thumbnail_path VARCHAR(255) NULL,
    file_size INT UNSIGNED NULL,
    mime_type VARCHAR(50) NULL,
    urutan TINYINT UNSIGNED DEFAULT 1,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    FOREIGN KEY (aduan_id) REFERENCES aduan(id) ON DELETE CASCADE,
    
    INDEX idx_aduan_id (aduan_id),
    INDEX idx_urutan (urutan)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Columns:**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | BIGINT UNSIGNED | NO | AUTO | Primary key |
| aduan_id | BIGINT UNSIGNED | NO | - | FK ke aduan.id |
| path | VARCHAR(255) | NO | - | Path file di storage |
| thumbnail_path | VARCHAR(255) | YES | NULL | Path thumbnail (auto-generated) |
| file_size | INT UNSIGNED | YES | NULL | Ukuran file dalam bytes |
| mime_type | VARCHAR(50) | YES | NULL | MIME type file (image/jpeg, dll) |
| urutan | TINYINT UNSIGNED | NO | 1 | Urutan foto (1-3) |
| created_at | TIMESTAMP | YES | NULL | Timestamp created |
| updated_at | TIMESTAMP | YES | NULL | Timestamp updated |

**Indexes:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `aduan_id` -> `aduan.id` (CASCADE on delete)
- INDEX: `idx_aduan_id`, `idx_urutan`

**Business Rules:**
- Minimal 1 foto, maksimal 3 foto per aduan
- Ukuran file maksimal 2MB per foto
- Format yang diterima: JPEG, PNG, JPG
- Thumbnail auto-generated dengan dimensi 300x300px
- Foto disimpan di `storage/app/public/aduan/`

---

### 5. personal_access_tokens (Laravel Sanctum)

**Description:** Tabel untuk menyimpan API tokens (Laravel Sanctum).

```sql
CREATE TABLE personal_access_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    abilities TEXT NULL,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_tokenable (tokenable_type, tokenable_id),
    INDEX idx_token (token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 🔗 Relationships Diagram

```
users (1) --------< (many) aduan
  │
  └── id
       │
       └── user_id (FK in aduan)

kategori_aduan (1) --------< (many) aduan
  │
  └── id
       │
       └── kategori_aduan_id (FK in aduan)

aduan (1) --------< (many) foto_aduan
  │
  └── id
       │
       └── aduan_id (FK in foto_aduan)
```

### Eloquent Relationships

**User Model:**
```php
public function aduan()
{
    return $this->hasMany(Aduan::class);
}
```

**KategoriAduan Model:**
```php
public function aduan()
{
    return $this->hasMany(Aduan::class);
}
```

**Aduan Model:**
```php
public function user()
{
    return $this->belongsTo(User::class);
}

public function kategoriAduan()
{
    return $this->belongsTo(KategoriAduan::class);
}

public function fotos()
{
    return $this->hasMany(FotoAduan::class)->orderBy('urutan');
}
```

**FotoAduan Model:**
```php
public function aduan()
{
    return $this->belongsTo(Aduan::class);
}
```

---

## 🔍 Query Examples

### 1. Get all aduan by user with kategori and fotos

```php
$aduan = Aduan::with(['kategoriAduan', 'fotos'])
    ->where('user_id', $userId)
    ->orderBy('created_at', 'desc')
    ->paginate(10);
```

### 2. Get aduan by status

```php
$aduanBaru = Aduan::where('status', 'baru')
    ->with(['user', 'kategoriAduan'])
    ->latest()
    ->get();
```

### 3. Find nearby aduan (within radius)

```php
// Find aduan within 5km radius
$latitude = -6.2088;
$longitude = 106.8456;
$radius = 5; // km

$aduan = Aduan::selectRaw(
    "*, 
    ( 6371 * acos( cos( radians(?) ) * 
    cos( radians( latitude ) ) * 
    cos( radians( longitude ) - radians(?) ) + 
    sin( radians(?) ) * 
    sin( radians( latitude ) ) ) ) AS distance",
    [$latitude, $longitude, $latitude]
)
->having('distance', '<', $radius)
->orderBy('distance')
->get();
```

### 4. Get statistics by kategori

```php
$stats = Aduan::select('kategori_aduan_id', DB::raw('count(*) as total'))
    ->groupBy('kategori_aduan_id')
    ->with('kategoriAduan')
    ->get();
```

### 5. Get aduan with all relations

```php
$aduan = Aduan::with([
    'user:id,name,no_hp',
    'kategoriAduan:id,nama,slug',
    'fotos'
])->findOrFail($id);
```

---

## ⚙️ Database Configuration

### MySQL Configuration

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=responta
DB_USERNAME=root
DB_PASSWORD=
```

**Recommended MySQL Settings:**
```ini
innodb_buffer_pool_size = 256M
innodb_log_file_size = 64M
max_connections = 150
query_cache_size = 32M
```

### PostgreSQL Configuration

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=responta
DB_USERNAME=postgres
DB_PASSWORD=
```

**Recommended PostgreSQL Settings:**
```ini
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 16MB
maintenance_work_mem = 64MB
```

---

## 🔒 Data Security

### Encrypted Fields

**NIK Encryption:**
```php
// In User model
protected $casts = [
    'nik' => 'encrypted',
];
```

### Data Access Control

1. **User dapat melihat:**
   - Hanya aduan yang mereka buat sendiri
   - Profil mereka sendiri

2. **Admin dapat melihat:**
   - Semua aduan
   - Statistik dan analytics

3. **Row Level Security:**
```php
// Policy untuk Aduan
public function view(User $user, Aduan $aduan)
{
    return $user->id === $aduan->user_id;
}
```

---

## 🛠️ Maintenance

### Backup Strategy

```bash
# Daily backup
0 2 * * * mysqldump -u root responta > /backup/responta_$(date +\%Y\%m\%d).sql

# Weekly full backup
0 3 * * 0 mysqldump -u root --all-databases > /backup/full_$(date +\%Y\%m\%d).sql
```

### Index Optimization

```sql
-- Analyze tables monthly
ANALYZE TABLE users, aduan, kategori_aduan, foto_aduan;

-- Optimize tables monthly
OPTIMIZE TABLE users, aduan, kategori_aduan, foto_aduan;
```

### Data Retention

- Aduan dengan status 'selesai': Simpan permanent
- Aduan dengan status 'ditolak': Arsip setelah 6 bulan
- Foto aduan: Simpan selama aduan masih aktif
- API tokens: Auto-expire setelah 30 hari tidak digunakan

---

## 📊 Performance Optimization

### Indexing Strategy

1. **Primary Keys:** Semua tabel menggunakan BIGINT UNSIGNED AUTO_INCREMENT
2. **Foreign Keys:** Semua FK di-index
3. **Search Fields:** no_hp, nomor_tiket, status di-index
4. **Date Fields:** created_at di-index untuk sorting
5. **Spatial Index:** latitude, longitude untuk proximity search

### Query Optimization Tips

1. Gunakan eager loading untuk relasi:
   ```php
   Aduan::with(['user', 'kategoriAduan', 'fotos'])->get();
   ```

2. Gunakan select() untuk limit fields:
   ```php
   User::select('id', 'name', 'no_hp')->get();
   ```

3. Gunakan pagination:
   ```php
   Aduan::paginate(15);
   ```

4. Gunakan caching untuk data yang jarang berubah:
   ```php
   Cache::remember('kategori_aduan', 3600, function () {
       return KategoriAduan::where('is_active', true)->get();
   });
   ```

---

## 📝 Migration Files Checklist

- [ ] `xxxx_xx_xx_update_users_table.php` - Add no_hp, nik fields
- [ ] `xxxx_xx_xx_create_kategori_aduan_table.php`
- [ ] `xxxx_xx_xx_create_aduan_table.php`
- [ ] `xxxx_xx_xx_create_foto_aduan_table.php`
- [ ] `xxxx_xx_xx_create_personal_access_tokens_table.php` (Sanctum)

---

**Version:** 0.1.0  
**Last Updated:** 2025-01-31  
**Database Engine:** InnoDB (MySQL) / PostgreSQL  
**Charset:** utf8mb4_unicode_ci
