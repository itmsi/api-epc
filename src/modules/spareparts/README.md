# Spareparts Module

Module untuk mengelola data spareparts dengan fitur CRUD lengkap.

## 📁 Struktur File

```
src/modules/spareparts/
├── handler.js              # Request handlers / Controllers
├── postgre_repository.js   # Database operations
├── validation.js           # Input validation rules
└── index.js               # Route definitions
```

## 🎯 Fitur

Module ini menyediakan:
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Soft delete dengan restore functionality
- ✅ Pagination untuk list data
- ✅ Search functionality
- ✅ Sorting berdasarkan kolom yang dipilih
- ✅ Input validation dengan express-validator
- ✅ Error handling yang konsisten
- ✅ Response format yang standar
- ✅ Database operations dengan Knex.js
- ✅ Swagger/OpenAPI documentation
- ✅ Authentication dengan verifyToken middleware

## 📊 Database Schema

Tabel `spareparts`:

| Column | Type | Description |
|--------|------|-------------|
| sparepart_id | UUID | Primary key (auto-generated) |
| target_id | VARCHAR(255) | Target ID (nullable) |
| part_number | VARCHAR(255) | Part number (nullable) |
| sparepart_name_en | VARCHAR(255) | Nama sparepart dalam bahasa Inggris (nullable) |
| sparepart_name_ch | VARCHAR(255) | Nama sparepart dalam bahasa Cina (nullable) |
| description | TEXT | Deskripsi sparepart (nullable) |
| quantity | INTEGER | Jumlah (default: 0) |
| unit | VARCHAR(255) | Satuan (nullable) |
| created_at | TIMESTAMP | Waktu pembuatan |
| created_by | UUID | User ID yang membuat (nullable) |
| updated_at | TIMESTAMP | Waktu update terakhir |
| updated_by | UUID | User ID yang mengupdate (nullable) |
| deleted_at | TIMESTAMP | Waktu soft delete (nullable) |
| deleted_by | UUID | User ID yang menghapus (nullable) |
| is_delete | BOOLEAN | Flag soft delete (default: false) |

Indexes:
- `idx_spareparts_deleted_at` - untuk soft delete queries
- `idx_spareparts_is_delete` - untuk filter by is_delete
- `idx_spareparts_created_at` - untuk sorting
- `idx_spareparts_part_number` - untuk search part number
- `idx_spareparts_target_id` - untuk search target id

## 🔌 API Endpoints

### 1. Get All Spareparts (with pagination)
```http
POST /api/epc/spareparts/get
Authorization: Bearer <token>
Content-Type: application/json

{
  "page": 1,
  "limit": 10,
  "search": "",
  "sort_by": "created_at",
  "sort_order": "desc"
}
```

**Request Body:**
- `page` (optional): Halaman yang ingin ditampilkan (default: 1)
- `limit` (optional): Jumlah item per halaman (default: 10, max: 100)
- `search` (optional): Kata kunci pencarian
- `sort_by` (optional): Kolom untuk sorting (default: created_at)
- `sort_order` (optional): Urutan sorting: asc atau desc (default: desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  },
  "message": "Data berhasil diambil"
}
```

### 2. Get Sparepart by ID
```http
GET /api/epc/spareparts/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sparepart_id": "...",
    "target_id": "...",
    "part_number": "...",
    ...
  },
  "message": "Data berhasil diambil"
}
```

### 3. Create Sparepart
```http
POST /api/epc/spareparts/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "target_id": "T001",
  "part_number": "PN-12345",
  "sparepart_name_en": "Engine Oil Filter",
  "sparepart_name_ch": "机油滤清器",
  "description": "High quality engine oil filter",
  "quantity": 2,
  "unit": "pcs"
}
```

**Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Data berhasil dibuat"
}
```

### 4. Update Sparepart
```http
PUT /api/epc/spareparts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "target_id": "T001",
  "part_number": "PN-12345",
  "sparepart_name_en": "Engine Oil Filter",
  "quantity": 3,
  ...
}
```

### 5. Delete Sparepart (Soft Delete)
```http
DELETE /api/epc/spareparts/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Data berhasil dihapus"
}
```

## 🔐 Authentication

Semua endpoint memerlukan authentication token yang dikirim melalui header:
```
Authorization: Bearer <token>
```

Token akan di-verify menggunakan middleware `verifyToken` dan user ID (employee_id atau user_id) akan otomatis digunakan untuk:
- `created_by` saat create
- `updated_by` saat update
- `deleted_by` saat soft delete

## 📝 Validation

Semua input akan divalidasi menggunakan express-validator:
- UUID format untuk ID
- String length untuk text fields
- Integer untuk quantity
- Required fields sesuai kebutuhan

## 🔍 Search

Search dilakukan pada kolom:
- `target_id`
- `part_number`
- `sparepart_name_en`
- `sparepart_name_ch`
- `description`
- `unit`

## 📚 Swagger Documentation

Dokumentasi lengkap tersedia di:
```
http://localhost:9566/documentation
```

Tag: **Spareparts**

