import React from "react";
import { getBuyingGuides } from "@/data/articles";
import { ArticleCard } from "@/components/blog/ArticleCard";

export function BuyingGuides({ lang, className = "" }: { lang: "id" | "en"; className?: string }) {
  const guides = getBuyingGuides();
  if (!guides.length) return null;
  return (
    <section aria-labelledby="buying-guides" className={className}>
      <h2 id="buying-guides" className="font-display font-bold text-xl sm:text-2xl text-slate-900 mb-4">
        {lang === "en" ? "Best Buying Guides" : "Panduan Beli Terbaik"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((a) => (
          <ArticleCard key={a.slug} article={a} lang={lang} />
        ))}
      </div>
    </section>
  );
}
