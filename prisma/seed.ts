// Seed script: npx tsx prisma/seed.ts
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const password = await bcrypt.hash("naufal123", 12);
  const user = await prisma.user.upsert({
    where: { email: "naufalnadi9@gmail.com" },
    update: {},
    create: {
      email: "naufalnadi9@gmail.com",
      password,
    },
  });
  console.log("Admin user created:", user.email);

  // Create default profile
  const profile = await prisma.profile.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      name: "Muhammad Naufalnadi Putra Rasya",
      tagline: "Web Developer | Tech Enthusiast",
      bio: "Saya adalah individu adaptif dengan semangat belajar tinggi untuk mengeksplorasi hal baru di luar zona nyaman. Mampu menyesuaikan diri dengan cepat dalam situasi kerja yang dinamis demi menjaga produktivitas, serta sangat menghargai kolaborasi tim yang komunikatif untuk mencapai keberhasilan bersama.",
      email: "naufalnadi9@gmail.com",
      siteTitle: "Portfolio",
      siteDescription: "My Personal Portfolio Website",
        socialLinks: {
          github: "https://github.com/noonety",
          linkedin: "https://www.linkedin.com/in/muhammad-naufalnadi/",
          instagram: "https://www.instagram.com/pall_nadi/",
        }  
    },
  });
  console.log("Default profile created");

  // Sample skills
  const skillsData = [
    // --- BACKEND & DATABASE DEVELOPMENT ---
    { name: "PHP", category: "Backend", level: "ADVANCED" as const, sortOrder: 1 },
    { name: "CodeIgniter", category: "Backend", level: "ADVANCED" as const, sortOrder: 2 },
    { name: "Java Spring Boot", category: "Backend", level: "INTERMEDIATE" as const, sortOrder: 3 },
    { name: "MySQL / RDBMS", category: "Backend", level: "ADVANCED" as const, sortOrder: 4 },
    { name: "PostgreSQL & Prisma", category: "Backend", level: "INTERMEDIATE" as const, sortOrder: 5 },

    // --- FRONTEND & MOBILE DEVELOPMENT ---
    { name: "HTML & CSS (Responsive Design)", category: "Frontend", level: "ADVANCED" as const, sortOrder: 1 },
    { name: "Tailwind CSS", category: "Frontend", level: "ADVANCED" as const, sortOrder: 2 },
    { name: "Next.js & TypeScript", category: "Frontend", level: "INTERMEDIATE" as const, sortOrder: 3 },

    // --- TOOLS & DEVOPS ---
    { name: "Git & GitHub Actions", category: "Tools", level: "INTERMEDIATE" as const, sortOrder: 1 },
    { name: "Figma (UI/UX Layout)", category: "Tools", level: "INTERMEDIATE" as const, sortOrder: 2 },

    // --- SOFT SKILLS (PROFESSIONAL) ---
    { name: "Leadership", category: "Professional", level: "ADVANCED" as const, sortOrder: 1 },
    { name: "Communication", category: "Professional", level: "ADVANCED" as const, sortOrder: 2 }
  ];

  await prisma.skill.deleteMany();
  for (const skill of skillsData) {
    await prisma.skill.create({ data: skill });
  }
  console.log("Skills seeded");

  // Sample projects
  const projectsData = [
    {
      title: "Librix - Library Management System",
      slug: "librix-library-management-system",
      shortDesc: "Sistem manajemen perpustakaan berbasis Java Spring Boot backend dan Flutter frontend.",
      longDesc: "<p>Librix adalah aplikasi modern untuk mengelola sirkulasi buku, inventarisasi, dan integrasi API yang dilengkapi dengan DevOps pipeline via GitHub Actions.</p>",
      category: "Web & Mobile",
      technologies: ["Java Spring Boot", "Flutter", "MySQL", "DevOps"],
      isPublished: true,
      sortOrder: 1,
    },
    {
      title: "Restaurant Management System",
      slug: "restaurant-management-system",
      shortDesc: "Platform manajemen restoran terpadu untuk sinkronisasi status meja dan antrean pesanan dari dapur hingga kasir.",
      longDesc: "<p>Sistem ini dibangun menggunakan framework modern <strong>CodeIgniter 4 (CI4)</strong> untuk menjaga pemisahan logika yang bersih dan skala aplikasi yang fleksibel. Dilengkapi dengan modul manajemen menu yang aman, hak akses pengguna multi-tier, serta pencatatan transaksi yang bersih.</p>",
      category: "Web",
      technologies: ["PHP", "CodeIgniter 4", "MySQL", "Tailwind CSS"],
      isPublished: true,
      sortOrder: 1,
    },
  ];

  for (const project of projectsData) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
  }
  console.log("Projects seeded");

  const experiencesData = [
    {
      company: "blu by BCA Digital",
      position: "blu Ambassador",
      description: "Mengembangkan strategi konten kreatif dan edukatif untuk mempromosikan layanan keuangan digital kepada target audiens mahasiswa. Berkolaborasi dalam ekosistem digital untuk mempromosikan efisiensi transaksi perbankan melalui aplikasi berbasis mobile.",
      startDate: new Date("2025-03-01"),
      isCurrent: true,
      type: "WORK" as const,
    },
    {
      company: "Komunitas Android CCIT-FTUI",
      position: "Staff Divisi Creative Visual",
      description: "Memproduksi aset visual dan materi dokumentasi kegiatan untuk kebutuhan publikasi eksternal komunitas. Mengoordinasikan tim dalam produksi konten visual dan dokumentasi kegiatan komunitas secara end-to-end.",
      startDate: new Date("2025-02-01"),
      isCurrent: true,
      type: "WORK" as const,
    },
    {
      company: "CCIT FTUI",
      position: "Mentor Masa Bimbingan (Mabim)",
      description: "Menjadi fasilitator utama dalam sesi diskusi kelompok untuk memecahkan masalah terkait akademik maupun non-akademik. Mengelola dinamika kelompok untuk memastikan terciptanya lingkungan belajar yang inklusif dan kolaboratif bagi seluruh peserta.",
      startDate: new Date("2025-09-01"),
      endDate: new Date("2026-03-01"),
      isCurrent: false,
      type: "WORK" as const,
    },
    {
      company: "Center for Computing and Information Technology Universitas Indonesia",
      position: "Teknologi Informasi",
      description: "Fokus pada pengembangan kompetensi teknologi informasi dan rekayasa perangkat lunak. Aktif berorganisasi sebagai Staff Creative Visual di Komunitas Android CCIT-FTUI.",
      startDate: new Date("2024-09-01"),
      endDate: new Date("2026-06-01"),
      isCurrent: false,
      type: "EDUCATION" as const,
    },
    {
      company: "Pesantren Umar Bin Khatab Plus",
      position: "IT Boarding School",
      description: "Menempuh pendidikan menengah dengan peminatan khusus di bidang teknologi informasi dan dasar-dasar pemrograman.",
      startDate: new Date("2021-07-01"),
      endDate: new Date("2024-06-01"),
      isCurrent: false,
      type: "EDUCATION" as const,
    },
  ];

  await prisma.experience.deleteMany();
  for (const exp of experiencesData) {
    await prisma.experience.create({ data: exp });
  }
  console.log("Experiences seeded");

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });