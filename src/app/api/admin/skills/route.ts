import { prisma } from "@/lib/prisma";
import { skillSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const validated = skillSchema.parse(body);
    const skill = await prisma.skill.create({ data: validated });
    return NextResponse.json(skill, { status: 201 });
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
    const skills = await prisma.skill.findMany({ orderBy: [{ category: "asc" }, { sortOrder: "asc" }] });
    return NextResponse.json(skills);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
