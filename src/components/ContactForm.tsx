"use client";

import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal mengirim pesan");
      }

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center p-8 bg-bg-secondary border border-success/30 rounded-lg">
        <svg className="w-12 h-12 text-success mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-semibold text-text-primary mb-2">Pesan Terkirim!</h3>
        <p className="text-text-secondary">Terima kasih, pesan Anda akan segera kami respon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">Nama</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2.5 bg-bg-secondary border border-border rounded-md focus:outline-none focus:border-accent text-text-primary placeholder-text-secondary"
          placeholder="Nama Anda"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2.5 bg-bg-secondary border border-border rounded-md focus:outline-none focus:border-accent text-text-primary placeholder-text-secondary"
          placeholder="email@example.com"
        />
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-text-secondary mb-1">Subjek</label>
        <input
          type="text"
          id="subject"
          name="subject"
          required
          value={formData.subject}
          onChange={handleChange}
          className="w-full px-4 py-2.5 bg-bg-secondary border border-border rounded-md focus:outline-none focus:border-accent text-text-primary placeholder-text-secondary"
          placeholder="Subjek pesan"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-text-secondary mb-1">Pesan</label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-2.5 bg-bg-secondary border border-border rounded-md focus:outline-none focus:border-accent text-text-primary placeholder-text-secondary resize-none"
          placeholder="Tulis pesan Anda..."
        />
      </div>
      {status === "error" && (
        <p className="text-error text-sm">{error}</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full px-6 py-2.5 bg-accent text-white rounded-md hover:bg-accent-hover transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Mengirim..." : "Kirim Pesan"}
      </button>
    </form>
  );
}