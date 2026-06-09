import type { Metadata } from "next";
import SkillBadge from "@/components/SkillBadge";

export const metadata: Metadata = {
  title: "Keahlian",
  description: "Daftar keahlian dan kompetensi saya",
};

async function getSkills() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/skills`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function SkillsPage() {
  const skills = await getSkills();

  const grouped = skills.reduce((acc: Record<string, any[]>, skill: any) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4 animate-fade-in-up">Skills</h1>
      <p className="text-text-secondary mb-12 animate-fade-in-up">Berbagai teknologi dan tools yang saya kuasai.</p>

      {Object.keys(grouped).length === 0 && (
        <div className="text-center py-20">
          <p className="text-text-secondary">Belum ada data keahlian.</p>
        </div>
      )}

      {Object.entries(grouped).map(([category, categorySkills]) => (
        <section key={category} className="mb-10 animate-fade-in-up">
          <h2 className="text-xl font-semibold text-text-primary mb-4">{category}</h2>
          <div className="flex flex-wrap gap-2">
            {(categorySkills as any[]).map((skill: any) => (
              <SkillBadge key={skill.id} name={skill.name} level={skill.level} category={skill.category} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}