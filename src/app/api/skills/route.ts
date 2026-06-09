import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    });
    return NextResponse.json(skills);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}