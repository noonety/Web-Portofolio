
# Web Portfolio Pribadi

Aplikasi web portofolio pribadi yang dibangun dengan Next.js 16 + TypeScript + Tailwind CSS + PostgreSQL + Prisma + NextAuth.js.

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router) |
| Bahasa | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL |
| ORM | Prisma 6 |
| Auth | NextAuth.js v5 (Credentials) |
| Rich Text | Tiptap |
| Deployment | Vercel + Railway |

## Fitur

### Halaman Publik
- Beranda dengan hero section
- Tentang Saya dengan profil, pengalaman, pendidikan
- Proyek dengan filter kategori dan detail
- Keahlian dengan level per skill
- Blog dengan artikel lengkap
- Kontak dengan form kirim pesan

### Panel Admin (`/admin`)
- Dashboard dengan statistik
- Manajemen profil & data diri
- CRUD proyek dengan rich text editor
- Manajemen keahlian
- Manajemen pengalaman & pendidikan
- CRUD artikel
- Manajemen pesan kontak
- Galeri media
- Pengaturan situs (SEO)

## Cara Memulai

### Prasyarat
- Node.js 20+
- PostgreSQL

### 1. Clone & Install

```bash
npm install
```

### 2. Setup Environment

Salin `.env.example` ke `.env` dan sesuaikan:

```bash
cp .env.example .env
```

### 3. Setup Database

```bash
# Migrate database
npm run db:migrate

# Seed data awal (admin user + sample data)
npm run seed
```

Akun admin default: `admin@example.com` / `admin123`

### 4. Jalankan Development

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## Deploy ke Vercel + Railway

### Database (Railway)
1. Buat akun di [Railway](https://railway.app)
2. Buat project baru → Provision PostgreSQL
3. Salin `DATABASE_URL` dari Railway

### Aplikasi (Vercel)
1. Push code ke GitHub
2. Import repo di [Vercel](https://vercel.com)
3. Set environment variables:
   - `DATABASE_URL` — dari Railway
   - `AUTH_SECRET` — generate dengan `npx auth secret`
   - `AUTH_URL` — URL aplikasi (https://domain.vercel.app)
   - `NEXT_PUBLIC_SITE_URL` — URL publik

4. Deploy

### Post-Deploy
```bash
# Jalankan migrasi database
npx prisma migrate deploy

# Seed data
npm run seed
```

## Struktur Folder

```
src/
├── app/
│   ├── api/           # Route Handlers (API)
│   ├── admin/         # Panel Admin
│   ├── about/         # Halaman Tentang
│   ├── projects/      # Halaman Proyek
│   ├── skills/        # Halaman Keahlian
│   ├── blog/          # Halaman Blog
│   ├── contact/       # Halaman Kontak
│   ├── layout.tsx     # Root Layout
│   └── page.tsx       # Beranda
├── components/        # Komponen
│   ├── admin/         # Komponen Admin
│   └── ...
└── lib/               # Utility & Config
    ├── auth.ts        # NextAuth config
    ├── prisma.ts      # Prisma client
    └── validations.ts # Zod schemas
proxy.ts               # Auth middleware (Next.js 16)
prisma/
└── schema.prisma      # Database schema
```

## API Endpoints

### Publik
- `GET /api/profile` — Data profil
- `GET /api/projects` — Proyek published
- `GET /api/projects/[slug]` — Detail proyek
- `GET /api/skills` — Semua skill
- `GET /api/experience` — Pengalaman & pendidikan
- `GET /api/articles` — Artikel published
- `GET /api/articles/[slug]` — Detail artikel
- `POST /api/contact` — Kirim pesan

### Admin (Auth Required)
- Semua CRUD untuk proyek, skill, pengalaman, artikel, media
- Manajemen profil, pesan, upload file

## Lisensi

Hak cipta dilindungi. Digunakan untuk keperluan pribadi.