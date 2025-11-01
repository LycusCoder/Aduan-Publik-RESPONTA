# ✅ PHASE 2: Authentication API - COMPLETE

**Project:** RESPONTA - Sistem Pelaporan Aduan Warga  
**Phase:** 2 - Authentication API Implementation  
**Status:** ✅ COMPLETED  
**Date:** 2025-11-01  
**Duration:** ~3 hours

---

## 📋 Summary

Phase 2 telah diselesaikan dengan sempurna! Sistem authentication dengan OTP email, login via no_hp, dan profile management sudah berfungsi dengan baik.

### ✅ Completed Deliverables

#### 1. **Authentication Endpoints** (4 endpoints)

- ✅ **POST `/api/v1/register`** - Registrasi user baru
  - Input: name, no_hp, nik, email (optional), password, password_confirmation
  - OTP toggle support (enabled/disabled via config)
  - Auto-verify jika OTP disabled
  - Kirim OTP via email jika enabled
  
- ✅ **POST `/api/v1/verify-otp`** - Verifikasi kode OTP
  - Input: no_hp, otp_code
  - Validate OTP expiration (5 minutes)
  - Return Sanctum token after verification
  
- ✅ **POST `/api/v1/resend-otp`** - Resend OTP code
  - Input: no_hp
  - Generate new OTP
  - Kirim ke email
  
- ✅ **POST `/api/v1/login`** - Login user
  - Input: no_hp, password (BUKAN email!)
  - Check verification status jika OTP enabled
  - Return Sanctum token + user stats

#### 2. **Profile Management** (3 endpoints)

- ✅ **GET `/api/v1/profile`** - Get user profile (Protected)
  - Return user data + statistics (total_aduan, active_aduan, completed_aduan)
  
- ✅ **PUT `/api/v1/profile`** - Update profile (Protected)
  - Input: name, no_hp, email (all optional)
  - Validation unique check
  
- ✅ **POST `/api/v1/logout`** - Logout (Protected)
  - Revoke current access token

#### 3. **Database Changes**

- ✅ **Migration**: `2025_02_01_000001_add_otp_and_verification_to_users_table.php`
  - Added fields: `otp_code`, `otp_expires_at`, `is_verified`, `verified_at`, `email`
  - Added index on `otp_code` and `otp_expires_at`
  
- ✅ **User Model Updates**
  - Added fillable fields
  - Added casts for datetime and boolean
  - Updated hidden fields

#### 4. **Form Request Validators** (5 validators)

- ✅ `RegisterRequest.php` - Validate registration
  - NIK format: 16 digits
  - No HP format: 08xxxxxxxxxx (10-13 digits)
  - Password: min 8 chars, letters + numbers, confirmed
  - Custom Indonesian error messages
  
- ✅ `LoginRequest.php` - Validate login
- ✅ `VerifyOtpRequest.php` - Validate OTP
- ✅ `ResendOtpRequest.php` - Validate resend OTP
- ✅ `UpdateProfileRequest.php` - Validate profile update

#### 5. **Mail System**

- ✅ **OtpMail.php** - Mailable class untuk OTP
- ✅ **otp.blade.php** - Beautiful HTML email template
  - Professional design dengan gradient header
  - Large OTP code display
  - Security warnings
  - Expiry countdown
  - Responsive design

#### 6. **Configuration**

- ✅ **config/responta.php** - Project configuration
  ```php
  'otp_enabled' => env('OTP_ENABLED', false),  // Toggle OTP
  'otp_length' => 6,
  'otp_expiry_minutes' => 5,
  'login_attempts' => 5,
  'login_lockout_minutes' => 15,
  ```

- ✅ **.env Configuration**
  ```env
  OTP_ENABLED=false              # For development (auto-verify)
  MAIL_MAILER=log                # Log emails to storage/logs
  MAIL_FROM_ADDRESS="noreply@responta.id"
  MAIL_FROM_NAME="${APP_NAME}"
  ```

---

## 🎯 Test Results

### API Endpoints Test (OTP Disabled - Auto Verify)

```bash
✅ POST /api/v1/register
   - Auto-verify user (no OTP needed)
   - Return token immediately
   - Status: 201 Created

✅ POST /api/v1/login
   - Login with no_hp + password
   - Return token + user statistics
   - Status: 200 OK

✅ GET /api/v1/profile (Protected)
   - Return user profile + statistics
   - Status: 200 OK

✅ PUT /api/v1/profile (Protected)
   - Update user data
   - Validate unique constraints
   - Status: 200 OK

✅ POST /api/v1/logout (Protected)
   - Revoke token
   - Status: 200 OK

✅ Access after logout
   - Returns 401 Unauthenticated
   - Token properly revoked
```

### OTP Flow Test (OTP Enabled)

```bash
✅ Register with OTP enabled
   - Generate 6-digit OTP
   - Save to database with expiry (5 minutes)
   - Send email (or log if MAIL_MAILER=log)
   - Return requires_verification: true

✅ Login before verification
   - Returns 403 Forbidden
   - Message: "Akun Anda belum terverifikasi"

✅ Verify OTP (wrong code)
   - Returns 422 Unprocessable Entity
   - Message: "Kode OTP tidak valid atau sudah kadaluarsa"

✅ Verify OTP (correct code)
   - Mark user as verified
   - Clear OTP fields
   - Return token
   - Status: 200 OK

✅ Resend OTP
   - Generate new OTP
   - Update expiry time
   - Send new email
   - Status: 200 OK
```

---

## 📊 Database Statistics

| Table | New Fields | Status |
|-------|-----------|--------|
| users | otp_code, otp_expires_at, is_verified, verified_at, email | ✅ Added |
| Users count | 7 users (5 seeded + 2 test) | ✅ Working |
| Tokens | personal_access_tokens | ✅ Active |

---

## 🔧 Technical Details

### Authentication Flow

#### Flow 1: OTP Disabled (Development)
```
1. User registers → Auto-verify → Get token immediately
2. User can login anytime with no_hp + password
3. No OTP verification needed
```

#### Flow 2: OTP Enabled (Production)
```
1. User registers → OTP sent to email → requires_verification: true
2. User verifies OTP → Account activated → Get token
3. User can login with no_hp + password
4. Unverified users cannot login (403 Forbidden)
```

### Key Features Implemented

1. **Flexible OTP System:**
   - Toggle enabled/disabled via `.env` (OTP_ENABLED)
   - Config-driven (otp_length, expiry_minutes)
   - Email-based OTP delivery
   - Auto-cleanup expired OTPs

2. **Security:**
   - Password hashing (bcrypt)
   - NIK encryption (Laravel encrypted cast)
   - Token-based authentication (Sanctum)
   - Token revocation on logout
   - OTP expiration validation

3. **Validation:**
   - NIK: 16 digits
   - No HP: 08xxxxxxxxxx (10-13 digits)
   - Password: min 8 chars, letters + numbers
   - Email: valid format, unique
   - Custom Indonesian error messages

4. **Performance:**
   - Indexes on OTP fields for fast lookup
   - Eager loading relationships
   - Efficient token management

---

## 🚀 Next Steps: Phase 3

**Phase 3: Aduan CRUD API (3-4 hari)**
- [ ] Create aduan endpoint with photo upload
- [ ] List aduan (with filters: status, kategori, nearby)
- [ ] Detail aduan
- [ ] Update aduan status
- [ ] Delete aduan
- [ ] Photo management (max 3 photos)
- [ ] Auto-generate nomor_tiket
- [ ] Nearby aduan query (spatial)

**Ready to proceed to Phase 3!** 🎉

---

## 📝 API Documentation

### Authentication Endpoints

#### 1. Register
```bash
POST /api/v1/register
Content-Type: application/json

{
  "name": "Budi Santoso",
  "no_hp": "081234567890",
  "nik": "1234567890123456",
  "email": "budi@example.com",  // optional
  "password": "password123",
  "password_confirmation": "password123"
}

# Response (OTP Disabled):
{
  "success": true,
  "message": "Registrasi berhasil! Akun Anda sudah terverifikasi.",
  "data": {
    "user": {
      "id": 1,
      "name": "Budi Santoso",
      "no_hp": "081234567890",
      "is_verified": true
    },
    "token": "1|abc123...",
    "requires_verification": false
  }
}

# Response (OTP Enabled):
{
  "success": true,
  "message": "Registrasi berhasil! Silakan cek email untuk kode OTP.",
  "data": {
    "user_id": 1,
    "name": "Budi Santoso",
    "no_hp": "081234567890",
    "otp_expires_at": "2025-11-01 12:35:00",
    "requires_verification": true
  }
}
```

#### 2. Verify OTP
```bash
POST /api/v1/verify-otp
Content-Type: application/json

{
  "no_hp": "081234567890",
  "otp_code": "123456"
}

# Response:
{
  "success": true,
  "message": "Verifikasi berhasil! Akun Anda sudah aktif.",
  "data": {
    "user": {
      "id": 1,
      "name": "Budi Santoso",
      "no_hp": "081234567890",
      "is_verified": true
    },
    "token": "1|abc123..."
  }
}
```

#### 3. Resend OTP
```bash
POST /api/v1/resend-otp
Content-Type: application/json

{
  "no_hp": "081234567890"
}

# Response:
{
  "success": true,
  "message": "Kode OTP baru telah dikirim ke email Anda.",
  "data": {
    "otp_expires_at": "2025-11-01 12:40:00"
  }
}
```

#### 4. Login
```bash
POST /api/v1/login
Content-Type: application/json

{
  "no_hp": "081234567890",
  "password": "password123"
}

# Response:
{
  "success": true,
  "message": "Login berhasil!",
  "data": {
    "user": {
      "id": 1,
      "name": "Budi Santoso",
      "no_hp": "081234567890",
      "is_verified": true,
      "total_aduan": 5,
      "active_aduan": 2,
      "completed_aduan": 3
    },
    "token": "2|xyz789..."
  }
}
```

### Profile Endpoints (Protected)

#### 5. Get Profile
```bash
GET /api/v1/profile
Authorization: Bearer {token}

# Response:
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Budi Santoso",
    "no_hp": "081234567890",
    "email": "budi@example.com",
    "is_verified": true,
    "verified_at": "2025-11-01 12:30:00",
    "created_at": "2025-11-01 10:00:00",
    "statistics": {
      "total_aduan": 5,
      "active_aduan": 2,
      "completed_aduan": 3
    }
  }
}
```

#### 6. Update Profile
```bash
PUT /api/v1/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Budi Updated",
  "email": "budi.updated@example.com"
}

# Response:
{
  "success": true,
  "message": "Profile berhasil diperbarui!",
  "data": {
    "id": 1,
    "name": "Budi Updated",
    "no_hp": "081234567890",
    "email": "budi.updated@example.com"
  }
}
```

#### 7. Logout
```bash
POST /api/v1/logout
Authorization: Bearer {token}

# Response:
{
  "success": true,
  "message": "Logout berhasil!"
}
```

---

## 🔧 Configuration Guide

### Toggle OTP Verification

**Disable OTP (Development):**
```env
OTP_ENABLED=false
```
- Users auto-verified on registration
- Get token immediately
- No email sent

**Enable OTP (Production):**
```env
OTP_ENABLED=true
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
```
- Users must verify OTP
- OTP sent via email
- 5 minutes expiry

### Test Credentials

```
Existing User (from Phase 1 seeder):
  No HP: 081234567890
  Password: password123
  Verified: false (need to update if OTP enabled)

New Test Users (created in Phase 2):
  No HP: 081234567899
  Password: password123
  Verified: true (auto-verified)
```

---

## 📚 Files Created/Modified

### New Files (15 files)

**Controllers:**
- `/app/app/Http/Controllers/Api/AuthController.php`
- `/app/app/Http/Controllers/Api/ProfileController.php`

**Requests:**
- `/app/app/Http/Requests/RegisterRequest.php`
- `/app/app/Http/Requests/LoginRequest.php`
- `/app/app/Http/Requests/VerifyOtpRequest.php`
- `/app/app/Http/Requests/ResendOtpRequest.php`
- `/app/app/Http/Requests/UpdateProfileRequest.php`

**Mail:**
- `/app/app/Mail/OtpMail.php`
- `/app/resources/views/emails/otp.blade.php`

**Routes & Config:**
- `/app/routes/api.php`
- `/app/config/responta.php`

**Migrations:**
- `/app/database/migrations/2025_02_01_000001_add_otp_and_verification_to_users_table.php`

**Documentation:**
- `/app/docs/phase/phase-2-completion.md` (this file)

### Modified Files (3 files)

- `/app/app/Models/User.php` - Added OTP fields and casts
- `/app/bootstrap/app.php` - Added API routes registration
- `/app/.env` - Added OTP configuration

---

## 🐛 Known Issues & Solutions

### Issue 1: MySQL Access Denied
**Solution:** Run MySQL password reset:
```bash
mysql -u root -e "SET PASSWORD FOR 'root'@'localhost' = PASSWORD('');"
mysql -u root -e "FLUSH PRIVILEGES;"
```

### Issue 2: Routes Not Found
**Solution:** API routes must be registered in `bootstrap/app.php`:
```php
->withRouting(
    api: __DIR__.'/../routes/api.php',
    // ...
)
```

### Issue 3: Email Not Sent in Development
**Solution:** Use `MAIL_MAILER=log` untuk development. Email akan tersimpan di `storage/logs/laravel.log`

---

## ✨ Key Highlights

1. ✅ **Flexible OTP System** - Toggle on/off via config
2. ✅ **Login via Phone Number** - No email required for login
3. ✅ **Beautiful Email Template** - Professional OTP email design
4. ✅ **Comprehensive Validation** - NIK, No HP format validation
5. ✅ **Sanctum Authentication** - Token-based API security
6. ✅ **Indonesian Messages** - User-friendly error messages
7. ✅ **Profile Management** - Update user data with validation
8. ✅ **User Statistics** - Total, active, completed aduan count

---

**Phase 2 Status:** ✅ **COMPLETE & TESTED**  
**Next Phase:** Phase 3 - Aduan CRUD API  
**Progress:** 2/6 phases completed (33.33%)

---

**Tested & Verified on:** 2025-11-01  
**PHP Version:** 8.2.29  
**Laravel Version:** 12.0  
**Database:** MariaDB 10.11.14
