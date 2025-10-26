# Item Category Module

Module ini mengelola data kategori item dengan fitur CRUD lengkap dan relasi dengan tabel lainnya.

## Struktur Database

### Tabel Dokumen
- `dokumen_id` (UUID, Primary Key)
- `dokumen_name` (VARCHAR(255), nullable)
- `dokumen_description` (TEXT, nullable)
- Audit fields: `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`, `is_delete`

### Tabel Item Categories
- `item_category_id` (UUID, Primary Key)
- `type_category_id` (UUID, Foreign Key ke type_categories)
- `dokumen_id` (UUID, Foreign Key ke dokumen)
- `item_category_name_en` (VARCHAR(255), nullable)
- `item_category_name_cn` (VARCHAR(255), nullable)
- `item_category_description` (TEXT, nullable)
- `item_category_foto` (TEXT, nullable)
- Audit fields: `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`, `is_delete`

### Tabel Item Categories Details
- `item_category_detail_id` (UUID, Primary Key)
- `item_category_id` (UUID, Foreign Key ke item_categories)
- `target_id` (VARCHAR(255), nullable)
- `part_number` (VARCHAR(255), nullable)
- `catalog_item_name_en` (VARCHAR(255), nullable)
- `catalog_item_name_ch` (VARCHAR(255), nullable)
- `description` (TEXT, nullable)
- `quantity` (INTEGER, nullable)
- `unit` (VARCHAR(255), nullable)
- Audit fields: `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`, `is_delete`

## Endpoints

### POST /api/epc/item_category/get
Mengambil data item categories dengan pagination dan filter.

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

### GET /api/epc/item_category/:id
Mengambil data item category berdasarkan ID dengan semua data terkait.

### POST /api/epc/item_category/create
Membuat item category baru dengan details.

**Request (multipart/form-data):**
- `dokumen_name` (string)
- `master_category_id` (uuid)
- `category_id` (uuid)
- `type_category_id` (uuid)
- `file_foto` (file)
- `data_items` (array JSON string)

**Contoh data_items:**
```json
[
    {
        "target_id": "T001",
        "part_number": "PN-12345",
        "catalog_item_name_en": "Engine Oil Filter",
        "catalog_item_name_ch": "机油滤清器",
        "description": "High quality engine oil filter",
        "quantity": 2,
        "unit": "pcs"
    }
]
```

### PUT /api/epc/item_category/:id
Update item category (sama seperti create).

### DELETE /api/epc/item_category/:id
Soft delete item category.

### POST /api/epc/item_category/:id/restore
Restore item category yang sudah di-soft delete.

## Fitur Khusus

1. **Auto-create Dokumen**: Jika dokumen_name tidak ada di tabel dokumen, akan dibuat otomatis.
2. **Auto-create Unit**: Jika unit tidak ada di tabel units, akan dibuat otomatis.
3. **Transaction Support**: Semua operasi menggunakan database transaction untuk konsistensi data.
4. **Soft Delete**: Menggunakan soft delete dengan field `deleted_at` dan `is_delete`.
5. **Audit Trail**: Semua operasi mencatat `created_by`, `updated_by`, `deleted_by` dari token user.
6. **File Upload**: Support upload foto untuk item category.
7. **Relational Data**: Mengambil data dari tabel terkait (master_categories, categories, type_categories, units, dokumen).

## Authentication

Semua endpoint memerlukan token authentication menggunakan middleware `verifyToken`. User ID diambil dari token (`employee_id` atau `user_id`) untuk audit trail.
