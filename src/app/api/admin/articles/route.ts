import { prisma } from "@/lib/prisma";
import { articleSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const validated = articleSchema.parse(body);
    const article = await prisma.article.create({
      data: {
        ...validated,
        publishedAt: validated.publishedAt ? new Date(validated.publishedAt) : null,
      },
    });
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validasi gagal", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const articles = await prisma.article.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
