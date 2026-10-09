import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft, Gamepad2 } from "lucide-react";
import { developer } from "@/data/apps";
import { HardwareCatalog } from "@/components/hardware/HardwareCatalog";
import { generateBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Tested Gear & Accessories | D Lucky X",
  description:
    "Field-tested physical accessories and smartphone gear designed to optimize mobile gaming response, safe kids learning, and paperless PDF workflows.",
  alternates: {
    canonical: `${developer.website}/en/gear/`,
    languages: {
      en: `${developer.website}/en/gear/`,
      id: `${developer.website}/gear/`,
    },
  },
  openGraph: {
    title: "Tested Gear & Accessories | D Lucky X",
    description:
      "Field-tested physical accessories and smartphone gear designed to optimize mobile gaming response, safe kids learning, and paperless PDF workflows.",
    url: `${developer.website}/en/gear/`,
    type: "website",
    images: [{ url: `${developer.website}/images/logo.png`, width: 512, height: 512 }],
  },
};

export default function EnglishGearPage() {
  const breadcrumbLd = generateBreadcrumbSchema([
    { name: "Home", url: `${developer.website}/` },
    { name: "Gear", url: `${developer.website}/en/gear/` },
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
              Back to Home
            </Link>

            <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-medium">
              <Link
                href="/gear"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-slate-600 hover:text-slate-900 transition-all"
              >
                <span>🇮🇩</span>
                <span>Bahasa Indonesia</span>
              </Link>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white text-slate-900 shadow-2xs font-bold">
                <span>🇬🇧</span>
                <span>English</span>
              </span>
            </div>
          </div>

          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-800">
              <Gamepad2 className="w-4 h-4 text-cyan-600" />
              TESTED GEAR • FIELD-TESTED PICKS
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-slate-900 tracking-tight">
              Recommended Gear &amp; Hardware
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              A curated selection of physical accessories tested to prevent device overheating, eliminate sweat friction, safeguard kids&apos; tablets, and bring pen-like digital signatures to PDF editing.
            </p>
          </div>

          {/* Gear Catalog Grid */}
          <HardwareCatalog lang="en" />
        </div>
      </div>
    </>
  );
}
