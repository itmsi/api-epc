# Master Category Module

Module ini menangani operasi CRUD untuk data master kategori.

## Endpoints

### 1. Get All Master Categories (dengan filter)
- **Method**: POST
- **URL**: `/api/epc/master_category/get`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
    "page": 1,
    "limit": 10,
    "search": "",
    "sort_by": "created_at",
    "sort_order": "desc"
}
```

### 2. Get Master Category by ID
- **Method**: GET
- **URL**: `/api/epc/master_category/:id`
- **Headers**: `Authorization: Bearer <token>`

### 3. Create Master Category
- **Method**: POST
- **URL**: `/api/epc/master_category/create`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
    "master_category_name_en": "Category Name EN",
    "master_category_name_cn": "Category Name CN",
    "master_category_description": "Category Description"
}
```

### 4. Update Master Category
- **Method**: PUT
- **URL**: `/api/epc/master_category/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
    "master_category_name_en": "Updated Category Name EN",
    "master_category_name_cn": "Updated Category Name CN",
    "master_category_description": "Updated Description"
}
```

### 5. Delete Master Category (Soft Delete)
- **Method**: DELETE
- **URL**: `/api/epc/master_category/:id`
- **Headers**: `Authorization: Bearer <token>`

### 6. Restore Master Category
- **Method**: POST
- **URL**: `/api/epc/master_category/:id/restore`
- **Headers**: `Authorization: Bearer <token>`

## Database Schema

Tabel: `master_categories`

| Column | Type | Description |
|--------|------|-------------|
| master_category_id | UUID | Primary Key |
| master_category_name_en | VARCHAR(255) | Nama kategori dalam bahasa Inggris (nullable) |
| master_category_name_cn | VARCHAR(255) | Nama kategori dalam bahasa China (nullable) |
| master_category_description | TEXT | Deskripsi kategori (nullable) |
| created_at | TIMESTAMP | Waktu pembuatan |
| created_by | UUID | ID user yang membuat |
| updated_at | TIMESTAMP | Waktu update terakhir |
| updated_by | UUID | ID user yang update terakhir |
| deleted_at | TIMESTAMP | Waktu soft delete (nullable) |
| deleted_by | UUID | ID user yang soft delete (nullable) |
| is_delete | BOOLEAN | Status soft delete |

## Features

- ✅ Pagination dengan search
- ✅ Sorting berdasarkan kolom tertentu
- ✅ Soft delete dengan restore functionality
- ✅ Audit trail (created_by, updated_by, deleted_by)
- ✅ Token verification untuk semua endpoint
- ✅ Input validation
- ✅ Error handling
