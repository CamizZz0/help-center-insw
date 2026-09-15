# Help Center INSW API Documentation

Dokumentasi REST API untuk aplikasi redesign Help Center Indonesia National Single Window (INSW).

> Status: pengembangan aktif  
> Terakhir diperbarui: 8 September 2026

## 1. Ringkasan sistem

API dibangun menggunakan Express.js dan mengambil data dari PostgreSQL melalui Drizzle ORM. Aplikasi React tidak mengakses database secara langsung.

```text
React/Vite → Express REST API → Drizzle ORM → PostgreSQL
```

Konten FAQ memiliki hierarki berikut:

```text
Kategori → Subkategori → Topik → Pertanyaan dan jawaban FAQ
```

Contoh:

```text
Impor & Kepabeanan → PIB → Tracking PIB → Daftar FAQ Tracking PIB
```

## 2. Informasi umum

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
    "totalItems": 13,
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

Detail internal seperti stack trace, query SQL, password, dan connection string tidak boleh dikirim kepada client pada lingkungan production.

## 3. Ringkasan endpoint

| Method | Endpoint                                  | Status   | Kegunaan                                      |
| ------ | ----------------------------------------- | -------- | --------------------------------------------- |
| `GET`  | `/health`                                 | Tersedia | Memeriksa API dan koneksi PostgreSQL          |
| `GET`  | `/categories`                             | Tersedia | Mengambil semua kategori aktif                |
| `GET`  | `/categories/:categorySlug/subcategories` | Tersedia | Mengambil subkategori pada satu kategori      |
| `GET`  | `/subcategories/:subcategorySlug/topics`  | Tersedia | Mengambil topik pada satu subkategori         |
| `GET`  | `/topics/:topicSlug/faqs`                 | Tersedia | Mengambil FAQ berdasarkan topik               |
| `GET`  | `/faqs`                                   | Tersedia | Mengambil, mencari, dan memfilter FAQ populer |
| `GET`  | `/guides`                                 | Tersedia | Mengambil daftar panduan PDF                  |
| `GET`  | `/guides/:guideSlug`                      | Tersedia | Mengambil satu panduan berdasarkan slug       |
| `GET`  | `/tutorials`                              | Tersedia | Mengambil daftar video tutorial               |
| `GET`  | `/tutorials/:tutorialSlug`                | Tersedia | Mengambil satu tutorial berdasarkan slug      |
| `POST` | `/faqs/:id/feedback`                      | Tersedia | Menyimpan feedback anonim untuk satu FAQ      |

Endpoint detail panduan dan tutorial tetap tersedia untuk kebutuhan integrasi, walaupun frontend saat ini langsung membuka PDF atau YouTube tanpa halaman detail internal.

## 4. Health check

### `GET /health`

Memeriksa apakah Express API berjalan dan dapat terhubung ke PostgreSQL.

```http
GET /api/health
```

Respons `200 OK`:

```json
{
  "success": true,
  "message": "API dan PostgreSQL berhasil terhubung",
  "databaseTime": "2026-09-08T01:00:00.000Z"
}
```

Respons `500 Internal Server Error`:

```json
{
  "success": false,
  "message": "Gagal terhubung ke PostgreSQL"
}
```

## 5. Categories

### `GET /categories`

Mengambil semua kategori aktif dan mengurutkannya berdasarkan `sortOrder`.

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
      "isActive": true
    }
  ]
}
```

## 6. Subcategories

### `GET /categories/:categorySlug/subcategories`

Mengambil seluruh subkategori aktif dalam satu kategori.

Path parameter:

| Parameter      | Tipe   | Wajib | Contoh             |
| -------------- | ------ | ----- | ------------------ |
| `categorySlug` | string | Ya    | `impor-kepabeanan` |

```http
GET /api/categories/impor-kepabeanan/subcategories
```

Contoh respons `200 OK`:

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
        "sortOrder": 1
      }
    ]
  }
}
```

Kategori yang valid tetapi belum memiliki subkategori mengembalikan `200 OK` dengan `subcategories: []`.

## 7. FAQ topics

### `GET /subcategories/:subcategorySlug/topics`

Mengambil topik aktif dalam satu subkategori.

Path parameter:

| Parameter         | Tipe   | Wajib | Contoh |
| ----------------- | ------ | ----- | ------ |
| `subcategorySlug` | string | Ya    | `pib`  |

```http
GET /api/subcategories/pib/topics
```

Mendukung `?viewerRole=guest|authenticated` (simulasi demo). Setiap
topik menyertakan `faqCount` (jumlah FAQ yang terlihat role tersebut) dan
`hasRestricted` (ada konten khusus), untuk badge jumlah di sidebar:

```json
{
  "id": 2,
  "name": "Tracking PIB",
  "slug": "tracking-pib",
  "description": "Informasi mengenai Tracking PIB.",
  "sortOrder": 2,
  "faqCount": 3,
  "hasRestricted": true
}
```

Contoh respons `200 OK`:

```json
{
  "success": true,
  "message": "Topik berhasil diambil",
  "data": {
    "subcategory": {
      "id": 1,
      "name": "PIB",
      "slug": "pib"
    },
    "topics": [
      {
        "id": 1,
        "name": "Pendahuluan PIB",
        "slug": "pendahuluan-pib",
        "description": "Informasi mengenai Pendahuluan PIB.",
        "sortOrder": 1
      },
      {
        "id": 2,
        "name": "Tracking PIB",
        "slug": "tracking-pib",
        "description": "Informasi mengenai Tracking PIB.",
        "sortOrder": 2
      }
    ]
  }
}
```

## 8. FAQs berdasarkan topik

### `GET /topics/:topicSlug/faqs`

Mengambil FAQ yang dipublikasikan dalam satu topik.

Query parameter:

| Parameter    | Tipe    | Wajib | Default | Keterangan                                                        |
| ------------ | ------- | ----- | ------- | ----------------------------------------------------------------- |
| `page`       | integer | Tidak | `1`     | Nomor halaman                                                     |
| `limit`      | integer | Tidak | `6`     | Jumlah data per halaman                                           |
| `viewerRole` | string  | Tidak | `guest` | Simulasi demo: `guest` \| `authenticated` (bukan auth) |

```http
GET /api/topics/tracking-pib/faqs?page=1&limit=6
```

Respons topik juga menyertakan metadata demo:

```json
{
  "data": {
    "topic": {},
    "faqs": [],
    "locked": [
      {
        "id": 9,
        "question": "Bagaimana memperbarui data profil perusahaan untuk layanan PIB?",
        "visibility": "authenticated",
        "isDraft": false,
        "teaser": "Panduan lanjutan yang hanya tersedia untuk pengguna terdaftar."
      }
    ]
  },
  "meta": {
    "visibilityCounts": {
      "public": 3,
      "authenticated": 2,
      "draft": 1,
      "total": 7
    }
  }
}
```

> `locked` **tidak pernah** memuat `answer` — Guest melihat judul card
> terkunci tanpa jawaban bocor via network.

Contoh item pada respons:

```json
{
  "id": 5,
  "question": "Apa maksud dari NSW Reject dan BC Reject di status tracking dokumen saya",
  "answer": "<p>Pastikan asal dan status penyebab reject...</p>",
  "isPopular": false,
  "isPublished": true,
  "visibility": "public",
  "sortOrder": 1,
  "topic": {
    "name": "Tracking PIB",
    "slug": "tracking-pib"
  },
  "subcategory": {
    "name": "PIB",
    "slug": "pib"
  },
  "category": {
    "name": "Impor & Kepabeanan",
    "slug": "impor-kepabeanan"
  }
}
```

## 9. Semua FAQ dan pencarian

### `GET /faqs`

Digunakan untuk daftar semua FAQ, pencarian global, FAQ populer, dan pagination.

Query parameter:

| Parameter    | Tipe    | Wajib | Default | Keterangan                                                        |
| ------------ | ------- | ----- | ------- | ----------------------------------------------------------------- |
| `search`     | string  | Tidak | —       | Mencari teks pada pertanyaan dan jawaban                          |
| `popular`    | boolean | Tidak | —       | Isi `true` untuk mengambil FAQ populer                            |
| `page`       | integer | Tidak | `1`     | Nomor halaman                                                     |
| `limit`      | integer | Tidak | `6`     | Jumlah data per halaman                                           |
| `viewerRole` | string  | Tidak | `guest` | Simulasi demo: `guest` \| `authenticated` (bukan auth) |

Pencarian:

```http
GET /api/faqs?search=tracking%20PIB&page=1&limit=6
```

FAQ populer:

```http
GET /api/faqs?popular=true&page=1&limit=3
```

Respons `200 OK`:

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

Pencarian tanpa hasil tetap mengembalikan `200 OK` dengan `data: []` dan bukan `404`.

Pencarian juga mengenali singkatan layanan (misalnya `PIB`, `PEB`, `BTKI`,
`PERTEK`, dan `SKA`), sinonim umum, serta salah ketik ringan. Respons metadata
dapat memuat `correctedQuery`, `highlightTerms`, dan maksimal tiga `suggestions`
saat tidak ada hasil.

Jawaban FAQ dapat berisi HTML yang telah dibersihkan pada backend. Frontend merendernya pada komponen accordion.

### Visibilitas FAQ dan `viewerRole` (simulasi demo, bukan autentikasi)

Setiap item FAQ kini menyertakan field:

| Field         | Tipe    | Keterangan                                                              |
| ------------- | ------- | ----------------------------------------------------------------------- |
| `isPublished` | boolean | `false` berarti draft (tersembunyi dari publik apa pun visibilitasnya) |
| `visibility`  | string  | `public` (default) \| `authenticated`                                    |

Aturan tampil berdasarkan `viewerRole`:

| `viewerRole`    | FAQ yang dikembalikan                                             |
| --------------- | ----------------------------------------------------------------- |
| `guest`         | published + `public`                                              |
| `authenticated` | published + `public` / `authenticated`                            |

> TODO(auth): `viewerRole` hanyalah query param simulasi untuk demo.
> Setelah login resmi tersedia, hapus param ini dan tentukan role dari
> sesi/JWT di backend. Filtering berbasis role wajib dilakukan di backend.

Endpoint CMS terkait:

| Method    | Endpoint              | Keterangan                                              |
| --------- | --------------------- | ------------------------------------------------------- |
| `GET`     | `/cms/faqs`           | Mendukung `?visibility=public\|authenticated`            |
| `POST`    | `/cms/faqs`           | Body menerima `visibility` (default `public`)           |
| `PATCH`   | `/cms/faqs/:id`       | Body menerima `visibility`                              |

## 10. Guides

### `GET /guides`

Mengambil daftar panduan yang dipublikasikan.

```http
GET /api/guides?page=1&limit=6
```

Contoh item:

```json
{
  "id": 1,
  "title": "Panduan Registrasi Akun INSW",
  "slug": "panduan-registrasi-akun-insw",
  "description": "Panduan registrasi akun pengguna INSW.",
  "thumbnailUrl": null,
  "fileUrl": "https://example.com/panduan.pdf",
  "sortOrder": 1
}
```

### `GET /guides/:guideSlug`

Mengambil satu panduan berdasarkan slug.

```http
GET /api/guides/panduan-registrasi-akun-insw
```

Respons `404 Not Found` diberikan jika slug tidak ditemukan.

## 11. Tutorials

### `GET /tutorials`

Mengambil daftar tutorial yang dipublikasikan.

```http
GET /api/tutorials?page=1&limit=6
```

Contoh item:

```json
{
  "id": 1,
  "title": "Tutorial Registrasi INSW",
  "slug": "tutorial-registrasi-insw",
  "description": "Video tutorial registrasi akun INSW.",
  "thumbnailUrl": "https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg",
  "videoUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
  "durationSeconds": null,
  "sortOrder": 1
}
```

### `GET /tutorials/:tutorialSlug`

Mengambil satu tutorial berdasarkan slug.

```http
GET /api/tutorials/tutorial-registrasi-insw
```

Respons `404 Not Found` diberikan jika slug tidak ditemukan.

## 12. Status HTTP

| Status                      | Arti                     | Penggunaan                                        |
| --------------------------- | ------------------------ | ------------------------------------------------- |
| `200 OK`                    | Request berhasil         | Data berhasil diambil atau hasil pencarian kosong |
| `400 Bad Request`           | Parameter tidak valid    | Nilai page, limit, atau parameter lain salah      |
| `404 Not Found`             | Resource tidak ditemukan | Slug atau ID tidak ditemukan                      |
| `500 Internal Server Error` | Kesalahan server         | Koneksi database atau proses server gagal         |

## 13. Integrasi frontend

Konfigurasi frontend:

```env
VITE_API_URL=http://localhost:5001/api
```

Lokasi fungsi API client:

```text
client/src/services/api.js
```

Pemetaan penggunaan:

| Fungsi frontend                   | Endpoint                                      |
| --------------------------------- | --------------------------------------------- |
| `getCategories()`                 | `GET /categories`                             |
| `getSubcategories(categorySlug)`  | `GET /categories/:categorySlug/subcategories` |
| `getTopics(subcategorySlug)`      | `GET /subcategories/:subcategorySlug/topics`  |
| `getTopicFaqs(topicSlug, params)` | `GET /topics/:topicSlug/faqs`                 |
| `getFaqs(params)`                 | `GET /faqs`                                   |
| `getGuides(params)`               | `GET /guides`                                 |
| `getGuideBySlug(slug)`            | `GET /guides/:guideSlug`                      |
| `getTutorials(params)`            | `GET /tutorials`                              |
| `getTutorialBySlug(slug)`         | `GET /tutorials/:tutorialSlug`                |

## 14. Sumber dan proses impor FAQ

Konten FAQ lama dapat diambil dari respons layanan CMS INSW, kemudian dipetakan ke struktur database redesign.

```text
API/CMS INSW → importer backend → PostgreSQL → REST API project → React
```

Importer menggunakan `sourceId` agar data sumber yang sama dapat diperbarui dengan proses upsert dan tidak menghasilkan duplikasi.

Jalankan importer:

```bash
npm run import:faqs
```

## 15. Menjalankan dan menguji API

Jalankan backend:

```bash
cd server
npm install
npm run dev
```

Uji endpoint menggunakan browser, Postman, atau Thunder Client:

```text
http://localhost:5001/api/health
http://localhost:5001/api/categories
http://localhost:5001/api/faqs?page=1&limit=6
http://localhost:5001/api/guides?page=1&limit=6
http://localhost:5001/api/tutorials?page=1&limit=6
```

## 16. Catatan keamanan

- Endpoint saat ini hanya menyediakan konten publik dan tidak memerlukan login.
- Kredensial PostgreSQL hanya disimpan pada file `.env` backend.
- File `.env` tidak boleh dikirim ke GitHub.
- Parameter request harus divalidasi pada backend.
- HTML jawaban dari sumber eksternal harus disanitasi sebelum disimpan atau dikirim.
- Pesan error production tidak boleh membocorkan query SQL atau stack trace.

## 17. Pemeliharaan dokumentasi

Dokumentasi harus diperbarui ketika endpoint, parameter, bentuk respons, atau status implementasi berubah.
