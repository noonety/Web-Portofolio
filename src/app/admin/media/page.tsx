"use client";

import { useState, useEffect } from "react";
import ImageUpload from "@/components/admin/ImageUpload";

export default function AdminMediaPage() {
  const [media, setMedia] = useState<any[]>([]);

  const fetchMedia = async () => {
    const res = await fetch("/api/admin/media", { cache: "no-store" });
    if (res.ok) setMedia(await res.json());
  };

  useEffect(() => { fetchMedia(); }, []);

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("URL disalin!");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus media ini?")) return;
    await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    fetchMedia();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Galeri Media</h1>
        <ImageUpload onUpload={() => fetchMedia()} />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {media.map((file) => (
          <div key={file.id} className="bg-bg-secondary border border-border rounded-lg overflow-hidden group">
            <div className="aspect-square bg-primary/30 relative">
              {file.fileType?.startsWith("image/") ? (
                <img src={file.url} alt={file.filename} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-secondary text-sm">{file.filename}</div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => copyUrl(file.url)} className="px-2 py-1 bg-accent text-white text-xs rounded">Salin URL</button>
                <button onClick={() => handleDelete(file.id)} className="px-2 py-1 bg-error text-white text-xs rounded">Hapus</button>
              </div>
            </div>
            <div className="p-2">
              <p className="text-text-secondary text-xs truncate">{file.filename}</p>
              <p className="text-text-secondary text-xs">{(file.fileSize / 1024).toFixed(1)} KB</p>
            </div>
          </div>
        ))}
        {media.length === 0 && (
          <p className="col-span-full text-center text-text-secondary py-10">Belum ada media.</p>
        )}
      </div>
    </div>
  );
}