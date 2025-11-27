# Master Items Module

Module untuk mengelola data master items dengan fitur CRUD lengkap.

## 📁 Struktur File

```
src/modules/master_items/
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

Tabel `master_items`:

| Column | Type | Description |
|--------|------|-------------|
| master_item_id | UUID | Primary key (auto-generated) |
| target_id | VARCHAR(255) | Target ID (nullable) |
| part_number | VARCHAR(255) | Part number (nullable) |
| master_item_name_en | VARCHAR(255) | Nama master item dalam bahasa Inggris (nullable) |
| master_item_name_ch | VARCHAR(255) | Nama master item dalam bahasa Cina (nullable) |
| description | TEXT | Deskripsi master item (nullable) |
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
- `idx_master_items_deleted_at` - untuk soft delete queries
- `idx_master_items_is_delete` - untuk filter by is_delete
- `idx_master_items_created_at` - untuk sorting
- `idx_master_items_part_number` - untuk search part number
- `idx_master_items_target_id` - untuk search target id

## 🔌 API Endpoints

### 1. Get All Master Items (with pagination)
```http
POST /api/epc/master_items/get
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

### 2. Get Master Item by ID
```http
GET /api/epc/master_items/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "master_item_id": "...",
    "target_id": "...",
    "part_number": "...",
    ...
  },
  "message": "Data berhasil diambil"
}
```

### 3. Create Master Item
```http
POST /api/epc/master_items/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "target_id": "T001",
  "part_number": "PN-12345",
  "master_item_name_en": "Engine Oil Filter",
  "master_item_name_ch": "机油滤清器",
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

### 4. Update Master Item
```http
PUT /api/epc/master_items/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "target_id": "T001",
  "part_number": "PN-12345",
  "master_item_name_en": "Engine Oil Filter",
  "quantity": 3,
  ...
}
```

### 5. Delete Master Item (Soft Delete)
```http
DELETE /api/epc/master_items/:id
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
- `master_item_name_en`
- `master_item_name_ch`
- `description`
- `unit`

## 📚 Swagger Documentation

Dokumentasi lengkap tersedia di:
```
http://localhost:9566/documentation
```

Tag: **Master Items**

