"use client";

import React, { useState } from "react";
import Image from "next/image";
import { amazonProducts } from "@/data/amazonProducts";
import { trackAmazonClick, trackShopeeClick } from "@/lib/analytics";
import { useIsIndonesia } from "@/lib/geo";
import { GearScene, hasGearScene } from "@/components/hardware/GearScene";

type Cat = "all" | "gaming" | "kids" | "productivity";

// Problem to product, shown as a short guide under the catalog.
const guide = [
  {
    id: "phone-cooler",
    id_q: "HP cepat panas dan layar patah-patah setelah 20 menit bermain game?",
    id_a: "Pendingin semikonduktor Peltier menahan suhu saat bermain lama.",
    en_q: "Phone runs hot and drops frames after 20 minutes of gaming?",
    en_a: "An active Peltier cooler keeps the temperature down during long sessions.",
  },
  {
    id: "finger-sleeves",
    id_q: "Jari berkeringat sehingga arah analog sering meleset?",
    id_a: "Sarung jempol serat perak 0.3mm menjaga layar tetap licin dan responsif.",
    en_q: "Sweaty fingers cause missed swipes and aiming errors?",
    en_a: "0.3mm silver fiber finger sleeves keep the screen gliding smoothly.",
  },
  {
    id: "capacitive-stylus",
    id_q: "Tanda tangan PDF pakai jari terlihat tebal dan berantakan?",
    id_a: "Stylus presisi 1.5mm menghasilkan goresan tipis dan rapi.",
    en_q: "PDF signatures drawn with a finger look thick and messy?",
    en_a: "A 1.5mm fine-tip stylus gives thin, clean strokes.",
  },
  {
    id: "kids-case",
    id_q: "Khawatir layar tablet pecah saat dijatuhkan anak?",
    id_a: "Casing busa EVA tebal meredam benturan dari segala sudut.",
    en_q: "Worried a toddler will crack the family tablet?",
    en_a: "A thick EVA foam case absorbs drops from every angle.",
  },
];

export const HardwareCatalog: React.FC<{ lang?: "id" | "en" }> = ({ lang = "id" }) => {
  const [active, setActive] = useState<Cat>("all");
  const isEn = lang === "en";
  const isIndonesia = useIsIndonesia(lang);

  const tabs: [Cat, string][] = [
    ["all", isEn ? "All" : "Semua"],
    ["gaming", isEn ? "Mobile gaming" : "Gaming"],
    ["kids", isEn ? "Kids and learning" : "Belajar dan anak"],
    ["productivity", isEn ? "PDF and productivity" : "Produktivitas dan PDF"],
  ];
  const count = (c: Cat) => (c === "all" ? amazonProducts.length : amazonProducts.filter((p) => p.category === c).length);
  const products = active === "all" ? amazonProducts : amazonProducts.filter((p) => p.category === active);

  const jump = (id: string) => {
    setActive("all");
    setTimeout(() => document.getElementById(`gear-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
  };

  return (
    <div className="space-y-16">
      <section aria-label={isEn ? "Gear catalog" : "Katalog gear"}>
        <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label={isEn ? "Filter by category" : "Filter kategori"}>
          {tabs.map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={active === key}
              onClick={() => setActive(key)}
              className={`min-h-[44px] px-4 rounded-lg text-sm font-bold border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
                active === key ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-800 border-slate-300 hover:bg-slate-100"
              }`}
            >
              {label} ({count(key)})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => {
            const name = isEn ? p.nameEn : p.name;
            const note = isEn ? p.editorNoteEn : p.editorNote;
            const ribbon = isEn ? p.ribbonEn : p.ribbon;
            const features = isEn ? p.featuresEn : p.features;
            const shopee = isIndonesia && Boolean(p.shopeeUrl);
            return (
              <article id={`gear-${p.id}`} key={p.id} className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white scroll-mt-28">
                <div className="relative aspect-[16/10] bg-slate-100">
                  {hasGearScene(p.id) ? (
                    <GearScene id={p.id} label={name} />
                  ) : (
                    <Image src={p.image} alt={name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                  )}
                </div>
                <div className="flex flex-col gap-3 p-5 flex-1">
                  {ribbon && <p className="text-xs font-bold text-amber-800">{ribbon}</p>}
                  <h3 className="font-display font-bold text-lg text-slate-900 leading-snug">{name}</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">{isEn ? p.taglineEn : p.tagline}</p>
                  <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                    {features.slice(0, 2).map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  {note && <p className="text-sm text-slate-600 italic">&ldquo;{note}&rdquo;</p>}
                  {p.rating && (
                    <p className="text-xs text-slate-600">
                      {isEn ? "Rating" : "Rating"} {p.rating.toFixed(1)}
                      {p.reviewsCount ? ` (${p.reviewsCount})` : ""}
                    </p>
                  )}
                  <div className="mt-auto pt-3 space-y-2">
                    <a
                      href={shopee ? p.shopeeUrl! : p.url}
                      target="_blank"
                      rel="sponsored noopener noreferrer"
                      onClick={() => (shopee ? trackShopeeClick(p.id, name, "hardware_catalog") : trackAmazonClick(p.id, name, "hardware_catalog"))}
                      className={`flex items-center justify-center min-h-[44px] rounded-lg px-4 text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
                        shopee ? "bg-[#c2381a] hover:bg-[#a52e14] text-white" : "bg-amber-500 hover:bg-amber-400 text-slate-950"
                      }`}
                    >
                      {shopee ? "Beli di Shopee" : isEn ? "Check price on Amazon" : "Cek harga di Amazon"}
                    </a>
                    {shopee && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="sponsored noopener noreferrer"
                        onClick={() => trackAmazonClick(p.id, name, "hardware_catalog_secondary")}
                        className="block text-center text-xs text-slate-600 underline underline-offset-4 py-2"
                      >
                        Amazon (internasional)
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="guide">
        <h2 id="guide" className="font-display font-bold text-2xl text-slate-900 mb-6">
          {isEn ? "Match the problem to the gear" : "Cocokkan masalah dengan gear"}
        </h2>
        <ul className="grid md:grid-cols-2 gap-x-10 gap-y-6">
          {guide.map((g) => (
            <li key={g.id}>
              <h3 className="font-bold text-slate-900">{isEn ? g.en_q : g.id_q}</h3>
              <p className="mt-1 text-slate-700">{isEn ? g.en_a : g.id_a}</p>
              <button type="button" onClick={() => jump(g.id)} className="mt-1 min-h-[44px] text-sm font-bold text-emerald-800 underline underline-offset-4">
                {isEn ? "See this item" : "Lihat produknya"}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
        {isEn
          ? "As an Amazon Associate, D Lucky X earns a commission from qualifying purchases through our links, at no extra cost to you."
          : isIndonesia
          ? "D Lucky X ikut program afiliasi Shopee dan Amazon, jadi kami menerima komisi dari pembelian lewat tautan di halaman ini tanpa biaya tambahan untuk Anda."
          : "Sebagai Amazon Associate, D Lucky X menerima komisi dari pembelian yang memenuhi syarat lewat tautan kami, tanpa biaya tambahan untuk Anda."}
      </p>
    </div>
  );
};
