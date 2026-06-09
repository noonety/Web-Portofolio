import type { Metadata } from "next";
import { PrismaClient } from "@/generated/prisma/client"; // 1. Sesuaikan path Prisma Client kamu jika berbeda

export const metadata: Metadata = {
  title: "Tentang Saya",
  description: "Profil dan latar belakang saya",
};

const prisma = new PrismaClient();

// 2. Fungsi mengambil data pengalaman dari database berdasarkan tipe dan diurutkan dari yang terbaru
async function getExperiences() {
  const experiences = await prisma.experience.findMany({
    orderBy: {
      startDate: "desc",
    },
  });

  // Pisahkan data menjadi kategori WORK dan EDUCATION sesuai skema database kita
  return {
    workData: experiences.filter((exp) => exp.type === "WORK"),
    educationData: experiences.filter((exp) => exp.type === "EDUCATION"),
  };
}

export default async function AboutPage() {
  // 3. Ambil data asli dari Supabase via Prisma
  const { workData, educationData } = await getExperiences();

  // Fungsi helper untuk memformat tampilan tanggal agar rapi
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-8 animate-fade-in-up">About Me</h1>

      {/* Ringkasan Profil */}
      <div className="grid md:grid-cols-3 gap-8 mb-12 animate-fade-in-up">
        <div className="md:col-span-1">
          <div className="w-full aspect-square rounded-lg bg-accent/10 border border-accent/30 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-accent">
              <img src="/Profile.png" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
        <div className="md:col-span-2 space-y-4 text-text-secondary leading-relaxed text-justify">
          <p>
            Halo, saya Naufal Nadi, mahasiswa Teknologi Informasi di CCIT FTUI sekaligus seorang Web Developer yang berfokus pada pengembangan website modern, responsif, dan user-friendly. 
            Saya memiliki pengalaman dalam membangun aplikasi backend menggunakan PHP, CodeIgniter, serta berbagai teknologi web lainnya. 
            Selain itu, saya juga terbiasa mengelola database seperti MySQL dan MongoDB untuk mendukung performa dan skalabilitas aplikasi. 
            Saya senang mempelajari teknologi baru dan selalu berusaha menghadirkan solusi terbaik dalam setiap proyek yang saya kerjakan. 
            Bagi saya, proses belajar dan berkembang adalah bagian penting untuk menjadi developer yang lebih baik setiap harinya.
          </p>
        </div>
      </div>

      {/* SECTION 1: PENGALAMAN KERJA & ORGANISASI */}
      <section className="mb-12 animate-fade-in-up">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Pengalaman Kerja & Organisasi</h2>
        {workData.length === 0 ? (
          <p className="text-text-secondary">Belum ada data pengalaman kerja.</p>
        ) : (
          <div className="space-y-6">
            {workData.map((exp) => (
              <div key={exp.id} className="relative pl-6 border-l-2 border-accent/30 space-y-2">
                {/* Dot penunjuk timeline unik */}
                <div className="absolute -left-1.75 top-2 w-3 h-3 rounded-full bg-accent border border-background" />
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                  <div>
                    <h3 className="text-xl font-bold text-text-primary">{exp.position}</h3>
                    <p className="text-accent font-medium">{exp.company}</p>
                  </div>
                  <span className="text-xs font-semibold bg-accent/10 text-accent px-3 py-1 rounded-full border border-accent/20 w-fit">
                    {formatDate(exp.startDate)} - {exp.isCurrent ? "Sekarang" : exp.endDate ? formatDate(exp.endDate) : ""}
                  </span>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed text-justify whitespace-pre-line">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 2: PENDIDIKAN */}
      <section className="animate-fade-in-up">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Pendidikan</h2>
        {educationData.length === 0 ? (
          <p className="text-text-secondary">Belum ada data pendidikan.</p>
        ) : (
          <div className="space-y-6">
            {educationData.map((edu) => (
              <div key={edu.id} className="relative pl-6 border-l-2 border-accent/30 space-y-2">
                {/* Dot penunjuk timeline unik */}
                <div className="absolute -left-1.75 top-2 w-3 h-3 rounded-full bg-accent border border-background" />
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                  <div>
                    <h3 className="text-xl font-bold text-text-primary">{edu.company}</h3>
                    <p className="text-text-secondary text-sm font-medium">{edu.position}</p>
                  </div>
                  <span className="text-xs font-semibold bg-accent/5 text-text-secondary px-3 py-1 rounded-full border border-text-secondary/20 w-fit">
                    {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : "Sekarang"}
                  </span>
                </div>
                {edu.description && (
                  <p className="text-text-secondary text-sm leading-relaxed text-justify">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}