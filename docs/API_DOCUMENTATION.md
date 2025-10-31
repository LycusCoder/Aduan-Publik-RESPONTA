# 📡 API Documentation - RESPONTA

## Base URL

```
Development: http://localhost:8000/api
Production: https://api.responta.id/api
```

## Authentication

API menggunakan Laravel Sanctum untuk token-based authentication.

### Headers

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer {token}
```

---

## 🔐 Authentication Endpoints

### 1. Register Warga

**Endpoint:** `POST /api/register`

**Description:** Registrasi akun warga baru dengan nomor HP dan NIK.

**Request Body:**
```json
{
  "name": "John Doe",
  "no_hp": "081234567890",
  "nik": "3201234567890123",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Validation Rules:**
- `name`: required, string, max:255
- `no_hp`: required, numeric, unique, digits_between:10,13
- `nik`: required, numeric, unique, digits:16
- `password`: required, string, min:8, confirmed

**Success Response:** `201 Created`
```json
{
  "success": true,
  "message": "Registrasi berhasil. Silakan login.",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "no_hp": "081234567890",
      "nik": "3201234567890123",
      "created_at": "2025-01-31T10:00:00.000000Z"
    }
  }
}
```

**Error Response:** `422 Unprocessable Entity`
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "no_hp": [
      "Nomor HP sudah terdaftar."
    ],
    "nik": [
      "NIK harus 16 digit."
    ]
  }
}
```

---

### 2. Login

**Endpoint:** `POST /api/login`

**Description:** Login menggunakan nomor HP dan password.

**Request Body:**
```json
{
  "no_hp": "081234567890",
  "password": "password123"
}
```

**Validation Rules:**
- `no_hp`: required, numeric
- `password`: required, string

**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "no_hp": "081234567890"
    },
    "token": "1|abcdefghijklmnopqrstuvwxyz1234567890",
    "token_type": "Bearer"
  }
}
```

**Error Response:** `401 Unauthorized`
```json
{
  "success": false,
  "message": "Nomor HP atau password salah."
}
```

---

### 3. Logout

**Endpoint:** `POST /api/logout`

**Description:** Logout dan hapus token aktif.

**Headers Required:**
```http
Authorization: Bearer {token}
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

---

### 4. Get User Profile

**Endpoint:** `GET /api/user`

**Description:** Mendapatkan data profil user yang sedang login.

**Headers Required:**
```http
Authorization: Bearer {token}
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "no_hp": "081234567890",
    "nik": "3201234567890123",
    "created_at": "2025-01-31T10:00:00.000000Z"
  }
}
```

---

## 📋 Kategori Aduan Endpoints

### 5. Get All Kategori Aduan

**Endpoint:** `GET /api/kategori-aduan`

**Description:** Mendapatkan daftar semua kategori aduan untuk dropdown form.

**Headers Required:**
```http
Authorization: Bearer {token}
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nama": "Jalan Rusak",
      "slug": "jalan-rusak",
      "icon": "road-icon.svg"
    },
    {
      "id": 2,
      "nama": "Lampu Jalan Mati",
      "slug": "lampu-jalan-mati",
      "icon": "light-icon.svg"
    },
    {
      "id": 3,
      "nama": "Sampah Menumpuk",
      "slug": "sampah-menumpuk",
      "icon": "trash-icon.svg"
    }
  ]
}
```

---

## 📝 Aduan Endpoints

### 6. Create Aduan

**Endpoint:** `POST /api/aduan`

**Description:** Membuat aduan baru dengan foto dan lokasi GIS.

**Headers Required:**
```http
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
kategori_aduan_id: 1
deskripsi: "Jalan berlubang di depan pasar sangat berbahaya"
latitude: -6.2088
longitude: 106.8456
fotos[]: (file) foto1.jpg
fotos[]: (file) foto2.jpg
fotos[]: (file) foto3.jpg
```

**Validation Rules:**
- `kategori_aduan_id`: required, exists:kategori_aduan,id
- `deskripsi`: required, string, min:20, max:1000
- `latitude`: required, numeric, between:-90,90
- `longitude`: required, numeric, between:-180,180
- `fotos`: required, array, min:1, max:3
- `fotos.*`: required, image, mimes:jpeg,png,jpg, max:2048 (2MB)

**Success Response:** `201 Created`
```json
{
  "success": true,
  "message": "Aduan berhasil dibuat",
  "data": {
    "id": 1,
    "nomor_tiket": "ADU-20250131-001",
    "user": {
      "id": 1,
      "name": "John Doe",
      "no_hp": "081234567890"
    },
    "kategori": {
      "id": 1,
      "nama": "Jalan Rusak"
    },
    "deskripsi": "Jalan berlubang di depan pasar sangat berbahaya",
    "lokasi": {
      "latitude": -6.2088,
      "longitude": 106.8456,
      "alamat": "Jl. Pasar Raya, Jakarta Pusat" // dari reverse geocoding
    },
    "fotos": [
      {
        "id": 1,
        "url": "http://localhost:8000/storage/aduan/foto1.jpg",
        "thumbnail_url": "http://localhost:8000/storage/aduan/thumbnails/foto1.jpg"
      },
      {
        "id": 2,
        "url": "http://localhost:8000/storage/aduan/foto2.jpg",
        "thumbnail_url": "http://localhost:8000/storage/aduan/thumbnails/foto2.jpg"
      }
    ],
    "status": "baru",
    "status_label": "Menunggu Verifikasi",
    "created_at": "2025-01-31T10:00:00.000000Z",
    "updated_at": "2025-01-31T10:00:00.000000Z"
  }
}
```

**Error Response:** `422 Unprocessable Entity`
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "fotos": [
      "Minimal 1 foto harus diunggah."
    ],
    "deskripsi": [
      "Deskripsi minimal 20 karakter."
    ]
  }
}
```

---

### 7. Get My Aduan List

**Endpoint:** `GET /api/aduan/saya`

**Description:** Mendapatkan daftar semua aduan yang dibuat oleh user yang sedang login.

**Headers Required:**
```http
Authorization: Bearer {token}
```

**Query Parameters (Optional):**
- `status`: Filter by status (baru, diverifikasi, diproses, selesai, ditolak)
- `kategori_id`: Filter by kategori aduan
- `per_page`: Items per page (default: 10, max: 50)
- `sort_by`: Sort field (created_at, updated_at)
- `sort_order`: Sort order (asc, desc)

**Example Request:**
```
GET /api/aduan/saya?status=baru&per_page=20&sort_by=created_at&sort_order=desc
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nomor_tiket": "ADU-20250131-001",
      "kategori": {
        "id": 1,
        "nama": "Jalan Rusak"
      },
      "deskripsi": "Jalan berlubang di depan pasar...",
      "lokasi": {
        "latitude": -6.2088,
        "longitude": 106.8456
      },
      "foto_thumbnail": "http://localhost:8000/storage/aduan/thumbnails/foto1.jpg",
      "status": "baru",
      "status_label": "Menunggu Verifikasi",
      "created_at": "2025-01-31T10:00:00.000000Z"
    },
    {
      "id": 2,
      "nomor_tiket": "ADU-20250130-045",
      "kategori": {
        "id": 2,
        "nama": "Lampu Jalan Mati"
      },
      "deskripsi": "Lampu jalan mati sejak 3 hari...",
      "lokasi": {
        "latitude": -6.2100,
        "longitude": 106.8500
      },
      "foto_thumbnail": "http://localhost:8000/storage/aduan/thumbnails/foto5.jpg",
      "status": "diproses",
      "status_label": "Sedang Ditangani",
      "created_at": "2025-01-30T15:30:00.000000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 3,
    "per_page": 10,
    "total": 25
  }
}
```

---

### 8. Get Aduan Detail

**Endpoint:** `GET /api/aduan/{id}`

**Description:** Mendapatkan detail lengkap sebuah aduan.

**Headers Required:**
```http
Authorization: Bearer {token}
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nomor_tiket": "ADU-20250131-001",
    "user": {
      "id": 1,
      "name": "John Doe",
      "no_hp": "081234567890"
    },
    "kategori": {
      "id": 1,
      "nama": "Jalan Rusak",
      "slug": "jalan-rusak"
    },
    "deskripsi": "Jalan berlubang di depan pasar sangat berbahaya untuk pengendara motor",
    "lokasi": {
      "latitude": -6.2088,
      "longitude": 106.8456,
      "alamat": "Jl. Pasar Raya, Jakarta Pusat"
    },
    "fotos": [
      {
        "id": 1,
        "url": "http://localhost:8000/storage/aduan/foto1.jpg",
        "thumbnail_url": "http://localhost:8000/storage/aduan/thumbnails/foto1.jpg"
      },
      {
        "id": 2,
        "url": "http://localhost:8000/storage/aduan/foto2.jpg",
        "thumbnail_url": "http://localhost:8000/storage/aduan/thumbnails/foto2.jpg"
      }
    ],
    "status": "baru",
    "status_label": "Menunggu Verifikasi",
    "timeline": [
      {
        "status": "baru",
        "description": "Aduan dibuat",
        "timestamp": "2025-01-31T10:00:00.000000Z"
      }
    ],
    "created_at": "2025-01-31T10:00:00.000000Z",
    "updated_at": "2025-01-31T10:00:00.000000Z"
  }
}
```

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "message": "Aduan tidak ditemukan"
}
```

**Error Response:** `403 Forbidden`
```json
{
  "success": false,
  "message": "Anda tidak memiliki akses ke aduan ini"
}
```

---

## 📊 Status Aduan

### Status Values & Labels

| Status | Label | Description |
|--------|-------|-------------|
| `baru` | Menunggu Verifikasi | Aduan baru masuk, belum diverifikasi |
| `diverifikasi` | Terverifikasi | Aduan telah diverifikasi oleh admin |
| `diproses` | Sedang Ditangani | Aduan sedang dalam proses penanganan |
| `selesai` | Selesai | Aduan telah selesai ditangani |
| `ditolak` | Ditolak | Aduan ditolak (tidak valid/duplikat) |

---

## ⚠️ Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "message": "Error message",
  "errors": {} // Optional, untuk validation errors
}
```

### HTTP Status Codes

- `200 OK` - Request berhasil
- `201 Created` - Resource berhasil dibuat
- `400 Bad Request` - Request tidak valid
- `401 Unauthorized` - Token tidak valid/expired
- `403 Forbidden` - Tidak memiliki akses
- `404 Not Found` - Resource tidak ditemukan
- `422 Unprocessable Entity` - Validation error
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

---

## 🔒 Rate Limiting

API menggunakan rate limiting untuk mencegah abuse:

- **Authentication endpoints:** 5 requests per minute
- **Other endpoints:** 60 requests per minute

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1706692800
```

**Rate Limit Exceeded Response:** `429 Too Many Requests`
```json
{
  "success": false,
  "message": "Too many requests. Please try again later."
}
```

---

## 🧪 Testing API

### Using Postman

1. Import Postman collection: `docs/postman/RESPONTA_API.postman_collection.json`
2. Import environment: `docs/postman/RESPONTA_ENV.postman_environment.json`
3. Set environment variables:
   - `base_url`: http://localhost:8000
   - `token`: (akan auto-filled setelah login)

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "John Doe",
    "no_hp": "081234567890",
    "nik": "3201234567890123",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "no_hp": "081234567890",
    "password": "password123"
  }'
```

**Create Aduan:**
```bash
curl -X POST http://localhost:8000/api/aduan \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json" \
  -F "kategori_aduan_id=1" \
  -F "deskripsi=Jalan berlubang berbahaya" \
  -F "latitude=-6.2088" \
  -F "longitude=106.8456" \
  -F "fotos[]=@/path/to/foto1.jpg" \
  -F "fotos[]=@/path/to/foto2.jpg"
```

---

## 📝 Changelog

### Version 0.1.0 (Phase 0 - 2025-01-31)
- Initial API documentation
- Authentication endpoints specification
- Aduan CRUD endpoints specification
- Kategori aduan endpoints specification

---

**Version:** 0.1.0  
**Last Updated:** 2025-01-31  
**Maintained by:** RESPONTA Development Team
