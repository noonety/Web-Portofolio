import type { Metadata } from "next";
import ArticleCard from "@/components/ArticleCard";

export const metadata: Metadata = {
  title: "Blog",
  description: "Artikel dan tulisan terbaru",
};

async function getArticles() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/articles`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const articles = await getArticles();

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4 animate-fade-in-up">Blog</h1>
      <p className="text-text-secondary mb-8 animate-fade-in-up">Artikel dan tulisan terbaru seputar teknologi dan pengembangan web.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article: any) => (
          <ArticleCard key={article.id} {...article} />
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-20">
          <p className="text-text-secondary">Belum ada artikel yang dipublikasikan.</p>
        </div>
      )}
    </div>
  );
}