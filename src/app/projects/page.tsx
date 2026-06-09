import type { Metadata } from "next";
import ProjectCard from "@/components/ProjectCard";

export const metadata: Metadata = {
  title: "Proyek",
  description: "Kumpulan proyek yang pernah saya kerjakan",
};

async function getProjects() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/projects`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  const categories = [...new Set(projects.map((p: { category: string }) => p.category))];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4 animate-fade-in-up">Project</h1>
      <p className="text-text-secondary mb-8 animate-fade-in-up">Kumpulan Project yang pernah saya kerjakan.</p>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button className="px-4 py-1.5 rounded-full bg-accent text-white text-sm font-medium">Semua</button>
          
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project: any) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-20">
          <p className="text-text-secondary">Belum ada proyek yang dipublikasikan.</p>
        </div>
      )}
    </div>
  );
}