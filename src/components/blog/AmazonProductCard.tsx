import React from "react";
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
import { AmazonProduct } from "@/data/amazonProducts";

interface AmazonProductCardProps {
  product: AmazonProduct;
  lang?: "en" | "id";
}

export const AmazonProductCard: React.FC<AmazonProductCardProps> = ({
  product,
  lang = "en",
}) => {
  const isEn = lang === "en";
  const name = isEn ? product.nameEn : product.name;
  const tagline = isEn ? product.taglineEn : product.tagline;
  const badge = isEn ? product.badgeEn : product.badge;
  const features = isEn ? product.featuresEn : product.features;

  const renderIcon = () => {
    switch (product.iconType) {
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
    <div className="group rounded-2xl bg-white border border-stone-200 p-5 sm:p-6 shadow-xs hover:border-stone-400/80 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div className="space-y-3.5">
        {/* Product Thematic Cover Image */}
        {product.image && (
          <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-stone-950 border border-stone-200/80 shadow-xs">
            <Image
              src={product.image}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}

        {/* Subtle Category & Source Label */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-stone-700 bg-stone-100 border border-stone-200/60">
            {renderIcon()}
            <span>{badge}</span>
          </span>

          <span className="inline-flex items-center gap-1 text-xs text-stone-500">
            <ShoppingBag className="w-3.5 h-3.5 text-stone-400" />
            <span>Amazon</span>
          </span>
        </div>

        {/* Product Title */}
        <h4 className="text-base sm:text-lg font-bold text-stone-900 group-hover:text-indigo-600 transition-colors leading-snug">
          {name}
        </h4>

        {/* Product Description */}
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          {tagline}
        </p>

        {/* Key Features */}
        <ul className="space-y-2 pt-3 border-t border-stone-100">
          {features.slice(0, 2).map((feat, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-sm text-stone-700 leading-relaxed"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Footer */}
      <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between gap-3">
        <span className="text-xs text-stone-400 font-mono hidden sm:inline">
          {isEn ? "Amazon Official Listing" : "Tautan Resmi Amazon"}
        </span>

        <a
          href={product.url}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="w-full sm:w-auto ml-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm transition-colors shadow-xs group/btn"
        >
          <span>{isEn ? "Check on Amazon" : "Lihat di Amazon"}</span>
          <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
};

interface AmazonGearShowcaseProps {
  products: AmazonProduct[];
  lang?: "en" | "id";
  title?: string;
  subtitle?: string;
}

export const AmazonGearShowcase: React.FC<AmazonGearShowcaseProps> = ({
  products,
  lang = "en",
  title,
  subtitle,
}) => {
  if (!products || products.length === 0) return null;
  const isEn = lang === "en";

  const defaultTitle = isEn
    ? "Tested Physical Accessories for Extended Sessions"
    : "Perangkat Pendukung Teruji untuk Kenyamanan Maksimal";

  const defaultSubtitle = isEn
    ? "Software settings only go so far. These tested physical accessories help keep touch response smooth, eliminate thermal throttling, and cut audio delay."
    : "Pengaturan game punya batas fisik. Aksesoris teruji ini membantu menjaga sentuhan tetap licin, meredam panas perangkat, dan memangkas delay audio.";

  return (
    <section className="my-10 rounded-2xl bg-stone-50/80 border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Header */}
      <div className="space-y-2 border-b border-stone-200/80 pb-4">
        <span className="text-xs font-semibold tracking-wider uppercase text-stone-500 font-mono block">
          {isEn ? "Recommended Hardware" : "Rekomendasi Perangkat Pendukung"}
        </span>

        <h3 className="text-xl sm:text-2xl font-bold font-display text-stone-900 leading-tight">
          {title || defaultTitle}
        </h3>

        <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl">
          {subtitle || defaultSubtitle}
        </p>
      </div>

      {/* Editorial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {products.map((prod) => (
          <AmazonProductCard key={prod.id} product={prod} lang={lang} />
        ))}
      </div>

      {/* Editorial Disclosure */}
      <div className="pt-4 border-t border-stone-200/70 text-xs text-stone-500 leading-relaxed flex flex-wrap items-center justify-between gap-2">
        <p>
          <span className="font-semibold text-stone-600">
            {isEn ? "Transparency Disclosure:" : "Catatan Transparansi:"}
          </span>{" "}
          {isEn
            ? "When you buy through links on our site, we may earn an affiliate commission at no extra cost to you."
            : "Sebagai Amazon Associate, kami memperoleh komisi dari pembelian yang memenuhi syarat tanpa biaya tambahan untuk Anda."}
        </p>
        <span className="text-stone-400 font-mono">
          {isEn ? "Direct Amazon Storefront" : "Tautan Resmi Toko Amazon"}
        </span>
      </div>
    </section>
  );
};
