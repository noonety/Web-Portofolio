"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "", thumbnailUrl: "", tags: "", isPublished: false, publishedAt: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch("/api/admin/articles")
      .then(r => r.json())
      .then(articles => {
        const article = articles.find((a: any) => a.id === params.id);
        if (article) {
          setForm({
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt || "",
            content: article.content || "",
            thumbnailUrl: article.thumbnailUrl || "",
            tags: (article.tags || []).join(", "),
            isPublished: article.isPublished,
            publishedAt: article.publishedAt?.split("T")[0] || "",
          });
        }
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(",").map(s => s.trim()).filter(Boolean) : [],
        publishedAt: form.publishedAt || null,
      };
      const res = await fetch(`/api/admin/articles/${params.id}`, {
        method: "PUT",
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

  const handleDelete = async () => {
    if (!confirm("Hapus artikel ini?")) return;
    await fetch(`/api/admin/articles/${params.id}`, { method: "DELETE" });
    router.push("/admin/articles");
  };

  if (fetching) return <p className="text-text-secondary">Memuat...</p>;

  const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md focus:outline-none focus:border-accent text-text-primary" />
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Edit Artikel</h1>
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Judul" required />
          <Input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} placeholder="Slug" required />
        </div>

        <textarea value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} rows={2} placeholder="Cuplikan" className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md focus:outline-none focus:border-accent text-text-primary resize-none" />

        <RichTextEditor content={form.content} onChange={(html) => setForm({...form, content: html})} placeholder="Konten artikel..." />

        <div className="grid sm:grid-cols-2 gap-4">
          <Input value={form.thumbnailUrl} onChange={e => setForm({...form, thumbnailUrl: e.target.value})} placeholder="URL Thumbnail" />
          <Input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="Tag (koma)" />
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isPublished} onChange={e => setForm({...form, isPublished: e.target.checked})} className="accent-accent" />
            <span className="text-sm text-text-secondary">Publikasikan</span>
          </label>
          <input type="date" value={form.publishedAt} onChange={e => setForm({...form, publishedAt: e.target.value})} className="px-3 py-2 bg-bg-secondary border border-border rounded-md focus:outline-none focus:border-accent text-text-primary" />
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="px-6 py-2 bg-accent text-white rounded-md hover:bg-accent-hover disabled:opacity-50">
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          <button type="button" onClick={handleDelete} className="px-6 py-2 border border-error text-error rounded-md hover:bg-error/10">
            Hapus Artikel
          </button>
        </div>
      </form>
    </div>
  );
}