"use client";

import React, { useMemo, useRef, useState } from "react";
import { ArticleCard, CardArticle } from "@/components/blog/ArticleCard";

const PER_PAGE = 9;
const copy = {
  id: { heading: "Semua artikel", label: "Cari artikel", ph: "Cari judul atau topik", found: "artikel ditemukan", none: "Tidak ada artikel yang cocok. Coba kata kunci lain.", prev: "Sebelumnya", next: "Berikutnya", page: "Halaman", nav: "Halaman artikel" },
  en: { heading: "All articles", label: "Search articles", ph: "Search by title or topic", found: "articles found", none: "No articles match. Try another keyword.", prev: "Previous", next: "Next", page: "Page", nav: "Article pages" },
} as const;

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, " ");

export function ArticleList({ items, lang }: { items: CardArticle[]; lang: "id" | "en" }) {
  const t = copy[lang];
  const isEn = lang === "en";
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const top = useRef<HTMLHeadingElement>(null);

  const index = useMemo(
    () => items.map((a) => norm(`${isEn ? a.titleEn : a.title} ${isEn ? a.metaDescriptionEn : a.metaDescription} ${a.category}`)),
    [items, isEn]
  );
  const terms = norm(q).split(/\s+/).filter(Boolean);
  const matches = terms.length ? items.filter((_, i) => terms.every((w) => index[i].includes(w))) : items;
  const pages = Math.max(1, Math.ceil(matches.length / PER_PAGE));
  const cur = Math.min(page, pages);
  const shown = matches.slice((cur - 1) * PER_PAGE, cur * PER_PAGE);

  const go = (n: number) => {
    setPage(n);
    top.current?.scrollIntoView({ block: "start" });
  };
  // current page plus neighbours, with first and last always reachable
  const nums = Array.from({ length: pages }, (_, i) => i + 1).filter((n) => n === 1 || n === pages || Math.abs(n - cur) <= 1);
  const btn = (on: boolean) =>
    `inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-3 rounded-lg text-sm font-bold ${
      on ? "bg-slate-900 text-white" : "border border-slate-300 text-slate-800 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent"
    }`;

  return (
    <section aria-labelledby="all" className="scroll-mt-24">
      <h2 id="all" ref={top} className="font-display font-bold text-xl text-slate-900 mb-4">
        {t.heading}
      </h2>
      <div className="mb-6 max-w-md">
        <label htmlFor="article-search" className="sr-only">
          {t.label}
        </label>
        <input
          id="article-search"
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder={t.ph}
          className="w-full min-h-[44px] rounded-lg border border-slate-300 bg-white px-4 text-base text-slate-900 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700"
        />
        <p className="mt-2 text-sm text-slate-700" aria-live="polite">
          {matches.length} {t.found}
        </p>
      </div>

      {shown.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shown.map((a) => (
            <ArticleCard key={a.slug} article={a} lang={lang} />
          ))}
        </div>
      ) : (
        <p className="py-10 text-slate-700">{t.none}</p>
      )}

      {pages > 1 && (
        <nav aria-label={t.nav} className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <button type="button" className={btn(false)} disabled={cur === 1} onClick={() => go(cur - 1)}>
            {t.prev}
          </button>
          {nums.map((n, i) => (
            <React.Fragment key={n}>
              {i > 0 && n - nums[i - 1] > 1 && <span aria-hidden="true" className="px-1 text-slate-600">...</span>}
              <button type="button" className={btn(n === cur)} aria-current={n === cur ? "page" : undefined} aria-label={`${t.page} ${n}`} onClick={() => go(n)}>
                {n}
              </button>
            </React.Fragment>
          ))}
          <button type="button" className={btn(false)} disabled={cur === pages} onClick={() => go(cur + 1)}>
            {t.next}
          </button>
        </nav>
      )}
    </section>
  );
}
