"use client";

import { useState, useEffect } from "react";

export default function AdminSettingsPage() {
  const [form, setForm] = useState({ siteTitle: "", siteDescription: "", showBlog: true });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then(r => r.json())
      .then(data => {
        if (data.id) {
          setForm({
            siteTitle: data.siteTitle || "",
            siteDescription: data.siteDescription || "",
            showBlog: true,
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteTitle: form.siteTitle, siteDescription: form.siteDescription }),
      });
      if (res.ok) setMessage("Pengaturan berhasil disimpan");
      else setMessage("Gagal menyimpan");
    } catch {
      setMessage("Gagal menyimpan");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Pengaturan Situs</h1>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm text-text-secondary mb-1">Judul Situs</label>
          <input value={form.siteTitle} onChange={e => setForm({...form, siteTitle: e.target.value})} className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md focus:outline-none focus:border-accent text-text-primary" />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1">Deskripsi Meta</label>
          <textarea value={form.siteDescription} onChange={e => setForm({...form, siteDescription: e.target.value})} rows={3} className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-md focus:outline-none focus:border-accent text-text-primary resize-none" />
        </div>

        {message && <p className={`text-sm ${message.includes("berhasil") ? "text-success" : "text-error"}`}>{message}</p>}

        <button type="submit" className="px-6 py-2 bg-accent text-white rounded-md hover:bg-accent-hover transition-colors">Simpan Pengaturan</button>
      </form>
    </div>
  );
}