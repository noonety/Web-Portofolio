"use client";

import { useState, useEffect } from "react";
import ImageUpload from "@/components/admin/ImageUpload";

export default function AdminProfilePage() {
  const [form, setForm] = useState({
    name: "", tagline: "", bio: "", email: "", phone: "", location: "",
    photoUrl: "", cvUrl: "", socialLinks: "{}", siteTitle: "", siteDescription: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then(r => r.json())
      .then(data => {
        if (data.id) {
          setForm({
            name: data.name || "",
            tagline: data.tagline || "",
            bio: data.bio || "",
            email: data.email || "",
            phone: data.phone || "",
            location: data.location || "",
            photoUrl: data.photoUrl || "",
            cvUrl: data.cvUrl || "",
            socialLinks: JSON.stringify(data.socialLinks || {}),
            siteTitle: data.siteTitle || "",
            siteDescription: data.siteDescription || "",
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = { ...form, socialLinks: JSON.parse(form.socialLinks || "{}") };
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal menyimpan");
      setMessage("Profil berhasil disimpan");
    } catch {
      setMessage("Gagal menyimpan profil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Edit Profil</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">Nama Lengkap</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md focus:outline-none focus:border-accent text-text-primary" />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Tagline</label>
            <input value={form.tagline} onChange={e => setForm({...form, tagline: e.target.value})} className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md focus:outline-none focus:border-accent text-text-primary" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-1">Bio</label>
          <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} rows={4} className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md focus:outline-none focus:border-accent text-text-primary resize-none" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">Email Kontak</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md focus:outline-none focus:border-accent text-text-primary" />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">No. HP</label>
            <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md focus:outline-none focus:border-accent text-text-primary" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-1">Lokasi</label>
          <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md focus:outline-none focus:border-accent text-text-primary" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">Foto Profil</label>
            <input value={form.photoUrl} onChange={e => setForm({...form, photoUrl: e.target.value})} placeholder="URL foto" className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md focus:outline-none focus:border-accent text-text-primary mb-2" />
            <ImageUpload onUpload={(url) => setForm({...form, photoUrl: url})} />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">URL CV</label>
            <input value={form.cvUrl} onChange={e => setForm({...form, cvUrl: e.target.value})} placeholder="URL file PDF" className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md focus:outline-none focus:border-accent text-text-primary" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-1">Social Links (JSON)</label>
          <textarea value={form.socialLinks} onChange={e => setForm({...form, socialLinks: e.target.value})} rows={3} className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md focus:outline-none focus:border-accent text-text-primary font-mono text-sm" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">Judul Situs (SEO)</label>
            <input value={form.siteTitle} onChange={e => setForm({...form, siteTitle: e.target.value})} className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md focus:outline-none focus:border-accent text-text-primary" />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Deskripsi Situs (SEO)</label>
            <input value={form.siteDescription} onChange={e => setForm({...form, siteDescription: e.target.value})} className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md focus:outline-none focus:border-accent text-text-primary" />
          </div>
        </div>

        {message && <p className={`text-sm ${message.includes("berhasil") ? "text-success" : "text-error"}`}>{message}</p>}

        <button type="submit" disabled={loading} className="px-6 py-2 bg-accent text-white rounded-md hover:bg-accent-hover disabled:opacity-50">
          {loading ? "Menyimpan..." : "Simpan Profil"}
        </button>
      </form>
    </div>
  );
}