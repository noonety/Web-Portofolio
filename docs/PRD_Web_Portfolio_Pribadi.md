# Product Requirements Document (PRD)
## Aplikasi Web Portofolio Pribadi

---

**Versi:** 1.0  
**Tanggal:** 25 Mei 2026  
**Status:** Draft  
**Penulis:** —  

---

## Daftar Isi

1. [Ringkasan Produk](#1-ringkasan-produk)
2. [Tujuan & Sasaran](#2-tujuan--sasaran)
3. [Target Pengguna](#3-target-pengguna)
4. [Rekomendasi Tech Stack](#4-rekomendasi-tech-stack)
5. [Arsitektur Sistem](#5-arsitektur-sistem)
6. [Fitur Lengkap](#6-fitur-lengkap)
7. [Desain & Panduan UI](#7-desain--panduan-ui)
8. [Struktur Database](#8-struktur-database)
9. [Halaman & Routing](#9-halaman--routing)
10. [API Endpoints](#10-api-endpoints)
11. [Keamanan & Autentikasi](#11-keamanan--autentikasi)
12. [Non-Functional Requirements](#12-non-functional-requirements)
13. [Milestone & Timeline](#13-milestone--timeline)
14. [Risiko & Mitigasi](#14-risiko--mitigasi)

---

## 1. Ringkasan Produk

Web Portofolio Pribadi adalah aplikasi web yang dibangun untuk menampilkan identitas, karya, dan kemampuan profesional pemiliknya kepada publik. Aplikasi ini dilengkapi dengan panel admin pribadi sehingga pemilik dapat mengelola seluruh konten — mulai dari data diri, foto, proyek, hingga artikel — tanpa perlu menyentuh kode.

Desain dipilih dengan pendekatan **simpel, bersih, dan profesional** dengan palet warna gelap (hitam ke biru tua), yang memberikan kesan elegan dan serius namun tetap mudah dibaca.

---

## 2. Tujuan & Sasaran

### Tujuan Utama
- Menyajikan portofolio kerja dan proyek kepada rekruter, klien, atau kolega secara online.
- Menyediakan sarana pengelolaan konten yang mudah tanpa bergantung pada pihak ketiga (Behance, LinkedIn, dll.).
- Memiliki platform pribadi yang bisa dikustomisasi sepenuhnya.

### Sasaran Terukur
- Waktu loading halaman utama < 2 detik.
- Bisa diakses dengan baik di perangkat mobile, tablet, dan desktop.
- Admin dapat menambah/mengubah konten dalam < 5 menit tanpa bantuan developer.
- Skor Lighthouse (Performance, SEO, Accessibility) minimal 85/100.

---

## 3. Target Pengguna

### Pengguna Publik (Visitor)
- Rekruter atau HRD yang ingin melihat profil dan karya kandidat.
- Klien potensial yang ingin mengevaluasi kemampuan.
- Rekan kerja atau komunitas yang ingin tahu lebih jauh.

### Pengguna Admin (Pemilik)
- Pemilik portofolio sendiri — satu-satunya yang bisa login dan mengelola konten.

---

## 4. Rekomendasi Tech Stack

### Pilihan Utama: **Next.js 15 (App Router) + TypeScript**

Next.js dipilih sebagai framework utama karena:

- **SSR & SSG hybrid** — halaman publik di-render di server untuk SEO optimal, sedangkan admin panel bisa berjalan sebagai SPA.
- **Image Optimization bawaan** — Next.js memiliki `next/image` yang otomatis mengompresi dan me-lazy-load gambar.
- **File-based routing** — struktur folder yang intuitif dan mudah dikelola.
- **API Routes / Route Handlers** — backend ringan langsung di satu proyek, tidak perlu server terpisah untuk skala kecil-menengah.
- **Ekosistem terbesar** saat ini untuk React-based web app, dengan update aktif dan komunitas yang sangat besar.
- **Deployment mudah** — Vercel (gratis untuk proyek pribadi), atau bisa self-host dengan Docker.

### Stack Lengkap

| Layer | Teknologi | Keterangan |
|---|---|---|
| Framework | Next.js 15 (App Router) | Fullstack React framework |
| Bahasa | TypeScript | Type safety, lebih mudah debug |
| Styling | Tailwind CSS | Utility-first, cepat, ringan |
| Database | PostgreSQL | Relasional, handal untuk data terstruktur |
| ORM | Prisma | Type-safe, mudah migrasi |
| Auth | NextAuth.js v5 | Auth siap pakai, support credential login |
| File Storage | Cloudinary atau Supabase Storage | Upload & hosting gambar/media |
| Deployment | Vercel + Railway (DB) | Gratis untuk skala pribadi |
| Editor Teks | Tiptap (Rich Text Editor) | Ringan, extensible, berbasis ProseMirror |

### Alternatif (Jika Ingin Backend Terpisah)
- **Laravel 11 (PHP)** + **Inertia.js** + **Vue 3** — cocok jika lebih familiar dengan PHP. Tapi untuk portofolio pribadi, Next.js lebih efisien karena satu codebase.

---

## 5. Arsitektur Sistem

```
┌─────────────────────────────────────────────────────┐
│                  Browser (Client)                   │
│    Halaman Publik (SSR/SSG) │ Admin Panel (CSR)     │
└────────────────┬────────────────────────────────────┘
                 │ HTTP / HTTPS
┌────────────────▼────────────────────────────────────┐
│              Next.js 15 Server                      │
│   App Router │ Route Handlers (API) │ Middleware     │
└───┬──────────────────────────┬──────────────────────┘
    │                          │
┌───▼───────┐         ┌────────▼──────────┐
│ PostgreSQL│         │  File Storage     │
│ (Prisma)  │         │  (Cloudinary /    │
│           │         │   Supabase)       │
└───────────┘         └───────────────────┘
```

### Pola Arsitektur
- **Public Pages**: Server-side rendering (SSR) / Static generation (SSG) untuk performa dan SEO.
- **Admin Panel**: Client-side rendering (CSR) dengan proteksi route via middleware NextAuth.
- **API**: Route Handlers Next.js menangani semua operasi CRUD.
- **Media**: Gambar di-upload langsung ke Cloudinary atau Supabase Storage, URL disimpan di database.

---

## 6. Fitur Lengkap

### 6.1 Halaman Publik

#### A. Halaman Beranda (Home)
- Hero section dengan nama, foto profil, dan tagline singkat.
- Tombol CTA: "Lihat Proyek Saya" dan "Hubungi Saya".
- Animasi ringan (fade-in) saat scroll.
- Ringkasan singkat tentang diri (max 3 paragraf).

#### B. Halaman Tentang Saya (About)
- Foto profil (bisa lebih dari satu, bisa di-slide).
- Data diri lengkap: nama, profesi, lokasi, email, tanggal lahir (opsional).
- Deskripsi diri (rich text dengan paragraf dan pemformatan).
- Riwayat pendidikan (nama institusi, jurusan, tahun).
- Riwayat pengalaman kerja (jabatan, perusahaan, deskripsi, periode).
- Tombol unduh CV (link ke file PDF).

#### C. Halaman Proyek / Portofolio
- Grid atau list tampilan kartu proyek.
- Filter berdasarkan kategori (Web, Mobile, Desain, dll.).
- Setiap kartu menampilkan: gambar thumbnail, judul, deskripsi singkat, tag teknologi, dan link.
- Halaman detail proyek: galeri gambar, deskripsi lengkap, teknologi yang digunakan, link GitHub/live demo.

#### D. Halaman Keahlian (Skills)
- Daftar skill dikelompokkan per kategori (Frontend, Backend, Tools, Bahasa, dll.).
- Setiap skill ditampilkan sebagai badge atau item dengan tingkat keahlian (Beginner / Intermediate / Advanced).
- Opsional: visualisasi bar atau icon per skill.

#### E. Halaman Blog / Artikel (Opsional)
- List artikel dengan thumbnail, judul, tanggal, dan cuplikan teks.
- Halaman detail artikel dengan konten rich text lengkap.
- Fitur pencarian artikel berdasarkan kata kunci.
- Tag/kategori artikel.

#### F. Halaman Kontak (Contact)
- Form kontak: nama, email, subjek, pesan.
- Validasi form di sisi client dan server.
- Notifikasi email ke pemilik saat ada pesan masuk (via Nodemailer/Resend).
- Tampilkan info kontak: email, LinkedIn, GitHub, dll.
- Peta lokasi (Google Maps embed, opsional).

#### G. Komponen Global
- Navbar responsif dengan link ke semua halaman dan toggle menu mobile.
- Footer dengan ikon media sosial dan copyright.
- Tombol "Scroll to Top".
- Loading state / skeleton screen saat fetch data.
- 404 Not Found page yang custom.

---

### 6.2 Panel Admin (Hanya untuk Pemilik)

Akses melalui `/admin` — dilindungi autentikasi. Semua fitur berikut tersedia di dashboard admin.

#### A. Dashboard
- Ringkasan statistik: jumlah proyek, artikel, pesan masuk, dan skill.
- Pesan kontak terbaru yang belum dibaca.
- Shortcut ke fitur yang paling sering digunakan.

#### B. Manajemen Profil & Data Diri
- Form edit data diri: nama, tagline, bio, email, nomor HP, lokasi, tanggal lahir.
- Upload foto profil (dengan preview sebelum simpan).
- Upload file CV (PDF).
- Edit link media sosial (GitHub, LinkedIn, Twitter/X, Instagram, dll.).

#### C. Manajemen Proyek
- Tambah / edit / hapus proyek.
- Upload gambar thumbnail dan galeri gambar proyek (multi-upload).
- Isi judul, deskripsi singkat, deskripsi panjang (rich text editor), teknologi, link GitHub, link demo.
- Atur kategori dan urutan tampil.
- Toggle publish/draft (apakah ditampilkan ke publik atau tidak).

#### D. Manajemen Keahlian
- Tambah / edit / hapus skill.
- Pilih kategori skill.
- Atur tingkat keahlian (dropdown: Beginner / Intermediate / Advanced / Expert).
- Atur urutan tampil dengan drag-and-drop (opsional).

#### E. Manajemen Pengalaman & Pendidikan
- Tambah / edit / hapus entri pengalaman kerja.
- Tambah / edit / hapus entri pendidikan.
- Setiap entri: nama institusi/perusahaan, posisi/jurusan, periode (dari-sampai), deskripsi.

#### F. Manajemen Artikel / Blog
- Tambah / edit / hapus artikel.
- Editor konten rich text (Tiptap): bold, italic, heading, list, quote, gambar, link.
- Upload gambar dalam konten artikel.
- Atur tag/kategori artikel.
- Toggle publish/draft.
- Set tanggal publikasi.

#### G. Manajemen Pesan Kontak
- Lihat daftar semua pesan masuk.
- Tandai sebagai sudah dibaca / belum dibaca.
- Hapus pesan.
- Balas pesan via email (link ke email client, opsional).

#### H. Manajemen Media (Galeri)
- Lihat semua gambar yang pernah di-upload.
- Upload gambar baru.
- Hapus gambar yang tidak terpakai.
- Salin URL gambar untuk digunakan di konten lain.

#### I. Pengaturan Situs
- Ubah judul situs dan deskripsi meta (SEO).
- Ubah favicon.
- Toggle fitur: tampilkan/sembunyikan menu Blog di navbar.
- Kelola tombol unduh CV (aktif/nonaktif, update file).

---

## 7. Desain & Panduan UI

### 7.1 Palet Warna

| Nama | Kode Hex | Kegunaan |
|---|---|---|
| Background Utama | `#0A0A0F` | Latar belakang halaman utama |
| Background Sekunder | `#0F1624` | Card, section alternatif |
| Biru Tua Primer | `#1E3A5F` | Elemen utama, navbar, border |
| Biru Aksen | `#2D6EAF` | Tombol, link aktif, highlight |
| Biru Terang (Hover) | `#4A90D9` | Hover state tombol/link |
| Teks Utama | `#E8EDF2` | Teks body utama |
| Teks Sekunder | `#8A9DB5` | Teks sub-heading, placeholder |
| Border / Divider | `#1E3A5F` | Garis pemisah, border card |
| Error | `#C0392B` | Pesan error |
| Success | `#27AE60` | Pesan sukses |

### 7.2 Tipografi

- **Font Heading**: `Inter` atau `Space Grotesk` — bersih, modern-klasik, mudah dibaca.
- **Font Body**: `Inter` — konsisten dan nyaman untuk paragraf panjang.
- **Font Code** (untuk menampilkan nama teknologi): `JetBrains Mono` atau `Fira Code`.

| Elemen | Ukuran | Weight |
|---|---|---|
| H1 (Hero) | 48–64px | 700 |
| H2 (Section Title) | 32–40px | 700 |
| H3 (Card Title) | 20–24px | 600 |
| Body | 16px | 400 |
| Caption / Label | 13–14px | 400–500 |

### 7.3 Komponen UI

- **Button Primer**: Background biru aksen `#2D6EAF`, teks putih, border-radius 6px, hover `#4A90D9`.
- **Button Sekunder**: Background transparan, border biru aksen, teks biru aksen, hover background biru gelap.
- **Card Proyek**: Background `#0F1624`, border `1px solid #1E3A5F`, border-radius 8px, hover sedikit terangkat (box-shadow).
- **Navbar**: Background semi-transparan dengan blur (`backdrop-filter: blur`), sticky di bagian atas.
- **Form Input**: Background `#0F1624`, border `1px solid #1E3A5F`, focus border biru aksen, teks putih.
- **Badge Teknologi**: Background `#1E3A5F`, teks `#4A90D9`, font kecil, border-radius penuh.

### 7.4 Prinsip Desain

- **Simpel dan tidak penuh**: Banyak white space (atau dark space) antar elemen.
- **Tidak terlalu modern/futuristik**: Hindari glassmorphism berlebihan, animasi 3D, atau gradien terlalu mencolok.
- **Konsisten**: Spacing menggunakan kelipatan 4px atau 8px (sistem 4-point grid).
- **Mobile-first**: Semua layout didesain untuk mobile terlebih dahulu.
- **Aksesibel**: Kontras warna memenuhi standar WCAG AA minimal.

---

## 8. Struktur Database

### Tabel: `User` (Admin)
| Field | Tipe | Keterangan |
|---|---|---|
| id | String (UUID) | Primary key |
| email | String | Email login |
| password | String | Hashed password |
| createdAt | DateTime | Waktu dibuat |

### Tabel: `Profile` (Data Diri)
| Field | Tipe | Keterangan |
|---|---|---|
| id | String | Primary key |
| name | String | Nama lengkap |
| tagline | String | Tagline singkat |
| bio | Text | Deskripsi diri (rich text) |
| email | String | Email kontak publik |
| phone | String? | Nomor HP (opsional) |
| location | String? | Kota / negara |
| photoUrl | String? | URL foto profil |
| cvUrl | String? | URL file CV |
| socialLinks | JSON | { github, linkedin, twitter, ... } |
| siteTitle | String | Judul situs untuk SEO |
| siteDescription | String | Deskripsi meta untuk SEO |

### Tabel: `Project`
| Field | Tipe | Keterangan |
|---|---|---|
| id | String | Primary key |
| title | String | Judul proyek |
| slug | String | URL-friendly title |
| shortDesc | String | Deskripsi singkat |
| longDesc | Text | Deskripsi lengkap (rich text) |
| thumbnailUrl | String? | Gambar utama |
| images | String[] | Array URL gambar galeri |
| technologies | String[] | Daftar nama teknologi |
| category | String | Kategori proyek |
| githubUrl | String? | Link GitHub |
| demoUrl | String? | Link demo |
| isPublished | Boolean | Ditampilkan atau draft |
| sortOrder | Integer | Urutan tampil |
| createdAt | DateTime | — |
| updatedAt | DateTime | — |

### Tabel: `Skill`
| Field | Tipe | Keterangan |
|---|---|---|
| id | String | Primary key |
| name | String | Nama skill |
| category | String | Kategori (Frontend, Backend, dll.) |
| level | Enum | BEGINNER, INTERMEDIATE, ADVANCED, EXPERT |
| iconUrl | String? | URL icon skill |
| sortOrder | Integer | Urutan tampil |

### Tabel: `Experience`
| Field | Tipe | Keterangan |
|---|---|---|
| id | String | Primary key |
| company | String | Nama perusahaan |
| position | String | Jabatan |
| description | Text | Deskripsi pekerjaan |
| startDate | Date | Tanggal mulai |
| endDate | Date? | Tanggal selesai (null = sekarang) |
| isCurrent | Boolean | Masih aktif |
| type | Enum | WORK atau EDUCATION |

### Tabel: `Article`
| Field | Tipe | Keterangan |
|---|---|---|
| id | String | Primary key |
| title | String | Judul artikel |
| slug | String | URL-friendly |
| excerpt | String | Cuplikan singkat |
| content | Text | Konten lengkap (rich text HTML) |
| thumbnailUrl | String? | Gambar sampul |
| tags | String[] | Daftar tag |
| isPublished | Boolean | Tampil atau draft |
| publishedAt | DateTime? | Tanggal publikasi |
| createdAt | DateTime | — |
| updatedAt | DateTime | — |

### Tabel: `ContactMessage`
| Field | Tipe | Keterangan |
|---|---|---|
| id | String | Primary key |
| name | String | Nama pengirim |
| email | String | Email pengirim |
| subject | String | Subjek pesan |
| message | Text | Isi pesan |
| isRead | Boolean | Sudah dibaca atau belum |
| createdAt | DateTime | Waktu dikirim |

### Tabel: `MediaFile`
| Field | Tipe | Keterangan |
|---|---|---|
| id | String | Primary key |
| url | String | URL file di storage |
| publicId | String | ID di Cloudinary/Supabase |
| filename | String | Nama file asli |
| fileType | String | mime type |
| fileSize | Integer | Ukuran dalam bytes |
| uploadedAt | DateTime | — |

---

## 9. Halaman & Routing

### Halaman Publik

| Route | Halaman | Render Mode |
|---|---|---|
| `/` | Beranda | SSG |
| `/about` | Tentang Saya | SSG |
| `/projects` | Daftar Proyek | SSG |
| `/projects/[slug]` | Detail Proyek | SSG (ISR) |
| `/skills` | Keahlian | SSG |
| `/blog` | Daftar Artikel | SSR |
| `/blog/[slug]` | Detail Artikel | SSR (ISR) |
| `/contact` | Kontak | SSR |

### Panel Admin

| Route | Halaman |
|---|---|
| `/admin` | Dashboard |
| `/admin/profile` | Edit Profil & Data Diri |
| `/admin/projects` | Daftar Proyek |
| `/admin/projects/new` | Tambah Proyek |
| `/admin/projects/[id]/edit` | Edit Proyek |
| `/admin/skills` | Manajemen Skill |
| `/admin/experience` | Pengalaman & Pendidikan |
| `/admin/articles` | Daftar Artikel |
| `/admin/articles/new` | Tulis Artikel Baru |
| `/admin/articles/[id]/edit` | Edit Artikel |
| `/admin/messages` | Pesan Kontak |
| `/admin/media` | Galeri Media |
| `/admin/settings` | Pengaturan Situs |
| `/admin/login` | Halaman Login |

---

## 10. API Endpoints

### Publik (Tidak perlu autentikasi)

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/profile` | Ambil data profil publik |
| GET | `/api/projects` | Ambil semua proyek yang published |
| GET | `/api/projects/[slug]` | Ambil detail proyek |
| GET | `/api/skills` | Ambil semua skill |
| GET | `/api/experience` | Ambil riwayat kerja & pendidikan |
| GET | `/api/articles` | Ambil semua artikel published |
| GET | `/api/articles/[slug]` | Ambil detail artikel |
| POST | `/api/contact` | Kirim pesan kontak |

### Admin (Wajib autentikasi)

| Method | Endpoint | Deskripsi |
|---|---|---|
| PUT | `/api/admin/profile` | Update data diri |
| POST | `/api/admin/projects` | Tambah proyek baru |
| PUT | `/api/admin/projects/[id]` | Edit proyek |
| DELETE | `/api/admin/projects/[id]` | Hapus proyek |
| POST | `/api/admin/skills` | Tambah skill |
| PUT | `/api/admin/skills/[id]` | Edit skill |
| DELETE | `/api/admin/skills/[id]` | Hapus skill |
| POST | `/api/admin/experience` | Tambah pengalaman |
| PUT | `/api/admin/experience/[id]` | Edit pengalaman |
| DELETE | `/api/admin/experience/[id]` | Hapus pengalaman |
| POST | `/api/admin/articles` | Buat artikel baru |
| PUT | `/api/admin/articles/[id]` | Edit artikel |
| DELETE | `/api/admin/articles/[id]` | Hapus artikel |
| GET | `/api/admin/messages` | Ambil semua pesan |
| PUT | `/api/admin/messages/[id]/read` | Tandai pesan sebagai dibaca |
| DELETE | `/api/admin/messages/[id]` | Hapus pesan |
| POST | `/api/admin/upload` | Upload file ke storage |
| DELETE | `/api/admin/media/[id]` | Hapus file dari storage |

### Auth

| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/api/auth/signin` | Login (dikelola NextAuth) |
| POST | `/api/auth/signout` | Logout |

---

## 11. Keamanan & Autentikasi

- **Login**: Satu akun admin dengan email dan password. Password di-hash dengan bcrypt (salt rounds ≥ 12).
- **Session**: JWT session via NextAuth.js, disimpan sebagai HTTP-only cookie.
- **Proteksi Route Admin**: Middleware Next.js mengecek session sebelum mengakses halaman/API admin.
- **CSRF Protection**: NextAuth secara default menangani proteksi CSRF.
- **Input Validation**: Semua input divalidasi dengan library Zod di sisi server sebelum diproses.
- **Rate Limiting**: Endpoint `/api/contact` dan `/api/auth/signin` dibatasi request-nya untuk mencegah spam dan brute force.
- **Environment Variables**: Semua credential (database URL, secret key, API key storage) disimpan di `.env.local` dan tidak pernah di-commit ke repository.
- **File Upload**: Validasi tipe file (hanya jpg, png, webp, gif, pdf) dan ukuran (maks 5MB per file) di sisi server.

---

## 12. Non-Functional Requirements

### Performa
- Halaman publik: Largest Contentful Paint (LCP) < 2.5 detik.
- Gambar selalu menggunakan format WebP dan di-lazy-load.
- Bundle JavaScript diminimalkan dengan code splitting otomatis Next.js.

### SEO
- Setiap halaman memiliki meta title, meta description, dan Open Graph tags.
- Sitemap XML digenerate otomatis (`/sitemap.xml`).
- Robots.txt disertakan (`/robots.txt`).
- URL ramah mesin pencari (slug berbasis judul, bukan ID acak).

### Responsivitas
- Layout responsif untuk breakpoint: mobile (< 640px), tablet (640–1024px), desktop (> 1024px).
- Navigasi mobile menggunakan hamburger menu.
- Gambar responsif dengan ukuran berbeda per breakpoint.

### Aksesibilitas
- Semua gambar memiliki atribut `alt`.
- Elemen interaktif dapat diakses via keyboard.
- Kontras warna memenuhi standar WCAG 2.1 Level AA.
- Gunakan elemen HTML semantik (header, main, nav, article, section, footer).

### Maintainability
- Kode dipisahkan per komponen (atomic design ringan).
- Komentar pada fungsi-fungsi kompleks.
- `.env.example` disertakan sebagai referensi variabel lingkungan.

---

## 13. Milestone & Timeline

> Estimasi untuk pengerjaan mandiri part-time (~10–15 jam/minggu)

| Fase | Tugas | Estimasi Durasi |
|---|---|---|
| **Fase 1: Setup** | Init project Next.js, setup Prisma + DB, NextAuth, Tailwind, struktur folder | 3–4 hari |
| **Fase 2: Backend** | Buat semua API Route Handlers, schema Prisma, migrasi database | 5–7 hari |
| **Fase 3: Admin Panel** | Bangun semua halaman admin (CRUD proyek, artikel, skill, profil, pesan, media) | 10–14 hari |
| **Fase 4: Halaman Publik** | Beranda, About, Projects, Skills, Blog, Contact | 7–10 hari |
| **Fase 5: Integrasi** | Hubungkan admin ke publik, upload media, notifikasi email | 3–5 hari |
| **Fase 6: Polish** | Animasi, responsivitas, SEO, testing, Lighthouse audit | 4–5 hari |
| **Fase 7: Deployment** | Deploy ke Vercel + Railway, setup domain, environment production | 2–3 hari |
| **Total Estimasi** | | **~5–7 Minggu** |

---

## 14. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Quota storage Cloudinary/Supabase habis | Gambar tidak bisa di-upload | Pantau usage rutin; kompresi gambar sebelum upload |
| Database down (Railway/cloud) | Situs tidak bisa diakses | Backup database berkala; pertimbangkan migrasi ke VPS jika traffic tinggi |
| Password admin bocor | Akses tidak sah ke konten | Gunakan password kuat, aktifkan 2FA jika NextAuth mendukung |
| Domain tidak terperbarui | Situs tidak bisa diakses | Set auto-renew domain; catat tanggal expired |
| Perubahan API Next.js setelah upgrade | Breaking changes pada app | Pin versi di `package.json`; baca changelog sebelum upgrade |
| Spam di form kontak | Inbox penuh, performa turun | Tambahkan reCAPTCHA v3 atau Honeypot field |

---

*Dokumen ini adalah living document — dapat diperbarui seiring perkembangan proyek.*

---

**Dibuat dengan:** Claude Sonnet 4.6  
**Untuk:** Kebutuhan Pengembangan Web Portofolio Pribadi
