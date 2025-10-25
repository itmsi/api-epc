# Type Category Module

Module untuk mengelola data type categories dengan fitur CRUD lengkap.

## Endpoints

- `POST /api/epc/type_category/get` - Mendapatkan data type categories dengan pagination dan filter
- `POST /api/epc/type_category/create` - Membuat type category baru
- `GET /api/epc/type_category/:id` - Mendapatkan type category berdasarkan ID
- `PUT /api/epc/type_category/:id` - Mengupdate type category
- `DELETE /api/epc/type_category/:id` - Menghapus type category (soft delete)

## Database Schema

Tabel: `type_categories`

### Kolom:
- `type_category_id` (uuid, primary key)
- `category_id` (uuid, nullable)
- `type_category_name_en` (varchar(255), nullable)
- `type_category_name_cn` (varchar(255), nullable)
- `type_category_description` (text, nullable)
- `created_at` (timestamp)
- `created_by` (uuid, nullable)
- `updated_at` (timestamp)
- `updated_by` (uuid, nullable)
- `deleted_at` (timestamp, nullable)
- `deleted_by` (uuid, nullable)
- `is_delete` (boolean, default: false)

## Authentication

Semua endpoint memerlukan token authentication melalui middleware `verifyToken`.

## Response Format

Menggunakan format response standar dari `utils/response.js`:
- `successResponse()` untuk response sukses
- `errorResponse()` untuk response error
