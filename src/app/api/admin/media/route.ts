import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client"; // Sesuaikan dengan path prisma client kamu
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();

// Inisialisasi Supabase Client khusus untuk server-side operation
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET_NAME = "portfolio-assets";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB sesuai standard PRD
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];

export async function POST(req: NextRequest) {
  try {
    // TODO: Di Fase 3 nanti, kita akan selipkan validasi NextAuth session di sini 
    // untuk mengunci agar hanya admin login yang bisa upload berkas.

    // 1. Ambil data Form dari Request
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Tidak ada berkas yang dipilih" }, { status: 400 });
    }

    // 2. Validasi Ukuran Berkas (Max 5MB)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Ukuran berkas terlalu besar! Maksimal 5MB" }, { status: 400 });
    }

    // 3. Validasi Tipe Berkas (Hanya Gambar & PDF)
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Format berkas tidak diizinkan! Hanya menerima Gambar atau PDF" }, { status: 400 });
    }

    // 4. Standarisasi Nama File unik agar tidak bentrok di Cloud Storage
    const fileExtension = file.name.split(".").pop();
    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExtension}`;

    // Convert file objek ke ArrayBuffer agar bisa dibaca oleh Supabase Storage Upload API
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 5. Eksekusi Upload ke Supabase Storage Bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(uniqueFileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase Storage Error:", uploadError);
      return NextResponse.json({ error: "Gagal mengunggah berkas ke Cloud Storage" }, { status: 500 });
    }

    // 6. Dapatkan URL Publik dari berkas yang sukses di-upload
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(uniqueFileName);

    // 7. Catat metadata file tersebut ke database PostgreSQL menggunakan Prisma ORM
    const savedMedia = await prisma.mediaFile.create({
      data: {
        url: publicUrl,
        publicId: uploadData.path, // Disimpan untuk keperluan menghapus file fisik nanti
        filename: file.name,
        fileType: file.type,
        fileSize: file.size,
      },
    });

    // 8. Kembalikan response sukses beserta detail file dan URL-nya
    return NextResponse.json({
      success: true,
      message: "Berkas berhasil diunggah!",
      data: savedMedia
    }, { status: 201 });

  } catch (error) {
    console.error("API Media Upload Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan internal server" }, { status: 500 });
  }
}