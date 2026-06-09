import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl sm:text-8xl font-bold text-accent mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-text-primary mb-2">Halaman Tidak Ditemukan</h2>
        <p className="text-text-secondary mb-8">Halaman yang Anda cari tidak ada atau telah dipindahkan.</p>
        <Link
          href="/"
          className="px-6 py-3 bg-accent text-white rounded-md hover:bg-accent-hover transition-colors font-medium inline-block"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}