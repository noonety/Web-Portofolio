import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProject(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/projects/${slug}`, {
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
  const project = await getProject(slug);
  if (!project) return { title: "Proyek Tidak Ditemukan" };
  return {
    title: project.title,
    description: project.shortDesc,
    openGraph: { title: project.title, description: project.shortDesc },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  return (
    <article className="max-w-4xl mx-auto px-4 py-16">
      <Link href="/projects" className="text-accent hover:text-accent-hover text-sm mb-6 inline-block">
        &larr; Kembali ke Proyek
      </Link>

      <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">{project.title}</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {project.technologies?.map((tech: string) => (
          <span key={tech} className="px-3 py-1 text-xs rounded-full bg-primary text-accent-hover">{tech}</span>
        ))}
      </div>

      {project.thumbnailUrl && (
        <div className="aspect-video rounded-lg overflow-hidden mb-8 bg-primary/30">
          <img src={project.thumbnailUrl} alt={project.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="prose prose-invert max-w-none text-text-secondary leading-relaxed space-y-4">
        <p>{project.shortDesc}</p>
        {project.longDesc && <div dangerouslySetInnerHTML={{ __html: project.longDesc }} />}
      </div>

      <div className="flex flex-wrap gap-4 mt-8">
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
            className="px-4 py-2 bg-bg-secondary border border-border rounded-md text-text-secondary hover:text-text-primary hover:border-accent transition-colors text-sm">
            GitHub &rarr;
          </a>
        )}
        {project.demoUrl && (
          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
            className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover transition-colors text-sm">
            Live Demo &rarr;
          </a>
        )}
      </div>

      {project.images && project.images.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Galeri</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {project.images.map((img: string, i: number) => (
              <div key={i} className="aspect-video rounded-lg overflow-hidden bg-primary/30">
                <img src={img} alt={`${project.title} screenshot ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}