import React from "react";
import Link from "next/link";
import { ArticleItem, getRelatedArticles } from "@/data/articles";
import { apps, developer } from "@/data/apps";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { AppCtaBanner } from "@/components/blog/AppCtaBanner";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { ArticleCover } from "@/components/blog/ArticleCover";
import { FormattedText } from "@/components/blog/FormattedText";
import { StickyLeftAd } from "@/components/blog/StickyLeftAd";
import { AmazonGearShowcase, AmazonInlineCallout } from "@/components/blog/AmazonProductCard";
import { getAmazonProductsByCategory, getAmazonProductsByIds } from "@/data/amazonProducts";
import { generateArticleSchema, generateFaqSchema, generateBreadcrumbSchema } from "@/lib/seo";

const copy = {
  id: {
    home: "Beranda",
    back: "Semua artikel",
    blogPath: "/blog/",
    other: "English version",
    faq: "Pertanyaan yang sering diajukan",
    related: "Panduan lainnya",
    all: "Semua artikel",
    summary: "Ringkasan dalam bahasa Inggris",
    readEn: "Baca versi lengkap dalam bahasa Inggris",
    gear: {
      gaming: ["Aksesoris untuk sesi bermain panjang", "HP yang panas dan jari yang berkeringat sering mengganggu permainan. Ini aksesoris yang bisa membantu."],
      education: ["Aksesoris tablet untuk belajar anak", "Lindungi tablet dari benturan dan bantu anak melatih genggaman dengan aksesoris yang aman."],
      other: ["Aksesoris untuk dokumen dan catatan", "Layar licin menyulitkan tanda tangan PDF. Stylus presisi dan pelindung layar tekstur kertas bisa membantu."],
    },
  },
  en: {
    home: "Home",
    back: "All articles",
    blogPath: "/en/blog/",
    other: "Versi Indonesia",
    faq: "Frequently asked questions",
    related: "More guides",
    all: "All articles",
    summary: "",
    readEn: "",
    gear: {
      gaming: ["Accessories for longer play sessions", "Heat and sweaty fingers often hold gameplay back. These accessories can help."],
      education: ["Tablet accessories for kids learning", "Protect the tablet from drops and help children practice their grip with child-safe accessories."],
      other: ["Accessories for documents and notes", "A slippery screen makes PDF signing hard. A fine-tip stylus and a paper-feel protector can help."],
    },
  },
} as const;

export function ArticleView({ article, lang }: { article: ArticleItem; lang: "id" | "en" }) {
  const isEn = lang === "en";
  const t = copy[lang];
  const title = isEn ? article.titleEn : article.title;
  const description = isEn ? article.metaDescriptionEn : article.metaDescription;
  const readTime = isEn ? article.readTimeEn : article.readTime;
  const sections = isEn ? article.sectionsEn : article.sections;
  const faq = isEn ? article.faqEn : article.faq;
  const slug = isEn ? article.slugEn : article.slug;
  const url = `${developer.website}${isEn ? "/en/blog/" : "/blog/"}${slug}/`;
  const targetApp = apps.find((a) => a.slug === article.targetAppSlug);
  const related = getRelatedArticles(article.slug, 3);
  const date = new Date(article.publishedDate).toLocaleDateString(isEn ? "en-US" : "id-ID", { day: "numeric", month: "long", year: "numeric" });

  const affiliate =
    article.affiliateProductIds?.length
      ? getAmazonProductsByIds(article.affiliateProductIds)
      : article.category === "gaming"
      ? getAmazonProductsByCategory("gaming")
      : article.category === "education"
      ? getAmazonProductsByCategory("kids")
      : article.category === "productivity"
      ? getAmazonProductsByCategory("productivity")
      : [];
  const [gearTitle, gearSub] = t.gear[article.category === "gaming" ? "gaming" : article.category === "education" ? "education" : "other"];

  const articleSchema = generateArticleSchema(article, targetApp, lang);
  const faqSchema = generateFaqSchema(faq);
  const categoryName = article.category.charAt(0).toUpperCase() + article.category.slice(1);
  const breadcrumb = generateBreadcrumbSchema([
    { name: t.home, url: `${developer.website}/` },
    { name: "Blog", url: `${developer.website}${t.blogPath}` },
    { name: categoryName, url: `${developer.website}${t.blogPath}?category=${article.category}` },
    { name: title, url },
  ]);
  const otherHref = isEn ? `/blog/${article.slug}/` : `/en/blog/${article.slugEn}/`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <div className="read-progress" aria-hidden="true" />

      <div className="bg-[#fafaf9] pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 mb-8 text-sm">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-2 text-slate-600">
              <Link href="/" className="inline-flex items-center min-h-[44px] hover:text-slate-950">{t.home}</Link>
              <span aria-hidden="true">/</span>
              <Link href={t.blogPath} className="inline-flex items-center min-h-[44px] hover:text-slate-950">Blog</Link>
              <span aria-hidden="true">/</span>
              <Link
                href={`${t.blogPath}?category=${article.category}`}
                className="inline-flex items-center min-h-[44px] hover:text-slate-950 capitalize font-medium text-emerald-800"
              >
                {article.category}
              </Link>
            </nav>
            <Link href={otherHref} hrefLang={isEn ? "id" : "en"} className="inline-flex items-center min-h-[44px] px-4 rounded-lg border border-slate-300 font-bold text-slate-800 hover:bg-slate-100">
              {t.other}
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row items-start justify-center gap-8 xl:gap-12">
            <StickyLeftAd />
            <article className="min-w-0 max-w-[44rem] flex-1">
              <header>
                <p className="text-sm text-slate-600">
                  <span className="font-bold text-emerald-800 capitalize">{article.category}</span>
                  {" · "}
                  {readTime}
                  {" · "}
                  <time dateTime={article.publishedDate}>{date}</time>
                </p>
                <h1 className="mt-3 font-display font-bold tracking-tight text-slate-950 text-3xl sm:text-5xl leading-[1.1]">{title}</h1>
                <p className="mt-4 text-lg sm:text-xl text-slate-700 leading-relaxed">{description}</p>
                <p className="mt-5 text-sm text-slate-600">{article.author}</p>
              </header>

              <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl bg-slate-100">
                <ArticleCover article={article} />
              </div>

              {!isEn && article.englishSummary && (
                <p className="mt-8 text-slate-700 leading-relaxed">
                  <span className="font-bold text-slate-900">{t.summary}: </span>
                  {article.englishSummary}{" "}
                  <Link href={otherHref} className="font-bold text-emerald-800 underline underline-offset-4">{t.readEn}</Link>
                </p>
              )}

              <div className="lg:hidden mt-8 rounded-xl border border-slate-200 bg-white p-4">
                <TableOfContents sections={sections} lang={lang} hasFaq={Boolean(faq?.length)} />
              </div>

              <div className="mt-10 text-slate-800 text-lg leading-8">
                {sections.map((section, idx) => (
                  <React.Fragment key={section.id}>
                    <section className="mb-12">
                      <h2 id={section.id} className="scroll-mt-28 font-display font-bold text-2xl sm:text-3xl text-slate-950 leading-snug mb-4">
                        {section.title}
                      </h2>
                      {section.content.map((p, i) => (
                        <p key={i} className="mb-5">
                          <FormattedText text={p} />
                        </p>
                      ))}
                      {section.bulletPoints?.length ? (
                        <ul className="list-disc pl-6 space-y-2 marker:text-emerald-700 mb-5">
                          {section.bulletPoints.map((b, i) => (
                            <li key={i}><FormattedText text={b} /></li>
                          ))}
                        </ul>
                      ) : null}
                      {section.tipBox && (
                        <div className={`rounded-xl border p-5 ${section.tipBox.type === "warning" ? "border-amber-300 bg-amber-50" : "border-slate-300 bg-white"}`}>
                          <p className="font-display font-bold text-slate-950">{section.tipBox.title}</p>
                          <p className="mt-1 text-base leading-relaxed text-slate-700">
                            <FormattedText text={section.tipBox.text} />
                          </p>
                        </div>
                      )}
                    </section>
                    {idx === 0 && targetApp && <AppCtaBanner app={targetApp} variant="inline" lang={lang} />}
                    {idx === 1 && affiliate.length > 0 && <AmazonInlineCallout product={affiliate[0]} lang={lang} />}
                    {idx === 1 && related.length > 0 && (
                      <aside className="my-8 rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 not-prose">
                        <p className="font-display font-bold text-sm text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                          {isEn ? "Recommended in this Topic Silo" : "Panduan Rekomendasi Terkait"}
                        </p>
                        <ul className="space-y-2.5">
                          {related.slice(0, 2).map((relArt) => {
                            const relTitle = isEn ? relArt.titleEn : relArt.title;
                            const relSlug = isEn ? relArt.slugEn || relArt.slug : relArt.slug;
                            const relHref = `${isEn ? "/en/blog/" : "/blog/"}${relSlug}/`;
                            return (
                              <li key={relArt.slug} className="flex items-start gap-2 text-base">
                                <span className="text-emerald-700 font-bold shrink-0">→</span>
                                <Link
                                  href={relHref}
                                  className="font-bold text-slate-900 hover:text-emerald-800 underline underline-offset-2 decoration-emerald-400 hover:decoration-emerald-700 transition-colors"
                                >
                                  {relTitle}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </aside>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {affiliate.length > 0 && <AmazonGearShowcase products={affiliate} lang={lang} title={gearTitle} subtitle={gearSub} />}
              {targetApp && <AppCtaBanner app={targetApp} variant="bottom" lang={lang} />}

              {faq && faq.length > 0 && (
                <section id="faq" className="scroll-mt-28 mt-12">
                  <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-950 mb-4">{t.faq}</h2>
                  <div className="divide-y divide-slate-200 border-y border-slate-200">
                    {faq.map((item, i) => (
                      <details key={i} className="group py-1">
                        <summary className="cursor-pointer list-none min-h-[44px] flex items-center justify-between gap-4 py-3 font-bold text-slate-900 text-lg">
                          <span>{item.q}</span>
                          <span aria-hidden="true" className="text-2xl text-slate-500 group-open:rotate-45 transition-transform">+</span>
                        </summary>
                        <p className="pb-4 text-slate-700 text-lg leading-8">
                          <FormattedText text={item.a} />
                        </p>
                      </details>
                    ))}
                  </div>
                </section>
              )}
            </article>

            <aside className="hidden lg:block w-[260px] shrink-0">
              <div className="sticky top-28">
                <TableOfContents sections={sections} lang={lang} hasFaq={Boolean(faq?.length)} />
              </div>
            </aside>
          </div>

          {related.length > 0 && (
            <section className="mt-20 border-t border-slate-200 pt-10">
              <div className="flex items-baseline justify-between gap-4 mb-6">
                <h2 className="font-display font-bold text-2xl text-slate-950">{t.related}</h2>
                <Link href={t.blogPath} className="inline-flex items-center min-h-[44px] text-sm font-bold text-emerald-800 underline underline-offset-4">
                  {t.all}
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((r) => (
                  <ArticleCard key={r.slug} article={r} lang={lang} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

    </>
  );
}
