import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft, BookOpen, Sparkles, Compass } from "lucide-react";
import { articles } from "@/data/articles";
import { ArticleCard } from "@/components/blog/ArticleCard";

export const metadata: Metadata = {
  title: "Blog & Panduan Aplikasi Android | D Lucky X",
  description:
    "Kumpulan artikel, tips privasi, panduan belajar anak, dan trik bermain game offline Android dari studio pengembang D Lucky X.",
  openGraph: {
    title: "Blog & Panduan Aplikasi Android | D Lucky X",
    description:
      "Kumpulan artikel, tips privasi, panduan belajar anak, dan trik bermain game offline Android dari studio pengembang D Lucky X.",
    type: "website",
  },
};

export default function BlogHubPage() {
  const [featuredArticle, ...otherArticles] = articles;

  return (
    <div className="pt-32 pb-24 relative overflow-hidden bg-[#fafaf9]">
      {/* Background ambient lighting */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-100/40 via-cyan-100/20 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Back navigation */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            BLOG &amp; PANDUAN RESMI
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-slate-900 tracking-tight">
            Wawasan &amp; Tips Terbaik Seputar Game &amp; Aplikasi Android
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Temukan panduan praktis pengelolaan dokumen, trik bermain game sepak bola &amp; arcade offline, metode belajar anak yang menyenangkan, serta rahasia budgeting harian yang aman.
          </p>
        </div>

        {/* Featured Article Spotlight */}
        {featuredArticle && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Sorotan Utama Minggu Ini</span>
            </div>
            <ArticleCard article={featuredArticle} featured />
          </div>
        )}

        {/* All Articles Grid */}
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold font-display text-lg">
              <Compass className="w-5 h-5 text-indigo-600" />
              <h2>Semua Artikel &amp; Panduan ({articles.length})</h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">Bilingual • Update Reguler</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {otherArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
