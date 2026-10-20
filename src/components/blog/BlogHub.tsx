import React from "react";
import Link from "next/link";
import { articles } from "@/data/articles";
import { developer } from "@/data/apps";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { ArticleList } from "@/components/blog/ArticleList";
import { BlogArt } from "@/components/blog/BlogArt";
import { generateBreadcrumbSchema } from "@/lib/seo";

const copy = {
  id: {
    home: "Beranda",
    h1: "Panduan dan tips untuk game dan aplikasi Android",
    sub: "Artikel tentang mengelola dokumen PDF, bermain game offline, belajar anak, dan mencatat keuangan di Android.",
    latest: "Artikel terbaru",
    path: "/blog/",
  },
  en: {
    home: "Home",
    h1: "Guides and tips for Android games and apps",
    sub: "Articles on offline PDF editing, penalty shootouts, toddler phonics, retro platforming, and private budgeting on Android.",
    latest: "Latest article",
    path: "/en/blog/",
  },
} as const;

export function BlogHub({ lang }: { lang: "id" | "en" }) {
  const t = copy[lang];
  const [first, ...rest] = articles;
  const slim = rest.map(({ slug, slugEn, title, titleEn, metaDescription, metaDescriptionEn, readTime, readTimeEn, publishedDate, category, targetAppSlug, affiliateProductIds }) => ({
    slug, slugEn, title, titleEn, metaDescription, metaDescriptionEn, readTime, readTimeEn, publishedDate, category, targetAppSlug, affiliateProductIds,
  }));
  const itemList = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t.h1,
    url: `${developer.website}${t.path}`,
    inLanguage: lang,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articles.slice(0, 30).map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${developer.website}${lang === "en" ? `/en/blog/${a.slugEn || a.slug}/` : `/blog/${a.slug}/`}`,
        name: lang === "en" ? a.titleEn : a.title,
      })),
    },
  };
  const breadcrumb = generateBreadcrumbSchema([
    { name: t.home, url: `${developer.website}/` },
    { name: "Blog", url: `${developer.website}${t.path}` },
  ]);
  const tab = (active: boolean) =>
    `inline-flex items-center justify-center min-h-[44px] px-4 rounded-lg text-sm font-bold ${
      active ? "bg-slate-900 text-white" : "border border-slate-300 text-slate-800 hover:bg-slate-100"
    }`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <div className="bg-[#fafaf9] pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 mb-10">
            <Link href="/" className="inline-flex items-center min-h-[44px] text-sm font-bold text-slate-700 hover:text-slate-950">
              {t.home}
            </Link>
            <nav aria-label="Language" className="flex gap-2">
              <Link href="/blog/" hrefLang="id" aria-current={lang === "id" ? "page" : undefined} className={tab(lang === "id")}>
                ID
              </Link>
              <Link href="/en/blog/" hrefLang="en" aria-current={lang === "en" ? "page" : undefined} className={tab(lang === "en")}>
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
              <BlogArt />
            </div>
          </header>

          {first && (
            <section aria-labelledby="latest" className="mb-14">
              <h2 id="latest" className="font-display font-bold text-xl text-slate-900 mb-4">
                {t.latest}
              </h2>
              <ArticleCard article={first} featured lang={lang} />
            </section>
          )}

          <ArticleList items={slim} lang={lang} />
        </div>
      </div>
    </>
  );
}
