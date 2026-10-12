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
  Star,
  LayoutGrid,
  GraduationCap,
  HelpCircle,
  Flame,
  Zap,
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
      label: isEn ? "All Gear" : "Semua Gear",
      count: amazonProducts.length,
      icon: LayoutGrid,
    },
    {
      id: "gaming",
      label: isEn ? "Mobile Gaming" : "Aksesoris Gaming",
      count: amazonProducts.filter((p) => p.category === "gaming").length,
      icon: Gamepad2,
    },
    {
      id: "kids",
      label: isEn ? "Kids & Learning" : "Belajar & Anak",
      count: amazonProducts.filter((p) => p.category === "kids").length,
      icon: GraduationCap,
    },
    {
      id: "productivity",
      label: isEn ? "PDF & Productivity" : "Produktivitas & PDF",
      count: amazonProducts.filter((p) => p.category === "productivity").length,
      icon: PenTool,
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

  const problemSolutions = [
    {
      problemId: "phone-cooler",
      category: "gaming",
      problem: isEn
        ? "Phone runs scorching hot & drops frames after 20 mins of gaming?"
        : "HP cepat panas & layar patah-patah setelah 20 menit bermain game?",
      solution: isEn
        ? "Active Peltier Semiconductor Cooler — Drops temps up to 15°C in seconds."
        : "Kipas Semikonduktor Peltier — Dinginkan suhu instan hingga belasan derajat.",
      icon: Flame,
      color: "border-orange-200 bg-orange-50/50 text-orange-950",
    },
    {
      problemId: "finger-sleeves",
      category: "gaming",
      problem: isEn
        ? "Sweaty fingers causing missed analog swipes and skill aiming errors?"
        : "Jari kesat atau basah keringat sehingga arah analog sering meleset?",
      solution: isEn
        ? "0.3mm Silver Fiber Sleeves — Restores zero-friction screen glide 100%."
        : "Sarung Jempol Serat Perak 0.3mm — Menjaga layar tetap licin & responsif.",
      icon: Zap,
      color: "border-sky-200 bg-sky-50/50 text-sky-950",
    },
    {
      problemId: "capacitive-stylus",
      category: "productivity",
      problem: isEn
        ? "PDF signatures drawn with fingers look clumsy, thick, and illegible?"
        : "Tanda tangan PDF pakai jari tampak tebal, berantakan, atau miring?",
      solution: isEn
        ? "1.5mm Fine Copper Tip Stylus — Precise, ink-like digital signature strokes."
        : "Stylus Pen Presisi 1.5mm — Goresan tanda tangan rapi layaknya pulpen asli.",
      icon: PenTool,
      color: "border-indigo-200 bg-indigo-50/50 text-indigo-950",
    },
    {
      problemId: "kids-case",
      category: "kids",
      problem: isEn
        ? "Worried toddlers will accidentally crack or throw the family tablet?"
        : "Khawatir layar tablet pecah dibanting atau tidak sengaja dijatuhkan anak?",
      solution: isEn
        ? "Heavy-Duty Dense EVA Foam Bumper — Extreme drop & shock absorbing protection."
        : "Casing Busa EVA Tebal — Meredam benturan lantai keras dari segala sudut.",
      icon: ShieldCheck,
      color: "border-emerald-200 bg-emerald-50/50 text-emerald-950",
    },
  ];

  const handleScrollToProduct = (productId: string, category: string) => {
    setActiveCategory("all");
    setTimeout(() => {
      const el = document.getElementById(`gear-${productId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-4", "ring-amber-400");
        setTimeout(() => el.classList.remove("ring-4", "ring-amber-400"), 2000);
      }
    }, 100);
  };

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-stone-100/90 border border-stone-200/90 max-w-3xl mx-auto shadow-2xs">
        {categories.map((cat) => {
          const IconComponent = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                isActive
                  ? "bg-white text-stone-900 shadow-sm border border-stone-200/80"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
              }`}
            >
              <IconComponent
                className={`w-4 h-4 ${
                  isActive ? "text-amber-600" : "text-stone-400"
                }`}
              />
              <span>{cat.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md font-bold ${
                  isActive
                    ? "bg-amber-100 text-amber-900"
                    : "bg-stone-200/80 text-stone-600"
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {filteredProducts.map((product) => {
          const name = isEn ? product.nameEn : product.name;
          const tagline = isEn ? product.taglineEn : product.tagline;
          const badge = isEn ? product.badgeEn : product.badge;
          const features = isEn ? product.featuresEn : product.features;
          const ribbon = isEn ? product.ribbonEn : product.ribbon;
          const editorNote = isEn ? product.editorNoteEn : product.editorNote;

          return (
            <div
              id={`gear-${product.id}`}
              key={product.id}
              className="group rounded-3xl bg-white border border-stone-200/90 p-5 sm:p-6 shadow-xs hover:border-amber-400/80 hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top Highlight Ribbon */}
              {ribbon && (
                <div className="absolute top-4 left-4 z-20 pointer-events-none">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-500 text-stone-950 shadow-md tracking-tight">
                    {ribbon}
                  </span>
                </div>
              )}

              <div className="space-y-4">
                {/* Product Cover Image with Glass Backing */}
                <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-stone-950 border border-stone-200/80 shadow-inner group/img">
                  <Image
                    src={product.image}
                    alt={name}
                    fill
                    className="object-cover group-hover:scale-108 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Bottom Image Gradient Overlay for Badge Contrast */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-stone-950/80 to-transparent pointer-events-none" />

                  {/* Rating Badge on bottom-right of image */}
                  <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-950/85 backdrop-blur-md text-amber-400 text-xs font-bold border border-white/10 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{product.rating ? product.rating.toFixed(1) : "4.8"}</span>
                    {product.reviewsCount && (
                      <span className="text-[10px] text-stone-300 font-normal hidden sm:inline">
                        ({product.reviewsCount})
                      </span>
                    )}
                  </div>
                </div>

                {/* Role Badge + Amazon Label */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-stone-800 bg-stone-100 border border-stone-200/80">
                    {getProductIcon(product.iconType)}
                    <span className="truncate max-w-[170px]">{badge}</span>
                  </span>

                  <span className="inline-flex items-center gap-1 text-xs text-stone-500 font-semibold">
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
                    <span>Amazon</span>
                  </span>
                </div>

                {/* Product Name */}
                <h3 className="text-base sm:text-lg font-bold font-display text-stone-900 group-hover:text-amber-700 transition-colors leading-snug line-clamp-2">
                  {name}
                </h3>

                {/* Concise 1-2 sentence description */}
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-2">
                  {tagline}
                </p>

                {/* Editorial Tester Verdict Callout */}
                {editorNote && (
                  <div className="rounded-xl bg-amber-50/70 border border-amber-200/80 p-3 space-y-1 text-xs text-amber-950">
                    <div className="flex items-center gap-1 font-bold text-amber-800">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{isEn ? "Why we recommend this:" : "Catatan Uji Editorial:"}</span>
                    </div>
                    <p className="text-amber-900/90 leading-relaxed italic">
                      &ldquo;{editorNote}&rdquo;
                    </p>
                  </div>
                )}

                {/* 2 Key Highlights */}
                <ul className="space-y-2 pt-2 border-t border-stone-100">
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

              {/* Action Button: Amazon High-Conversion Vibrant Gold Button */}
              <div className="pt-4 mt-4 border-t border-stone-100 space-y-2">
                <a
                  href={product.url}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  className="w-full inline-flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-xs sm:text-sm transition-all shadow-sm hover:shadow-md active:scale-98 group/btn"
                >
                  <span className="flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 fill-stone-950/20" />
                    <span>{isEn ? "Check Price on Amazon" : "Cek Promo di Amazon"}</span>
                  </span>
                  <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                </a>

                <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono pt-0.5">
                  <span>✓ {isEn ? "Official Listing" : "Tautan Resmi"}</span>
                  <span>{isEn ? "Fast Shipping" : "Garansi Terpercaya"}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Buying Guide: Problem-Solver Grid */}
      <section className="mt-14 rounded-3xl bg-gradient-to-b from-stone-100/90 via-stone-50 to-white border border-stone-200/90 p-6 sm:p-8 md:p-10 space-y-6 shadow-sm">
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300/80">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{isEn ? "Troubleshooting Guide" : "Panduan Cepat Memilih"}</span>
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-display text-stone-900">
            {isEn
              ? "Match Your Device Problem to the Right Hardware"
              : "Cocokkan Masalah Perangkat Anda dengan Solusi Fisik"}
          </h3>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            {isEn
              ? "Software adjustments cannot solve physical device limitations. Select your most annoying issue below to view the verified physical solution:"
              : "Pengaturan game punya batas fisik. Pilih kendala utama yang sering Anda alami di bawah ini untuk melihat solusinya:"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {problemSolutions.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl border ${item.color} flex flex-col justify-between gap-4 transition-all hover:shadow-md`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-white/80 shadow-2xs shrink-0">
                      <IconComponent className="w-5 h-5 text-stone-800" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-500 block">
                        {isEn ? "Physical Issue:" : "Masalah Fisik:"}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-stone-900 leading-snug">
                        {item.problem}
                      </h4>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 pl-11 leading-relaxed">
                    <strong className="text-stone-900">{isEn ? "Recommended Solution: " : "Solusi Rekomendasi: "}</strong>
                    {item.solution}
                  </p>
                </div>

                <div className="pl-11 pt-1">
                  <button
                    onClick={() => handleScrollToProduct(item.problemId, item.category)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 underline underline-offset-4 cursor-pointer"
                  >
                    <span>{isEn ? "Jump to this gear item &rarr;" : "Lihat rekomendasi gear ini &rarr;"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Amazon Associates Editorial Disclosure */}
      <div className="p-5 sm:p-6 rounded-2xl bg-stone-100/80 border border-stone-200/90 text-xs sm:text-sm text-stone-600 leading-relaxed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="space-y-1">
          <p>
            <span className="font-bold text-stone-800">
              {isEn ? "Editorial Transparency Disclosure:" : "Transparansi Afiliasi Amazon:"}
            </span>{" "}
            {isEn
              ? "As an Amazon Associate, D Lucky X earns a small commission from qualifying purchases through our links at no additional cost to you. We only curate gear tested for real-world gaming, child safety, and mobile productivity."
              : "Sebagai Amazon Associate, D Lucky X memperoleh komisi dari pembelian yang memenuhi syarat tanpa biaya tambahan untuk Anda. Kami hanya memilih dan menguji aksesoris yang terbukti handal untuk kenyamanan bermain, keamanan anak, dan produktivitas."}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-mono text-stone-700 shadow-2xs shrink-0 font-bold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verified Amazon Links</span>
        </span>
      </div>
    </div>
  );
};
