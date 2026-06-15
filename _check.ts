import { PrismaClient } from "./src/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  const skills = await prisma.skill.count();
  const projects = await prisma.project.count();
  const experiences = await prisma.experience.count();
  console.log("Skills:", skills, "| Projects:", projects, "| Experiences:", experiences);
  await prisma.$disconnect();
}

main();