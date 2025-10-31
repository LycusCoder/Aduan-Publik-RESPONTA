# 📱 Modul 1: Portal Aduan Warga (Citizen-Facing)

## Overview

Modul ini adalah interface utama yang digunakan oleh warga untuk berinteraksi dengan sistem RESPONTA. Fokus utama adalah kemudahan penggunaan, kecepatan akses, dan akurasi data lokasi.

---

## 🎯 Tujuan Modul

1. Memudahkan warga melaporkan masalah non-darurat di wilayahnya
2. Memberikan transparansi status penanganan aduan
3. Meningkatkan partisipasi warga dalam pembangunan daerah
4. Menyediakan data lokasi yang akurat untuk koordinasi penanganan

---

## 📝 Fitur Fungsional Detail

### F-01: Autentikasi Warga

#### 1. Registrasi

**User Story:**
> Sebagai warga, saya ingin mendaftar menggunakan nomor HP saya agar saya bisa membuat aduan.

**Acceptance Criteria:**
- ✅ User mengisi form dengan: Nama, Nomor HP, NIK, Password
- ✅ Nomor HP harus unique (10-13 digit)
- ✅ NIK harus 16 digit dan unique
- ✅ Password minimal 8 karakter
- ✅ System mengirim OTP ke nomor HP (optional di Phase 2)
- ✅ Setelah registrasi, user diarahkan ke halaman login

**UI/UX Requirements:**
- Form sederhana, tidak lebih dari 5 field
- Input nomor HP dengan format auto (contoh: 0812-3456-7890)
- Input NIK dengan format 16 digit
- Password dengan toggle show/hide
- Loading indicator saat submit
- Error message yang jelas per field

**Validation Rules:**
```php
[
    'name' => 'required|string|max:255',
    'no_hp' => 'required|numeric|unique:users|digits_between:10,13',
    'nik' => 'required|numeric|unique:users|digits:16',
    'password' => 'required|string|min:8|confirmed',
]
```

**API Endpoint:**
```
POST /api/register
```

---

#### 2. Login

**User Story:**
> Sebagai warga yang sudah terdaftar, saya ingin login menggunakan nomor HP dan password agar bisa mengakses sistem.

**Acceptance Criteria:**
- ✅ User login dengan Nomor HP dan Password
- ✅ System validasi credentials
- ✅ Jika valid, system generate API token (Laravel Sanctum)
- ✅ Token disimpan di localStorage/cookie
- ✅ User diarahkan ke dashboard
- ✅ Jika invalid, tampilkan error message

**UI/UX Requirements:**
- Form sederhana dengan 2 field (Nomor HP, Password)
- Checkbox "Remember Me" (optional)
- Link "Lupa Password" (Phase 2)
- Button "Belum punya akun? Daftar"
- Loading state saat login

**API Endpoint:**
```
POST /api/login
```

---

### F-02: Pembuatan Aduan Baru

#### User Story:
> Sebagai warga, saya ingin membuat laporan aduan dengan foto dan lokasi yang akurat agar masalah saya bisa ditangani dengan cepat.

#### Acceptance Criteria:

**1. Kategori Aduan:**
- ✅ Dropdown berisi kategori dari database
- ✅ Kategori diambil dari API `/api/kategori-aduan`
- ✅ Menampilkan icon kategori (optional)
- ✅ Required field

**2. Deskripsi:**
- ✅ Text area dengan min 20 karakter, max 1000 karakter
- ✅ Character counter
- ✅ Placeholder yang jelas
- ✅ Required field

**3. Upload Foto:**
- ✅ Minimal 1 foto, maksimal 3 foto
- ✅ Format: JPEG, PNG, JPG
- ✅ Max size: 2MB per foto
- ✅ Preview foto sebelum upload
- ✅ Bisa hapus foto yang sudah dipilih
- ✅ Drag & drop atau click to upload

**4. Lokasi GIS:**
- ✅ Interactive map menggunakan Leaflet.js
- ✅ Default center: User's current location
- ✅ User bisa drag pin ke lokasi yang diinginkan
- ✅ Auto-extract latitude & longitude
- ✅ Reverse geocoding untuk mendapatkan alamat
- ✅ Display alamat di bawah map
- ✅ Zoom controls

**API Endpoint:**
```
POST /api/aduan
Content-Type: multipart/form-data
```

---

### F-03: Daftar Aduan Saya

#### User Story:
> Sebagai warga, saya ingin melihat semua aduan yang pernah saya buat dan statusnya agar saya bisa memantau progress penanganan.

#### Acceptance Criteria:
- ✅ List semua aduan yang dibuat oleh user
- ✅ Sorting: Terbaru ke terlama (default)
- ✅ Filter by status (Semua, Baru, Diproses, Selesai)
- ✅ Pagination (10 items per page)
- ✅ Klik item untuk lihat detail

**API Endpoint:**
```
GET /api/aduan/saya?status={status}&page={page}
```

---

### F-04: Detail Aduan

#### Acceptance Criteria:
- ✅ Nomor tiket
- ✅ Status dengan badge
- ✅ Kategori aduan
- ✅ Deskripsi lengkap
- ✅ Gallery foto (dengan lightbox)
- ✅ Map dengan marker lokasi
- ✅ Alamat lokasi
- ✅ Timeline status (Phase 2)
- ✅ Tanggal dibuat & update terakhir

**API Endpoint:**
```
GET /api/aduan/{id}
```

---

## 🎨 Design Guidelines

### Color Scheme

```css
/* Primary Colors */
--primary: #3B82F6;      /* Blue - CTA buttons */
--secondary: #10B981;    /* Green - Success */

/* Status Colors */
--status-baru: #FCD34D;      /* Yellow */
--status-verified: #60A5FA;  /* Blue */
--status-proses: #FB923C;    /* Orange */
--status-selesai: #34D399;   /* Green */
--status-ditolak: #F87171;   /* Red */
```

---

## ✅ Testing Checklist

### Unit Tests:
- [ ] User registration validation
- [ ] Login authentication
- [ ] Aduan creation with photos
- [ ] File upload validation
- [ ] Coordinate validation

### E2E Tests:
- [ ] Complete user journey
- [ ] Photo upload flow
- [ ] Map interaction
- [ ] Form validation errors

---

**Version:** 0.1.0  
**Last Updated:** 2025-01-31  
**Status:** 📝 Documentation Complete
