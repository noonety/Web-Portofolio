import Link from "next/link";
import { PrismaClient } from "@/generated/prisma/client"; // 1. Sesuaikan path Prisma Client kamu

const prisma = new PrismaClient();

async function getStats() {
  try {
    // 1. Ambil semua perhitungan secara paralel dari PostgreSQL via Prisma
    const [totalProjects, totalArticles, totalSkills, totalMessages, unreadMessages] = await Promise.all([
      prisma.project.count(),
      prisma.article.count(),
      prisma.skill.count(),
      prisma.contactMessage.count(), // Menghitung total baris di tabel ContactMessage (akan menghasilkan 2)
      prisma.contactMessage.count({
        where: {
          isRead: false, // Menghitung pesan yang isRead-nya false (akan menghasilkan 1)
        },
      }),
    ]);

    // 2. Kembalikan data asli yang sudah sinkron dengan Supabase
    return {
      totalProjects,
      totalArticles,
      totalMessages,   // Sekarang nilainya otomatis dinamis mengikuti database
      unreadMessages,  // Sekarang nilainya otomatis dinamis mengikuti database
      totalSkills,
    };
  } catch (error) {
    console.error("Dashboard Sync Error:", error);
    return { totalProjects: 0, totalArticles: 0, totalMessages: 0, unreadMessages: 0, totalSkills: 0 };
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "Total Proyek", value: stats.totalProjects, href: "/admin/projects", color: "border-accent" },
    { label: "Total Artikel", value: stats.totalArticles, href: "/admin/articles", color: "border-green-500" },
    { label: "Pesan Masuk", value: stats.totalMessages, href: "/admin/messages", color: "border-yellow-500" },
    { label: "Pesan Belum Dibaca", value: stats.unreadMessages, href: "/admin/messages", color: "border-error" },
    { label: "Total Keahlian", value: stats.totalSkills, href: "/admin/skills", color: "border-purple-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}
            className={`bg-bg-secondary border ${card.color} rounded-lg p-4 hover:shadow-md transition-shadow`}>
            <p className="text-text-secondary text-sm">{card.label}</p>
            <p className="text-3xl font-bold text-text-primary mt-1">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="bg-bg-secondary border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Ringkasan Cepat</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/admin/projects/new"
            className="px-4 py-3 bg-accent/10 border border-accent/30 rounded-lg text-accent hover:bg-accent/20 transition-colors text-sm font-medium text-center">
            + Tambah Proyek Baru
          </Link>
          <Link href="/admin/articles/new"
            className="px-4 py-3 bg-accent/10 border border-accent/30 rounded-lg text-accent hover:bg-accent/20 transition-colors text-sm font-medium text-center">
            + Tulis Artikel Baru
          </Link>
        </div>
      </div>
    </div>
  );
}