import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getArticle(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/articles/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Artikel Tidak Ditemukan" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: { title: article.title, description: article.excerpt },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) notFound();

  return (
    <article className="max-w-4xl mx-auto px-4 py-16">
      <Link href="/blog" className="text-accent hover:text-accent-hover text-sm mb-6 inline-block">
        &larr; Kembali ke Blog
      </Link>

      <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">{article.title}</h1>

      <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mb-8">
        {article.publishedAt && (
          <time>{new Date(article.publishedAt).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}</time>
        )}
        <div className="flex flex-wrap gap-1.5">
          {article.tags?.map((tag: string) => (
            <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-primary text-accent-hover">{tag}</span>
          ))}
        </div>
      </div>

      {article.thumbnailUrl && (
        <div className="aspect-video rounded-lg overflow-hidden mb-8 bg-primary/30">
          <img src={article.thumbnailUrl} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div
        className="prose prose-invert max-w-none text-text-secondary leading-relaxed"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  );
}