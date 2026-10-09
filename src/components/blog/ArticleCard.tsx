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
  lang?: "id" | "en";
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  featured = false,
  lang = "id",
}) => {
  const targetApp = apps.find((a) => a.slug === article.targetAppSlug);

  const getCategoryBadgeVariant = (
    cat: ArticleItem["category"]
  ): "purple" | "cyan" | "pink" | "green" | "amber" | "outline" => {
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

  const isEn = lang === "en";
  const title = isEn ? article.titleEn : article.title;
  const description = isEn ? article.metaDescriptionEn : article.metaDescription;
  const readTime = isEn ? article.readTimeEn : article.readTime;
  const href = isEn ? `/en/blog/${article.slugEn || article.slug}` : `/blog/${article.slug}`;

  const formattedDate = new Date(article.publishedDate).toLocaleDateString(
    isEn ? "en-US" : "id-ID",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  if (featured) {
    return (
      <article className="group relative rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
        <div className="lg:col-span-5 relative bg-slate-900 min-h-[240px] lg:min-h-full overflow-hidden flex flex-col justify-between p-6 sm:p-8">
          {article.coverImage && (
            <Image
              src={article.coverImage}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/20 pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-xs font-bold text-cyan-300 tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              {isEn ? "Featured Guide" : "Artikel Pilihan"}
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
                    {isEn ? "Related Application" : "Aplikasi Terkait"}
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
              {readTime}
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

            <Link href={href}>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                {title}
              </h3>
            </Link>

            <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Link
              href={href}
              className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 group-hover:gap-3 transition-all"
            >
              <span>{isEn ? "Read Complete Guide" : "Baca Panduan Selengkapnya"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between">
      {/* Cover Image */}
      {article.coverImage && (
        <Link href={href} className="relative w-full aspect-[16/9] overflow-hidden block bg-slate-900 border-b border-slate-100">
          <Image
            src={article.coverImage}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
      )}

      <div className="p-6 sm:p-7 space-y-4">
        {/* Card Header with Badges */}
        <div className="flex items-center justify-between gap-2">
          <Badge variant={getCategoryBadgeVariant(article.category)}>
            {article.category.toUpperCase()}
          </Badge>

          <span className="inline-flex items-center gap-1 text-xs text-slate-600 font-medium font-mono">
            <Clock className="w-3 h-3 text-slate-500" />
            {readTime}
          </span>
        </div>

        {/* Title */}
        <Link href={href} className="block">
          <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
            {title}
          </h3>
        </Link>

        {/* Snippet */}
        <p className="text-sm sm:text-base text-slate-600 line-clamp-3 leading-relaxed">
          {description}
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
              <span className="text-[10px] text-slate-600 font-mono block leading-none">
                {isEn ? "App" : "Aplikasi"}
              </span>
              <span className="text-xs font-bold text-slate-800 truncate block mt-0.5">
                {targetApp.name}
              </span>
            </div>
          </div>
        )}

        <div className="pt-2 flex items-center justify-between text-xs text-slate-600 font-medium">
          <span>{formattedDate}</span>
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 font-bold text-indigo-600 hover:text-indigo-800 group-hover:gap-2 transition-all"
          >
            <span>{isEn ? "Read" : "Baca"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};
