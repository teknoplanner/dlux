"use client";

import React from "react";
import Image from "next/image";
import { AmazonProduct } from "@/data/amazonProducts";
import { trackAmazonClick, trackShopeeClick } from "@/lib/analytics";
import { useIsIndonesia } from "@/lib/geo";
import { GearScene, hasGearScene } from "@/components/hardware/GearScene";

type Lang = "en" | "id";

// Indonesian pages always lead with Shopee; on /en/ pages the geo lookup can still switch Indonesian visitors to Shopee.
export function useShopeeFirst(product: AmazonProduct, lang: Lang): boolean {
  const isIndonesia = useIsIndonesia(lang);
  return Boolean(product.shopeeUrl) && (lang === "id" || isIndonesia);
}

export const AFFILIATE_REL = "sponsored nofollow noopener";
const secondaryLink = "inline-flex items-center justify-center min-h-[44px] px-2 text-sm font-semibold text-slate-700 underline underline-offset-2 hover:text-slate-900";

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
  const name = isEn ? product.nameEn : product.name;
  const features = isEn ? product.featuresEn : product.features;
  const hasShopee = useShopeeFirst(product, lang);

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="relative aspect-[16/10] bg-slate-100">
        <Thumb product={product} name={name} sizes="(max-width: 768px) 100vw, 50vw" />
      </div>
      <div className="flex flex-col gap-3 p-5 flex-1">
        <h4 className="font-display font-bold text-lg text-slate-900 leading-snug">{name}</h4>
        <p className="text-sm text-slate-700 leading-relaxed">{isEn ? product.taglineEn : product.tagline}</p>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
          {features.slice(0, 2).map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <div className="mt-auto pt-2 flex flex-col sm:flex-row gap-2">
          {hasShopee && (
            <a
              href={product.shopeeUrl}
              target="_blank"
              rel={AFFILIATE_REL}
              onClick={() => trackShopeeClick(product.id, name, "gear_showcase")}
              className={`${btnBase} bg-[#c2381a] hover:bg-[#a52e14] text-white flex-1 text-center`}
            >
              Beli di Shopee
            </a>
          )}
          <a
            href={product.url}
            target="_blank"
            rel={AFFILIATE_REL}
            onClick={() => trackAmazonClick(product.id, name, "gear_showcase")}
            className={hasShopee ? secondaryLink : `${btnBase} bg-amber-500 hover:bg-amber-400 text-slate-950 flex-1 text-center`}
          >
            {hasShopee ? "Cek di Amazon" : isEn ? "Check price on Amazon" : "Cek harga di Amazon"}
          </a>
        </div>
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
  const name = isEn ? product.nameEn : product.name;
  const hasShopee = useShopeeFirst(product, lang);

  return (
    <aside className="my-10 flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-slate-300 bg-white p-4 sm:p-5">
      <div className="relative w-full sm:w-36 aspect-[16/10] shrink-0 overflow-hidden rounded-lg bg-slate-100">
        <Thumb product={product} name={name} sizes="144px" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-bold text-slate-900 leading-snug">{name}</p>
        <p className="mt-1 text-sm text-slate-700 line-clamp-2">{isEn ? product.taglineEn : product.tagline}</p>
      </div>
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
        {hasShopee && (
          <a
            href={product.shopeeUrl}
            target="_blank"
            rel={AFFILIATE_REL}
            onClick={() => trackShopeeClick(product.id, name, "inline_callout")}
            className={`${btnBase} bg-[#c2381a] hover:bg-[#a52e14] text-white`}
          >
            Beli di Shopee
          </a>
        )}
        <a
          href={product.url}
          target="_blank"
          rel={AFFILIATE_REL}
          onClick={() => trackAmazonClick(product.id, name, "inline_callout")}
          className={hasShopee ? secondaryLink : `${btnBase} bg-amber-500 hover:bg-amber-400 text-slate-950`}
        >
          {hasShopee ? "atau Amazon" : isEn ? "Check on Amazon" : "Cek di Amazon"}
        </a>
      </div>
    </aside>
  );
};
