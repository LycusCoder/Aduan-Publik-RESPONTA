# 📱 RESPONTA - Sistem Manajemen Aduan Publik

## Deskripsi Aplikasi

RESPONTA adalah aplikasi manajemen aduan publik berbasis web yang memungkinkan warga untuk melaporkan permasalahan non-darurat di wilayah mereka. Sistem ini menggunakan teknologi GIS untuk pemetaan lokasi dan mempermudah koordinasi antara warga dengan instansi pemerintah terkait.

## 🎯 Tujuan Sistem

- Memberikan platform mudah bagi warga untuk menyampaikan aduan
- Meningkatkan transparansi penanganan keluhan publik
- Mempercepat koordinasi antar instansi dalam penanganan aduan
- Memberikan tracking status aduan secara real-time
- Meningkatkan akuntabilitas pelayanan publik

## 🏗️ Arsitektur Sistem

### Tech Stack

**Backend:**
- Framework: Laravel 12.x
- Database: MySQL 8.0+ / PostgreSQL 15+
- Authentication: Laravel Sanctum
- File Storage: Laravel Storage (Local/S3)
- Queue: Laravel Queue (Database/Redis)

**Frontend:**
- Framework: Vue.js 3 / React 18 (dengan Inertia.js)
- Map Library: Leaflet.js
- UI Framework: Tailwind CSS
- Build Tool: Vite

**Additional Tools:**
- Image Processing: Intervention Image
- API Documentation: Laravel Scramble / Scribe
- Code Quality: Laravel Pint, PHPStan

## 📋 Modul Sistem

### Modul 1: Portal Aduan Warga (Citizen-Facing)
**Status:** 📝 Dokumentasi

Modul ini adalah front-end yang digunakan oleh warga untuk:
- Registrasi dan autentikasi menggunakan nomor HP
- Membuat laporan aduan dengan foto dan lokasi GIS
- Melihat status dan riwayat aduan

Detail lengkap: [Lihat Dokumentasi Modul 1](docs/MODULE_01_CITIZEN_PORTAL.md)

### Modul 2: Portal Admin/Verifikator (Internal)
**Status:** 🔜 Planned

Modul untuk admin dan verifikator melakukan:
- Verifikasi aduan yang masuk
- Disposisi aduan ke dinas terkait
- Monitoring dashboard

### Modul 3: Portal Dinas Pelaksana
**Status:** 🔜 Planned

Modul untuk dinas terkait:
- Menerima aduan yang didisposisi
- Update progress penanganan
- Upload dokumentasi penyelesaian

### Modul 4: Dashboard & Reporting
**Status:** 🔜 Planned

Modul analitik dan pelaporan:
- Dashboard statistik real-time
- Report generator
- Data visualization

## 📊 Entity Relationship Diagram

```
┌─────────────────┐
│     Users       │
│─────────────────│
│ id (PK)         │
│ name            │
│ no_hp (unique)  │
│ nik (unique)    │◄────┐
│ password        │     │
│ timestamps      │     │
└─────────────────┘     │
                        │ user_id (FK)
                        │
┌─────────────────┐     │
│ KategoriAduan   │     │
│─────────────────│     │    ┌─────────────────┐
│ id (PK)         │◄────┼────│     Aduan       │
│ nama            │     │    │─────────────────│
│ slug            │     │    │ id (PK)         │
│ icon            │     └────│ user_id (FK)    │
│ dinas_id (FK)   │          │ kategori_id(FK) │
│ timestamps      │          │ deskripsi       │
└─────────────────┘          │ latitude        │
                             │ longitude       │
                             │ status          │◄────┐
                             │ nomor_tiket     │     │
                             │ timestamps      │     │
                             └─────────────────┘     │
                                                     │ aduan_id (FK)
                                                     │
                             ┌─────────────────┐     │
                             │   FotoAduan     │     │
                             │─────────────────│     │
                             │ id (PK)         │     │
                             │ aduan_id (FK)   │─────┘
                             │ path            │
                             │ timestamps      │
                             └─────────────────┘
```

## 🔑 Fitur Utama

### Autentikasi & Keamanan
- ✅ Registrasi dengan validasi NIK
- ✅ OTP verification via SMS
- ✅ Token-based authentication (Sanctum)
- ✅ Encrypted data untuk informasi sensitif (NIK)

### Manajemen Aduan
- ✅ Form aduan dengan kategori dropdown
- ✅ Upload multiple foto (1-3 foto)
- ✅ Pemilihan lokasi dengan GIS map (Leaflet.js)
- ✅ Auto-generate nomor tiket unique
- ✅ Tracking status aduan real-time

### GIS & Mapping
- ✅ Interactive map dengan Leaflet.js
- ✅ Pin-drop untuk lokasi aduan
- ✅ Auto-capture latitude & longitude
- ✅ Reverse geocoding untuk alamat

## 📁 Struktur Project

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── API/
│   │   │   ├── Auth/
│   │   │   │   ├── RegisterController.php
│   │   │   │   ├── LoginController.php
│   │   │   │   └── LogoutController.php
│   │   │   ├── KategoriAduanController.php
│   │   │   └── AduanController.php
│   │   └── Web/
│   ├── Requests/
│   │   ├── Auth/
│   │   │   ├── RegisterRequest.php
│   │   │   └── LoginRequest.php
│   │   └── StoreAduanRequest.php
│   ├── Resources/
│   │   ├── AduanResource.php
│   │   ├── KategoriAduanResource.php
│   │   └── UserResource.php
│   └── Middleware/
├── Models/
│   ├── User.php
│   ├── KategoriAduan.php
│   ├── Aduan.php
│   └── FotoAduan.php
├── Services/
│   ├── OTPService.php
│   ├── FileUploadService.php
│   └── TicketGeneratorService.php
└── Observers/
    └── AduanObserver.php

database/
├── migrations/
│   ├── xxxx_update_users_table.php
│   ├── xxxx_create_kategori_aduan_table.php
│   ├── xxxx_create_aduan_table.php
│   └── xxxx_create_foto_aduan_table.php
├── seeders/
│   ├── KategoriAduanSeeder.php
│   └── UserSeeder.php
└── factories/
    └── AduanFactory.php

routes/
├── api.php      # API endpoints untuk mobile/SPA
└── web.php      # Web routes untuk Inertia

resources/
├── js/
│   ├── Pages/
│   │   ├── Auth/
│   │   │   ├── Register.vue
│   │   │   └── Login.vue
│   │   ├── Aduan/
│   │   │   ├── Create.vue
│   │   │   ├── Index.vue
│   │   │   └── Show.vue
│   │   └── Dashboard.vue
│   └── Components/
│       ├── MapPicker.vue
│       ├── PhotoUploader.vue
│       └── StatusBadge.vue
└── views/      # Blade views (jika tidak pakai Inertia)

tests/
├── Feature/
│   ├── Auth/
│   │   ├── RegisterTest.php
│   │   └── LoginTest.php
│   └── Aduan/
│       ├── CreateAduanTest.php
│       └── ListAduanTest.php
└── Unit/
    └── Services/
        └── TicketGeneratorServiceTest.php

docs/
├── API_DOCUMENTATION.md
├── DATABASE_SCHEMA.md
├── SETUP_GUIDE.md
├── DEPLOYMENT_GUIDE.md
└── MODULE_01_CITIZEN_PORTAL.md
```

## 🚀 Quick Start

Lihat [Setup Guide](docs/SETUP_GUIDE.md) untuk instruksi instalasi lengkap.

```bash
# Clone repository
git clone <repository-url>

# Install dependencies
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Setup database
php artisan migrate --seed

# Start development server
composer run dev
```

## 📖 Dokumentasi Lengkap

- [Setup Guide](docs/SETUP_GUIDE.md) - Panduan instalasi dan konfigurasi
- [API Documentation](docs/API_DOCUMENTATION.md) - Dokumentasi API endpoints
- [Database Schema](docs/DATABASE_SCHEMA.md) - Skema database lengkap
- [Module 1: Citizen Portal](docs/MODULE_01_CITIZEN_PORTAL.md) - Dokumentasi modul warga
- [Development Roadmap](docs/DEVELOPMENT_ROADMAP.md) - Roadmap pengembangan

## 🔄 Development Phases

### ✅ Phase 0: Dokumentasi & Setup (Current)
- [x] Dokumentasi arsitektur sistem
- [x] Dokumentasi API
- [x] Dokumentasi database schema
- [x] Setup dependencies
- [x] Environment configuration

### 📝 Phase 1: Database & Models
- [ ] Migrasi database
- [ ] Eloquent models dengan relasi
- [ ] Model factories & seeders
- [ ] Unit tests untuk models

### 📝 Phase 2: Authentication System
- [ ] Setup Laravel Sanctum
- [ ] Register & Login API
- [ ] OTP verification
- [ ] NIK validation integration

### 📝 Phase 3: Aduan Management
- [ ] CRUD aduan API
- [ ] File upload handling
- [ ] Ticket generator
- [ ] Status management

### 📝 Phase 4: Frontend Implementation
- [ ] Setup Inertia.js
- [ ] Auth pages (Register/Login)
- [ ] Aduan form dengan map picker
- [ ] Daftar aduan & detail

### 📝 Phase 5: Testing & Refinement
- [ ] Feature tests
- [ ] Integration tests
- [ ] Performance optimization
- [ ] Security audit

## 🤝 Contributing

Lihat [CONTRIBUTING.md](CONTRIBUTING.md) untuk panduan kontribusi.

## 📄 License

MIT License - lihat [LICENSE](LICENSE) untuk detail.

## 👥 Team

- **Project Manager:** -
- **Backend Developer:** -
- **Frontend Developer:** -
- **UI/UX Designer:** -
- **QA Engineer:** -

## 📞 Contact

Untuk pertanyaan atau dukungan:
- Email: support@responta.id
- Documentation: https://docs.responta.id

---

**Version:** 0.1.0 (Phase 0 - Documentation)  
**Last Updated:** 2025-01-31  
**Status:** 📝 In Documentation Phase
