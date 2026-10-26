import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { apps, developer } from "@/data/apps";
import { getArticlesByApp } from "@/data/articles";
import { ScreenshotCarousel } from "@/components/app/ScreenshotCarousel";
import { AppCard } from "@/components/app/AppCard";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { generateSoftwareAppSchema, generateBreadcrumbSchema } from "@/lib/seo";

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return apps.map((app) => ({
    slug: app.slug,
  }));
}

// Meta description: tagline plus the first full sentence of the description, cut at a word boundary.
function summary(tagline: string, description: string) {
  const first = description.split(/(?<=[.!?])\s/)[0] ?? "";
  const text = `${tagline} ${first}`.trim();
  if (text.length <= 158) return text;
  return text.slice(0, 155).replace(/\s+\S*$/, "") + "...";
}

export function generateMetadata({ params }: PageProps): Metadata {
  const app = apps.find((a) => a.slug === params.slug);
  if (!app) return { title: "App Not Found" };

  return {
    title: `${app.name} | D Lucky X Android App`,
    description: summary(app.tagline, app.description),
    alternates: {
      canonical: `${developer.website}/apps/${app.slug}/`,
    },
    openGraph: {
      title: `${app.name} | D Lucky X`,
      description: app.tagline,
      url: `${developer.website}/apps/${app.slug}/`,
      siteName: "D Lucky X",
      images: [{ url: `${developer.website}${app.icon}`, alt: app.name, width: 512, height: 512 }],
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${app.name} | D Lucky X`,
      description: app.tagline,
      images: [`${developer.website}${app.icon}`],
    },
  };
}

export default function AppDetailPage({ params }: PageProps) {
  const app = apps.find((a) => a.slug === params.slug);
  if (!app) notFound();

  const jsonLd = generateSoftwareAppSchema(app);
  const breadcrumbLd = generateBreadcrumbSchema([
    { name: "Home", url: `${developer.website}/` },
    { name: "Apps & Games", url: `${developer.website}/#apps` },
    { name: app.name, url: `${developer.website}/apps/${app.slug}/` },
  ]);
  const relatedApps = apps.filter((a) => a.slug !== app.slug).slice(0, 3);
  const appArticles = getArticlesByApp(app.slug);
  const categoryLabel = app.category === "education" ? "Education" : app.category === "tool" ? "Tool" : "Game";

  const facts: [string, string][] = [
    ["Developer", developer.name],
    ["Category", categoryLabel],
    ["Content rating", `Rated ${app.contentRating || "3+"}`],
    ["Ads", app.hasAds ? "Contains ads" : "No ads"],
  ];
  if (app.downloads) facts.splice(1, 0, ["Downloads", app.downloads]);
  if (app.rating) facts.splice(2, 0, ["Play Store rating", `${app.rating.toFixed(1)}${app.reviewsCount ? ` (${app.reviewsCount} reviews)` : ""}`]);

  const playBtn =
    "inline-flex items-center justify-center min-h-[48px] px-7 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="bg-[#fafaf9] pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-600">
            <Link href="/" className="inline-flex items-center min-h-[44px] hover:text-slate-950">Home</Link>
            <span aria-hidden="true" className="mx-2">/</span>
            <Link href="/#apps" className="inline-flex items-center min-h-[44px] hover:text-slate-950">Apps</Link>
          </nav>

          <header className="grid md:grid-cols-[auto_1fr] gap-6 sm:gap-10 items-center pb-12 border-b border-slate-200">
            <div className="hv-float w-28 h-28 sm:w-40 sm:h-40 rounded-[28%] overflow-hidden bg-white shrink-0" style={{ boxShadow: `0 0 0 8px ${app.color}22` }}>
              <Image src={app.icon} alt={`${app.name} icon`} width={160} height={160} priority className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-800">{categoryLabel} for Android</p>
              <h1 className="mt-1 font-display font-bold tracking-tight text-slate-950 text-3xl sm:text-5xl leading-[1.1]">{app.name}</h1>
              <p className="mt-3 max-w-2xl text-lg text-slate-700 leading-relaxed">{app.tagline}</p>
              <p className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-700">
                {app.rating ? <span>Rating <strong className="text-slate-950">{app.rating.toFixed(1)}</strong></span> : null}
                {app.downloads ? <span>Downloads <strong className="text-slate-950">{app.downloads}</strong></span> : null}
                <span>Rated <strong className="text-slate-950">{app.contentRating || "3+"}</strong></span>
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={app.playUrl} target="_blank" rel="noopener noreferrer" className={playBtn}>
                  Get on Google Play
                </a>
              </div>
            </div>
          </header>

          <section aria-labelledby="shots" className="py-12">
            <h2 id="shots" className="font-display font-bold text-2xl text-slate-950 mb-6">Screenshots</h2>
            <ScreenshotCarousel screenshots={app.screenshots} appName={app.name} />
          </section>

          <div className="grid lg:grid-cols-12 gap-12 pb-16">
            <section aria-labelledby="about" className="lg:col-span-8 max-w-3xl">
              <h2 id="about" className="font-display font-bold text-2xl text-slate-950 mb-4">About {app.name}</h2>
              <p className="text-lg text-slate-700 leading-8 whitespace-pre-line">{app.description}</p>

              {app.features?.length > 0 && (
                <>
                  <h3 className="mt-10 font-display font-bold text-xl text-slate-950 mb-3">Features</h3>
                  <ul className="list-disc pl-6 space-y-2 marker:text-emerald-700 text-slate-700 text-lg leading-relaxed">
                    {app.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </>
              )}
            </section>

            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-28 space-y-8">
                <section aria-labelledby="info">
                  <h2 id="info" className="font-display font-bold text-xl text-slate-950 mb-3">App information</h2>
                  <dl className="divide-y divide-slate-200 border-y border-slate-200 text-sm">
                    {facts.map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4 py-3">
                        <dt className="text-slate-600">{k}</dt>
                        <dd className="font-bold text-slate-900 text-right">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <a href={app.playUrl} target="_blank" rel="noopener noreferrer" className={`${playBtn} mt-5 w-full`}>
                    Get on Google Play
                  </a>
                </section>

                <p className="flex flex-wrap gap-x-6 text-sm font-bold">
                  <Link href={`/privacy/${app.slug}/`} className="inline-flex items-center min-h-[44px] text-slate-900 underline underline-offset-4">Privacy Policy</Link>
                  <Link href={`/terms/${app.slug}/`} className="inline-flex items-center min-h-[44px] text-slate-900 underline underline-offset-4">Terms of Service</Link>
                </p>
              </div>
            </aside>
          </div>

          {appArticles.length > 0 && (
            <section aria-labelledby="guides" className="pt-12 border-t border-slate-200">
              <div className="flex items-baseline justify-between gap-4 mb-6">
                <h2 id="guides" className="font-display font-bold text-2xl text-slate-950">Panduan dan tips untuk {app.name}</h2>
                <Link
                  href={`/blog/?category=${app.category === "tool" ? "productivity" : app.category === "education" ? "education" : "gaming"}`}
                  className="inline-flex items-center min-h-[44px] text-sm font-bold text-emerald-800 underline underline-offset-4 shrink-0"
                >
                  Semua artikel {categoryLabel}
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {appArticles.map((a) => (
                  <ArticleCard key={a.slug} article={a} lang="id" />
                ))}
              </div>
            </section>
          )}

          {relatedApps.length > 0 && (
            <section aria-labelledby="more" className="pt-12 mt-12 border-t border-slate-200">
              <h2 id="more" className="font-display font-bold text-2xl text-slate-950 mb-6">More from D Lucky X</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedApps.map((r) => (
                  <AppCard key={r.slug} app={r} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
