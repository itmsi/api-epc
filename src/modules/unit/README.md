# Unit Module

Module untuk mengelola data units (satuan).

## Endpoints

### 1. POST /api/epc/unit/get
Mengambil data units dengan pagination, search, dan sorting.

**Request Body:**
```json
{
  "page": 1,
  "limit": 10,
  "search": "",
  "sort_by": "created_at",
  "sort_order": "desc"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Data berhasil diambil",
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

### 2. GET /api/epc/unit/:id
Mengambil data unit berdasarkan ID.

**Response:**
```json
{
  "success": true,
  "message": "Data berhasil diambil",
  "data": {
    "unit_id": "...",
    "unit_name_en": "...",
    "unit_name_cn": "...",
    "unit_description": "...",
    ...
  }
}
```

### 3. POST /api/epc/unit/create
Membuat unit baru.

**Request Body:**
```json
{
  "unit_name_en": "Kilogram",
  "unit_name_cn": "千克",
  "unit_description": "Unit of mass"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Unit berhasil dibuat",
  "data": {...}
}
```

### 4. PUT /api/epc/unit/:id
Mengupdate data unit.

**Request Body:**
```json
{
  "unit_name_en": "Updated Kilogram",
  "unit_name_cn": "更新的千克",
  "unit_description": "Updated unit of mass"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Unit berhasil diupdate",
  "data": {...}
}
```

### 5. DELETE /api/epc/unit/:id
Menghapus unit (soft delete).

**Response:**
```json
{
  "success": true,
  "message": "Unit berhasil dihapus",
  "data": null
}
```

## Authentication

Semua endpoint memerlukan authentication token. Kirimkan token di header:
```
Authorization: Bearer <token>
```

## Database Schema

### Table: units

| Column | Type | Description |
|--------|------|-------------|
| unit_id | UUID | Primary key |
| unit_name_en | VARCHAR(255) | Unit name in English (nullable) |
| unit_name_cn | VARCHAR(255) | Unit name in Chinese (nullable) |
| unit_description | TEXT | Unit description (nullable) |
| created_at | TIMESTAMP | Created timestamp |
| created_by | UUID | User who created (nullable) |
| updated_at | TIMESTAMP | Updated timestamp |
| updated_by | UUID | User who updated (nullable) |
| deleted_at | TIMESTAMP | Deleted timestamp (nullable) |
| deleted_by | UUID | User who deleted (nullable) |
| is_delete | BOOLEAN | Soft delete flag |

## Features

- Pagination dengan page dan limit
- Search pada unit_name_en, unit_name_cn, dan unit_description
- Sorting berdasarkan created_at, unit_name_en, atau unit_name_cn
- Soft delete dengan is_delete flag
- Audit trail dengan created_by, updated_by, deleted_by
- Automatic timestamp untuk created_at, updated_at, deleted_at

