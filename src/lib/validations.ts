import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const profileSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  tagline: z.string().min(1, "Tagline wajib diisi"),
  bio: z.string().default(""),
  email: z.string().email("Email tidak valid"),
  phone: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  photoUrl: z.string().nullable().optional(),
  cvUrl: z.string().nullable().optional(),
  socialLinks: z.record(z.string(), z.unknown()).optional(),
  siteTitle: z.string().default("Portfolio"),
  siteDescription: z.string().default("My Personal Portfolio"),
});

export const projectSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  shortDesc: z.string().min(1, "Deskripsi singkat wajib diisi"),
  longDesc: z.string().default(""),
  thumbnailUrl: z.string().nullable().optional(),
  images: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  category: z.string().min(1, "Kategori wajib diisi"),
  githubUrl: z.string().nullable().optional(),
  demoUrl: z.string().nullable().optional(),
  isPublished: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export const skillSchema = z.object({
  name: z.string().min(1, "Nama skill wajib diisi"),
  category: z.string().min(1, "Kategori wajib diisi"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]),
  iconUrl: z.string().nullable().optional(),
  sortOrder: z.number().int().default(0),
});

export const experienceSchema = z.object({
  company: z.string().min(1, "Nama institusi/perusahaan wajib diisi"),
  position: z.string().min(1, "Posisi/jabatan wajib diisi"),
  description: z.string().default(""),
  startDate: z.string().min(1, "Tanggal mulai wajib diisi"),
  endDate: z.string().nullable().optional(),
  isCurrent: z.boolean().default(false),
  type: z.enum(["WORK", "EDUCATION"]),
});

export const articleSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  excerpt: z.string().default(""),
  content: z.string().default(""),
  thumbnailUrl: z.string().nullable().optional(),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
  publishedAt: z.string().nullable().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
  subject: z.string().min(1, "Subjek wajib diisi"),
  message: z.string().min(1, "Pesan wajib diisi"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type ArticleInput = z.infer<typeof articleSchema>;
export type ContactInput = z.infer<typeof contactSchema>;