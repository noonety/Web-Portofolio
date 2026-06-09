import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = contactSchema.parse(body);

    const message = await prisma.contactMessage.create({
      data: validated,
    });

    return NextResponse.json({ message: "Pesan berhasil dikirim", id: message.id }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validasi gagal", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
