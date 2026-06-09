"use client";

import { useState, useEffect } from "react";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);

  const fetchMessages = async () => {
    const res = await fetch("/api/admin/messages");
    if (res.ok) setMessages(await res.json());
  };

  useEffect(() => { fetchMessages(); }, []);

  const markAsRead = async (id: string) => {
    await fetch(`/api/admin/messages/${id}/read`, { method: "PUT" });
    fetchMessages();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus pesan ini?")) return;
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    fetchMessages();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Pesan Kontak</h1>

      <div className="space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`bg-bg-secondary border ${msg.isRead ? "border-border" : "border-accent/50"} rounded-lg p-4`}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-text-primary font-medium">{msg.name}</p>
                <p className="text-text-secondary text-sm">{msg.email} &middot; {new Date(msg.createdAt).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
              </div>
              <div className="flex gap-2">
                {!msg.isRead && (
                  <button onClick={() => markAsRead(msg.id)} className="text-accent hover:text-accent-hover text-sm">Tandai Dibaca</button>
                )}
                <button onClick={() => handleDelete(msg.id)} className="text-error hover:text-error/80 text-sm">Hapus</button>
              </div>
            </div>
            <p className="text-sm font-medium text-text-primary mb-1">{msg.subject}</p>
            <p className="text-text-secondary text-sm whitespace-pre-wrap">{msg.message}</p>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-center text-text-secondary py-10">Belum ada pesan.</p>
        )}
      </div>
    </div>
  );
}