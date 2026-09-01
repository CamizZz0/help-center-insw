# Help Center INSW Database Documentation

Dokumentasi database untuk aplikasi redesign Help Center Indonesia National Single Window (INSW).

## 1. Informasi Database

| Informasi         | Nilai              |
| ----------------- | ------------------ |
| Database          | PostgreSQL         |
| Nama database     | `help_center_insw` |
| ORM               | Drizzle ORM        |
| Backend           | Express.js         |
| Driver            | `node-postgres`    |
| Schema PostgreSQL | `public`           |

Database menyimpan konten dinamis Help Center, sedangkan React hanya mengambil data melalui REST API.

## 2. Status Tabel

| Tabel            | Status       | Keterangan                 |
| ---------------- | ------------ | -------------------------- |
| `categories`     | Tersedia     | Kategori utama Help Center |
| `subcategories`  | Tersedia     | Topik di dalam kategori    |
| `faqs`           | Tersedia     | Pertanyaan dan jawaban     |
| `guides`         | Direncanakan | Dokumen panduan            |
| `tutorials`      | Direncanakan | Video atau tutorial        |
| `tutorial_steps` | Direncanakan | Langkah-langkah tutorial   |

## 3. Entity Relationship Diagram

```mermaid
erDiagram
    categories ||--o{ subcategories : memiliki
    subcategories ||--o{ faqs : memiliki
    categories ||--o{ guides : memiliki
    categories ||--o{ tutorials : memiliki
    tutorials ||--o{ tutorial_steps : memiliki

    categories {
        integer id PK
        varchar name
        varchar slug UK
        text description
        varchar icon
        integer sort_order
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    subcategories {
        integer id PK
        integer category_id FK
        varchar name
        varchar slug UK
        text description
        varchar icon
        integer sort_order
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    faqs {
        integer id PK
        integer subcategory_id FK
        text question
        text answer
        boolean is_popular
        integer sort_order
        boolean is_published
        timestamp created_at
        timestamp updated_at
    }

    guides {
        integer id PK
        integer category_id FK
        varchar title
        varchar slug UK
        text description
        varchar thumbnail_url
        varchar file_url
        integer sort_order
        boolean is_published
        timestamp published_at
        timestamp created_at
        timestamp updated_at
    }

    tutorials {
        integer id PK
        integer category_id FK
        varchar title
        varchar slug UK
        text description
        varchar thumbnail_url
        varchar video_url
        integer duration_seconds
        integer sort_order
        boolean is_published
        timestamp published_at
        timestamp created_at
        timestamp updated_at
    }

    tutorial_steps {
        integer id PK
        integer tutorial_id FK
        integer step_number
        varchar title
        text description
        varchar image_url
        timestamp created_at
        timestamp updated_at
    }
```

## 4. Tabel `categories`

Menyimpan kategori utama yang ditampilkan sebagai card pada halaman utama Help Center.

Contoh kategori:

- Impor & Kepabeanan
- Ekspor
- Registrasi & Akun
- Portal INSW
- Perizinan & Rekomendasi
- Fasilitas & Kawasan
- Layanan Lainnya

### Struktur kolom

| Kolom         | Tipe                       | Constraint       | Keterangan             |
| ------------- | -------------------------- | ---------------- | ---------------------- |
| `id`          | `serial`                   | Primary key      | Identitas kategori     |
| `name`        | `varchar(150)`             | Not null         | Nama kategori          |
| `slug`        | `varchar(150)`             | Not null, unique | Digunakan pada URL     |
| `description` | `text`                     | Nullable         | Deskripsi kategori     |
| `icon`        | `varchar(100)`             | Nullable         | Kunci ikon untuk React |
| `sort_order`  | `integer`                  | Default `0`      | Urutan tampilan        |
| `is_active`   | `boolean`                  | Default `true`   | Status kategori        |
| `created_at`  | `timestamp with time zone` | Default sekarang | Waktu dibuat           |
| `updated_at`  | `timestamp with time zone` | Default sekarang | Waktu diperbarui       |

### Contoh data

```json
{
  "id": 1,
  "name": "Impor & Kepabeanan",
  "slug": "impor-kepabeanan",
  "description": "Informasi terkait proses impor dan kepabeanan.",
  "icon": "package-import",
  "sortOrder": 1,
  "isActive": true
}
```

## 5. Tabel `subcategories`

Menyimpan topik yang berada di dalam kategori.

Contoh struktur:

```text
Impor & Kepabeanan
├── PIB
├── DO Online/SP2
├── SSM QC (Impor–Ekspor)
├── BTKI 2022
└── Modul Pertek/Rekom
```

### Struktur kolom

| Kolom         | Tipe                       | Constraint            | Keterangan             |
| ------------- | -------------------------- | --------------------- | ---------------------- |
| `id`          | `serial`                   | Primary key           | Identitas subkategori  |
| `category_id` | `integer`                  | Foreign key, not null | Referensi kategori     |
| `name`        | `varchar(150)`             | Not null              | Nama subkategori       |
| `slug`        | `varchar(150)`             | Not null, unique      | Digunakan pada URL     |
| `description` | `text`                     | Nullable              | Penjelasan subkategori |
| `icon`        | `varchar(100)`             | Nullable              | Kunci ikon untuk React |
| `sort_order`  | `integer`                  | Default `0`           | Urutan tampilan        |
| `is_active`   | `boolean`                  | Default `true`        | Status subkategori     |
| `created_at`  | `timestamp with time zone` | Default sekarang      | Waktu dibuat           |
| `updated_at`  | `timestamp with time zone` | Default sekarang      | Waktu diperbarui       |

### Foreign key

```text
subcategories.category_id → categories.id
```

Aturan penghapusan:

```text
ON DELETE CASCADE
```

Jika kategori dihapus, subkategori di dalamnya ikut terhapus.

## 6. Tabel `faqs`

Menyimpan pertanyaan dan jawaban yang berada di dalam subkategori.

Satu subkategori dapat mempunyai banyak FAQ.

### Struktur kolom

| Kolom            | Tipe                       | Constraint            | Keterangan                   |
| ---------------- | -------------------------- | --------------------- | ---------------------------- |
| `id`             | `serial`                   | Primary key           | Identitas FAQ                |
| `subcategory_id` | `integer`                  | Foreign key, not null | Referensi subkategori        |
| `question`       | `text`                     | Not null              | Pertanyaan FAQ               |
| `answer`         | `text`                     | Not null              | Jawaban FAQ                  |
| `is_popular`     | `boolean`                  | Default `false`       | Ditampilkan pada FAQ Populer |
| `sort_order`     | `integer`                  | Default `0`           | Urutan FAQ                   |
| `is_published`   | `boolean`                  | Default `true`        | Status publikasi             |
| `created_at`     | `timestamp with time zone` | Default sekarang      | Waktu dibuat                 |
| `updated_at`     | `timestamp with time zone` | Default sekarang      | Waktu diperbarui             |

### Foreign key

```text
faqs.subcategory_id → subcategories.id
```

Aturan penghapusan:

```text
ON DELETE CASCADE
```

Jika subkategori dihapus, FAQ di dalamnya ikut terhapus.

### Contoh data

```json
{
  "id": 1,
  "subcategoryId": 1,
  "question": "Apa itu PIB?",
  "answer": "PIB adalah pemberitahuan pabean untuk pengeluaran barang impor.",
  "isPopular": true,
  "sortOrder": 1,
  "isPublished": true
}
```

## 7. Tabel `guides` — Direncanakan

Menyimpan metadata dokumen panduan.

File PDF tidak disimpan sebagai binary di PostgreSQL. Database hanya menyimpan URL atau path file.

### Struktur kolom

| Kolom           | Tipe                       | Constraint       | Keterangan         |
| --------------- | -------------------------- | ---------------- | ------------------ |
| `id`            | `serial`                   | Primary key      | Identitas panduan  |
| `category_id`   | `integer`                  | Foreign key      | Kategori panduan   |
| `title`         | `varchar(200)`             | Not null         | Judul panduan      |
| `slug`          | `varchar(200)`             | Not null, unique | URL detail panduan |
| `description`   | `text`                     | Nullable         | Deskripsi panduan  |
| `thumbnail_url` | `varchar(500)`             | Nullable         | URL thumbnail      |
| `file_url`      | `varchar(500)`             | Not null         | URL/path PDF       |
| `sort_order`    | `integer`                  | Default `0`      | Urutan tampilan    |
| `is_published`  | `boolean`                  | Default `true`   | Status publikasi   |
| `published_at`  | `timestamp with time zone` | Nullable         | Waktu publikasi    |
| `created_at`    | `timestamp with time zone` | Default sekarang | Waktu dibuat       |
| `updated_at`    | `timestamp with time zone` | Default sekarang | Waktu diperbarui   |

## 8. Tabel `tutorials` — Direncanakan

Menyimpan metadata tutorial video.

Video tidak disimpan sebagai binary di PostgreSQL. Database hanya menyimpan URL video.

### Struktur kolom

| Kolom              | Tipe                       | Constraint       | Keterangan          |
| ------------------ | -------------------------- | ---------------- | ------------------- |
| `id`               | `serial`                   | Primary key      | Identitas tutorial  |
| `category_id`      | `integer`                  | Foreign key      | Kategori tutorial   |
| `title`            | `varchar(200)`             | Not null         | Judul tutorial      |
| `slug`             | `varchar(200)`             | Not null, unique | URL detail tutorial |
| `description`      | `text`                     | Nullable         | Deskripsi tutorial  |
| `thumbnail_url`    | `varchar(500)`             | Nullable         | URL thumbnail       |
| `video_url`        | `varchar(500)`             | Not null         | URL video           |
| `duration_seconds` | `integer`                  | Nullable         | Durasi dalam detik  |
| `sort_order`       | `integer`                  | Default `0`      | Urutan tampilan     |
| `is_published`     | `boolean`                  | Default `true`   | Status publikasi    |
| `published_at`     | `timestamp with time zone` | Nullable         | Waktu publikasi     |
| `created_at`       | `timestamp with time zone` | Default sekarang | Waktu dibuat        |
| `updated_at`       | `timestamp with time zone` | Default sekarang | Waktu diperbarui    |

## 9. Tabel `tutorial_steps` — Direncanakan

Menyimpan langkah-langkah dari satu tutorial.

### Struktur kolom

| Kolom         | Tipe                       | Constraint            | Keterangan         |
| ------------- | -------------------------- | --------------------- | ------------------ |
| `id`          | `serial`                   | Primary key           | Identitas langkah  |
| `tutorial_id` | `integer`                  | Foreign key, not null | Referensi tutorial |
| `step_number` | `integer`                  | Not null              | Nomor urut langkah |
| `title`       | `varchar(200)`             | Not null              | Judul langkah      |
| `description` | `text`                     | Not null              | Penjelasan langkah |
| `image_url`   | `varchar(500)`             | Nullable              | Gambar pendukung   |
| `created_at`  | `timestamp with time zone` | Default sekarang      | Waktu dibuat       |
| `updated_at`  | `timestamp with time zone` | Default sekarang      | Waktu diperbarui   |

## 10. Hubungan Antar-Entitas

| Parent          | Child            | Relasi      |
| --------------- | ---------------- | ----------- |
| `categories`    | `subcategories`  | One-to-many |
| `subcategories` | `faqs`           | One-to-many |
| `categories`    | `guides`         | One-to-many |
| `categories`    | `tutorials`      | One-to-many |
| `tutorials`     | `tutorial_steps` | One-to-many |

Contoh aliran data FAQ:

```text
Impor & Kepabeanan
└── PIB
    ├── Apa itu PIB?
    ├── Bagaimana cara mengisi PIB?
    └── Bagaimana memantau status PIB?
```

## 11. Aturan Slug

Slug digunakan untuk membuat URL yang mudah dibaca.

Contoh:

```text
Nama: Impor & Kepabeanan
Slug: impor-kepabeanan
URL: /faq/impor-kepabeanan
```

Ketentuan slug:

- Menggunakan huruf kecil.
- Spasi diganti tanda hubung.
- Tidak menggunakan simbol khusus.
- Harus unik pada tabelnya.
- Tidak boleh berubah sembarangan setelah digunakan pada production.

## 12. Aturan Data

- Hanya kategori dengan `is_active = true` yang ditampilkan.
- Hanya subkategori dengan `is_active = true` yang ditampilkan.
- Hanya FAQ dengan `is_published = true` yang dapat dibaca pengguna.
- FAQ populer menggunakan `is_popular = true`.
- Urutan data menggunakan `sort_order`.
- `updated_at` diperbarui ketika data berubah.
- Pertanyaan dan jawaban tidak boleh kosong.
- Setiap subkategori harus terhubung ke kategori yang valid.
- Setiap FAQ harus terhubung ke subkategori yang valid.

## 13. Index dan Constraint

Index yang disarankan:

```text
categories.slug
subcategories.slug
subcategories.category_id
faqs.subcategory_id
faqs.is_popular
faqs.is_published
guides.slug
guides.category_id
tutorials.slug
tutorials.category_id
tutorial_steps.tutorial_id
```

Kolom `slug` menggunakan unique constraint untuk mencegah URL ganda.

## 14. Pengelolaan Schema dengan Drizzle

Lokasi schema:

```text
server/src/models/schema.js
```

Lokasi konfigurasi:

```text
server/drizzle.config.js
```

Mengirim schema langsung ke database development:

```bash
npm run db:push
```

Membuka Drizzle Studio:

```bash
npm run db:studio
```

Mengisi data awal:

```bash
npm run db:seed
```

`db:push` digunakan selama pengembangan awal. Untuk production, perubahan database sebaiknya menggunakan migration yang disimpan di Git.

## 15. Environment Variable

Koneksi database disimpan di:

```text
server/.env
```

Contoh:

```env
DATABASE_URL=postgresql://USERNAME:PASSWORD@HOST:5432/help_center_insw
```

Repository hanya menyimpan `.env.example`:

```env
DATABASE_URL=postgresql://USERNAME:PASSWORD@HOST:5432/DATABASE_NAME
```

File `.env` tidak boleh dimasukkan ke GitHub.

## 16. Keamanan Database

- Kredensial database disimpan melalui environment variable.
- Password tidak boleh ditulis langsung pada source code.
- Query menggunakan Drizzle untuk menghindari penggabungan input secara langsung.
- API tidak mengirim stack trace atau query database kepada pengguna.
- Database production menggunakan user dengan hak akses sesuai kebutuhan.
- Backup database dilakukan sebelum migration besar.
- File PDF, video, dan gambar tidak disimpan sebagai binary di PostgreSQL.

## 17. Scope Saat Ini

Database saat ini ditujukan untuk konten publik Help Center.

Tabel berikut belum diperlukan:

```text
users
roles
sessions
```

Tabel autentikasi hanya ditambahkan apabila project mendapatkan scope dashboard admin untuk mengelola kategori, FAQ, panduan, dan tutorial.

## 18. Pemeliharaan Dokumentasi

Dokumentasi ini harus diperbarui ketika:

- Tabel baru ditambahkan.
- Kolom diubah atau dihapus.
- Foreign key berubah.
- Constraint atau index ditambahkan.
- Struktur panduan dan tutorial sudah diimplementasikan.
- Sistem autentikasi admin mulai dikembangkan.