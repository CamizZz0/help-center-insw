# Help Center INSW Database Documentation

Dokumentasi database untuk aplikasi redesign Help Center Indonesia National Single Window (INSW).

> Status: pengembangan aktif  
> Terakhir diperbarui: 8 September 2026

## 1. Informasi database

| Informasi                 | Nilai                  |
| ------------------------- | ---------------------- |
| Database                  | PostgreSQL             |
| Nama database development | `help_center_insw`     |
| ORM                       | Drizzle ORM            |
| Driver                    | `node-postgres` (`pg`) |
| Backend                   | Express.js             |
| Schema PostgreSQL         | `public`               |

Database menyimpan konten dinamis. React hanya mengambil data melalui REST API dan tidak terhubung langsung ke PostgreSQL.

```text
React/Vite → Express API → Drizzle ORM → PostgreSQL
```

## 2. Status tabel

| Tabel           | Status   | Keterangan                 |
| --------------- | -------- | -------------------------- |
| `categories`    | Tersedia | Kategori utama Help Center |
| `subcategories` | Tersedia | Subkategori dalam kategori |
| `faq_topics`    | Tersedia | Topik dalam subkategori    |
| `faqs`          | Tersedia | Pertanyaan dan jawaban FAQ |
| `guides`        | Tersedia | Metadata panduan PDF       |
| `tutorials`     | Tersedia | Metadata video tutorial    |

Tabel `tutorial_steps` tidak digunakan karena tutorial saat ini langsung membuka video YouTube dan tidak mempunyai halaman langkah-langkah internal.

## 3. Entity Relationship Diagram

```mermaid
erDiagram
    categories ||--o{ subcategories : memiliki
    subcategories ||--o{ faq_topics : memiliki
    faq_topics ||--o{ faqs : memiliki
    categories ||--o{ guides : mengelompokkan
    categories ||--o{ tutorials : mengelompokkan

    categories {
        integer id PK
        integer source_id UK
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
        integer source_id UK
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

    faq_topics {
        integer id PK
        integer source_id UK
        integer subcategory_id FK
        varchar name
        varchar slug UK
        text description
        integer sort_order
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    faqs {
        integer id PK
        integer source_id UK
        integer topic_id FK
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
```

## 4. Hierarki FAQ

Struktur data FAQ terdiri dari empat tingkat:

```text
Kategori
└── Subkategori
    └── Topik
        └── Pertanyaan dan jawaban FAQ
```

Contoh:

```text
Impor & Kepabeanan
└── PIB
    ├── Pendahuluan PIB
    │   ├── Kekurangan dokumen saat mengajukan nomor aju PIB
    │   └── Jumlah dokumen persyaratan terkait komoditas
    └── Tracking PIB
        ├── NSW Reject dan BC Reject
        └── Aju dokumen PIB tidak ada di tracking INSW
```

## 5. Tabel `categories`

Menyimpan kategori utama yang ditampilkan sebagai card pada landing page.

Contoh kategori:

- Impor & Kepabeanan
- Ekspor
- Registrasi & Akun
- Portal INSW
- Perizinan & Rekomendasi
- Fasilitas & Kawasan
- Layanan Lainnya

| Kolom         | Tipe                       | Constraint               | Keterangan                   |
| ------------- | -------------------------- | ------------------------ | ---------------------------- |
| `id`          | `serial`                   | Primary key              | Identitas internal kategori  |
| `source_id`   | `integer`                  | Unique, nullable         | ID kategori pada sumber lama |
| `name`        | `varchar(150)`             | Not null                 | Nama kategori                |
| `slug`        | `varchar(150)`             | Not null, unique         | Nama aman untuk URL          |
| `description` | `text`                     | Nullable                 | Deskripsi kategori           |
| `icon`        | `varchar(100)`             | Nullable                 | Kunci ikon untuk frontend    |
| `sort_order`  | `integer`                  | Not null, default `0`    | Urutan tampilan              |
| `is_active`   | `boolean`                  | Not null, default `true` | Status aktif                 |
| `created_at`  | `timestamp with time zone` | Default sekarang         | Waktu dibuat                 |
| `updated_at`  | `timestamp with time zone` | Default sekarang         | Waktu diperbarui             |

## 6. Tabel `subcategories`

Menyimpan subkategori yang berada di dalam kategori.

| Kolom         | Tipe                       | Constraint               | Keterangan                      |
| ------------- | -------------------------- | ------------------------ | ------------------------------- |
| `id`          | `serial`                   | Primary key              | Identitas internal subkategori  |
| `source_id`   | `integer`                  | Unique, nullable         | ID subkategori pada sumber lama |
| `category_id` | `integer`                  | Foreign key, not null    | Referensi ke `categories.id`    |
| `name`        | `varchar(150)`             | Not null                 | Nama subkategori                |
| `slug`        | `varchar(150)`             | Not null, unique         | Nama aman untuk URL             |
| `description` | `text`                     | Nullable                 | Deskripsi subkategori           |
| `icon`        | `varchar(100)`             | Nullable                 | Kunci ikon untuk frontend       |
| `sort_order`  | `integer`                  | Not null, default `0`    | Urutan tampilan                 |
| `is_active`   | `boolean`                  | Not null, default `true` | Status aktif                    |
| `created_at`  | `timestamp with time zone` | Default sekarang         | Waktu dibuat                    |
| `updated_at`  | `timestamp with time zone` | Default sekarang         | Waktu diperbarui                |

Foreign key:

```text
subcategories.category_id → categories.id
```

Aturan penghapusan: `ON DELETE CASCADE`.

## 7. Tabel `faq_topics`

Menyimpan kelompok topik di dalam satu subkategori. Tabel ini memisahkan topik seperti `Pendahuluan PIB`, `Tracking PIB`, dan `Reject Dokumen`.

| Kolom            | Tipe                       | Constraint               | Keterangan                      |
| ---------------- | -------------------------- | ------------------------ | ------------------------------- |
| `id`             | `serial`                   | Primary key              | Identitas internal topik        |
| `source_id`      | `integer`                  | Unique, nullable         | ID topik pada sumber lama       |
| `subcategory_id` | `integer`                  | Foreign key, not null    | Referensi ke `subcategories.id` |
| `name`           | `varchar(150)`             | Not null                 | Nama topik                      |
| `slug`           | `varchar(150)`             | Not null, unique         | Nama aman untuk URL             |
| `description`    | `text`                     | Nullable                 | Deskripsi topik                 |
| `sort_order`     | `integer`                  | Not null, default `0`    | Urutan tampilan                 |
| `is_active`      | `boolean`                  | Not null, default `true` | Status aktif                    |
| `created_at`     | `timestamp with time zone` | Default sekarang         | Waktu dibuat                    |
| `updated_at`     | `timestamp with time zone` | Default sekarang         | Waktu diperbarui                |

Foreign key:

```text
faq_topics.subcategory_id → subcategories.id
```

Aturan penghapusan: `ON DELETE CASCADE`.

## 8. Tabel `faqs`

Menyimpan pertanyaan dan jawaban. Satu topik dapat mempunyai banyak FAQ.

| Kolom          | Tipe                       | Constraint                | Keterangan                                           |
| -------------- | -------------------------- | ------------------------- | ---------------------------------------------------- |
| `id`           | `serial`                   | Primary key               | Identitas internal FAQ                               |
| `source_id`    | `integer`                  | Unique, nullable          | ID FAQ pada sumber lama                              |
| `topic_id`     | `integer`                  | Foreign key, not null     | Referensi ke `faq_topics.id`                         |
| `question`     | `text`                     | Not null                  | Pertanyaan FAQ                                       |
| `answer`       | `text`                     | Not null                  | Jawaban FAQ; dapat berisi HTML yang telah disanitasi |
| `is_popular`   | `boolean`                  | Not null, default `false` | Ditampilkan pada FAQ Populer                         |
| `sort_order`   | `integer`                  | Not null, default `0`     | Urutan FAQ                                           |
| `is_published` | `boolean`                  | Not null, default `true`  | Status publikasi                                     |
| `created_at`   | `timestamp with time zone` | Default sekarang          | Waktu dibuat                                         |
| `updated_at`   | `timestamp with time zone` | Default sekarang          | Waktu diperbarui                                     |

Foreign key:

```text
faqs.topic_id → faq_topics.id
```

Aturan penghapusan: `ON DELETE CASCADE`.

## 9. Tabel `guides`

Menyimpan metadata panduan. File PDF tidak disimpan sebagai binary di PostgreSQL; database hanya menyimpan URL file.

| Kolom           | Tipe                       | Constraint               | Keterangan          |
| --------------- | -------------------------- | ------------------------ | ------------------- |
| `id`            | `serial`                   | Primary key              | Identitas panduan   |
| `category_id`   | `integer`                  | Foreign key, nullable    | Kategori panduan    |
| `title`         | `varchar(200)`             | Not null                 | Judul panduan       |
| `slug`          | `varchar(200)`             | Not null, unique         | Nama aman untuk URL |
| `description`   | `text`                     | Nullable                 | Deskripsi panduan   |
| `thumbnail_url` | `varchar(500)`             | Nullable                 | URL thumbnail       |
| `file_url`      | `varchar(500)`             | Not null                 | URL/path PDF        |
| `sort_order`    | `integer`                  | Not null, default `0`    | Urutan tampilan     |
| `is_published`  | `boolean`                  | Not null, default `true` | Status publikasi    |
| `published_at`  | `timestamp with time zone` | Nullable                 | Waktu publikasi     |
| `created_at`    | `timestamp with time zone` | Default sekarang         | Waktu dibuat        |
| `updated_at`    | `timestamp with time zone` | Default sekarang         | Waktu diperbarui    |

## 10. Tabel `tutorials`

Menyimpan metadata video tutorial. File video tidak disimpan sebagai binary di PostgreSQL; database hanya menyimpan URL YouTube atau penyedia video lainnya.

| Kolom              | Tipe                       | Constraint               | Keterangan               |
| ------------------ | -------------------------- | ------------------------ | ------------------------ |
| `id`               | `serial`                   | Primary key              | Identitas tutorial       |
| `category_id`      | `integer`                  | Foreign key, nullable    | Kategori tutorial        |
| `title`            | `varchar(200)`             | Not null                 | Judul tutorial           |
| `slug`             | `varchar(200)`             | Not null, unique         | Nama aman untuk URL      |
| `description`      | `text`                     | Nullable                 | Deskripsi tutorial       |
| `thumbnail_url`    | `varchar(500)`             | Nullable                 | URL thumbnail video      |
| `video_url`        | `varchar(500)`             | Not null                 | URL video                |
| `duration_seconds` | `integer`                  | Nullable                 | Durasi video dalam detik |
| `sort_order`       | `integer`                  | Not null, default `0`    | Urutan tampilan          |
| `is_published`     | `boolean`                  | Not null, default `true` | Status publikasi         |
| `published_at`     | `timestamp with time zone` | Nullable                 | Waktu publikasi          |
| `created_at`       | `timestamp with time zone` | Default sekarang         | Waktu dibuat             |
| `updated_at`       | `timestamp with time zone` | Default sekarang         | Waktu diperbarui         |

## 11. Hubungan dan aturan penghapusan

| Parent          | Child           | Relasi      | Aturan                 |
| --------------- | --------------- | ----------- | ---------------------- |
| `categories`    | `subcategories` | One-to-many | `ON DELETE CASCADE`    |
| `subcategories` | `faq_topics`    | One-to-many | `ON DELETE CASCADE`    |
| `faq_topics`    | `faqs`          | One-to-many | `ON DELETE CASCADE`    |
| `categories`    | `guides`        | One-to-many | Sesuai definisi schema |
| `categories`    | `tutorials`     | One-to-many | Sesuai definisi schema |

Penghapusan parent harus dilakukan dengan hati-hati karena data turunannya dapat ikut terhapus.

## 12. Aturan slug

Slug digunakan pada URL dan pencarian resource.

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

## 13. Fungsi `source_id`

`source_id` menyimpan ID data dari sistem atau CMS INSW lama. Kolom ini berbeda dari `id` internal PostgreSQL.

| Kolom       | Fungsi                                                    |
| ----------- | --------------------------------------------------------- |
| `id`        | Primary key internal project redesign                     |
| `source_id` | Identitas data dari sumber lama untuk proses sinkronisasi |

Unique constraint pada `source_id` memungkinkan importer menggunakan upsert:

```text
Data sumber belum ada → INSERT
Data sumber sudah ada → UPDATE
```

Dengan cara ini, importer dapat dijalankan kembali tanpa membuat data yang sama berulang kali.

## 14. Aturan data

- Hanya kategori dan subkategori dengan `is_active = true` yang ditampilkan.
- Hanya topik dengan `is_active = true` yang ditampilkan.
- Hanya FAQ, panduan, dan tutorial dengan `is_published = true` yang ditampilkan.
- FAQ populer menggunakan `is_popular = true`.
- Urutan data menggunakan `sort_order`.
- Pertanyaan dan jawaban FAQ tidak boleh kosong.
- Setiap subkategori harus terhubung ke kategori yang valid.
- Setiap topik harus terhubung ke subkategori yang valid.
- Setiap FAQ harus terhubung ke topik yang valid.
- `updated_at` harus diperbarui ketika data berubah.

## 15. Constraint dan index

Constraint utama:

- Primary key pada seluruh kolom `id`.
- Unique constraint pada setiap `slug`.
- Unique constraint pada `source_id` yang digunakan importer.
- Foreign key untuk menjaga integritas hubungan antartabel.

Index yang direkomendasikan:

```text
categories.slug
categories.source_id
subcategories.slug
subcategories.source_id
subcategories.category_id
faq_topics.slug
faq_topics.source_id
faq_topics.subcategory_id
faqs.source_id
faqs.topic_id
faqs.is_popular
faqs.is_published
guides.slug
guides.category_id
tutorials.slug
tutorials.category_id
```

Untuk pencarian FAQ yang lebih besar, pertimbangkan PostgreSQL full-text search atau index trigram pada `question` dan `answer`.

## 16. Pengelolaan schema dengan Drizzle

Lokasi schema:

```text
server/src/models/schema.js
```

Lokasi konfigurasi:

```text
server/drizzle.config.js
```

Mengirim schema ke database development:

```bash
npm run db:push
```

Jika Drizzle menanyakan apakah tabel harus di-truncate saat menambah unique constraint, pilih opsi tanpa truncate setelah memastikan tidak ada data duplikat.

Untuk production, gunakan migration yang tersimpan di Git dan lakukan backup sebelum perubahan besar. Jangan mengandalkan `db:push` langsung pada database production.

## 17. Seed dan importer

Data awal kategori, FAQ populer, panduan, dan tutorial dapat dimasukkan melalui script pada:

```text
server/src/scripts/
```

Contoh perintah yang digunakan project:

```bash
npm run import:faqs
npm run seed:popular
```

Nama script panduan dan tutorial mengikuti konfigurasi pada `server/package.json`.

Importer FAQ membaca data sumber, memetakan hierarki, membersihkan HTML jawaban, lalu melakukan upsert menggunakan `source_id`.

## 18. Environment variable

File lokal:

```text
server/.env
```

Contoh:

```env
DATABASE_URL=postgresql://USERNAME:PASSWORD@HOST:5432/help_center_insw
PORT=5001
```

Repository hanya menyimpan contoh berikut:

```text
server/.env.example
```

File `.env` asli tidak boleh dimasukkan ke GitHub.

## 19. Keamanan dan operasional

- Kredensial database disimpan melalui environment variable.
- Password tidak ditulis langsung pada source code.
- Input API divalidasi sebelum digunakan pada query.
- HTML dari sumber eksternal disanitasi.
- API production tidak mengirim stack trace atau query SQL kepada pengguna.
- Database production menggunakan user dengan hak akses minimum yang diperlukan.
- Backup dilakukan sebelum migration besar atau import massal.
- PDF, video, dan gambar tidak disimpan sebagai binary di PostgreSQL.

## 20. Scope saat ini

Database ditujukan untuk konten publik Help Center. Login pengguna tidak diperlukan untuk membaca FAQ, panduan, atau tutorial.

Tabel berikut belum diperlukan:

```text
users
roles
sessions
```

Autentikasi baru diperlukan apabila scope project ditambah dengan dashboard admin untuk mengelola konten.

## 21. Pemeliharaan dokumentasi

Dokumentasi ini harus diperbarui ketika:

- Tabel atau kolom ditambahkan, diubah, atau dihapus.
- Foreign key, constraint, atau index berubah.
- Format importer berubah.
- Panduan atau tutorial menggunakan penyimpanan file baru.
- Sistem autentikasi atau dashboard admin mulai dikembangkan.
