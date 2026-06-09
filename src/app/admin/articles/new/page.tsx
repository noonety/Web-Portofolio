"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function NewArticlePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "", thumbnailUrl: "", tags: "", isPublished: false, publishedAt: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(",").map(s => s.trim()).filter(Boolean) : [],
        publishedAt: form.publishedAt || null,
      };
      const res = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Gagal");
      router.push("/admin/articles");
    } catch {
      alert("Gagal menyimpan artikel");
    } finally {
      setLoading(false);
    }
  };

  const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md focus:outline-none focus:border-accent text-text-primary" />
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Tulis Artikel Baru</h1>
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
          <label className="block text-sm text-text-secondary mb-1">Cuplikan (Excerpt)</label>
          <textarea value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} rows={2} className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md focus:outline-none focus:border-accent text-text-primary resize-none" />
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-1">Konten</label>
          <RichTextEditor content={form.content} onChange={(html) => setForm({...form, content: html})} placeholder="Mulai menulis artikel..." />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">URL Thumbnail</label>
            <Input value={form.thumbnailUrl} onChange={e => setForm({...form, thumbnailUrl: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Tag (pisahkan koma)</label>
            <Input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="nextjs, react, tutorial" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isPublished} onChange={e => setForm({...form, isPublished: e.target.checked})} className="accent-accent" />
            <span className="text-sm text-text-secondary">Publikasikan</span>
          </label>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Tanggal Publikasi</label>
            <input type="date" value={form.publishedAt} onChange={e => setForm({...form, publishedAt: e.target.value})} className="px-3 py-2 bg-bg-secondary border border-border rounded-md focus:outline-none focus:border-accent text-text-primary" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="px-6 py-2 bg-accent text-white rounded-md hover:bg-accent-hover disabled:opacity-50">
          {loading ? "Menyimpan..." : "Simpan Artikel"}
        </button>
      </form>
    </div>
  );
}