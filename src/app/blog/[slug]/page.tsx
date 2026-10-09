import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  ArrowLeft,
  Clock,
  Calendar,
  HelpCircle,
  CheckCircle2,
  Lightbulb,
  Globe2,
} from "lucide-react";
import { articles, getArticleBySlug, getRelatedArticles } from "@/data/articles";
import { apps, developer } from "@/data/apps";
import { Badge } from "@/components/ui/Badge";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { AppCtaBanner } from "@/components/blog/AppCtaBanner";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { LanguageSwitcher } from "@/components/blog/LanguageSwitcher";
import {
  generateArticleSchema,
  generateFaqSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo";

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const article = getArticleBySlug(params.slug);
  if (!article) return { title: "Artikel Tidak Ditemukan" };

  return {
    title: `${article.metaTitle} | D Lucky X`,
    description: article.metaDescription,
    keywords: article.keywords,
    alternates: {
      canonical: `${developer.website}/blog/${article.slug}/`,
      languages: {
        id: `${developer.website}/blog/${article.slug}/`,
        en: `${developer.website}/en/blog/${article.slug}/`,
      },
    },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      images: [{ url: article.coverImage }],
      type: "article",
      publishedTime: article.publishedDate,
      authors: [article.author],
    },
    twitter: {
      card: "summary_large_image",
      title: article.metaTitle,
      description: article.metaDescription,
    },
  };
}

export default function ArticleDetailPage({ params }: PageProps) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const targetApp = apps.find((a) => a.slug === article.targetAppSlug);
  const relatedArticles = getRelatedArticles(article.slug, 3);

  const formattedDate = new Date(article.publishedDate).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const articleSchema = generateArticleSchema(article, targetApp, "id");
  const faqSchema = generateFaqSchema(article.faq);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Beranda", url: `${developer.website}/` },
    { name: "Blog", url: `${developer.website}/blog/` },
    { name: article.title, url: `${developer.website}/blog/${article.slug}/` },
  ]);

  return (
    <>
      {/* Google SEO JSON-LD Injections */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="pt-32 pb-24 relative overflow-hidden bg-[#fafaf9]">
        {/* Ambient Top Glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-gradient-to-b from-indigo-100/30 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          {/* Breadcrumb & Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 border-b border-slate-200/80 pb-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Blog</span>
            </Link>

            <div className="flex items-center gap-2">
              <Link href="/" className="hover:underline">Beranda</Link>
              <span>/</span>
              <Link href="/blog" className="hover:underline">Blog</Link>
              <span>/</span>
              <span className="text-slate-800 font-semibold truncate max-w-[200px]">
                {article.title}
              </span>
            </div>
          </div>

          {/* Bilingual Language Switcher & Non-ID IP Prompt */}
          <LanguageSwitcher currentLang="id" slug={article.slug} />

          {/* Article Header */}
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="purple">
                {article.category.toUpperCase()}
              </Badge>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {article.readTime}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {formattedDate}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-slate-900 leading-tight">
              {article.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              {article.metaDescription}
            </p>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
                  DL
                </div>
                <div>
                  <span className="font-semibold text-slate-900 block leading-tight">{article.author}</span>
                  <span className="text-[11px] text-slate-600 font-mono">Dipublikasikan untuk Pengguna Android</span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Featured Cover Image */}
          {article.coverImage && (
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 shadow-md bg-slate-900">
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
              />
            </div>
          )}

          {/* Bilingual English Quick Summary */}
          {article.englishSummary && (
            <div className="rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50/50 to-slate-50 border border-sky-200/90 p-5 sm:p-6 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sky-900 font-bold text-xs font-mono uppercase tracking-wider">
                  <Globe2 className="w-4 h-4 text-sky-600" />
                  <span>🇬🇧 English Quick Summary (Bilingual Overview)</span>
                </div>
                <Link
                  href={`/en/blog/${article.slug}`}
                  className="text-xs font-bold text-indigo-700 hover:text-indigo-900 underline"
                >
                  Read Full Article in English &rarr;
                </Link>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                &ldquo;{article.englishSummary}&rdquo;
              </p>
            </div>
          )}

          {/* Table of Contents */}
          <TableOfContents sections={article.sections} lang="id" />

          {/* Article Main Body Content */}
          <main className="space-y-10 text-slate-800 text-sm sm:text-base leading-relaxed">
            {article.sections.map((section, idx) => (
              <div key={section.id} className="space-y-4">
                <h2
                  id={section.id}
                  className="text-xl sm:text-2xl font-bold font-display text-slate-900 scroll-mt-28 border-b border-slate-100 pb-2"
                >
                  {section.title}
                </h2>

                <div className="space-y-3.5 text-slate-700">
                  {section.content.map((paragraph, pIdx) => (
                    <p key={pIdx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Optional Bullet Points */}
                {section.bulletPoints && section.bulletPoints.length > 0 && (
                  <ul className="space-y-2 pl-1 pt-1">
                    {section.bulletPoints.map((point, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Optional Tip / Highlight Box */}
                {section.tipBox && (
                  <div
                    className={`p-4 sm:p-5 rounded-2xl border text-xs sm:text-sm leading-relaxed space-y-1.5 my-4 ${
                      section.tipBox.type === "highlight"
                        ? "bg-cyan-50/70 border-cyan-200 text-cyan-950"
                        : section.tipBox.type === "warning"
                        ? "bg-amber-50/70 border-amber-200 text-amber-950"
                        : "bg-indigo-50/70 border-indigo-200 text-indigo-950"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold font-display">
                      <Lightbulb className="w-4 h-4 text-indigo-600" />
                      <span>{section.tipBox.title}</span>
                    </div>
                    <p className="text-slate-700 pl-6">{section.tipBox.text}</p>
                  </div>
                )}

                {/* Mid-Article Inline App CTA (After 2nd Section) */}
                {idx === 1 && targetApp && (
                  <AppCtaBanner app={targetApp} variant="inline" lang="id" />
                )}
              </div>
            ))}
          </main>

          {/* End-Article Main App CTA Banner */}
          {targetApp && (
            <div className="pt-4">
              <AppCtaBanner app={targetApp} variant="bottom" lang="id" />
            </div>
          )}

          {/* FAQ Accordion Section */}
          {article.faq && article.faq.length > 0 && (
            <section id="faq" className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-28">
              <div className="border-b border-slate-100 pb-3 flex items-center gap-2.5">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-bold font-display text-slate-900">
                  Pertanyaan yang Sering Diajukan (FAQ)
                </h2>
              </div>

              <div className="space-y-4">
                {article.faq.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2"
                  >
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      Q: {item.q}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related Articles Grid */}
          {relatedArticles.length > 0 && (
            <section className="pt-8 border-t border-slate-200 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold font-display text-slate-900">
                  Rekomendasi Panduan Lainnya
                </h3>
                <Link
                  href="/blog"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                  Lihat Semua &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((rel) => (
                  <ArticleCard key={rel.slug} article={rel} lang="id" />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
