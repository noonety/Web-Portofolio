import Link from "next/link";

interface ArticleCardProps {
  title: string;
  slug: string;
  excerpt: string;
  thumbnailUrl?: string | null;
  tags: string[];
  publishedAt: string | null;
}

export default function ArticleCard({ title, slug, excerpt, thumbnailUrl, tags, publishedAt }: ArticleCardProps) {
  return (
    <Link href={`/blog/${slug}`}>
      <article className="bg-bg-secondary border border-border rounded-lg overflow-hidden hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 hover:-translate-y-1">
        {thumbnailUrl && (
          <div className="aspect-video bg-primary/30 overflow-hidden">
            <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          </div>
        )}
        <div className="p-4">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-primary text-accent-hover">
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2 hover:text-accent-hover transition-colors">
            {title}
          </h3>
          <p className="text-text-secondary text-sm mb-3 line-clamp-2">{excerpt}</p>
          {publishedAt && (
            <time className="text-text-secondary text-xs">{new Date(publishedAt).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}</time>
          )}
        </div>
      </article>
    </Link>
  );
}