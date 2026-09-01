# Help Center INSW API Documentation

Dokumentasi REST API untuk aplikasi redesign Help Center Indonesia National Single Window (INSW).

> Status dokumen: pengembangan. Endpoint berlabel **Tersedia** sudah diimplementasikan, sedangkan endpoint berlabel **Direncanakan** menjadi kontrak untuk tahap pengembangan berikutnya.

## 1. Informasi Umum

### Base URL

Development:

```text
http://localhost:5001/api
```

Production:

```text
https://<domain-backend>/api
```

### Content type

```http
Content-Type: application/json
```

### Format respons berhasil

```json
{
  "success": true,
  "message": "Data berhasil diambil",
  "data": {}
}
```

### Format respons dengan pagination

```json
{
  "success": true,
  "message": "Data berhasil diambil",
  "data": [],
  "meta": {
    "page": 1,
    "limit": 6,
    "totalItems": 18,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### Format respons gagal

```json
{
  "success": false,
  "message": "Data tidak ditemukan"
}
```

Pada production, detail internal seperti stack trace, query SQL, password, dan connection string tidak boleh dikirim kepada client.

## 2. Ringkasan Endpoint

| Method | Endpoint                                  | Status       | Kegunaan                                   |
| ------ | ----------------------------------------- | ------------ | ------------------------------------------ |
| `GET`  | `/health`                                 | Tersedia     | Memeriksa API dan koneksi PostgreSQL       |
| `GET`  | `/categories`                             | Tersedia     | Mengambil seluruh kategori aktif           |
| `GET`  | `/categories/:categorySlug`               | Direncanakan | Mengambil detail kategori                  |
| `GET`  | `/categories/:categorySlug/subcategories` | Direncanakan | Mengambil subkategori berdasarkan kategori |
| `GET`  | `/subcategories/:subcategorySlug`         | Direncanakan | Mengambil detail subkategori               |
| `GET`  | `/subcategories/:subcategorySlug/faqs`    | Direncanakan | Mengambil FAQ per subkategori              |
| `GET`  | `/faqs`                                   | Direncanakan | Mengambil dan mencari FAQ                  |
| `GET`  | `/faqs/popular`                           | Direncanakan | Mengambil FAQ populer                      |
| `GET`  | `/faqs/:faqId`                            | Direncanakan | Mengambil detail satu FAQ                  |
| `GET`  | `/guides`                                 | Direncanakan | Mengambil daftar panduan                   |
| `GET`  | `/guides/:guideSlug`                      | Direncanakan | Mengambil detail panduan/PDF               |
| `GET`  | `/tutorials`                              | Direncanakan | Mengambil daftar tutorial                  |
| `GET`  | `/tutorials/:tutorialSlug`                | Direncanakan | Mengambil detail tutorial                  |

## 3. Health Check

### GET `/health`

Memeriksa apakah Express API berjalan dan dapat terhubung ke PostgreSQL.

Contoh request:

```http
GET /api/health
```

Respons `200 OK`:

```json
{
  "success": true,
  "message": "API dan PostgreSQL berhasil terhubung",
  "databaseTime": "2026-09-01T06:30:00.000Z"
}
```

Respons `500 Internal Server Error`:

```json
{
  "success": false,
  "message": "Gagal terhubung ke PostgreSQL"
}
```

## 4. Categories

### GET `/categories`

Mengambil semua kategori Help Center yang aktif dan mengurutkannya berdasarkan `sortOrder`.

Contoh request:

```http
GET /api/categories
```

Respons `200 OK`:

```json
{
  "success": true,
  "message": "Kategori berhasil diambil",
  "data": [
    {
      "id": 1,
      "name": "Impor & Kepabeanan",
      "slug": "impor-kepabeanan",
      "description": "Informasi terkait proses impor dan kepabeanan.",
      "icon": "package-import",
      "sortOrder": 1,
      "isActive": true,
      "createdAt": "2026-09-01T06:30:00.000Z",
      "updatedAt": "2026-09-01T06:30:00.000Z"
    }
  ]
}
```

### GET `/categories/:categorySlug`

Mengambil detail satu kategori berdasarkan slug.

Path parameter:

| Parameter      | Tipe   | Wajib | Contoh             |
| -------------- | ------ | ----- | ------------------ |
| `categorySlug` | string | Ya    | `impor-kepabeanan` |

Contoh request:

```http
GET /api/categories/impor-kepabeanan
```

Respons `200 OK`:

```json
{
  "success": true,
  "message": "Kategori berhasil ditemukan",
  "data": {
    "id": 1,
    "name": "Impor & Kepabeanan",
    "slug": "impor-kepabeanan",
    "description": "Informasi terkait proses impor dan kepabeanan.",
    "icon": "package-import",
    "sortOrder": 1
  }
}
```

Respons `404 Not Found`:

```json
{
  "success": false,
  "message": "Kategori tidak ditemukan"
}
```

### GET `/categories/:categorySlug/subcategories`

Mengambil seluruh subkategori aktif dalam satu kategori.

Contoh request:

```http
GET /api/categories/impor-kepabeanan/subcategories
```

Respons `200 OK`:

```json
{
  "success": true,
  "message": "Subkategori berhasil diambil",
  "data": {
    "category": {
      "id": 1,
      "name": "Impor & Kepabeanan",
      "slug": "impor-kepabeanan"
    },
    "subcategories": [
      {
        "id": 1,
        "name": "PIB",
        "slug": "pib",
        "description": "Informasi mengenai Pemberitahuan Impor Barang.",
        "icon": "file-text",
        "sortOrder": 1
      },
      {
        "id": 2,
        "name": "DO Online/SP2",
        "slug": "do-online-sp2",
        "description": "Informasi layanan Delivery Order Online dan SP2.",
        "icon": "file-check",
        "sortOrder": 2
      }
    ]
  }
}
```

Jika kategori ditemukan tetapi belum mempunyai subkategori, API mengembalikan `200 OK` dengan `subcategories: []`.

## 5. Subcategories

### GET `/subcategories/:subcategorySlug`

Mengambil detail subkategori beserta kategori induknya.

Contoh request:

```http
GET /api/subcategories/pib
```

Respons `200 OK`:

```json
{
  "success": true,
  "message": "Subkategori berhasil ditemukan",
  "data": {
    "id": 1,
    "name": "PIB",
    "slug": "pib",
    "description": "Informasi mengenai Pemberitahuan Impor Barang.",
    "icon": "file-text",
    "category": {
      "id": 1,
      "name": "Impor & Kepabeanan",
      "slug": "impor-kepabeanan"
    }
  }
}
```

### GET `/subcategories/:subcategorySlug/faqs`

Mengambil daftar FAQ yang dipublikasikan dalam satu subkategori. Endpoint ini mendukung pagination.

Query parameter:

| Parameter | Tipe    | Wajib | Default | Keterangan                |
| --------- | ------- | ----- | ------- | ------------------------- |
| `page`    | integer | Tidak | `1`     | Nomor halaman             |
| `limit`   | integer | Tidak | `6`     | Jumlah FAQ, maksimal `50` |

Contoh request:

```http
GET /api/subcategories/pib/faqs?page=1&limit=6
```

Respons `200 OK`:

```json
{
  "success": true,
  "message": "FAQ berhasil diambil",
  "data": {
    "subcategory": {
      "id": 1,
      "name": "PIB",
      "slug": "pib"
    },
    "faqs": [
      {
        "id": 1,
        "question": "Apa itu PIB?",
        "answer": "PIB adalah pemberitahuan pabean untuk pengeluaran barang impor.",
        "isPopular": true,
        "sortOrder": 1
      }
    ]
  },
  "meta": {
    "page": 1,
    "limit": 6,
    "totalItems": 1,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

## 6. FAQs

### GET `/faqs`

Mengambil daftar FAQ yang dipublikasikan. Dapat digunakan oleh search bar, filter kategori, dan pagination.

Query parameter:

| Parameter     | Tipe    | Wajib | Default | Keterangan                          |
| ------------- | ------- | ----- | ------- | ----------------------------------- |
| `search`      | string  | Tidak | —       | Mencari pada pertanyaan dan jawaban |
| `category`    | string  | Tidak | —       | Filter berdasarkan slug kategori    |
| `subcategory` | string  | Tidak | —       | Filter berdasarkan slug subkategori |
| `popular`     | boolean | Tidak | —       | Gunakan `true` untuk FAQ populer    |
| `page`        | integer | Tidak | `1`     | Nomor halaman                       |
| `limit`       | integer | Tidak | `6`     | Jumlah data, maksimal `50`          |

Contoh request:

```http
GET /api/faqs?search=status%20PIB&category=impor-kepabeanan&page=1&limit=6
```

Respons `200 OK`:

```json
{
  "success": true,
  "message": "FAQ berhasil diambil",
  "data": [
    {
      "id": 2,
      "question": "Bagaimana cara memantau status pengajuan PIB?",
      "answer": "Status pengajuan dapat dipantau melalui layanan terkait pada Portal INSW.",
      "isPopular": true,
      "category": {
        "name": "Impor & Kepabeanan",
        "slug": "impor-kepabeanan"
      },
      "subcategory": {
        "name": "PIB",
        "slug": "pib"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 6,
    "totalItems": 1,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

Jika pencarian tidak menghasilkan data, API tetap mengembalikan `200 OK`:

```json
{
  "success": true,
  "message": "FAQ berhasil diambil",
  "data": [],
  "meta": {
    "page": 1,
    "limit": 6,
    "totalItems": 0,
    "totalPages": 0,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

### GET `/faqs/popular`

Mengambil FAQ yang memiliki `isPopular: true` untuk bagian FAQ Populer pada halaman utama.

Query parameter:

| Parameter | Tipe    | Wajib | Default | Keterangan                        |
| --------- | ------- | ----- | ------- | --------------------------------- |
| `limit`   | integer | Tidak | `3`     | Jumlah FAQ populer, maksimal `10` |

Contoh request:

```http
GET /api/faqs/popular?limit=3
```

Respons `200 OK`:

```json
{
  "success": true,
  "message": "FAQ populer berhasil diambil",
  "data": [
    {
      "id": 1,
      "question": "Bagaimana cara registrasi akun INSW?",
      "answer": "Pengguna dapat melakukan registrasi melalui Portal INSW.",
      "category": {
        "name": "Registrasi & Akun",
        "slug": "registrasi"
      }
    }
  ]
}
```

> Penting: route `/faqs/popular` harus didaftarkan sebelum `/faqs/:faqId` agar kata `popular` tidak dianggap sebagai ID.

### GET `/faqs/:faqId`

Mengambil detail satu FAQ berdasarkan ID.

Path parameter:

| Parameter | Tipe    | Wajib | Contoh |
| --------- | ------- | ----- | ------ |
| `faqId`   | integer | Ya    | `1`    |

Respons `200 OK`:

```json
{
  "success": true,
  "message": "FAQ berhasil ditemukan",
  "data": {
    "id": 1,
    "question": "Apa itu PIB?",
    "answer": "PIB adalah pemberitahuan pabean untuk pengeluaran barang impor.",
    "isPopular": true,
    "category": {
      "name": "Impor & Kepabeanan",
      "slug": "impor-kepabeanan"
    },
    "subcategory": {
      "name": "PIB",
      "slug": "pib"
    }
  }
}
```

## 7. Guides

PDF tidak disimpan sebagai binary di PostgreSQL. Database hanya menyimpan metadata dan URL/path file.

### GET `/guides`

Mengambil daftar panduan yang dipublikasikan.

Query parameter:

| Parameter  | Tipe    | Wajib | Default | Keterangan                       |
| ---------- | ------- | ----- | ------- | -------------------------------- |
| `category` | string  | Tidak | —       | Filter berdasarkan slug kategori |
| `search`   | string  | Tidak | —       | Pencarian judul/deskripsi        |
| `page`     | integer | Tidak | `1`     | Nomor halaman                    |
| `limit`    | integer | Tidak | `6`     | Jumlah data, maksimal `50`       |

Contoh request:

```http
GET /api/guides?category=impor-kepabeanan&page=1&limit=6
```

Contoh item response:

```json
{
  "id": 1,
  "title": "Panduan Pengisian PIB",
  "slug": "panduan-pengisian-pib",
  "description": "Panduan langkah demi langkah pengisian PIB.",
  "thumbnailUrl": "/uploads/guides/pib-thumbnail.webp",
  "fileUrl": "/uploads/guides/panduan-pib.pdf",
  "category": {
    "name": "Impor & Kepabeanan",
    "slug": "impor-kepabeanan"
  }
}
```

### GET `/guides/:guideSlug`

Mengambil detail satu panduan untuk ditampilkan pada PDF Viewer.

Contoh request:

```http
GET /api/guides/panduan-pengisian-pib
```

Respons `200 OK`:

```json
{
  "success": true,
  "message": "Panduan berhasil ditemukan",
  "data": {
    "id": 1,
    "title": "Panduan Pengisian PIB",
    "slug": "panduan-pengisian-pib",
    "description": "Panduan langkah demi langkah pengisian PIB.",
    "thumbnailUrl": "/uploads/guides/pib-thumbnail.webp",
    "fileUrl": "/uploads/guides/panduan-pib.pdf",
    "publishedAt": "2026-09-01T06:30:00.000Z"
  }
}
```

## 8. Tutorials

Video tidak disimpan sebagai binary di PostgreSQL. Database hanya menyimpan metadata dan URL video/thumbnail.

### GET `/tutorials`

Mengambil daftar tutorial yang dipublikasikan.

Query parameter:

| Parameter  | Tipe    | Wajib | Default | Keterangan                       |
| ---------- | ------- | ----- | ------- | -------------------------------- |
| `category` | string  | Tidak | —       | Filter berdasarkan slug kategori |
| `search`   | string  | Tidak | —       | Pencarian judul/deskripsi        |
| `page`     | integer | Tidak | `1`     | Nomor halaman                    |
| `limit`    | integer | Tidak | `6`     | Jumlah data, maksimal `50`       |

Contoh item response:

```json
{
  "id": 1,
  "title": "Tutorial Pengajuan PIB",
  "slug": "tutorial-pengajuan-pib",
  "description": "Tutorial proses pengajuan PIB melalui Portal INSW.",
  "thumbnailUrl": "/uploads/tutorials/pib-thumbnail.webp",
  "videoUrl": "https://www.youtube.com/watch?v=example",
  "durationSeconds": 420,
  "category": {
    "name": "Impor & Kepabeanan",
    "slug": "impor-kepabeanan"
  }
}
```

### GET `/tutorials/:tutorialSlug`

Mengambil detail tutorial dan langkah-langkahnya.

Contoh request:

```http
GET /api/tutorials/tutorial-pengajuan-pib
```

Respons `200 OK`:

```json
{
  "success": true,
  "message": "Tutorial berhasil ditemukan",
  "data": {
    "id": 1,
    "title": "Tutorial Pengajuan PIB",
    "slug": "tutorial-pengajuan-pib",
    "description": "Tutorial proses pengajuan PIB melalui Portal INSW.",
    "thumbnailUrl": "/uploads/tutorials/pib-thumbnail.webp",
    "videoUrl": "https://www.youtube.com/watch?v=example",
    "durationSeconds": 420,
    "steps": [
      {
        "id": 1,
        "stepNumber": 1,
        "title": "Masuk ke Portal INSW",
        "description": "Buka Portal INSW dan masuk menggunakan akun yang terdaftar."
      }
    ]
  }
}
```

## 9. Validasi Parameter

Ketentuan umum:

- `page` harus berupa bilangan bulat minimal `1`.
- `limit` harus berupa bilangan bulat minimal `1` dan maksimal `50`.
- `faqId` harus berupa bilangan bulat positif.
- Nilai `popular` hanya menerima `true` atau `false`.
- Slug harus berupa huruf kecil, angka, dan tanda hubung.
- Kata pencarian harus dipangkas dari spasi berlebih.
- Input dari pengguna tidak boleh digabungkan langsung ke query SQL.

Respons `400 Bad Request`:

```json
{
  "success": false,
  "message": "Parameter tidak valid",
  "errors": [
    {
      "field": "page",
      "message": "Page minimal bernilai 1"
    }
  ]
}
```

## 10. HTTP Status Codes

| Status                      | Kegunaan                                             |
| --------------------------- | ---------------------------------------------------- |
| `200 OK`                    | Request berhasil                                     |
| `400 Bad Request`           | Parameter atau input tidak valid                     |
| `404 Not Found`             | Resource tidak ditemukan                             |
| `429 Too Many Requests`     | Terlalu banyak request jika rate limiting diaktifkan |
| `500 Internal Server Error` | Kesalahan internal API atau database                 |

## 11. CORS dan Environment

Development frontend yang diizinkan:

```env
CLIENT_URL=http://localhost:5173
```

Environment backend minimal:

```env
PORT=5001
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://USERNAME:PASSWORD@HOST:5432/DATABASE_NAME
```

File `.env` tidak boleh dimasukkan ke Git. Repository hanya menyimpan `.env.example` tanpa kredensial asli.

## 12. Scope Autentikasi

Endpoint publik di dokumen ini tidak membutuhkan login karena pengguna Help Center hanya membaca informasi.

Autentikasi, dashboard admin, serta endpoint `POST`, `PUT`, dan `DELETE` belum termasuk scope saat ini. Jika dashboard pengelolaan konten ditambahkan, endpoint admin harus ditempatkan pada `/api/admin`, dilindungi autentikasi, otorisasi role, validasi input, dan rate limiting.

## 13. Aturan Pemeliharaan Dokumentasi

- Ubah status endpoint menjadi **Tersedia** hanya setelah endpoint berhasil diuji.
- Perbarui contoh response saat kontrak API berubah.
- Jangan menuliskan password, token, atau data rahasia pada dokumentasi.
- Dokumentasi API dan implementasi endpoint sebaiknya masuk dalam commit yang sama.
- Catat breaking change jika nama field, URL, atau struktur response berubah.

