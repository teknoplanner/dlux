"use client";

import React from "react";
import Image from "next/image";
import { AmazonProduct } from "@/data/amazonProducts";
import { trackAmazonClick, trackShopeeClick } from "@/lib/analytics";
import { useIsIndonesia } from "@/lib/geo";
import { GearScene, hasGearScene } from "@/components/hardware/GearScene";

type Lang = "en" | "id";

function useBuy(product: AmazonProduct, lang: Lang, source: string) {
  const isIndonesia = useIsIndonesia(lang);
  const isEn = lang === "en";
  const shopee = isIndonesia && Boolean(product.shopeeUrl);
  const name = isEn ? product.nameEn : product.name;
  return {
    name,
    shopee,
    href: shopee ? product.shopeeUrl! : product.url,
    label: shopee ? "Beli di Shopee" : isEn ? "Check price on Amazon" : "Cek harga di Amazon",
    onClick: () => (shopee ? trackShopeeClick(product.id, name, source) : trackAmazonClick(product.id, name, source)),
    btn: shopee ? "bg-[#c2381a] hover:bg-[#a52e14] text-white" : "bg-amber-500 hover:bg-amber-400 text-slate-950",
  };
}

const Thumb: React.FC<{ product: AmazonProduct; name: string; sizes: string }> = ({ product, name, sizes }) =>
  hasGearScene(product.id) ? (
    <GearScene id={product.id} label={name} />
  ) : (
    <Image src={product.image} alt={name} fill className="object-cover" sizes={sizes} />
  );

const btnBase =
  "inline-flex items-center justify-center min-h-[44px] px-4 rounded-lg text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900";

export const AmazonProductCard: React.FC<{ product: AmazonProduct; lang?: Lang }> = ({ product, lang = "en" }) => {
  const isEn = lang === "en";
  const buy = useBuy(product, lang, "gear_showcase");
  const features = isEn ? product.featuresEn : product.features;
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="relative aspect-[16/10] bg-slate-100">
        <Thumb product={product} name={buy.name} sizes="(max-width: 768px) 100vw, 50vw" />
      </div>
      <div className="flex flex-col gap-3 p-5 flex-1">
        <h4 className="font-display font-bold text-lg text-slate-900 leading-snug">{buy.name}</h4>
        <p className="text-sm text-slate-700 leading-relaxed">{isEn ? product.taglineEn : product.tagline}</p>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
          {features.slice(0, 2).map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <a href={buy.href} target="_blank" rel="sponsored noopener noreferrer" onClick={buy.onClick} className={`${btnBase} ${buy.btn} mt-auto`}>
          {buy.label}
        </a>
      </div>
    </article>
  );
};

export const AmazonGearShowcase: React.FC<{ products: AmazonProduct[]; lang?: Lang; title?: string; subtitle?: string }> = ({
  products,
  lang = "en",
  title,
  subtitle,
}) => {
  if (!products?.length) return null;
  const isEn = lang === "en";
  return (
    <section className="my-12">
      <h3 className="font-display font-bold text-2xl text-slate-900">
        {title || (isEn ? "Accessories for longer sessions" : "Aksesoris untuk sesi yang lebih lama")}
      </h3>
      {subtitle && <p className="mt-2 max-w-2xl text-slate-700 leading-relaxed">{subtitle}</p>}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        {products.map((p) => (
          <AmazonProductCard key={p.id} product={p} lang={lang} />
        ))}
      </div>
      <p className="mt-5 text-sm text-slate-600 leading-relaxed">
        {isEn
          ? "If you buy through these links we may earn a commission, at no extra cost to you."
          : "Kami bisa menerima komisi dari pembelian lewat tautan ini, tanpa biaya tambahan untuk Anda."}
      </p>
    </section>
  );
};

export const AmazonInlineCallout: React.FC<{ product: AmazonProduct; lang?: Lang }> = ({ product, lang = "en" }) => {
  const isEn = lang === "en";
  const buy = useBuy(product, lang, "inline_callout");
  return (
    <aside className="my-10 flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-slate-300 bg-white p-4 sm:p-5">
      <div className="relative w-full sm:w-36 aspect-[16/10] shrink-0 overflow-hidden rounded-lg bg-slate-100">
        <Thumb product={product} name={buy.name} sizes="144px" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-bold text-slate-900 leading-snug">{buy.name}</p>
        <p className="mt-1 text-sm text-slate-700 line-clamp-2">{isEn ? product.taglineEn : product.tagline}</p>
      </div>
      <a href={buy.href} target="_blank" rel="sponsored noopener noreferrer" onClick={buy.onClick} className={`${btnBase} ${buy.btn} shrink-0`}>
        {buy.label}
      </a>
    </aside>
  );
};
