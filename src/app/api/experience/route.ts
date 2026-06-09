import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const experience = await prisma.experience.findMany({
      orderBy: { startDate: "desc" },
    });
    return NextResponse.json(experience);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}