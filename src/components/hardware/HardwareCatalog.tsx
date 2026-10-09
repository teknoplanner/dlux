"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  Gamepad2,
  Headphones,
  Tablet,
  PenTool,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  Wind,
  ShoppingBag,
} from "lucide-react";
import { amazonProducts, AmazonProduct } from "@/data/amazonProducts";

interface HardwareCatalogProps {
  lang?: "id" | "en";
}

export const HardwareCatalog: React.FC<HardwareCatalogProps> = ({ lang = "id" }) => {
  const [activeCategory, setActiveCategory] = useState<"all" | "gaming" | "kids" | "productivity">("all");
  const isEn = lang === "en";

  const categories = [
    {
      id: "all",
      label: isEn ? "All Items (9)" : "Semua Gear (9)",
    },
    {
      id: "gaming",
      label: isEn ? "Mobile Gaming (4)" : "Aksesoris Gaming (4)",
    },
    {
      id: "kids",
      label: isEn ? "Kids & Learning (3)" : "Belajar & Anak (3)",
    },
    {
      id: "productivity",
      label: isEn ? "PDF & Productivity (2)" : "Produktivitas & PDF (2)",
    },
  ] as const;

  const filteredProducts =
    activeCategory === "all"
      ? amazonProducts
      : amazonProducts.filter((p) => p.category === activeCategory);

  const getProductIcon = (iconType: AmazonProduct["iconType"]) => {
    switch (iconType) {
      case "fan":
        return <Wind className="w-3.5 h-3.5 text-cyan-600" />;
      case "gamepad":
        return <Gamepad2 className="w-3.5 h-3.5 text-indigo-600" />;
      case "headphones":
        return <Headphones className="w-3.5 h-3.5 text-emerald-600" />;
      case "tablet":
        return <Tablet className="w-3.5 h-3.5 text-amber-600" />;
      case "pen":
        return <PenTool className="w-3.5 h-3.5 text-purple-600" />;
      case "shield":
        return <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />;
      case "sparkles":
      default:
        return <Sparkles className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-stone-100/90 border border-stone-200/80 max-w-2xl mx-auto">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              activeCategory === cat.id
                ? "bg-white text-stone-900 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {filteredProducts.map((product) => {
          const name = isEn ? product.nameEn : product.name;
          const tagline = isEn ? product.taglineEn : product.tagline;
          const badge = isEn ? product.badgeEn : product.badge;
          const features = isEn ? product.featuresEn : product.features;

          return (
            <div
              key={product.id}
              className="group rounded-2xl bg-white border border-stone-200 p-5 sm:p-6 shadow-xs hover:border-stone-400/80 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                {/* Product Thematic Cover Image */}
                <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-stone-950 border border-stone-200/80 shadow-xs">
                  <Image
                    src={product.image}
                    alt={name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                {/* Header: Role Badge + Amazon Label */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-stone-700 bg-stone-100 border border-stone-200/60">
                    {getProductIcon(product.iconType)}
                    <span className="truncate max-w-[150px]">{badge}</span>
                  </span>

                  <span className="inline-flex items-center gap-1 text-xs text-stone-500">
                    <ShoppingBag className="w-3.5 h-3.5 text-stone-400" />
                    <span>Amazon</span>
                  </span>
                </div>

                {/* Product Name */}
                <h3 className="text-base sm:text-lg font-bold text-stone-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
                  {name}
                </h3>

                {/* Concise 1-2 sentence description */}
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-2">
                  {tagline}
                </p>

                {/* 2 Key Highlights */}
                <ul className="space-y-1.5 pt-2.5 border-t border-stone-100">
                  {features.slice(0, 2).map((feat, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs sm:text-sm text-stone-700 leading-relaxed"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                <span className="text-[11px] text-stone-400 font-mono hidden sm:inline">
                  {isEn ? "Prime Eligible" : "Tautan Resmi"}
                </span>

                <a
                  href={product.url}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  className="w-full sm:w-auto ml-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs sm:text-sm transition-colors shadow-xs group/btn"
                >
                  <span>{isEn ? "Check on Amazon" : "Lihat di Amazon"}</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Amazon Associates Disclosure */}
      <div className="p-5 rounded-2xl bg-stone-100/70 border border-stone-200/80 text-xs text-stone-500 leading-relaxed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p>
          <span className="font-semibold text-stone-700">
            {isEn ? "Editorial Transparency:" : "Transparansi Afiliasi:"}
          </span>{" "}
          {isEn
            ? "As an Amazon Associate, D Lucky X earns from qualifying purchases at no extra cost to you. We only recommend hardware tested for real-world reliability."
            : "Sebagai Amazon Associate, D Lucky X memperoleh komisi dari pembelian yang memenuhi syarat tanpa biaya tambahan untuk Anda. Kami hanya merekomendasikan perlengkapan yang teruji kualitasnya."}
        </p>
        <span className="text-stone-500 font-mono shrink-0">
          ✓ Verified Amazon Storefront
        </span>
      </div>
    </div>
  );
};
