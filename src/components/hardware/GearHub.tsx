import React from "react";
import Link from "next/link";
import { developer } from "@/data/apps";
import { amazonProducts } from "@/data/amazonProducts";
import { HardwareCatalog } from "@/components/hardware/HardwareCatalog";
import { GearArt } from "@/components/hardware/GearArt";
import { generateBreadcrumbSchema, generateHardwareItemListSchema } from "@/lib/seo";

const copy = {
  id: {
    home: "Beranda",
    h1: "Aksesoris untuk gaming, belajar anak, dan dokumen PDF",
    sub: "Pilihan aksesoris smartphone dan tablet: pendingin HP, sarung jempol, casing tablet anak, dan stylus untuk tanda tangan PDF.",
    path: "/gear/",
  },
  en: {
    home: "Home",
    h1: "Accessories for mobile gaming, kids learning, and PDF work",
    sub: "Phone and tablet accessories we picked: a phone cooler, finger sleeves, a kids tablet case, and a stylus for signing PDFs.",
    path: "/en/gear/",
  },
} as const;

export function GearHub({ lang }: { lang: "id" | "en" }) {
  const t = copy[lang];
  const breadcrumb = generateBreadcrumbSchema([
    { name: t.home, url: `${developer.website}/` },
    { name: "Gear", url: `${developer.website}${t.path}` },
  ]);
  const list = generateHardwareItemListSchema(amazonProducts, lang);
  const tab = (active: boolean) =>
    `inline-flex items-center justify-center min-h-[44px] px-4 rounded-lg text-sm font-bold ${
      active ? "bg-slate-900 text-white" : "border border-slate-300 text-slate-800 hover:bg-slate-100"
    }`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(list) }} />
      <div className="bg-[#fafaf9] pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 mb-10">
            <Link href="/" className="inline-flex items-center min-h-[44px] text-sm font-bold text-slate-700 hover:text-slate-950">
              {t.home}
            </Link>
            <nav aria-label="Language" className="flex gap-2">
              <Link href="/gear/" hrefLang="id" aria-current={lang === "id" ? "page" : undefined} className={tab(lang === "id")}>
                ID
              </Link>
              <Link href="/en/gear/" hrefLang="en" aria-current={lang === "en" ? "page" : undefined} className={tab(lang === "en")}>
                EN
              </Link>
            </nav>
          </div>

          <header className="grid lg:grid-cols-12 gap-8 items-center mb-14">
            <div className="lg:col-span-7">
              <h1 className="font-display font-bold tracking-tight text-slate-950 text-3xl sm:text-5xl leading-[1.1]">{t.h1}</h1>
              <p className="mt-4 max-w-xl text-base sm:text-lg text-slate-700 leading-relaxed">{t.sub}</p>
            </div>
            <div className="lg:col-span-5">
              <GearArt />
            </div>
          </header>

          <HardwareCatalog lang={lang} />
        </div>
      </div>
    </>
  );
}
