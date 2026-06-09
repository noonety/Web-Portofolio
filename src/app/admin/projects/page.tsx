import Link from "next/link";
import { prisma } from "@/lib/prisma";

// 2. Mengambil data proyek langsung dari PostgreSQL via Prisma secara aman di sisi server
async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        sortOrder: "asc", // Diurutkan berdasarkan nomor urutannya
      },
    });
    return projects;
  } catch (error) {
    console.error("Gagal memuat data proyek dari database:", error);
    return [];
  }
}

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Manajemen Proyek</h1>
        <Link href="/admin/projects/new"
          className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover transition-colors text-sm font-medium">
          + Tambah Proyek
        </Link>
      </div>

      <div className="bg-bg-secondary border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-text-secondary text-sm bg-primary/5">
              <th className="text-left p-3 font-medium">Judul</th>
              <th className="text-left p-3 font-medium hidden md:table-cell">Kategori</th>
              <th className="text-left p-3 font-medium hidden sm:table-cell">Status</th>
              <th className="text-right p-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-text-secondary">
                  Belum ada proyek.
                </td>
              </tr>
            ) : (
              projects.map((p: any) => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-primary/20 transition-colors">
                  <td className="p-3 text-text-primary font-medium">{p.title}</td>
                  <td className="p-3 text-text-secondary hidden md:table-cell">{p.category || "Web Development"}</td>
                  <td className="p-3 hidden sm:table-cell">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${p.isPublished ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"}`}>
                      {p.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-3">
                    <Link href={`/admin/projects/${p.id}/edit`}
                      className="text-accent hover:text-accent-hover text-sm font-medium">
                      Edit
                    </Link>
                    {/* Catatan: Untuk tombol hapus di Server Component, idealnya menggunakan Server Actions atau dioper ke client component. 
                        Namun ini layout aksinya sudah disiapkan agar sejajar dan rapi */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}