import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ShieldCheck, ArrowLeft, Mail, ExternalLink } from "lucide-react";
import { apps, developer } from "@/data/apps";
import { GlassCard } from "@/components/ui/GlassCard";
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
    <div className="pt-32 pb-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/privacy"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Kebijakan Privasi Umum
          </Link>

          <Link
            href={`/apps/${app.slug}`}
            className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
          >
            Halaman Game {app.name} &rarr;
          </Link>
        </div>

        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-300">
            <ShieldCheck className="w-4 h-4" />
            KEBIJAKAN PRIVASI KHUSUS APLIKASI
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white">
            Kebijakan Privasi: {app.name}
          </h1>
          <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
            <span>Package ID: <code className="text-cyan-300 font-mono">{app.packageId}</code></span>
            <span>•</span>
            <span>Developer: {developer.name}</span>
          </div>
        </div>

        <GlassCard className="p-8 sm:p-12 space-y-8 text-gray-300 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white font-display">Ringkasan Privasi</h2>
            <p>
              Halaman ini merupakan kebijakan privasi khusus untuk aplikasi <strong>{app.name}</strong> yang diterbitkan oleh <strong>{developer.name}</strong> di Google Play Store.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant={isEducation ? "cyan" : "purple"}>
                Kategori: {app.category}
              </Badge>
              <Badge variant="outline">
                Rating Konten: {app.contentRating || "3+"}
              </Badge>
              <Badge variant={app.hasAds ? "amber" : "green"}>
                {app.hasAds ? "Memuat Iklan Terverifikasi" : "Bebas Iklan"}
              </Badge>
            </div>
          </section>

          {isEducation && (
            <section className="p-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-3">
              <h3 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                Kepatuhan Khusus Perlindungan Anak (COPPA &amp; Play Families)
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Karena <strong>{app.name}</strong> dirancang untuk kategori edukasi dan anak-anak, kami menyatakan secara tegas bahwa aplikasi ini:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-gray-300">
                <li>Tidak mengumpulkan nama, foto, email, lokasi GPS presisi, atau data pengenal lainnya dari anak-anak.</li>
                <li>Tidak membagikan data kepada pihak ketiga untuk tujuan penargetan perilaku (behavioral targeting).</li>
                <li>Sepenuhnya mematuhi pedoman Google Play Families Policy.</li>
              </ul>
            </section>
          )}

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white font-display">Penggunaan Izin &amp; Data Lokal</h2>
            <p>
              <strong>{app.name}</strong> menyimpan progres permainan (skor, level yang dibuka, dan pengaturan suara) secara lokal pada perangkat Anda menggunakan mekanisme penyimpanan aman Android. Data ini tidak dikirimkan ke server eksternal kami.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white font-display">Layanan Pihak Ketiga</h2>
            <p>
              Aplikasi dapat menggunakan layanan Google Play Services untuk mendistribusikan pembaruan atau mencatat laporan kerusakan teknis anonim guna menjamin stabilitas permainan.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-white/10">
            <h2 className="text-xl font-bold text-white font-display">Kontak Pengembang</h2>
            <p>
              Untuk pertanyaan, keluhan, atau permintaan seputar privasi untuk aplikasi {app.name}, hubungi kami melalui:
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 inline-flex items-center gap-2 text-cyan-300 font-mono text-xs">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>{developer.email}</span>
              </div>
              <a
                href={app.playUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-white/5 border border-white/10 inline-flex items-center gap-2 text-gray-300 hover:text-white text-xs font-semibold"
              >
                <ExternalLink className="w-4 h-4 text-cyan-400" />
                Lihat di Google Play Store
              </a>
            </div>
          </section>
        </GlassCard>
      </div>
    </div>
  );
}
