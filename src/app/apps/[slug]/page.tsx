import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
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
    title: `${app.name} | D Lucky X`,
    description: `${app.tagline} ${app.description}`,
    openGraph: {
      title: `${app.name} | D Lucky X`,
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
  const getCategoryTitle = () => {
    if (app.category === "education") return "Edukasi & Belajar";
    if (app.category === "tool") return "Aplikasi & Utilitas";
    return "Game Android";
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pt-28 pb-20 relative overflow-hidden bg-[#fafaf9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link
              href="/#apps"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Katalog Karya Kami
            </Link>
          </div>

          {/* App Header Box */}
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 shadow-sm mb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden shrink-0 border-2 border-slate-100 shadow-md bg-white">
                <Image
                  src={app.icon}
                  alt={app.name}
                  width={144}
                  height={144}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={app.category === "education" ? "cyan" : app.category === "tool" ? "purple" : "green"} size="md">
                    {getCategoryTitle()}
                  </Badge>
                  {app.contentRating && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      Usia {app.contentRating}
                    </span>
                  )}
                  {app.hasAds ? (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                      Iklan Ringan
                    </span>
                  ) : (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Bebas Iklan
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-slate-900">
                  {app.name}
                </h1>

                <p className="text-base sm:text-lg text-slate-600">
                  {app.tagline}
                </p>

                <div className="flex items-center gap-6 pt-2 text-sm text-slate-500">
                  <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Terverifikasi Aman &amp; Privat</span>
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
                  className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white shadow-sm px-8 py-4 text-base"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Unduh di Google Play
                </Button>
              </div>
            </div>
          </div>

          {/* Screenshot Gallery Section */}
          <div className="mb-14">
            <h2 className="text-2xl font-bold font-display text-slate-900 mb-6">
              Tangkapan Layar Aplikasi
            </h2>
            <ScreenshotCarousel screenshots={app.screenshots} appName={app.name} />
          </div>

          {/* Details & Specs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
            {/* Left 8 cols: Full Description */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                <h3 className="text-xl font-bold font-display text-slate-900 mb-4">
                  Tentang {app.name}
                </h3>
                <p className="text-slate-600 text-base leading-relaxed whitespace-pre-line mb-6">
                  {app.description}
                </p>

                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                  Fitur Unggulan:
                </h4>
                <ul className="space-y-2.5 text-sm text-slate-700">
                  {app.features && app.features.length > 0 ? (
                    app.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Desain responsif dan kontrol intuitif untuk layar sentuh Android.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Performa stabil tanpa lag dan hemat konsumsi baterai.</span>
                      </li>
                    </>
                  )}
                </ul>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="w-4 h-4 text-slate-400 shrink-0" />
                    {app.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4 cols: Technical Specifications */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold font-display text-slate-900 mb-4">
                  Informasi Aplikasi
                </h3>

                <div className="space-y-4 text-sm divide-y divide-slate-100">
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-500">Pengembang</span>
                    <span className="text-slate-900 font-medium">{developer.name}</span>
                  </div>

                  <div className="flex justify-between items-center pt-3">
                    <span className="text-slate-500">Kategori</span>
                    <span className="text-slate-900 font-medium capitalize">{app.category}</span>
                  </div>

                  <div className="flex justify-between items-center pt-3">
                    <span className="text-slate-500">Sistem Operasi</span>
                    <span className="text-slate-900 font-medium flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-slate-600" />
                      Android 6.0+
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-3">
                    <span className="text-slate-500">Rating Usia</span>
                    <span className="text-slate-900 font-medium">{app.contentRating || "3+"}</span>
                  </div>

                  <div className="flex justify-between items-center pt-3">
                    <span className="text-slate-500">Format Iklan</span>
                    <span className="text-slate-900 font-medium">
                      {app.hasAds ? "Iklan Ringan" : "Bebas Iklan"}
                    </span>
                  </div>

                  <div className="pt-4">
                    <a
                      href={app.playUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white shadow-sm transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Lihat di Google Play Store
                    </a>
                  </div>
                </div>
              </div>

              {/* Privacy Link Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h4 className="text-base font-bold text-slate-900">Privasi Pengguna</h4>
                </div>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Kami sangat menghargai privasi Anda dan anak Anda. Pelajari kebijakan penanganan data untuk aplikasi ini.
                </p>
                <Link
                  href={`/privacy/${app.slug}`}
                  className="text-xs font-semibold text-slate-900 hover:underline"
                >
                  Baca Kebijakan Privasi {app.name} &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Related Apps */}
          {relatedApps.length > 0 && (
            <div className="pt-10 border-t border-slate-200">
              <h2 className="text-2xl font-bold font-display text-slate-900 mb-8">
                Karya Terkait Lainnya
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
