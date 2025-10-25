# Categories Module

Module untuk mengelola data categories dengan fitur CRUD lengkap dan relasi dengan type categories.

## Fitur Utama

- **CRUD Operations**: Create, Read, Update, Delete categories
- **Type Categories Integration**: Setiap category dapat memiliki multiple type categories
- **Transaction Support**: Semua operasi menggunakan database transaction untuk konsistensi data
- **Soft Delete**: Data tidak dihapus permanen, hanya ditandai sebagai deleted
- **Pagination & Search**: Mendukung pagination dan pencarian data
- **Validation**: Validasi lengkap untuk semua input data

## Relasi Data

- **Categories** → **Type Categories** (One-to-Many)
- Setiap category dapat memiliki multiple type categories
- Type categories akan otomatis ter-soft delete saat category di-update dengan data_type baru

## Endpoints

### 1. Get All Categories (POST)
```
POST /api/epc/categories/get
```

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

### 2. Get Category by ID (GET)
```
GET /api/epc/categories/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Data berhasil diambil",
  "data": {
    "category_id": "uuid",
    "master_category_id": "uuid",
    "master_category_name_en": "Electronics",
    "category_name_cn": "电子产品",
    "category_description": "Description",
    "data_type": [
      {
        "type_category_id": "uuid",
        "type_category_name_en": "Electronics",
        "type_category_name_cn": "电子产品",
        "type_category_description": "Electronic devices and components"
      }
    ],
    "created_at": "2025-01-01T00:00:00.000Z",
    "created_by": "uuid",
    "updated_at": "2025-01-01T00:00:00.000Z",
    "updated_by": "uuid",
    "deleted_at": null,
    "deleted_by": null,
    "is_delete": false
  }
}
```

### 3. Create Category (POST)
```
POST /api/epc/categories/create
```

**Request Body:**
```json
{
  "master_category_id": "uuid",
  "master_category_name_en": "Electronics",
  "category_name_cn": "电子产品",
  "category_description": "Description",
  "data_type": [
    {
      "type_category_id": "uuid",
      "type_category_name_en": "Electronics",
      "type_category_name_cn": "电子产品",
      "type_category_description": "Electronic devices and components"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Category berhasil dibuat",
  "data": {...}
}
```

### 4. Update Category (PUT)
```
PUT /api/epc/categories/:id
```

**Request Body:**
```json
{
  "master_category_id": "uuid",
  "master_category_name_en": "Updated Electronics",
  "category_name_cn": "更新的电子产品",
  "category_description": "Updated description",
  "data_type": [
    {
      "type_category_id": "uuid",
      "type_category_name_en": "Updated Electronics",
      "type_category_name_cn": "更新的电子产品",
      "type_category_description": "Updated electronic devices and components"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Category berhasil diupdate",
  "data": {...}
}
```

### 5. Delete Category (DELETE)
```
DELETE /api/epc/categories/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Category berhasil dihapus"
}
```

### 6. Restore Category (POST)
```
POST /api/epc/categories/:id/restore
```

**Response:**
```json
{
  "success": true,
  "message": "Category berhasil direstore",
  "data": {...}
}
```

## Authentication

Semua endpoint memerlukan authentication token:
```
Authorization: Bearer <token>
```

User ID (employee_id atau user_id) akan otomatis diambil dari token untuk:
- `created_by` saat create
- `updated_by` saat update
- `deleted_by` saat delete

## Database Schema

### Table: categories

| Column | Type | Description |
|--------|------|-------------|
| category_id | UUID | Primary key |
| master_category_id | UUID | Foreign key ke master_categories |
| master_category_name_en | VARCHAR(255) | Master category name in English |
| category_name_cn | VARCHAR(255) | Category name in Chinese |
| category_description | TEXT | Category description |
| created_at | TIMESTAMP | Creation timestamp |
| created_by | UUID | User who created |
| updated_at | TIMESTAMP | Last update timestamp |
| updated_by | UUID | User who last updated |
| deleted_at | TIMESTAMP | Deletion timestamp |
| deleted_by | UUID | User who deleted |
| is_delete | BOOLEAN | Soft delete flag |

## Features

- ✅ CRUD operations
- ✅ Soft delete
- ✅ Restore deleted items
- ✅ Pagination
- ✅ Search functionality
- ✅ Sorting
- ✅ Automatic audit fields (created_by, updated_by, deleted_by)
- ✅ Token-based authentication
- ✅ Input validation
- ✅ Swagger documentation

