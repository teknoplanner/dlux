import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  Clock,
  Calendar,
  HelpCircle,
  CheckCircle2,
  Lightbulb,
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
import {
  getAmazonProductsByCategory,
  getAmazonProductsByIds,
} from "@/data/amazonProducts";
import { AmazonGearShowcase } from "@/components/blog/AmazonProductCard";

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slugEn,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const article = getArticleBySlug(params.slug);
  if (!article) return { title: "Article Not Found" };

  return {
    title: `${article.metaTitleEn} | D Lucky X`,
    description: article.metaDescriptionEn,
    keywords: article.keywordsEn,
    alternates: {
      canonical: `${developer.website}/en/blog/${article.slugEn}/`,
      languages: {
        en: `${developer.website}/en/blog/${article.slugEn}/`,
        id: `${developer.website}/blog/${article.slug}/`,
      },
    },
    openGraph: {
      title: article.metaTitleEn,
      description: article.metaDescriptionEn,
      images: [{ url: article.coverImage }],
      type: "article",
      publishedTime: article.publishedDate,
      authors: [article.author],
    },
    twitter: {
      card: "summary_large_image",
      title: article.metaTitleEn,
      description: article.metaDescriptionEn,
      images: [article.coverImage],
    },
  };
}

export default function EnglishArticleDetailPage({ params }: PageProps) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const targetApp = apps.find((a) => a.slug === article.targetAppSlug);
  const relatedArticles = getRelatedArticles(article.slug, 3);

  const formattedDate = new Date(article.publishedDate).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const affiliateProducts =
    article.affiliateProductIds && article.affiliateProductIds.length > 0
      ? getAmazonProductsByIds(article.affiliateProductIds)
      : article.category === "gaming"
      ? getAmazonProductsByCategory("gaming")
      : article.category === "education"
      ? getAmazonProductsByCategory("kids")
      : article.category === "productivity"
      ? getAmazonProductsByCategory("productivity")
      : [];

  const articleSchema = generateArticleSchema(article, targetApp, "en");
  const faqSchema = generateFaqSchema(article.faqEn);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `${developer.website}/` },
    { name: "Blog", url: `${developer.website}/en/blog/` },
    { name: article.titleEn, url: `${developer.website}/en/blog/${article.slugEn}/` },
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

      <div className="pt-28 pb-24 relative overflow-hidden bg-[#fafaf9]">
        {/* Ambient Top Glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-gradient-to-b from-indigo-100/30 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          {/* Bilingual Language Switcher */}
          <LanguageSwitcher currentLang="en" slugId={article.slug} slugEn={article.slugEn} />

          {/* Article Header */}
          <header className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="purple">
                {article.category.toUpperCase()}
              </Badge>
              <span className="inline-flex items-center gap-1.5 text-sm text-slate-500 font-medium font-mono">
                <Clock className="w-4 h-4 text-slate-400" />
                {article.readTimeEn}
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                <Calendar className="w-4 h-4 text-slate-400" />
                {formattedDate}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-slate-900 leading-tight">
              {article.titleEn}
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
              {article.metaDescriptionEn}
            </p>

            <div className="pt-3 flex items-center justify-between text-sm text-slate-500 border-t border-slate-200/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
                  DL
                </div>
                <div>
                  <span className="font-semibold text-slate-900 block leading-tight">{article.author}</span>
                  <span className="text-xs text-slate-500 font-mono">Published</span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Featured Cover Image */}
          {article.coverImage && (
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 shadow-md bg-slate-900">
              <Image
                src={article.coverImage}
                alt={article.titleEn}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
              />
            </div>
          )}

          {/* Table of Contents */}
          <TableOfContents sections={article.sectionsEn} lang="en" />

          {/* Article Main Body Content - Enlarged for Easy Reading */}
          <main className="space-y-12 text-slate-800 text-base sm:text-lg leading-relaxed sm:leading-8">
            {article.sectionsEn.map((section, idx) => (
              <div key={section.id} className="space-y-5">
                <h2
                  id={section.id}
                  className="text-2xl sm:text-3xl font-bold font-display text-slate-900 scroll-mt-28 border-b border-slate-200/70 pb-3"
                >
                  {section.title}
                </h2>

                <div className="space-y-4 text-slate-700">
                  {section.content.map((paragraph, pIdx) => (
                    <p key={pIdx} className="leading-relaxed sm:leading-8 text-base sm:text-lg text-slate-700">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Optional Bullet Points */}
                {section.bulletPoints && section.bulletPoints.length > 0 && (
                  <ul className="space-y-2.5 pl-1 pt-2">
                    {section.bulletPoints.map((point, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-3 text-base sm:text-lg text-slate-700 leading-relaxed">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-1" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Optional Tip / Highlight Box */}
                {section.tipBox && (
                  <div
                    className={`p-5 sm:p-6 rounded-2xl border text-base sm:text-lg leading-relaxed space-y-2 my-6 ${
                      section.tipBox.type === "highlight"
                        ? "bg-cyan-50/70 border-cyan-200 text-cyan-950"
                        : section.tipBox.type === "warning"
                        ? "bg-amber-50/70 border-amber-200 text-amber-950"
                        : "bg-indigo-50/70 border-indigo-200 text-indigo-950"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold font-display">
                      <Lightbulb className="w-5 h-5 text-indigo-600 shrink-0" />
                      <span>{section.tipBox.title}</span>
                    </div>
                    <p className="text-slate-700 pl-7 leading-relaxed">{section.tipBox.text}</p>
                  </div>
                )}

                {/* Mid-Article Inline App CTA (After 2nd Section) */}
                {idx === 1 && targetApp && (
                  <AppCtaBanner app={targetApp} variant="inline" lang="en" />
                )}
              </div>
            ))}
          </main>

          {/* Amazon Affiliate Hardware & Gear Showcase */}
          {affiliateProducts.length > 0 && (
            <AmazonGearShowcase
              products={affiliateProducts}
              lang="en"
              title={
                article.category === "gaming"
                  ? "Tested Hardware & Gear for Mobile Gaming"
                  : article.category === "education"
                  ? "Recommended Tablet Hardware for Kids & Early Learning"
                  : "Tested Tools for Digital Paperwork & Note-Taking"
              }
              subtitle={
                article.category === "gaming"
                  ? "Touchscreen friction, heat buildup, and audio lag often hold gameplay back. These tested physical accessories help keep touch response smooth and prevent thermal throttling."
                  : article.category === "education"
                  ? "Protect screens from accidental drops and help children develop pencil grip coordination with tested, child-safe accessories."
                  : "Eliminate slippery touchscreen friction and sign digital PDFs with pen-like precision using tested universal styluses and paper-feel protectors."
              }
            />
          )}

          {/* End-Article Main App CTA Banner */}
          {targetApp && (
            <div className="pt-4">
              <AppCtaBanner app={targetApp} variant="bottom" lang="en" />
            </div>
          )}

          {/* FAQ Accordion Section */}
          {article.faqEn && article.faqEn.length > 0 && (
            <section id="faq" className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-28">
              <div className="border-b border-slate-100 pb-3 flex items-center gap-2.5">
                <HelpCircle className="w-6 h-6 text-indigo-600" />
                <h2 className="text-2xl font-bold font-display text-slate-900">
                  Frequently Asked Questions (FAQ)
                </h2>
              </div>

              <div className="space-y-4">
                {article.faqEn.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2"
                  >
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      Q: {item.q}
                    </h3>
                    <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
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
                <h3 className="text-2xl font-bold font-display text-slate-900">
                  Related Guides &amp; Articles
                </h3>
                <Link
                  href="/en/blog"
                  className="text-sm font-bold text-indigo-600 hover:text-indigo-800"
                >
                  View All Guides &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((rel) => (
                  <ArticleCard key={rel.slug} article={rel} lang="en" />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
