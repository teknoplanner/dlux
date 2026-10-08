import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Calendar, ArrowRight, Sparkles } from "lucide-react";
import { ArticleItem } from "@/data/articles";
import { apps } from "@/data/apps";
import { Badge } from "@/components/ui/Badge";

interface ArticleCardProps {
  article: ArticleItem;
  featured?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, featured = false }) => {
  const targetApp = apps.find((a) => a.slug === article.targetAppSlug);

  const getCategoryBadgeVariant = (cat: ArticleItem["category"]): "purple" | "cyan" | "pink" | "green" | "amber" | "outline" => {
    switch (cat) {
      case "productivity":
        return "cyan";
      case "gaming":
        return "purple";
      case "education":
        return "green";
      case "finance":
        return "amber";
      default:
        return "outline";
    }
  };

  const formattedDate = new Date(article.publishedDate).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (featured) {
    return (
      <article className="group relative rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
        <div className="lg:col-span-5 relative bg-gradient-to-br from-slate-900 to-indigo-950 p-8 sm:p-10 flex flex-col justify-between overflow-hidden">
          {/* Neon decorative background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-cyan-300 tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Artikel Pilihan
            </div>

            {targetApp && (
              <div className="flex items-center gap-3 pt-2">
                <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-white/20 shadow-md shrink-0 bg-slate-800">
                  <Image
                    src={targetApp.icon}
                    alt={targetApp.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300 block">
                    Aplikasi Terkait
                  </span>
                  <span className="text-sm font-bold text-white block truncate">
                    {targetApp.name}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="relative z-10 pt-8 mt-auto flex items-center gap-4 text-xs text-slate-300 font-medium">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              {article.readTime}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formattedDate}
            </span>
          </div>
        </div>

        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant={getCategoryBadgeVariant(article.category)}>
                {article.category.toUpperCase()}
              </Badge>
            </div>

            <Link href={`/blog/${article.slug}`}>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                {article.title}
              </h3>
            </Link>

            <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
              {article.metaDescription}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Link
              href={`/blog/${article.slug}`}
              className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 group-hover:gap-3 transition-all"
            >
              <span>Baca Panduan Selengkapnya</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between">
      <div className="p-6 sm:p-7 space-y-4">
        {/* Card Header with Badges */}
        <div className="flex items-center justify-between gap-2">
          <Badge variant={getCategoryBadgeVariant(article.category)}>
            {article.category.toUpperCase()}
          </Badge>

          <span className="inline-flex items-center gap-1 text-xs text-slate-600 font-medium font-mono">
            <Clock className="w-3 h-3 text-slate-500" />
            {article.readTime}
          </span>
        </div>

        {/* Title */}
        <Link href={`/blog/${article.slug}`} className="block">
          <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
            {article.title}
          </h3>
        </Link>

        {/* Snippet */}
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
          {article.metaDescription}
        </p>
      </div>

      {/* Card Footer */}
      <div className="p-6 sm:p-7 pt-0 mt-auto space-y-3">
        {targetApp && (
          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-slate-200 shrink-0">
              <Image
                src={targetApp.icon}
                alt={targetApp.name}
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-slate-600 font-mono block leading-none">Aplikasi</span>
              <span className="text-xs font-bold text-slate-800 truncate block mt-0.5">
                {targetApp.name}
              </span>
            </div>
          </div>
        )}

        <div className="pt-2 flex items-center justify-between text-xs text-slate-600 font-medium">
          <span>{formattedDate}</span>
          <Link
            href={`/blog/${article.slug}`}
            className="inline-flex items-center gap-1.5 font-bold text-indigo-600 hover:text-indigo-800 group-hover:gap-2 transition-all"
          >
            <span>Baca</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};
