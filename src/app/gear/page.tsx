import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft, Gamepad2 } from "lucide-react";
import { developer } from "@/data/apps";
import { HardwareCatalog } from "@/components/hardware/HardwareCatalog";
import { generateBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Gear & Aksesoris Teruji | D Lucky X",
  description:
    "Koleksi gear fisik dan aksesoris smartphone pilihan yang teruji untuk gaming mobile, belajar anak, dan produktivitas dokumen.",
  alternates: {
    canonical: `${developer.website}/gear/`,
    languages: {
      id: `${developer.website}/gear/`,
      en: `${developer.website}/en/gear/`,
    },
  },
  openGraph: {
    title: "Gear & Aksesoris Teruji | D Lucky X",
    description:
      "Koleksi gear fisik dan aksesoris smartphone pilihan yang teruji untuk gaming mobile, belajar anak, dan produktivitas dokumen.",
    url: `${developer.website}/gear/`,
    type: "website",
    images: [{ url: `${developer.website}/images/logo.png`, width: 512, height: 512 }],
  },
};

export default function GearPage() {
  const breadcrumbLd = generateBreadcrumbSchema([
    { name: "Home", url: `${developer.website}/` },
    { name: "Gear", url: `${developer.website}/gear/` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="pt-32 pb-24 relative overflow-hidden bg-[#fafaf9]">
        {/* Background ambient lighting */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-100/30 via-cyan-100/20 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
          {/* Top Bar: Back & Language Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Beranda
            </Link>

            <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-medium">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white text-slate-900 shadow-2xs font-bold">
                <span>🇮🇩</span>
                <span>Bahasa Indonesia</span>
              </span>
              <Link
                href="/en/gear"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-slate-600 hover:text-slate-900 transition-all"
              >
                <span>🇬🇧</span>
                <span>English</span>
              </Link>
            </div>
          </div>

          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-800">
              <Gamepad2 className="w-4 h-4 text-cyan-600" />
              GEAR TERUJI • FIELD-TESTED
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-slate-900 tracking-tight">
              Gear &amp; Aksesoris Pilihan
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Perlengkapan fisik pilihan yang diuji untuk menjaga suhu ponsel tetap adem, layar licin anti-keringat, tablet anak aman benturan, dan tanda tangan digital presisi.
            </p>
          </div>

          {/* Gear Catalog Grid */}
          <HardwareCatalog lang="id" />
        </div>
      </div>
    </>
  );
}
