import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
    });
    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}