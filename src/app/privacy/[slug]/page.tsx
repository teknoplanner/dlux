import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ShieldCheck, ArrowLeft, Mail, ExternalLink } from "lucide-react";
import { apps, developer } from "@/data/apps";
import { Badge } from "@/components/ui/Badge";

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return apps.map((app) => ({
    slug: app.slug,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const app = apps.find((a) => a.slug === params.slug);
  if (!app) return { title: "Privacy Policy Tidak Ditemukan" };

  return {
    title: `Privacy Policy: ${app.name}`,
    description: `Kebijakan Privasi resmi untuk aplikasi Android ${app.name} (${app.packageId}).`,
  };
}

export default function AppPrivacyPage({ params }: PageProps) {
  const app = apps.find((a) => a.slug === params.slug);

  if (!app) {
    notFound();
  }

  const isEducation = app.category === "education";

  return (
    <div className="pt-32 pb-24 relative overflow-hidden bg-[#fafaf9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/privacy"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Kebijakan Privasi Umum
          </Link>

          <Link
            href={`/apps/${app.slug}`}
            className="text-xs text-slate-700 hover:text-slate-900 font-semibold underline flex items-center gap-1"
          >
            Halaman {app.name} &rarr;
          </Link>
        </div>

        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            KEBIJAKAN PRIVASI KHUSUS APLIKASI
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-slate-900">
            Kebijakan Privasi: {app.name}
          </h1>
          <div className="flex items-center justify-center gap-3 text-xs text-slate-500">
            <span>Package ID: <code className="text-slate-700 font-mono">{app.packageId}</code></span>
            <span>•</span>
            <span>Developer: {developer.name}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-display">Ringkasan Privasi</h2>
            <p>
              Halaman ini merupakan kebijakan privasi khusus untuk aplikasi <strong>{app.name}</strong> yang diterbitkan oleh <strong>{developer.name}</strong> di Google Play Store.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant={isEducation ? "cyan" : "purple"}>
                Kategori: {app.category}
              </Badge>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                Rating Usia: {app.contentRating || "3+"}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
                app.hasAds ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
              }`}>
                {app.hasAds ? "Memuat Iklan Ringan" : "Bebas Iklan"}
              </span>
            </div>
          </section>

          {isEducation && (
            <section className="p-6 rounded-2xl bg-sky-50 border border-sky-200 space-y-3">
              <h3 className="text-base font-bold text-sky-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-sky-600" />
                Kepatuhan Khusus Perlindungan Anak (COPPA &amp; Play Families)
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Karena <strong>{app.name}</strong> dirancang untuk kategori edukasi dan anak-anak, kami menyatakan secara tegas bahwa aplikasi ini:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-700">
                <li>Tidak mengumpulkan nama, foto, email, lokasi GPS presisi, atau data pengenal lainnya dari anak-anak.</li>
                <li>Tidak membagikan data kepada pihak ketiga untuk tujuan penargetan perilaku (behavioral targeting).</li>
                <li>Sepenuhnya mematuhi pedoman Google Play Families Policy.</li>
              </ul>
            </section>
          )}

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-display">Penggunaan Izin &amp; Data Lokal</h2>
            <p>
              <strong>{app.name}</strong> menyimpan progres penggunaan (skor, level yang dibuka, atau preferensi pengguna) secara lokal pada perangkat Anda menggunakan mekanisme penyimpanan aman Android. Data ini tidak dikirimkan ke server eksternal kami.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-display">Layanan Pihak Ketiga</h2>
            <p>
              Aplikasi dapat menggunakan layanan Google Play Services untuk mendistribusikan pembaruan atau mencatat laporan kerusakan teknis anonim guna menjamin stabilitas aplikasi.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 font-display">Kontak Pengembang</h2>
            <p>
              Untuk pertanyaan, masukan, atau permintaan seputar privasi untuk aplikasi {app.name}, hubungi kami melalui:
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 inline-flex items-center gap-2 text-slate-900 font-mono text-xs">
                <Mail className="w-4 h-4 text-emerald-600" />
                <span>{developer.email}</span>
              </div>
              <a
                href={app.playUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 inline-flex items-center gap-2 text-slate-800 hover:bg-slate-100 text-xs font-semibold"
              >
                <ExternalLink className="w-4 h-4 text-slate-500" />
                Lihat di Google Play Store
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
