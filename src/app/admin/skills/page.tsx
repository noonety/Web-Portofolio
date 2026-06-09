"use client";

import { useState, useEffect } from "react";

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", category: "", level: "BEGINNER", iconUrl: "", sortOrder: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSkills = async () => {
    const res = await fetch("/api/admin/skills");
    if (res.ok) setSkills(await res.json());
  };

  useEffect(() => { fetchSkills(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, sortOrder: Number(form.sortOrder) };
      let res;
      if (editingId) {
        res = await fetch(`/api/admin/skills/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      if (res.ok) {
        setForm({ name: "", category: "", level: "BEGINNER", iconUrl: "", sortOrder: 0 });
        setEditingId(null);
        fetchSkills();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (skill: any) => {
    setForm({ name: skill.name, category: skill.category, level: skill.level, iconUrl: skill.iconUrl || "", sortOrder: skill.sortOrder });
    setEditingId(skill.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus skill ini?")) return;
    await fetch(`/api/admin/skills/${id}`, { method: "DELETE" });
    fetchSkills();
  };

  const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md focus:outline-none focus:border-accent text-text-primary" />
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Manajemen Keahlian</h1>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-3 mb-8 p-4 bg-bg-secondary border border-border rounded-lg">
        <div className="grid sm:grid-cols-2 gap-3">
          <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Nama Skill" required />
          <Input value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="Kategori" required />
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <select value={form.level} onChange={e => setForm({...form, level: e.target.value})} className="px-3 py-2 bg-bg-secondary border border-border rounded-md focus:outline-none focus:border-accent text-text-primary">
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
            <option value="EXPERT">Expert</option>
          </select>
          <Input value={form.iconUrl} onChange={e => setForm({...form, iconUrl: e.target.value})} placeholder="Icon URL (opsional)" />
          <Input type="number" value={form.sortOrder} onChange={e => setForm({...form, sortOrder: Number(e.target.value)})} placeholder="Urutan" />
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover disabled:opacity-50 text-sm">
            {editingId ? "Update" : "Tambah"}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm({ name: "", category: "", level: "BEGINNER", iconUrl: "", sortOrder: 0 }); }} className="px-4 py-2 border border-border text-text-secondary rounded-md hover:text-text-primary text-sm">
              Batal
            </button>
          )}
        </div>
      </form>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {skills.map((skill) => (
          <div key={skill.id} className="bg-bg-secondary border border-border rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-text-primary font-medium">{skill.name}</p>
              <p className="text-text-secondary text-xs">{skill.category} &middot; {skill.level}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(skill)} className="text-accent hover:text-accent-hover text-sm">Edit</button>
              <button onClick={() => handleDelete(skill.id)} className="text-error hover:text-error/80 text-sm">Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}