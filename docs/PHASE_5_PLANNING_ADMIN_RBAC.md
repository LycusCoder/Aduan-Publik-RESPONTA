# 📋 Phase 5 Planning - Admin Panel & RBAC System

**Created:** 2025-11-01  
**Version:** 1.0.0  
**Status:** Planning & Analysis

---

## 🎯 Vision & Scope

**RESPONTA** akan berkembang dari sistem aduan warga sederhana menjadi **platform transformasi digital pemerintahan lengkap** yang mencakup:

1. ✅ **Sistem Aduan Warga** (Phase 1-4 - COMPLETE)
2. 🚧 **Admin Panel dengan RBAC** (Phase 5 - THIS PHASE)
3. 📋 **Sistem Surat Menyurat Digital** (Future)
4. 📊 **Dashboard & Reporting** (Future)
5. 🏛️ **Multi-Organization Management** (Future)

**Scope Phase 5:** Admin Panel dengan Role-Based Access Control (RBAC) yang scalable untuk mendukung struktur organisasi pemerintahan multi-level.

---

## 🏛️ Struktur Organisasi Pemerintahan Indonesia

### Level Hierarki

```
Kota/Kabupaten
└── Kecamatan (dipimpin Camat)
    └── Kelurahan (dipimpin Lurah)
        └── RW → RT → Warga
```

### Struktur Kecamatan

```
Camat (Kepala Kecamatan)
├── Sekretariat Kecamatan
│   ├── Subbag Umum & Kepegawaian
│   └── Subbag Perencanaan & Keuangan
├── Seksi Pemerintahan
├── Seksi Pemberdayaan Masyarakat
├── Seksi Ketentraman, Ketertiban & Perlindungan Masyarakat
├── Seksi Perekonomian & Pembangunan
├── Seksi Pelayanan
└── Kelurahan-kelurahan
```

### Struktur Kelurahan

```
Lurah (Kepala Kelurahan)
├── Sekretariat Kelurahan
├── Seksi Pemerintahan
├── Seksi Pelayanan
├── Seksi Pemberdayaan Masyarakat
└── Seksi Ketentraman & Ketertiban
```

### Dinas Terkait (Level Kota/Kabupaten)

- **DPU (Dinas Pekerjaan Umum)** - Handle jalan rusak, infrastruktur
- **Dinas Lingkungan Hidup** - Handle sampah, kebersihan
- **Dinas Perhubungan** - Handle lampu jalan, rambu
- **Dinsos (Dinas Sosial)** - Handle masalah sosial
- **Disdukcapil** - Handle administrasi kependudukan
- **Dan lain-lain**

---

## 👥 Rekomendasi Struktur Role & Permission

### Role Hierarchy (dari tertinggi ke terendah)

```
1. Super Admin (System Administrator)
   ├── 2. Admin Kota/Kabupaten
   │   ├── 3. Kepala Dinas (per Dinas)
   │   │   └── 4. Staf Dinas
   │   ├── 5. Camat (Kepala Kecamatan)
   │   │   └── 6. Staf Kecamatan
   │   └── 7. Lurah (Kepala Kelurahan)
   │       └── 8. Staf Kelurahan
   ├── 9. Verifikator (Verifikasi aduan)
   ├── 10. Teknisi Lapangan (Update progress)
   └── 11. Warga (Citizen)
```

### Detail Role & Permission

#### 1. **Super Admin** (System Administrator)
**Deskripsi:** Administrator sistem, mengelola konfigurasi dan user management level tertinggi.

**Permissions:**
- ✅ Full access ke semua fitur
- ✅ Manage all users & roles
- ✅ Manage organizations (Kota, Kecamatan, Kelurahan, Dinas)
- ✅ System settings & configurations
- ✅ View all statistics & reports
- ✅ Export data
- ✅ Audit logs

**Use Case:**
- Tim IT Pemkot/Pemkab
- Developer/Vendor sistem

---

#### 2. **Admin Kota/Kabupaten**
**Deskripsi:** Administrator level Kota/Kabupaten, koordinasi seluruh wilayah.

**Permissions:**
- ✅ View all aduan di seluruh wilayah
- ✅ Manage users (Kepala Dinas, Camat, Lurah)
- ✅ Assign aduan ke dinas terkait
- ✅ View dashboard & statistics (semua kecamatan)
- ✅ Generate reports
- ✅ Manage kategori aduan
- ⛔ Cannot delete users

**Use Case:**
- Bagian Humas Pemkot/Pemkab
- Bagian TI Pemkot/Pemkab

---

#### 3. **Kepala Dinas** (Head of Department)
**Deskripsi:** Kepala dinas teknis (DPU, Dishub, DLH, dll).

**Permissions:**
- ✅ View aduan yang di-assign ke dinasnya
- ✅ Assign aduan ke teknisi/staf
- ✅ Update status aduan (diverifikasi → diproses → selesai)
- ✅ Add catatan/keterangan
- ✅ View statistics dinasnya
- ✅ Manage staf dinasnya
- ⛔ Cannot view aduan dinas lain

**Use Case:**
- Kepala Dinas Pekerjaan Umum
- Kepala Dinas Lingkungan Hidup
- Kepala Dinas Perhubungan

---

#### 4. **Staf Dinas** (Department Staff)
**Deskripsi:** Staf/pegawai dinas teknis.

**Permissions:**
- ✅ View aduan yang di-assign kepadanya
- ✅ Update progress aduan
- ✅ Upload foto progress
- ✅ Add catatan pekerjaan
- ⛔ Cannot change status akhir (butuh approval Kepala Dinas)
- ⛔ Cannot view aduan yang tidak di-assign

**Use Case:**
- Staf Teknis Dinas
- Koordinator Lapangan

---

#### 5. **Camat** (Head of District)
**Deskripsi:** Kepala Kecamatan, monitoring aduan di wilayah kecamatannya.

**Permissions:**
- ✅ View all aduan di kecamatannya
- ✅ View statistics kecamatan
- ✅ Prioritize aduan (set priority: low, medium, high, urgent)
- ✅ Add notes/recommendations
- ✅ Forward aduan ke Admin Kota untuk escalation
- ⛔ Cannot directly change status

**Use Case:**
- Camat Kecamatan A, B, C, dst

---

#### 6. **Staf Kecamatan** (District Staff)
**Deskripsi:** Staf administrasi kecamatan.

**Permissions:**
- ✅ View aduan di kecamatannya
- ✅ Add notes
- ✅ Contact warga untuk klarifikasi
- ⛔ Cannot change status

**Use Case:**
- Sekretaris Kecamatan
- Staf Pelayanan Kecamatan

---

#### 7. **Lurah** (Village Head)
**Deskripsi:** Kepala Kelurahan, monitoring aduan di wilayah kelurahannya.

**Permissions:**
- ✅ View all aduan di kelurahannya
- ✅ View statistics kelurahan
- ✅ Add notes/recommendations
- ✅ Forward ke Camat jika perlu escalation
- ⛔ Cannot change status

**Use Case:**
- Lurah Kelurahan A, B, C, dst

---

#### 8. **Staf Kelurahan** (Village Staff)
**Deskripsi:** Staf administrasi kelurahan.

**Permissions:**
- ✅ View aduan di kelurahannya
- ✅ Add notes
- ✅ Contact warga
- ⛔ Cannot change status

**Use Case:**
- Sekretaris Kelurahan
- Staf Pelayanan Kelurahan

---

#### 9. **Verifikator**
**Deskripsi:** Petugas khusus verifikasi aduan (cek validitas, foto, lokasi).

**Permissions:**
- ✅ View all new aduan (status: baru)
- ✅ Verify aduan (baru → diverifikasi)
- ✅ Reject aduan (baru → ditolak) dengan alasan
- ✅ Add verification notes
- ✅ Request additional info from warga
- ⛔ Cannot change status beyond verification

**Use Case:**
- Tim Verifikasi Aduan
- Quality Control

---

#### 10. **Teknisi Lapangan** (Field Technician)
**Deskripsi:** Teknisi/pekerja lapangan yang handle perbaikan.

**Permissions:**
- ✅ View aduan yang di-assign kepadanya
- ✅ Update progress (0-100%)
- ✅ Upload foto before/after
- ✅ Check-in/check-out lokasi
- ✅ Mark as completed
- ⛔ Cannot verify or reject aduan

**Use Case:**
- Tukang listrik (Dishub)
- Tukang aspal (DPU)
- Petugas kebersihan (DLH)

---

#### 11. **Warga** (Citizen)
**Deskripsi:** Masyarakat umum, pembuat aduan.

**Permissions:**
- ✅ Create aduan
- ✅ View own aduan only
- ✅ Edit aduan (hanya status: baru)
- ✅ Delete aduan (hanya status: baru)
- ✅ Track status aduan
- ✅ Rate service (after completed)
- ⛔ Cannot view other user's aduan

**Use Case:**
- Masyarakat umum

---

## 📊 Permission Matrix

| Permission | Super<br>Admin | Admin<br>Kota | Kepala<br>Dinas | Staf<br>Dinas | Camat | Staf<br>Kec | Lurah | Staf<br>Kel | Verif | Teknisi | Warga |
|------------|:--------------:|:-------------:|:---------------:|:-------------:|:-----:|:-----------:|:-----:|:-----------:|:-----:|:-------:|:-----:|
| View All Aduan | ✅ | ✅ | 🔶 Dinas | 🔶 Assigned | 🔶 Kec | 🔶 Kec | 🔶 Kel | 🔶 Kel | ✅ New | 🔶 Assigned | 🔶 Own |
| Create Aduan | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Verify Aduan | ✅ | ✅ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ✅ | ⛔ | ⛔ |
| Assign to Dinas | ✅ | ✅ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ |
| Assign to Staff | ✅ | ✅ | ✅ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ |
| Update Status | ✅ | ✅ | ✅ | 🔶 Progress | ⛔ | ⛔ | ⛔ | ⛔ | 🔶 Verify | 🔶 Progress | ⛔ |
| Add Notes | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⛔ |
| Upload Photos | ✅ | ✅ | ✅ | ✅ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ✅ | ✅ |
| View Statistics | ✅ | ✅ | 🔶 Dinas | 🔶 Own | 🔶 Kec | ⛔ | 🔶 Kel | ⛔ | ⛔ | ⛔ | ⛔ |
| Generate Reports | ✅ | ✅ | ✅ | ⛔ | ✅ | ⛔ | ✅ | ⛔ | ⛔ | ⛔ | ⛔ |
| Manage Users | ✅ | 🔶 Limited | 🔶 Staff | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ |
| System Settings | ✅ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ | ⛔ |

**Legend:**
- ✅ Full Access
- 🔶 Limited/Filtered Access
- ⛔ No Access

---

## 🗄️ Database Schema Updates (Phase 5)

### New Tables

#### 1. **roles** table
```sql
CREATE TABLE roles (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE, -- 'super_admin', 'admin_kota', 'kepala_dinas', etc
    display_name VARCHAR(255) NOT NULL, -- 'Super Admin', 'Kepala Dinas', etc
    description TEXT,
    level INT NOT NULL DEFAULT 99, -- 1=highest, 99=lowest
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### 2. **permissions** table
```sql
CREATE TABLE permissions (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE, -- 'view_all_aduan', 'verify_aduan', etc
    display_name VARCHAR(255) NOT NULL,
    description TEXT,
    group VARCHAR(100), -- 'aduan', 'user', 'report', etc
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### 3. **role_permission** (pivot table)
```sql
CREATE TABLE role_permission (
    role_id BIGINT UNSIGNED,
    permission_id BIGINT UNSIGNED,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);
```

#### 4. **organizations** table
```sql
CREATE TABLE organizations (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    parent_id BIGINT UNSIGNED NULL, -- for hierarchy
    type ENUM('kota', 'kecamatan', 'kelurahan', 'dinas'), -- organization type
    name VARCHAR(255) NOT NULL, -- 'Kota Tegal', 'Kecamatan Tegal Barat', 'Kelurahan Kraton'
    code VARCHAR(50) UNIQUE, -- '3376' for Kota Tegal, '3376010' for Kecamatan
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES organizations(id) ON DELETE SET NULL
);
```

#### 5. **dinas** table (Dinas/Department)
```sql
CREATE TABLE dinas (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    organization_id BIGINT UNSIGNED, -- link to organizations (kota level)
    name VARCHAR(255) NOT NULL, -- 'Dinas Pekerjaan Umum'
    code VARCHAR(50) UNIQUE, -- 'DPU', 'DISHUB', 'DLH'
    description TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);
```

### Updated Tables

#### Update **users** table
```sql
ALTER TABLE users ADD COLUMN role_id BIGINT UNSIGNED AFTER password;
ALTER TABLE users ADD COLUMN organization_id BIGINT UNSIGNED NULL AFTER role_id; -- Kecamatan/Kelurahan
ALTER TABLE users ADD COLUMN dinas_id BIGINT UNSIGNED NULL AFTER organization_id;
ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE AFTER dinas_id;
ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT TRUE AFTER is_admin;
ALTER TABLE users ADD COLUMN last_login_at TIMESTAMP NULL AFTER is_active;

ALTER TABLE users ADD FOREIGN KEY (role_id) REFERENCES roles(id);
ALTER TABLE users ADD FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL;
ALTER TABLE users ADD FOREIGN KEY (dinas_id) REFERENCES dinas(id) ON DELETE SET NULL;
```

#### Update **aduan** table
```sql
ALTER TABLE aduan ADD COLUMN dinas_id BIGINT UNSIGNED NULL AFTER kategori_aduan_id; -- assigned dinas
ALTER TABLE aduan ADD COLUMN assigned_to BIGINT UNSIGNED NULL AFTER dinas_id; -- assigned teknisi/staf
ALTER TABLE aduan ADD COLUMN verifikator_id BIGINT UNSIGNED NULL AFTER assigned_to;
ALTER TABLE aduan ADD COLUMN organization_id BIGINT UNSIGNED NULL AFTER verifikator_id; -- kelurahan of reporter
ALTER TABLE aduan ADD COLUMN priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium' AFTER status;
ALTER TABLE aduan ADD COLUMN tanggal_verifikasi TIMESTAMP NULL AFTER tanggal_selesai;
ALTER TABLE aduan ADD COLUMN tanggal_diproses TIMESTAMP NULL AFTER tanggal_verifikasi;
ALTER TABLE aduan ADD COLUMN progress INT DEFAULT 0 AFTER priority; -- 0-100%
ALTER TABLE aduan ADD COLUMN catatan_admin TEXT NULL AFTER catatan_penolakan;
ALTER TABLE aduan ADD COLUMN catatan_verifikasi TEXT NULL AFTER catatan_admin;

ALTER TABLE aduan ADD FOREIGN KEY (dinas_id) REFERENCES dinas(id) ON DELETE SET NULL;
ALTER TABLE aduan ADD FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE aduan ADD FOREIGN KEY (verifikator_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE aduan ADD FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL;
```

#### New: **aduan_history** table (Activity Log)
```sql
CREATE TABLE aduan_history (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    aduan_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL, -- who did the action
    action VARCHAR(100) NOT NULL, -- 'created', 'verified', 'assigned', 'updated_status', etc
    old_value TEXT NULL, -- for tracking changes
    new_value TEXT NULL,
    notes TEXT NULL,
    created_at TIMESTAMP,
    FOREIGN KEY (aduan_id) REFERENCES aduan(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 📋 Phase 5 Implementation Tasks

### Milestone 1: Database & Models (2 hari)

#### 1.1 Migrations
- [ ] Create `roles` table migration
- [ ] Create `permissions` table migration
- [ ] Create `role_permission` pivot table migration
- [ ] Create `organizations` table migration
- [ ] Create `dinas` table migration
- [ ] Update `users` table migration (add role_id, organization_id, dinas_id, is_admin)
- [ ] Update `aduan` table migration (add dinas_id, assigned_to, verifikator_id, priority, progress)
- [ ] Create `aduan_history` table migration

#### 1.2 Models
- [ ] Create `Role` model with relationships
- [ ] Create `Permission` model
- [ ] Create `Organization` model with tree structure
- [ ] Create `Dinas` model
- [ ] Create `AduanHistory` model
- [ ] Update `User` model (add role, organization, dinas relationships)
- [ ] Update `Aduan` model (add new relationships)

#### 1.3 Seeders
- [ ] RoleSeeder (11 roles)
- [ ] PermissionSeeder (30+ permissions)
- [ ] RolePermissionSeeder (assign permissions to roles)
- [ ] OrganizationSeeder (sample: 1 kota, 4 kecamatan, 8 kelurahan)
- [ ] DinasSeeder (sample: DPU, Dishub, DLH, Dinsos)
- [ ] AdminUserSeeder (create admin users for each role)

---

### Milestone 2: Backend Admin API (3 hari)

#### 2.1 Middleware & Policies
- [ ] Create `RoleMiddleware` (check user role)
- [ ] Create `PermissionMiddleware` (check user permission)
- [ ] Update `AduanPolicy` (add RBAC checks)
- [ ] Create `UserPolicy` (admin user management)

#### 2.2 Controllers
- [ ] **AdminAuthController** (admin login, separate from warga)
  - POST `/api/admin/login`
  - POST `/api/admin/logout`
  - GET `/api/admin/me`
  
- [ ] **AdminDashboardController**
  - GET `/api/admin/dashboard` (statistics based on role)
  - GET `/api/admin/statistics` (charts data)
  
- [ ] **AdminAduanController**
  - GET `/api/admin/aduan` (list dengan filters & role-based)
  - GET `/api/admin/aduan/{id}` (detail)
  - PUT `/api/admin/aduan/{id}/verify` (verify aduan)
  - PUT `/api/admin/aduan/{id}/reject` (reject aduan)
  - PUT `/api/admin/aduan/{id}/assign` (assign to dinas/staff)
  - PUT `/api/admin/aduan/{id}/status` (update status)
  - PUT `/api/admin/aduan/{id}/priority` (set priority)
  - POST `/api/admin/aduan/{id}/notes` (add admin notes)
  - GET `/api/admin/aduan/{id}/history` (activity log)
  
- [ ] **AdminUserController**
  - GET `/api/admin/users` (list users with filters)
  - POST `/api/admin/users` (create user)
  - GET `/api/admin/users/{id}` (user detail)
  - PUT `/api/admin/users/{id}` (update user)
  - PUT `/api/admin/users/{id}/activate` (activate/deactivate)
  - DELETE `/api/admin/users/{id}` (soft delete)
  
- [ ] **OrganizationController**
  - GET `/api/admin/organizations` (list)
  - GET `/api/admin/organizations/{id}/tree` (hierarchy)
  
- [ ] **DinasController**
  - GET `/api/admin/dinas` (list)
  - POST `/api/admin/dinas` (create)
  - PUT `/api/admin/dinas/{id}` (update)

#### 2.3 Services
- [ ] **RBACService** (check permissions)
- [ ] **AduanAssignmentService** (assign logic)
- [ ] **NotificationService** (notify users on status change)
- [ ] **StatisticsService** (generate statistics based on role)

#### 2.4 Resources (API Response)
- [ ] AdminUserResource
- [ ] AdminAduanResource
- [ ] OrganizationResource
- [ ] DinasResource
- [ ] RoleResource

---

### Milestone 3: Frontend Admin Panel (4 hari)

#### 3.1 Admin Layout & Components
- [ ] AdminLayout.tsx (sidebar, header, content)
- [ ] Sidebar.tsx (navigation based on role)
- [ ] AdminHeader.tsx (user dropdown, notifications)
- [ ] Breadcrumb.tsx
- [ ] DataTable.tsx (reusable table component)
- [ ] StatusBadge.tsx (update dengan priority colors)
- [ ] RoleGuard.tsx (protect routes by permission)

#### 3.2 Admin Authentication
- [ ] AdminLogin.tsx (separate from warga login)
- [ ] Route: `/admin/login`

#### 3.3 Admin Dashboard
- [ ] AdminDashboard.tsx
  - Statistics cards (role-based)
  - Charts (line, bar, pie)
  - Recent activities
  - Quick actions
- [ ] Route: `/admin/dashboard`

#### 3.4 Aduan Management
- [ ] AdminAduanList.tsx
  - Advanced filters (status, kategori, dinas, kecamatan, tanggal, priority)
  - Bulk actions (assign, verify)
  - Export to Excel/PDF
- [ ] AdminAduanDetail.tsx
  - Full aduan info
  - Action buttons (verify, reject, assign, update status)
  - Add notes form
  - Activity timeline
  - Photos gallery
  - Map location
- [ ] AssignAduanModal.tsx (assign to dinas/staff)
- [ ] VerifyAduanModal.tsx (verify/reject)
- [ ] UpdateStatusModal.tsx (update status)
- [ ] Routes:
  - `/admin/aduan`
  - `/admin/aduan/:id`

#### 3.5 User Management
- [ ] AdminUserList.tsx
  - Filters (role, organization, dinas, status)
  - Create user button
- [ ] AdminUserForm.tsx (create/edit user)
  - Role selection
  - Organization/Dinas selection (conditional)
  - Permissions override
- [ ] AdminUserDetail.tsx
  - User info
  - Activity log
  - Assigned aduan
  - Statistics
- [ ] Routes:
  - `/admin/users`
  - `/admin/users/create`
  - `/admin/users/:id`
  - `/admin/users/:id/edit`

#### 3.6 Reports & Statistics
- [ ] ReportsPage.tsx
  - Date range picker
  - Report type selection
  - Generate & download
- [ ] Route: `/admin/reports`

#### 3.7 Settings (Super Admin only)
- [ ] SettingsPage.tsx
  - Manage roles & permissions
  - Manage organizations
  - Manage dinas
  - System settings
- [ ] Route: `/admin/settings`

---

### Milestone 4: Testing & Documentation (1 hari)

#### 4.1 Testing
- [ ] Test RBAC middleware
- [ ] Test permission checks
- [ ] Test admin API endpoints
- [ ] Test admin UI flows
- [ ] Test role-based data filtering

#### 4.2 Documentation
- [ ] Update API_DOCUMENTATION.md (add admin endpoints)
- [ ] Create ADMIN_GUIDE.md (user manual untuk admin)
- [ ] Update DATABASE_SCHEMA.md (new tables)
- [ ] Create docs/phase/phase-5-completion.md

---

## 🎯 Success Criteria

### Must Have ✅
- [ ] 11 roles dengan permissions matrix lengkap
- [ ] Database schema dengan RBAC tables
- [ ] Admin authentication (terpisah dari warga)
- [ ] Admin dashboard dengan statistics
- [ ] Aduan management dengan verify/assign/update status
- [ ] User management (create, edit, activate/deactivate)
- [ ] Role-based access control working correctly
- [ ] Activity log untuk setiap perubahan aduan

### Nice to Have 🌟
- [ ] Multi-level approval workflow
- [ ] Email/SMS notification system
- [ ] Advanced reporting & charts
- [ ] Export data to Excel/PDF
- [ ] Real-time notifications (websocket)
- [ ] Mobile-responsive admin panel

---

## 📊 Estimated Timeline

| Milestone | Duration | Tasks |
|-----------|----------|-------|
| M1: Database & Models | 2 hari | Migrations, Models, Seeders |
| M2: Backend Admin API | 3 hari | Controllers, Services, Policies |
| M3: Frontend Admin Panel | 4 hari | Pages, Components, Integration |
| M4: Testing & Docs | 1 hari | Testing, Documentation |
| **Total** | **10 hari** | ~80 jam |

---

## 🚀 Phase 5 Deliverables

1. ✅ **11 roles** dengan permission matrix lengkap
2. ✅ **6 new database tables** + update existing tables
3. ✅ **10+ admin API endpoints** dengan RBAC
4. ✅ **8+ admin pages** (dashboard, aduan, users, reports)
5. ✅ **Activity logging** untuk audit trail
6. ✅ **Role-based dashboard** dengan statistics
7. ✅ **Documentation** lengkap (API + User Manual)

---

## 🔮 Future Enhancements (Phase 6+)

### Sistem Surat Menyurat Digital
- [ ] Surat masuk/keluar
- [ ] Nomor surat otomatis
- [ ] Disposisi surat elektronik
- [ ] E-signature (tanda tangan digital)
- [ ] Template surat
- [ ] Arsip digital searchable
- [ ] Tracking status surat

### Advanced Features
- [ ] Multi-language support
- [ ] Mobile app (Flutter/React Native)
- [ ] Integration dengan SIAK (Sistem Informasi Administrasi Kependudukan)
- [ ] Integration dengan e-Budgeting
- [ ] Public dashboard (transparansi untuk warga)
- [ ] API untuk third-party integration

---

## 💡 Notes & Considerations

### Keamanan
- Password hashing dengan bcrypt
- Token expiration (24 jam untuk admin)
- Rate limiting untuk admin login
- Audit log untuk sensitive actions
- CORS configuration untuk admin panel

### Performance
- Database indexing untuk foreign keys
- Pagination untuk list pages
- Lazy loading untuk images
- Cache untuk statistics queries

### Scalability
- Support multi-tenancy (bisa deploy untuk multiple kota)
- Database partitioning untuk large data
- Queue jobs untuk email/SMS notifications
- CDN untuk static assets

---

**Version:** 1.0.0  
**Last Updated:** 2025-11-01  
**Next Review:** Start of Phase 5 Implementation
