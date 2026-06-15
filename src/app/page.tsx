import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-3xl animate-fade-in-up">
          <div className="w-45 h-45 mx-auto mb-6 rounded-full bg-accent/20 border-2 border-accent overflow-hidden">
          <img src="/Profile.png" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-4">
            Halo, Saya <span className="text-accent">Naufalnadi</span>
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary mb-3">Web Developer</p>
          <p className="text-text-secondary max-w-xl mx-auto mb-8 leading-relaxed">
            Saya membuat aplikasi web yang modern, responsif, dan user-friendly.
            Dengan pengalaman di berbagai teknologi, saya siap membantu mewujudkan idemu menjadi produk digital.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/projects"
              className="w-full sm:w-auto px-6 py-3 bg-accent text-white rounded-md hover:bg-accent-hover transition-colors font-medium text-center"
            >
              Lihat Project Saya
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-6 py-3 border border-accent text-accent rounded-md hover:bg-accent/10 transition-colors font-medium text-center"
            >
              Hubungi Saya
            </Link>
            <a
              href="/CV Muhammad Naufalnadi Putra Rasya.pdf"
              download
              className="w-full sm:w-auto px-6 py-3 text-accent rounded-md hover:bg-accent/10 transition-colors font-medium text-center inline-flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download CV
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-bg-secondary">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary text-center mb-12">Tentang Saya</h2>
          <div className="max-w-3xl mx-auto space-y-4 text-text-secondary leading-relaxed">
            <p>
              Saya adalah seorang developer yang berfokus pada pengembangan web modern.
              Dengan pengalaman dalam berbagai teknologi frontend dan backend, saya selalu berusaha
              memberikan solusi terbaik untuk setiap proyek yang saya kerjakan.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}