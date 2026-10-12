import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft, BookOpen, Sparkles, Compass, Globe, Languages } from "lucide-react";
import { articles } from "@/data/articles";
import { developer } from "@/data/apps";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { generateBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Android Apps & Games Blog | Guides & Tips | D Lucky X",
  description:
    "Explore actionable guides on offline PDF editing, penalty shootout techniques, toddler phonics learning, retro 2D platforming, and private feline budgeting from D Lucky X.",
  alternates: {
    canonical: `${developer.website}/en/blog/`,
    languages: {
      en: `${developer.website}/en/blog/`,
      id: `${developer.website}/blog/`,
    },
  },
  openGraph: {
    title: "Android Apps & Games Blog | Guides & Tips | D Lucky X",
    description:
      "Explore actionable guides on offline PDF editing, penalty shootout techniques, toddler phonics learning, retro 2D platforming, and private feline budgeting from D Lucky X.",
    url: `${developer.website}/en/blog/`,
    type: "website",
    images: [{ url: `${developer.website}/images/logo.png`, width: 512, height: 512 }],
  },
};

export default function EnglishBlogHubPage() {
  const [featuredArticle, ...otherArticles] = articles;
  const breadcrumbLd = generateBreadcrumbSchema([
    { name: "Home", url: `${developer.website}/` },
    { name: "Blog (EN)", url: `${developer.website}/en/blog/` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="pt-20 sm:pt-24 md:pt-28 pb-20 sm:pb-24 relative overflow-hidden bg-[#fafaf9]">
      {/* Background ambient lighting */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-100/40 via-cyan-100/20 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-10 md:space-y-12">
        {/* Navigation & Language switch */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200/60">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden font-medium">Home</span>
          </Link>

          {/* Hub Language Switcher */}
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-medium shrink-0">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-slate-600 hover:text-slate-900 transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Bahasa Indonesia</span>
              <span className="sm:hidden font-semibold">ID</span>
            </Link>
            <Link
              href="/en/blog"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-white text-slate-900 shadow-2xs font-bold transition-all"
            >
              <Languages className="w-3.5 h-3.5 text-slate-700" />
              <span className="hidden sm:inline">English</span>
              <span className="sm:hidden font-semibold">EN</span>
            </Link>
          </div>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800">
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
            OFFICIAL ARTICLES &amp; GUIDES
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-display text-slate-900 tracking-tight leading-tight">
            Expert Insights, Gameplay Guides &amp; Mobile Tips
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Discover practical guides for offline document productivity, penalty soccer shootouts, playful toddler phonics, retro cat speedruns, and confidential budget management on Android.
          </p>
        </div>

        {/* Featured Article Spotlight */}
        {featuredArticle && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Weekly Editor&apos;s Spotlight</span>
            </div>
            <ArticleCard article={featuredArticle} featured lang="en" />
          </div>
        )}

        {/* All Articles Grid */}
        <div className="space-y-6 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold font-display text-base sm:text-lg">
              <Compass className="w-5 h-5 text-indigo-600 shrink-0" />
              <h2>All Guides &amp; Articles ({articles.length})</h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">Bilingual • Constantly Updated</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {otherArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} lang="en" />
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
