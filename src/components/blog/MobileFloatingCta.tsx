"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Play, X, ShoppingBag, ExternalLink, ShieldCheck } from "lucide-react";
import { AppItem } from "@/data/apps";
import { AmazonProduct } from "@/data/amazonProducts";

interface MobileFloatingCtaProps {
  app?: AppItem;
  affiliateProduct?: AmazonProduct;
  lang?: "id" | "en";
}

export const MobileFloatingCta: React.FC<MobileFloatingCtaProps> = ({
  app,
  affiliateProduct,
  lang = "id",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const isEn = lang === "en";

  useEffect(() => {
    if (isDismissed) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const scrollPercent = (scrollY / docHeight) * 100;

      // Show when reader scrolled past 30% and before bottom footer (88%)
      if (scrollPercent > 30 && scrollPercent < 88) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);

  if (isDismissed || !isVisible) return null;

  // Primary: promote app if available
  if (app) {
    return (
      <aside
        aria-label={isEn ? "Quick install app recommendation" : "Rekomendasi pasang aplikasi"}
        className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-40 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
      >
        <div className="flex items-center justify-between gap-3 p-2.5 sm:p-3 rounded-2xl bg-slate-950/95 backdrop-blur-md border border-slate-800 text-white shadow-2xl">
          {/* App Icon + Title */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-slate-900 shadow-xs">
              <Image
                src={app.icon}
                alt={app.name}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800/80">
                  {isEn ? "Free App" : "Aplikasi Gratis"}
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white truncate leading-tight mt-0.5">
                {app.name}
              </h4>
            </div>
          </div>

          {/* Action Button + Dismiss */}
          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={app.playUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{isEn ? "Install Free" : "Pasang Gratis"}</span>
            </a>

            <button
              onClick={() => setIsDismissed(true)}
              aria-label={isEn ? "Dismiss floating banner" : "Tutup banner"}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // Secondary: promote featured Amazon gear if no target app
  if (affiliateProduct) {
    const name = isEn ? affiliateProduct.nameEn : affiliateProduct.name;
    const badge = isEn ? affiliateProduct.badgeEn : affiliateProduct.badge;

    return (
      <aside
        aria-label={isEn ? "Recommended hardware accessory" : "Rekomendasi perangkat aksesoris"}
        className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-40 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
      >
        <div className="flex items-center justify-between gap-3 p-2.5 sm:p-3 rounded-2xl bg-stone-950/95 backdrop-blur-md border border-amber-500/40 text-white shadow-2xl">
          {/* Product Icon + Title */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {affiliateProduct.image && (
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-amber-400/40 shrink-0 bg-stone-900 shadow-xs">
                <Image
                  src={affiliateProduct.image}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-800/80">
                {badge}
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-white truncate leading-tight mt-0.5">
                {name}
              </h4>
            </div>
          </div>

          {/* Action Button + Dismiss */}
          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={affiliateProduct.url}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <ShoppingBag className="w-3 h-3 fill-current" />
              <span>{isEn ? "Check Amazon" : "Cek Promo"}</span>
            </a>

            <button
              onClick={() => setIsDismissed(true)}
              aria-label={isEn ? "Dismiss floating banner" : "Tutup banner"}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    );
  }

  return null;
};
