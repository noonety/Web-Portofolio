import Link from "next/link";

async function getArticles() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/admin/articles`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function AdminArticlesPage() {
  const articles = await getArticles();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Manajemen Artikel</h1>
        <Link href="/admin/articles/new"
          className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover transition-colors text-sm font-medium">
          + Tulis Artikel
        </Link>
      </div>

      <div className="bg-bg-secondary border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-text-secondary text-sm">
              <th className="text-left p-3 font-medium">Judul</th>
              <th className="text-left p-3 font-medium hidden md:table-cell">Tag</th>
              <th className="text-left p-3 font-medium hidden sm:table-cell">Status</th>
              <th className="text-right p-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a: any) => (
              <tr key={a.id} className="border-b border-border/50 hover:bg-primary/20 transition-colors">
                <td className="p-3 text-text-primary font-medium">{a.title}</td>
                <td className="p-3 text-text-secondary hidden md:table-cell">{(a.tags || []).join(", ")}</td>
                <td className="p-3 hidden sm:table-cell">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${a.isPublished ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                    {a.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <Link href={`/admin/articles/${a.id}/edit`} className="text-accent hover:text-accent-hover text-sm">Edit</Link>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr><td colSpan={4} className="p-6 text-center text-text-secondary">Belum ada artikel.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}