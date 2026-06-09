import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";

export async function PUT(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const validated = profileSchema.parse(body);

    const existing = await prisma.profile.findFirst();
    let profile;

    const data: Prisma.ProfileUpdateInput = {
      ...validated,
      socialLinks: validated.socialLinks as Prisma.InputJsonValue,
    };

    if (existing) {
      profile = await prisma.profile.update({
        where: { id: existing.id },
        data,
      });
    } else {
      profile = await prisma.profile.create({ data: data as any });
    }

    return NextResponse.json(profile);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validasi gagal", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
