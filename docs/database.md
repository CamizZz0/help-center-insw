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
| `content_feedback` | Tersedia | Feedback anonim untuk FAQ, panduan, dan tutorial |
| `faq_feedback`  | Legacy   | Feedback FAQ lama, tidak lagi ditulis |

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
        varchar visibility
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

    content_feedback {
        integer id PK
        varchar content_type
        integer content_id
        boolean is_helpful
        text reason
        timestamp created_at
    }
```

`content_feedback` tidak digambar dengan garis relasi karena referensinya polimorfik: pasangan `content_type` + `content_id` menunjuk ke tabel `faqs`, `guides`, atau `tutorials` sesuai nilainya, sehingga PostgreSQL tidak bisa menegakkan foreign key-nya.

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
| `is_published` | `boolean`                  | Not null, default `true`  | Status publikasi (`false` = draft)                   |
| `visibility`   | `varchar(20)`              | Not null, default `public`| Target pembaca: `public` \| `authenticated`           |
| `created_at`   | `timestamp with time zone` | Default sekarang          | Waktu dibuat                                         |
| `updated_at`   | `timestamp with time zone` | Default sekarang          | Waktu diperbarui                                     |

Aturan visibilitas (simulasi demo, bukan autentikasi):

| Mode pembaca            | FAQ yang dapat dilihat                              |
| ----------------------- | --------------------------------------------------- |
| Guest                   | published + `public`                                |
| User login (simulasi)   | published + `public` / `authenticated`              |

> TODO(auth): setelah login resmi tersedia, filtering berbasis role wajib
> dilakukan di backend dari sesi/JWT. Validasi di frontend hanyalah simulasi.

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

## 11. Tabel `content_feedback`

Menyimpan feedback anonim pengunjung untuk seluruh jenis konten. Satu tabel dipakai bersama supaya rekap di dashboard CMS bisa dihitung dengan satu query, dan penambahan jenis konten baru tidak memerlukan tabel baru.

| Kolom          | Tipe                       | Constraint                                  | Keterangan                                        |
| -------------- | -------------------------- | ------------------------------------------- | ------------------------------------------------- |
| `id`           | `serial`                   | Primary key                                 | Identitas feedback                                |
| `content_type` | `varchar(20)`              | Not null, `CHECK`                           | Jenis konten: `faq`, `guide`, atau `tutorial`      |
| `content_id`   | `integer`                  | Not null                                    | ID baris di tabel sesuai `content_type`            |
| `is_helpful`   | `boolean`                  | Not null                                    | `true` untuk Membantu, `false` untuk Tidak membantu |
| `reason`       | `text`                     | Nullable                                    | Alasan singkat, hanya diisi saat `is_helpful` bernilai `false` |
| `created_at`   | `timestamp with time zone` | Default sekarang                            | Waktu feedback dikirim                            |

Index:

- `content_feedback_type_id_idx` pada `(content_type, content_id)` untuk rekap per konten.
- `content_feedback_created_at_idx` pada `(created_at)` untuk urutan waktu.

Karena `content_id` tidak bisa memakai foreign key, keberadaan dan status terbit konten diperiksa di controller sebelum baris disimpan. Baris feedback juga tidak ikut terhapus saat konten dihapus, sehingga perlu dibersihkan manual bila diperlukan. **Orphan (feedback yatim)** = baris `content_feedback` yang `content_id`-nya tidak ada lagi di `faqs`/`guides`/`tutorials` akibat konten dihapus. Orphan tetap terhitung di `groupBy content_type` dashboard sehingga menggelembungkan total.

**Cleanup orphan:**
```bash
npm run cleanup:orphan-feedback        # dry-run, cuma lapor
npm run cleanup:orphan-feedback:execute # hapus orphan beneran (DELETE ... NOT EXISTS ... RETURNING)
```
Script `server/src/scripts/cleanupOrphanFeedback.js` idempoten, aman dijalankan berulang. Jalankan sebelum analisis atau cron mingguan.

**Keamanan reason:** `reason` disanitasi `sanitize-html` (strip tags) sebelum insert (`feedbackController.js`) untuk cegah XSS saat ditampilkan di CMS Drawer `GET /cms/dashboard/feedback/:type/:id/reasons`.

**Rate-limit:** Feedback dibatasi `5 / 60 menit / IP / konten` via `feedbackRateLimit.js` (in-memory Map, 60 menit window lebih lama) → `429` + `Retry-After`. Dashboard memakai endpoint lazy-load `getFeedbackReasons` agar tidak membebani `getCmsDashboard`.

`faq_feedback` adalah tabel pendahulu yang hanya menampung feedback FAQ. Isinya sudah dipindahkan ke `content_feedback` oleh migrasi `0005_add_content_feedback.sql`; tabel lamanya sengaja dibiarkan utuh sebagai cadangan dan tidak lagi ditulis oleh aplikasi.

## 12. Hubungan dan aturan penghapusan

| Parent          | Child           | Relasi      | Aturan                 |
| --------------- | --------------- | ----------- | ---------------------- |
| `categories`    | `subcategories` | One-to-many | `ON DELETE CASCADE`    |
| `subcategories` | `faq_topics`    | One-to-many | `ON DELETE CASCADE`    |
| `faq_topics`    | `faqs`          | One-to-many | `ON DELETE CASCADE`    |
| `categories`    | `guides`        | One-to-many | Sesuai definisi schema |
| `categories`    | `tutorials`     | One-to-many | Sesuai definisi schema |

Penghapusan parent harus dilakukan dengan hati-hati karena data turunannya dapat ikut terhapus.

## 13. Aturan slug

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

## 14. Fungsi `source_id`

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

## 15. Aturan data

- Hanya kategori dan subkategori dengan `is_active = true` yang ditampilkan.
- Hanya topik dengan `is_active = true` yang ditampilkan.
- Hanya FAQ, panduan, dan tutorial dengan `is_published = true` yang ditampilkan.
- FAQ `is_published = false` dianggap draft untuk semua nilai `visibility`.
- FAQ lama tanpa `visibility` dianggap `public` (default), sehingga tetap tampil seperti sebelumnya.
- FAQ populer menggunakan `is_popular = true`.
- Urutan data menggunakan `sort_order`.
- Pertanyaan dan jawaban FAQ tidak boleh kosong.
- Setiap subkategori harus terhubung ke kategori yang valid.
- Setiap topik harus terhubung ke subkategori yang valid.
- Setiap FAQ harus terhubung ke topik yang valid.
- `updated_at` harus diperbarui ketika data berubah.

## 16. Constraint dan index

Constraint utama:

- Primary key pada seluruh kolom `id`.
- Unique constraint pada setiap `slug`.
- Unique constraint pada `source_id` yang digunakan importer.
- Foreign key untuk menjaga integritas hubungan antartabel.
- `CHECK` constraint pada `content_feedback.content_type` agar nilainya hanya `faq`, `guide`, atau `tutorial`.

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
faqs.visibility
guides.slug
guides.category_id
tutorials.slug
tutorials.category_id
content_feedback.content_type + content_id
content_feedback.created_at
```

Untuk pencarian FAQ yang lebih besar, pertimbangkan PostgreSQL full-text search atau index trigram pada `question` dan `answer`.

## 17. Pengelolaan schema dengan Drizzle

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

## 18. Seed dan importer

Data awal kategori, FAQ populer, panduan, dan tutorial dapat dimasukkan melalui script pada:

```text
server/src/scripts/
```

Contoh perintah yang digunakan project:

```bash
npm run import:faqs
npm run seed:popular
npm run seed:demo-visibility
```

`seed:demo-visibility` menyiapkan 3 FAQ demo di topik `tracking-pib`
(2 authenticated dan 1 draft; idempoten, aman dijalankan ulang)
agar perbedaan Guest dan User login terlihat saat presentasi.

Nama script panduan dan tutorial mengikuti konfigurasi pada `server/package.json`.

Importer FAQ membaca data sumber, memetakan hierarki, membersihkan HTML jawaban, lalu melakukan upsert menggunakan `source_id`.

## 19. Environment variable

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

## 20. Keamanan dan operasional

- Kredensial database disimpan melalui environment variable.
- Password tidak ditulis langsung pada source code.
- Input API divalidasi sebelum digunakan pada query.
- HTML dari sumber eksternal disanitasi.
- API production tidak mengirim stack trace atau query SQL kepada pengguna.
- Database production menggunakan user dengan hak akses minimum yang diperlukan.
- Backup dilakukan sebelum migration besar atau import massal.
- PDF, video, dan gambar tidak disimpan sebagai binary di PostgreSQL.

## 21. Scope saat ini

Database ditujukan untuk konten publik Help Center. Login pengguna tidak diperlukan untuk membaca FAQ, panduan, atau tutorial.

Tabel berikut belum diperlukan:

```text
users
roles
sessions
```

Autentikasi baru diperlukan apabila scope project ditambah dengan dashboard admin untuk mengelola konten.

## 22. Pemeliharaan dokumentasi

Dokumentasi ini harus diperbarui ketika:

- Tabel atau kolom ditambahkan, diubah, atau dihapus.
- Foreign key, constraint, atau index berubah.
- Format importer berubah.
- Panduan atau tutorial menggunakan penyimpanan file baru.
- Sistem autentikasi atau dashboard admin mulai dikembangkan.
