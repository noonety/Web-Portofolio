import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "portfolio";

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Tipe file tidak diizinkan" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Ukuran file maksimal 5MB" }, { status: 400 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: "Cloudinary not configured. Store file locally." }, { status: 501 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const formDataCloudinary = new FormData();
    formDataCloudinary.append("file", dataUri);
    formDataCloudinary.append("upload_preset", "ml_default");
    formDataCloudinary.append("folder", folder);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      { method: "POST", body: formDataCloudinary }
    );

    if (!uploadRes.ok) {
      const errData = await uploadRes.json();
      throw new Error(errData.error?.message || "Upload gagal");
    }

    const uploadData = await uploadRes.json();

    const mediaFile = await prisma.mediaFile.create({
      data: {
        url: uploadData.secure_url,
        publicId: uploadData.public_id,
        filename: file.name,
        fileType: file.type,
        fileSize: file.size,
      },
    });

    return NextResponse.json(mediaFile, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal upload file" }, { status: 500 });
  }
}