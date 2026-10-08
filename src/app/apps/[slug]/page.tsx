import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  Star,
  Download,
  Play,
  ArrowLeft,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  Tag,
  CheckCircle2,
} from "lucide-react";
import { apps, developer } from "@/data/apps";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import { ScreenshotCarousel } from "@/components/app/ScreenshotCarousel";
import { AppCard } from "@/components/app/AppCard";
import { generateSoftwareAppSchema } from "@/lib/seo";

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
  if (!app) return { title: "Aplikasi Tidak Ditemukan" };

  return {
    title: `${app.name} — Unduh di Google Play`,
    description: `${app.tagline} ${app.description}`,
    openGraph: {
      title: `${app.name} — D Lucky X`,
      description: app.tagline,
      images: [{ url: app.icon }],
    },
  };
}

export default function AppDetailPage({ params }: PageProps) {
  const app = apps.find((a) => a.slug === params.slug);

  if (!app) {
    notFound();
  }

  const jsonLd = generateSoftwareAppSchema(app);
  const relatedApps = apps.filter((a) => a.slug !== app.slug).slice(0, 3);
  const isEducation = app.category === "education";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pt-28 pb-20 relative overflow-hidden">
        {/* Dynamic Glow Background based on app color */}
        <div
          className="absolute top-20 left-1/2 -translate-x-1/2 w-3/4 h-80 rounded-full blur-[140px] pointer-events-none opacity-25"
          style={{ backgroundColor: app.color }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link
              href="/#apps"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Semua Game
            </Link>
          </div>

          {/* App Header Box */}
          <div className="rounded-3xl bg-white/[0.04] border border-white/10 p-6 sm:p-10 backdrop-blur-2xl shadow-2xl mb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8">
              <div
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl p-1 shrink-0 shadow-2xl"
                style={{
                  background: `linear-gradient(135deg, ${app.color}, #0b0b18)`,
                  boxShadow: `0 12px 30px -10px ${app.color}60`,
                }}
              >
                <Image
                  src={app.icon}
                  alt={app.name}
                  width={144}
                  height={144}
                  className="w-full h-full rounded-[22px] object-cover"
                  priority
                />
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={isEducation ? "cyan" : "purple"} size="md">
                    {isEducation ? "Edukasi & Belajar" : "Game Android"}
                  </Badge>
                  {app.contentRating && (
                    <Badge variant="outline" size="md">
                      {app.contentRating} Usia
                    </Badge>
                  )}
                  {app.hasAds ? (
                    <Badge variant="amber" size="md">
                      Berisi Iklan
                    </Badge>
                  ) : (
                    <Badge variant="green" size="md">
                      Bebas Iklan
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white">
                  {app.name}
                </h1>

                <p className="text-base sm:text-lg text-gray-300">
                  {app.tagline}
                </p>

                {/* Rating & Downloads Bar */}
                <div className="flex items-center gap-6 pt-2 text-sm text-gray-300">
                  {app.rating && (
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                      <Star className="w-5 h-5 fill-amber-400" />
                      <span className="text-base">{app.rating.toFixed(1)}</span>
                      <span className="text-xs text-muted font-normal">/ 5.0</span>
                    </div>
                  )}

                  {app.downloads && (
                    <div className="flex items-center gap-1.5 font-semibold text-cyan-300">
                      <Download className="w-4 h-4" />
                      <span>{app.downloads} Unduhan</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-green-400 font-medium">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Terverifikasi Aman</span>
                  </div>
                </div>
              </div>

              {/* Install Button Header */}
              <div className="w-full md:w-auto shrink-0 pt-4 md:pt-0">
                <Button
                  href={app.playUrl}
                  external
                  variant="primary"
                  size="lg"
                  className="w-full md:w-auto shadow-purple-600/30 px-8 py-4 text-base"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Install di Google Play
                </Button>
              </div>
            </div>
          </div>

          {/* Screenshot Gallery Section */}
          <div className="mb-14">
            <h2 className="text-2xl font-bold font-display text-white mb-6">
              Screenshot &amp; Tampilan Gameplay
            </h2>
            <ScreenshotCarousel screenshots={app.screenshots} appName={app.name} />
          </div>

          {/* Details & Specs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
            {/* Left 8 cols: Full Description */}
            <div className="lg:col-span-8 space-y-6">
              <GlassCard className="p-8">
                <h3 className="text-xl font-bold font-display text-white mb-4">
                  Tentang {app.name}
                </h3>
                <p className="text-gray-300 text-base leading-relaxed whitespace-pre-line mb-6">
                  {app.description}
                </p>

                <h4 className="text-sm font-semibold uppercase tracking-wider text-cyan-300 mb-3">
                  Fitur Utama:
                </h4>
                <ul className="space-y-2.5 text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                    <span>Gameplay responsif dan kontrol intuitif untuk layar sentuh Android.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                    <span>Grafis HD cerah dengan performa stabil 60 FPS tanpa lag.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                    <span>Ukuran file ringan, hemat memori penyimpanan dan kuota data.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                    <span>Dukungan mode bermain offline tanpa ketergantungan koneksi internet.</span>
                  </li>
                </ul>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="w-4 h-4 text-muted shrink-0" />
                    {app.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Right 4 cols: Technical Specifications */}
            <div className="lg:col-span-4 space-y-6">
              <GlassCard className="p-6">
                <h3 className="text-lg font-bold font-display text-white mb-4">
                  Informasi Aplikasi
                </h3>

                <div className="space-y-4 text-sm divide-y divide-white/5">
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-muted">Package ID</span>
                    <span className="font-mono text-xs text-cyan-300 truncate max-w-[180px]">
                      {app.packageId}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-3">
                    <span className="text-muted">Developer</span>
                    <span className="text-white font-medium">{developer.name}</span>
                  </div>

                  <div className="flex justify-between items-center pt-3">
                    <span className="text-muted">Kategori</span>
                    <span className="text-white font-medium capitalize">{app.category}</span>
                  </div>

                  <div className="flex justify-between items-center pt-3">
                    <span className="text-muted">Sistem Operasi</span>
                    <span className="text-white font-medium flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                      Android 6.0+
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-3">
                    <span className="text-muted">Rating Konten</span>
                    <span className="text-white font-medium">{app.contentRating || "3+"}</span>
                  </div>

                  <div className="flex justify-between items-center pt-3">
                    <span className="text-muted">Iklan</span>
                    <span className="text-white font-medium">
                      {app.hasAds ? "Berisi Iklan" : "Tidak Ada Iklan"}
                    </span>
                  </div>

                  <div className="pt-4">
                    <a
                      href={app.playUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cyan-300 hover:text-white transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Buka di Google Play Console
                    </a>
                  </div>
                </div>
              </GlassCard>

              {/* Privacy Link Card */}
              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck className="w-5 h-5 text-pink-400" />
                  <h4 className="text-base font-bold text-white">Privasi Pengguna</h4>
                </div>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  Kami sangat menghargai privasi Anda dan anak Anda. Pelajari kebijakan penanganan data untuk aplikasi ini.
                </p>
                <Link
                  href={`/privacy/${app.slug}`}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 underline"
                >
                  Baca Kebijakan Privasi {app.name} &rarr;
                </Link>
              </GlassCard>
            </div>
          </div>

          {/* Related Apps */}
          {relatedApps.length > 0 && (
            <div className="pt-10 border-t border-white/10">
              <h2 className="text-2xl font-bold font-display text-white mb-8">
                Game &amp; Aplikasi Terkait Lainnya
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedApps.map((related) => (
                  <AppCard key={related.slug} app={related} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
