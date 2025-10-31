# 🗺️ Development Roadmap - RESPONTA

## Project Timeline Overview

```
Phase 0: Dokumentasi & Setup        [CURRENT] ████████████ 100%
Phase 1: Database & Models          [NEXT]    ░░░░░░░░░░░░   0%
Phase 2: Authentication System                ░░░░░░░░░░░░   0%
Phase 3: Aduan Management                     ░░░░░░░░░░░░   0%
Phase 4: Frontend Implementation              ░░░░░░░░░░░░   0%
Phase 5: Testing & Refinement                 ░░░░░░░░░░░░   0%
Phase 6: Deployment & Launch                  ░░░░░░░░░░░░   0%
```

---

## ✅ Phase 0: Dokumentasi & Setup Persiapan

**Status:** ✅ COMPLETE  
**Duration:** 1-2 hari  
**Completion Date:** 2025-01-31

### Deliverables

- [x] README_RESPONTA.md - Dokumentasi utama aplikasi
- [x] docs/API_DOCUMENTATION.md - Spesifikasi API lengkap
- [x] docs/DATABASE_SCHEMA.md - Skema database detail
- [x] docs/SETUP_GUIDE.md - Panduan instalasi
- [x] docs/MODULE_01_CITIZEN_PORTAL.md - Dokumentasi modul warga
- [x] docs/DEVELOPMENT_ROADMAP.md - Roadmap pengembangan
- [x] .env.example updated - Template environment variables

### Dependencies Setup Plan

**Backend Dependencies (composer.json):**
```json
{
    "require": {
        "php": "^8.2",
        "laravel/framework": "^12.0",
        "laravel/sanctum": "^4.0",
        "laravel/tinker": "^2.10",
        "intervention/image": "^3.0"
    },
    "require-dev": {
        "laravel/pint": "^1.24",
        "phpstan/phpstan": "^1.10",
        "pestphp/pest": "^2.0"
    }
}
```

**Frontend Dependencies (package.json):**
```json
{
    "dependencies": {
        "@inertiajs/vue3": "^1.0",
        "vue": "^3.4",
        "leaflet": "^1.9",
        "axios": "^1.6"
    },
    "devDependencies": {
        "@vitejs/plugin-vue": "^5.0",
        "tailwindcss": "^3.4",
        "autoprefixer": "^10.4",
        "postcss": "^8.4"
    }
}
```

### Next Steps
→ Proceed to Phase 1: Database & Models

---

## 📋 Phase 1: Database & Models

**Status:** 🔜 PLANNED  
**Duration:** 2-3 hari  
**Priority:** HIGH

### Goals
Membangun foundation database yang solid dengan Eloquent models, migrations, dan relationships.

### Tasks

#### 1.1 Database Migrations
- [ ] Update users table migration
  - Add `no_hp` column (string, unique)
  - Add `nik` column (string, encrypted, unique)
  - Remove `email` column (optional)
  - Add indexes
  
- [ ] Create kategori_aduan table migration
  - id, nama, slug, icon, deskripsi, dinas_terkait_id
  - is_active boolean
  - timestamps
  
- [ ] Create aduan table migration
  - All fields as per schema
  - Foreign keys with proper constraints
  - Spatial index for latitude/longitude
  - Status enum
  
- [ ] Create foto_aduan table migration
  - aduan_id foreign key
  - path, thumbnail_path
  - file_size, mime_type
  - urutan field

#### 1.2 Eloquent Models

- [ ] Update User model
  ```php
  - Add fillable: no_hp, nik
  - Add hidden: nik
  - Add casts: nik => 'encrypted'
  - Add relationship: hasMany Aduan
  ```

- [ ] Create KategoriAduan model
  ```php
  - Fillable fields
  - Relationship: hasMany Aduan
  - Scope: whereActive()
  ```

- [ ] Create Aduan model
  ```php
  - Fillable fields
  - Relationships: belongsTo User, belongsTo KategoriAduan, hasMany FotoAduan
  - Casts: status => enum
  - Accessors: getStatusLabelAttribute()
  - Scopes: byStatus(), byUser(), recent()
  ```

- [ ] Create FotoAduan model
  ```php
  - Fillable fields
  - Relationship: belongsTo Aduan
  - Accessors: getUrlAttribute(), getThumbnailUrlAttribute()
  ```

#### 1.3 Database Seeders

- [ ] KategoriAduanSeeder
  ```
  - Jalan Rusak
  - Lampu Jalan Mati
  - Sampah Menumpuk
  - Drainase Tersumbat
  - Pohon Tumbang
  ```

- [ ] UserSeeder (demo users)
  ```
  - Create 3-5 demo users
  - With valid no_hp and nik
  ```

- [ ] AduanSeeder (optional, for testing)
  ```
  - Create 20-30 sample aduan
  - With random status
  - With random locations
  ```

#### 1.4 Model Factories

- [ ] UserFactory
- [ ] AduanFactory
- [ ] FotoAduanFactory

#### 1.5 Testing

- [ ] Unit tests for User model
- [ ] Unit tests for Aduan model
- [ ] Unit tests for relationships
- [ ] Migration tests

### Commands to Run

```bash
# Create migrations
php artisan make:migration update_users_table --table=users
php artisan make:migration create_kategori_aduan_table
php artisan make:migration create_aduan_table
php artisan make:migration create_foto_aduan_table

# Create models
php artisan make:model KategoriAduan -mfs
php artisan make:model Aduan -mfs
php artisan make:model FotoAduan -mfs

# Run migrations
php artisan migrate

# Run seeders
php artisan db:seed

# Run tests
php artisan test --filter=ModelTest
```

### Success Criteria
- ✅ All migrations run without errors
- ✅ All relationships work correctly
- ✅ Seeders populate database successfully
- ✅ Unit tests pass (100% coverage for models)
- ✅ Database queries optimized with proper indexes

---

## 🔐 Phase 2: Authentication System

**Status:** 📅 SCHEDULED  
**Duration:** 2-3 hari  
**Priority:** HIGH

### Goals
Implement secure authentication system using Laravel Sanctum with phone number login.

### Tasks

#### 2.1 Laravel Sanctum Setup

- [ ] Install Laravel Sanctum
  ```bash
  composer require laravel/sanctum
  php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
  php artisan migrate
  ```

- [ ] Configure sanctum.php
  - Set stateful domains
  - Configure token expiration
  - Set token name prefix

- [ ] Update CORS configuration
  - Allow credentials
  - Set allowed origins

#### 2.2 Authentication Controllers

- [ ] Create RegisterController
  ```
  - POST /api/register
  - Validate input (no_hp, nik, password)
  - Check no_hp uniqueness
  - Check nik uniqueness (optional: validate with Disdukcapil API)
  - Hash password
  - Create user
  - Return success message
  ```

- [ ] Create LoginController
  ```
  - POST /api/login
  - Validate credentials (no_hp + password)
  - Check user exists
  - Verify password
  - Generate Sanctum token
  - Return user data + token
  ```

- [ ] Create LogoutController
  ```
  - POST /api/logout
  - Revoke current token
  - Return success message
  ```

- [ ] Create ProfileController
  ```
  - GET /api/user
  - Return authenticated user data
  ```

#### 2.3 Form Requests

- [ ] RegisterRequest validation
- [ ] LoginRequest validation
- [ ] UpdateProfileRequest validation (Phase 2)

#### 2.4 API Routes

```php
// Public routes
Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LoginController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [ProfileController::class, 'show']);
    Route::post('/logout', [LogoutController::class, 'logout']);
});
```

#### 2.5 OTP Integration (Optional)

- [ ] Choose SMS provider (Twilio/Nexmo/Local Gateway)
- [ ] Create OTPService
  - generateOTP()
  - sendOTP()
  - verifyOTP()
- [ ] Add otp_code and otp_expires_at to users table
- [ ] Create OTP verification endpoint

#### 2.6 Testing

- [ ] Test user registration
  - Valid data
  - Duplicate no_hp
  - Duplicate nik
  - Invalid password
  
- [ ] Test user login
  - Valid credentials
  - Invalid credentials
  - Non-existent user
  
- [ ] Test token authentication
  - Valid token
  - Invalid token
  - Expired token
  
- [ ] Test logout

### Success Criteria
- ✅ Users can register with no_hp and nik
- ✅ Users can login with no_hp and password
- ✅ Sanctum tokens are generated correctly
- ✅ Protected routes require authentication
- ✅ All authentication tests pass

---

## 📝 Phase 3: Aduan Management (Backend)

**Status:** 📅 SCHEDULED  
**Duration:** 3-4 hari  
**Priority:** HIGH

### Goals
Implement complete CRUD operations for aduan with file upload and GIS data.

### Tasks

#### 3.1 Services

- [ ] Create TicketGeneratorService
  ```php
  - generateTicketNumber()
  - Format: ADU-YYYYMMDD-XXX
  - Auto-increment daily counter
  ```

- [ ] Create FileUploadService
  ```php
  - uploadPhotos()
  - generateThumbnail()
  - validateImage()
  - deletePhoto()
  - Max 3 photos per aduan
  - Compress images
  - Create thumbnails (300x300px)
  ```

- [ ] Create GeocodingService (optional)
  ```php
  - reverseGeocode()
  - getAddressFromCoordinates()
  - Integration with Nominatim or Google Maps API
  ```

#### 3.2 Controllers

- [ ] Create KategoriAduanController
  ```
  - GET /api/kategori-aduan
  - List all active categories
  - Cache results for 1 hour
  ```

- [ ] Create AduanController
  ```
  - POST /api/aduan (create)
  - GET /api/aduan/saya (list my aduan)
  - GET /api/aduan/{id} (detail)
  - PUT /api/aduan/{id} (update - Phase 2)
  - DELETE /api/aduan/{id} (delete - Phase 2)
  ```

#### 3.3 Form Requests

- [ ] StoreAduanRequest
  ```php
  - Validate kategori_aduan_id
  - Validate deskripsi (min 20, max 1000)
  - Validate latitude (-90 to 90)
  - Validate longitude (-180 to 180)
  - Validate fotos (array, min 1, max 3)
  - Validate each foto (image, max 2MB)
  ```

#### 3.4 API Resources

- [ ] AduanResource
  ```
  - Transform aduan data
  - Include user, kategori, fotos
  - Format dates
  - Add status_label
  ```

- [ ] AduanCollection
  ```
  - Paginated list
  - Include meta data
  ```

- [ ] FotoAduanResource
  ```
  - Transform foto data
  - Include URLs
  ```

#### 3.5 Policies (Authorization)

- [ ] AduanPolicy
  ```php
  - view(): User can only view their own aduan
  - update(): User can only update their own aduan
  - delete(): User can only delete their own aduan
  ```

#### 3.6 Observers

- [ ] AduanObserver
  ```php
  - creating(): Generate ticket number
  - created(): Send notification (Phase 2)
  - updated(): Log status change (Phase 2)
  ```

#### 3.7 Testing

- [ ] Test create aduan
  - With valid data
  - With 1, 2, 3 photos
  - With invalid coordinates
  - With invalid photo format
  - Without photos
  
- [ ] Test list aduan
  - Pagination
  - Filtering by status
  - Sorting
  
- [ ] Test view aduan detail
  - Own aduan
  - Other user's aduan (should fail)
  
- [ ] Test file upload
  - Valid images
  - Oversized images
  - Invalid formats
  - Thumbnail generation

### Success Criteria
- ✅ Users can create aduan with photos
- ✅ Photos are uploaded and thumbnails generated
- ✅ Unique ticket numbers are generated
- ✅ Users can view their aduan list
- ✅ Users can view aduan details
- ✅ Authorization policies work correctly
- ✅ All API tests pass

---

## 🎨 Phase 4: Frontend Implementation

**Status:** 📅 SCHEDULED  
**Duration:** 4-5 hari  
**Priority:** HIGH

### Goals
Build complete frontend interface using Vue.js + Inertia.js + Tailwind CSS.

### Tasks

#### 4.1 Setup

- [ ] Install dependencies
  ```bash
  npm install @inertiajs/vue3 vue@next
  npm install leaflet
  npm install -D tailwindcss@latest
  ```

- [ ] Configure Inertia.js
  - Setup Inertia middleware
  - Configure app.js
  - Setup Ziggy for routes

- [ ] Configure Tailwind CSS
  - tailwind.config.js
  - Include in app.css

#### 4.2 Layout & Components

- [ ] Create AppLayout.vue
  - Header with logo
  - Navigation menu
  - User dropdown
  - Mobile responsive
  
- [ ] Create GuestLayout.vue
  - Simple layout for auth pages
  
- [ ] Create reusable components:
  - Button.vue
  - Input.vue
  - TextArea.vue
  - Select.vue
  - Card.vue
  - Badge.vue
  - Alert.vue
  - Loading.vue

#### 4.3 Authentication Pages

- [ ] Register.vue
  - Form with: name, no_hp, nik, password, password_confirmation
  - Validation errors display
  - Submit to POST /register
  - Redirect to login on success
  
- [ ] Login.vue
  - Form with: no_hp, password
  - Remember me checkbox
  - Submit to POST /login
  - Store token in localStorage
  - Redirect to dashboard
  
- [ ] Dashboard.vue
  - Welcome message
  - Quick stats (total aduan, status breakdown)
  - Recent aduan list
  - Button to create new aduan

#### 4.4 Aduan Pages

- [ ] CreateAduan.vue
  - Kategori dropdown
  - Deskripsi textarea with character counter
  - Photo uploader component
  - Map picker component
  - Submit form
  - Show success with ticket number
  
- [ ] ListAduan.vue
  - List all user's aduan
  - Filter by status
  - Pagination
  - Search by ticket number
  - Click to view detail
  
- [ ] DetailAduan.vue
  - Show all aduan info
  - Photo gallery with lightbox
  - Map with marker
  - Status badge
  - Timeline (Phase 2)
  - Back button

#### 4.5 Special Components

- [ ] MapPicker.vue
  ```vue
  - Initialize Leaflet map
  - Get user's current location
  - Add draggable marker
  - Emit coordinates on change
  - Reverse geocoding
  - Show address below map
  ```

- [ ] PhotoUploader.vue
  ```vue
  - Multiple file input
  - Drag & drop support
  - Preview uploaded photos
  - Remove photo button
  - Validation (max 3, max 2MB each)
  - Emit files array
  ```

- [ ] StatusBadge.vue
  ```vue
  - Display status with color
  - Props: status
  - Color mapping for each status
  ```

#### 4.6 API Integration

- [ ] Create api.js service
  ```javascript
  - axios instance with base URL
  - Set Authorization header with token
  - Handle 401 errors (redirect to login)
  - Request/response interceptors
  ```

- [ ] API methods:
  - auth.register()
  - auth.login()
  - auth.logout()
  - auth.getUser()
  - aduan.create()
  - aduan.getList()
  - aduan.getDetail()
  - kategori.getAll()

#### 4.7 State Management (Optional)

- [ ] Use Pinia for global state
  - User store
  - Aduan store
  - UI store (loading, errors)

#### 4.8 Testing

- [ ] Component tests (Vitest)
  - Test form validation
  - Test photo upload
  - Test map interaction
  
- [ ] E2E tests (Playwright/Cypress)
  - Complete user journey
  - Photo upload flow
  - Form submission

### Success Criteria
- ✅ All auth pages work correctly
- ✅ Users can create aduan with photos and location
- ✅ Map picker works smoothly
- ✅ Photo upload with preview works
- ✅ List and detail pages display correctly
- ✅ Mobile responsive
- ✅ All frontend tests pass

---

## ✅ Phase 5: Testing & Refinement

**Status:** 📅 SCHEDULED  
**Duration:** 2-3 hari  
**Priority:** MEDIUM

### Tasks

- [ ] Comprehensive testing
  - Unit tests coverage > 80%
  - Feature tests for all endpoints
  - E2E tests for critical flows
  
- [ ] Performance optimization
  - Database query optimization
  - Add caching where needed
  - Image optimization
  - Code splitting
  
- [ ] Security audit
  - SQL injection prevention
  - XSS prevention
  - CSRF protection
  - Rate limiting
  - Input sanitization
  
- [ ] Accessibility (A11y)
  - Keyboard navigation
  - Screen reader support
  - Color contrast
  - Alt texts for images
  
- [ ] Browser compatibility testing
  - Chrome
  - Firefox
  - Safari
  - Mobile browsers
  
- [ ] Bug fixes
  - Fix all reported bugs
  - Handle edge cases
  
- [ ] Code quality
  - Run Laravel Pint
  - Run PHPStan
  - Run ESLint
  - Code review

---

## 🚀 Phase 6: Deployment & Launch

**Status:** 📅 SCHEDULED  
**Duration:** 2-3 hari  
**Priority:** MEDIUM

### Tasks

- [ ] Production environment setup
  - Configure .env for production
  - Set up database
  - Set up file storage (S3/local)
  - Set up queue worker
  
- [ ] Server configuration
  - Nginx/Apache setup
  - SSL certificate
  - Domain setup
  - Firewall rules
  
- [ ] CI/CD pipeline
  - GitHub Actions / GitLab CI
  - Auto-deploy on main branch
  - Run tests before deploy
  
- [ ] Monitoring & logging
  - Error tracking (Sentry/Bugsnag)
  - Performance monitoring
  - Log aggregation
  
- [ ] Backup strategy
  - Database daily backup
  - File storage backup
  - Backup retention policy
  
- [ ] Documentation update
  - Update README
  - Deployment guide
  - API documentation
  - User manual
  
- [ ] Launch checklist
  - Load testing
  - Final security audit
  - DNS propagation
  - SSL verification
  - Monitoring alerts setup
  
- [ ] Post-launch
  - Monitor errors
  - User feedback collection
  - Bug fixes
  - Performance tuning

---

## 📊 Progress Tracking

### Overall Progress: 16.67% (Phase 0 Complete)

| Phase | Status | Progress | Est. Duration |
|-------|--------|----------|---------------|
| Phase 0: Dokumentasi | ✅ Complete | 100% | 1-2 hari |
| Phase 1: Database | 🔜 Next | 0% | 2-3 hari |
| Phase 2: Authentication | 📅 Planned | 0% | 2-3 hari |
| Phase 3: Aduan Backend | 📅 Planned | 0% | 3-4 hari |
| Phase 4: Frontend | 📅 Planned | 0% | 4-5 hari |
| Phase 5: Testing | 📅 Planned | 0% | 2-3 hari |
| Phase 6: Deployment | 📅 Planned | 0% | 2-3 hari |

**Total Estimated Duration:** 16-23 hari kerja (3-4 minggu)

---

## 🎯 Milestones

- [x] **M0:** Documentation Complete - 2025-01-31
- [ ] **M1:** Database & Models Complete - TBD
- [ ] **M2:** API MVP (Auth + Aduan CRUD) - TBD
- [ ] **M3:** Frontend MVP (All features working) - TBD
- [ ] **M4:** Beta Launch (Testing phase) - TBD
- [ ] **M5:** Production Launch - TBD

---

## 📞 Communication Plan

### Daily Standup (15 min)
- What was done yesterday?
- What will be done today?
- Any blockers?

### Weekly Review (1 hour)
- Demo completed features
- Review progress vs plan
- Adjust roadmap if needed

### Phase Completion Review
- Review all deliverables
- Test all features
- Document learnings
- Plan next phase

---

## 🎓 Learning Resources

- [Laravel 12 Documentation](https://laravel.com/docs/12.x)
- [Laravel Sanctum](https://laravel.com/docs/12.x/sanctum)
- [Inertia.js Guide](https://inertiajs.com/)
- [Leaflet.js Documentation](https://leafletjs.com/)
- [Vue.js 3 Guide](https://vuejs.org/guide/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Version:** 0.1.0  
**Last Updated:** 2025-01-31  
**Next Review:** Start of Phase 1
