"use client";

import { useState } from "react";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  folder?: string;
}

export default function ImageUpload({ onUpload, folder = "portfolio" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      alert("Hanya file JPG, PNG, WebP, dan GIF yang diizinkan");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal 5MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Gagal upload");

      const data = await res.json();
      onUpload(data.url);
    } catch (err) {
      alert("Gagal mengupload file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <label className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover transition-colors cursor-pointer text-sm">
      {uploading ? "Mengupload..." : "Upload Gambar"}
      <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleUpload} className="hidden" disabled={uploading} />
    </label>
  );
}