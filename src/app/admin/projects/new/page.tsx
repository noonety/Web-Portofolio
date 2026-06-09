"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function NewProjectPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", slug: "", shortDesc: "", longDesc: "",
    thumbnailUrl: "", images: "", technologies: "", category: "",
    githubUrl: "", demoUrl: "", isPublished: false, sortOrder: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        images: form.images ? form.images.split("\n").map(s => s.trim()).filter(Boolean) : [],
        technologies: form.technologies ? form.technologies.split(",").map(s => s.trim()).filter(Boolean) : [],
        sortOrder: Number(form.sortOrder),
      };
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Gagal");
      router.push("/admin/projects");
    } catch {
      alert("Gagal menyimpan proyek");
    } finally {
      setLoading(false);
    }
  };

  const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md focus:outline-none focus:border-accent text-text-primary" />
  );
  const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea {...props} className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md focus:outline-none focus:border-accent text-text-primary resize-none" />
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Tambah Proyek Baru</h1>
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">Judul</label>
            <Input value={form.title} onChange={e => setForm({...form, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")})} required />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Slug</label>
            <Input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} required />
          </div>
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-1">Deskripsi Singkat</label>
          <Textarea value={form.shortDesc} onChange={e => setForm({...form, shortDesc: e.target.value})} rows={2} required />
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-1">Deskripan Lengkap</label>
          <RichTextEditor content={form.longDesc} onChange={(html) => setForm({...form, longDesc: html})} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">Kategori</label>
            <Input value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="Web, Mobile, Design, dll" required />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Teknologi (pisahkan dengan koma)</label>
            <Input value={form.technologies} onChange={e => setForm({...form, technologies: e.target.value})} placeholder="React, Node.js, PostgreSQL" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-1">URL Thumbnail</label>
          <Input value={form.thumbnailUrl} onChange={e => setForm({...form, thumbnailUrl: e.target.value})} />
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-1">Galeri Gambar (satu URL per baris)</label>
          <Textarea value={form.images} onChange={e => setForm({...form, images: e.target.value})} rows={3} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">URL GitHub</label>
            <Input value={form.githubUrl} onChange={e => setForm({...form, githubUrl: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">URL Demo</label>
            <Input value={form.demoUrl} onChange={e => setForm({...form, demoUrl: e.target.value})} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isPublished} onChange={e => setForm({...form, isPublished: e.target.checked})} className="accent-accent" />
            <span className="text-sm text-text-secondary">Publikasikan</span>
          </label>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Urutan</label>
            <input type="number" value={form.sortOrder} onChange={e => setForm({...form, sortOrder: Number(e.target.value)})} className="w-20 px-3 py-2 bg-bg-secondary border border-border rounded-md focus:outline-none focus:border-accent text-text-primary" />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={loading} className="px-6 py-2 bg-accent text-white rounded-md hover:bg-accent-hover disabled:opacity-50">
            {loading ? "Menyimpan..." : "Simpan Proyek"}
          </button>
        </div>
      </form>
    </div>
  );
}