import Link from "next/link";

interface ProjectCardProps {
  title: string;
  slug: string;
  shortDesc: string;
  thumbnailUrl?: string | null;
  technologies: string[];
  category: string;
}

export default function ProjectCard({ title, slug, shortDesc, thumbnailUrl, technologies }: ProjectCardProps) {
  return (
    <Link href={`/projects/${slug}`}>
      <div className="group bg-bg-secondary border border-border rounded-lg overflow-hidden hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 hover:-translate-y-1">
        <div className="aspect-video bg-primary/30 relative overflow-hidden">
          {thumbnailUrl ? (
            <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-secondary text-4xl font-bold">
              {title.charAt(0)}
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-accent-hover transition-colors">
            {title}
          </h3>
          <p className="text-text-secondary text-sm mb-3 line-clamp-2">{shortDesc}</p>
          <div className="flex flex-wrap gap-1.5">
            {technologies.slice(0, 4).map((tech) => (
              <span key={tech} className="px-2 py-0.5 text-xs rounded-full bg-primary text-accent-hover">
                {tech}
              </span>
            ))}
            {technologies.length > 4 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-primary text-text-secondary">
                +{technologies.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}