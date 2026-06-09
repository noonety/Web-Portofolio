interface SkillBadgeProps {
  name: string;
  level: string;
  category: string;
}

const levelColors: Record<string, string> = {
  BEGINNER: "border-yellow-500/30 text-yellow-400",
  INTERMEDIATE: "border-blue-500/30 text-blue-400",
  ADVANCED: "border-green-500/30 text-green-400",
  EXPERT: "border-purple-500/30 text-purple-400",
};

const levelLabels: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  EXPERT: "Expert",
};

export default function SkillBadge({ name, level, category }: SkillBadgeProps) {
  return (
    <div className={`px-3 py-1.5 rounded-full border text-sm font-medium transition-all hover:scale-105 ${levelColors[level] || "border-primary text-text-secondary"}`}>
      <span>{name}</span>
      <span className="ml-1.5 opacity-70 text-xs">({levelLabels[level] || level})</span>
    </div>
  );
}