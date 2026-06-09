"use client";

import { useState, useEffect } from "react";

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [form, setForm] = useState({
    company: "", position: "", description: "", startDate: "", endDate: "", isCurrent: false, type: "WORK",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const res = await fetch("/api/admin/experience");
    if (res.ok) setExperiences(await res.json());
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, endDate: form.isCurrent ? null : form.endDate || null };
      let res;
      if (editingId) {
        res = await fetch(`/api/admin/experience/${editingId}`, {
          method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/experience", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        });
      }
      if (res.ok) {
        setForm({ company: "", position: "", description: "", startDate: "", endDate: "", isCurrent: false, type: "WORK" });
        setEditingId(null);
        fetchData();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (exp: any) => {
    setForm({
      company: exp.company, position: exp.position, description: exp.description,
      startDate: exp.startDate?.split("T")[0] || "", endDate: exp.endDate?.split("T")[0] || "",
      isCurrent: exp.isCurrent, type: exp.type,
    });
    setEditingId(exp.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus entri ini?")) return;
    await fetch(`/api/admin/experience/${id}`, { method: "DELETE" });
    fetchData();
  };

  const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md focus:outline-none focus:border-accent text-text-primary" />
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Pengalaman & Pendidikan</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-3 mb-8 p-4 bg-bg-secondary border border-border rounded-lg">
        <div className="flex gap-2">
          <button type="button" onClick={() => setForm({...form, type: "WORK"})} className={`px-3 py-1.5 text-sm rounded-md ${form.type === "WORK" ? "bg-accent text-white" : "bg-primary text-text-secondary"}`}>Kerja</button>
          <button type="button" onClick={() => setForm({...form, type: "EDUCATION"})} className={`px-3 py-1.5 text-sm rounded-md ${form.type === "EDUCATION" ? "bg-accent text-white" : "bg-primary text-text-secondary"}`}>Pendidikan</button>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <Input value={form.company} onChange={e => setForm({...form, company: e.target.value})} placeholder={form.type === "WORK" ? "Nama Perusahaan" : "Institusi"} required />
          <Input value={form.position} onChange={e => setForm({...form, position: e.target.value})} placeholder={form.type === "WORK" ? "Jabatan" : "Jurusan"} required />
        </div>
        <Input value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Deskripsi" />
        <div className="grid sm:grid-cols-2 gap-3">
          <Input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} required />
          <Input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} disabled={form.isCurrent} placeholder="Selesai" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.isCurrent} onChange={e => setForm({...form, isCurrent: e.target.checked})} className="accent-accent" />
          <span className="text-sm text-text-secondary">Masih berlangsung</span>
        </label>
        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover disabled:opacity-50 text-sm">
            {editingId ? "Update" : "Tambah"}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm({ company: "", position: "", description: "", startDate: "", endDate: "", isCurrent: false, type: "WORK" }); }} className="px-4 py-2 border border-border text-text-secondary rounded-md hover:text-text-primary text-sm">Batal</button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {experiences.map((exp) => (
          <div key={exp.id} className="bg-bg-secondary border border-border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-text-primary font-medium">{exp.position}</p>
                <p className="text-text-secondary text-sm">{exp.company}</p>
                <p className="text-text-secondary text-xs mt-1">
                  {new Date(exp.startDate).toLocaleDateString("id-ID", { year: "numeric", month: "short" })}
                  {" - "}
                  {exp.isCurrent ? "Sekarang" : exp.endDate ? new Date(exp.endDate).toLocaleDateString("id-ID", { year: "numeric", month: "short" }) : ""}
                  {" "}&middot;{" "}{exp.type === "WORK" ? "Kerja" : "Pendidikan"}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(exp)} className="text-accent hover:text-accent-hover text-sm">Edit</button>
                <button onClick={() => handleDelete(exp.id)} className="text-error hover:text-error/80 text-sm">Hapus</button>
              </div>
            </div>
            {exp.description && <p className="text-text-secondary text-sm mt-2">{exp.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}