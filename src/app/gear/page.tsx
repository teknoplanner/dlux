import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  ArrowLeft,
  Sparkles,
  Gamepad2,
  GraduationCap,
  PenTool,
  ShieldCheck,
  CheckCircle2,
  Flame,
  Globe,
  Languages,
} from "lucide-react";
import { developer } from "@/data/apps";
import { amazonProducts } from "@/data/amazonProducts";
import { HardwareCatalog } from "@/components/hardware/HardwareCatalog";
import {
  generateBreadcrumbSchema,
  generateHardwareItemListSchema,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: "Gear & Aksesoris Fisik Teruji | D Lucky X",
  description:
    "Koleksi gear fisik dan aksesoris smartphone pilihan yang teruji untuk gaming mobile tanpa throttling, proteksi tablet anak, dan tanda tangan PDF presisi.",
  alternates: {
    canonical: `${developer.website}/gear/`,
    languages: {
      id: `${developer.website}/gear/`,
      en: `${developer.website}/en/gear/`,
    },
  },
  openGraph: {
    title: "Gear & Aksesoris Fisik Teruji | D Lucky X",
    description:
      "Koleksi gear fisik dan aksesoris smartphone pilihan yang teruji untuk gaming mobile tanpa throttling, proteksi tablet anak, dan tanda tangan PDF presisi.",
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
  const hardwareItemListLd = generateHardwareItemListSchema(amazonProducts, "id");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hardwareItemListLd) }}
      />
      <div className="pt-20 sm:pt-24 md:pt-28 pb-20 sm:pb-24 relative overflow-hidden bg-[#fafaf9]">
        {/* Background ambient lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-gradient-to-b from-amber-100/30 via-cyan-100/20 to-transparent blur-3xl pointer-events-none select-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 sm:space-y-12">
          {/* Top Bar: Back & Language Switcher with Lucide Icons */}
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-stone-200/70">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-stone-600 hover:text-stone-950 transition-colors shrink-0 group"
            >
              <ArrowLeft className="w-4 h-4 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Kembali ke Beranda</span>
              <span className="sm:hidden">Beranda</span>
            </Link>

            <div className="inline-flex items-center p-1 rounded-xl bg-stone-100 border border-stone-200 text-xs font-semibold shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white text-stone-900 shadow-2xs font-bold">
                <Globe className="w-3.5 h-3.5 text-stone-700" />
                <span className="hidden sm:inline">Bahasa Indonesia</span>
                <span className="sm:hidden">ID</span>
              </span>
              <Link
                href="/en/gear"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-stone-600 hover:text-stone-900 transition-all font-medium"
              >
                <Languages className="w-3.5 h-3.5 text-stone-400" />
                <span className="hidden sm:inline">English</span>
                <span className="sm:hidden">EN</span>
              </Link>
            </div>
          </div>

          {/* Page Hero Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300/80 text-xs font-bold text-amber-900 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>D LUCKY X HARDWARE LAB • TERUJI LAPANGAN</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-stone-950 tracking-tight leading-tight">
              Aksesoris Fisik Teruji untuk Gaming, Belajar, &amp; Dokumen
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
              Software optimal punya batas fisik. Kami menguji aksesoris smartphone &amp; tablet pilihan untuk mencegah thermal throttling, menjaga sentuhan jari tetap licin anti-keringat, memproteksi tablet anak, dan memastikan tanda tangan PDF presisi.
            </p>

            {/* Trust Points Badges with Lucide Icons */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 text-xs font-bold text-stone-700">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-100 border border-stone-200/80">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Verified Amazon Store</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-100 border border-stone-200/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Diuji Langsung di Perangkat</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-100 border border-stone-200/80">
                <Flame className="w-3.5 h-3.5 text-orange-600" />
                <span>Bebas Panas &amp; Lag</span>
              </span>
            </div>
          </div>

          {/* 3 Pillar Cards Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2 hover:border-cyan-300 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-cyan-100 border border-cyan-200/80 flex items-center justify-center text-cyan-700">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-stone-900">
                Mobile Gaming Anti-Panas
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Cooler Peltier aktif &amp; sarung jempol perak untuk menjaga suhu dingin serta refleks sentuhan layar tanpa hambatan keringat.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2 hover:border-purple-300 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-200/80 flex items-center justify-center text-purple-700">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-stone-900">
                Belajar Anak &amp; Proteksi Ekstrem
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Casing busa EVA tebal tahan banting dan stylus ergonomis yang aman melatih koordinasi motorik genggaman tangan balita.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2 hover:border-emerald-300 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-200/80 flex items-center justify-center text-emerald-700">
                <PenTool className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-stone-900">
                Produktivitas &amp; Dokumen PDF
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Stylus presisi 1.5mm &amp; pelindung layar matte tekstur kertas untuk tanda tangan kontrak digital dan review dokumen bebas silau.
              </p>
            </div>
          </div>

          {/* Gear Catalog Grid */}
          <HardwareCatalog lang="id" />
        </div>
      </div>
    </>
  );
}
