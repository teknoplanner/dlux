import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Star, ShieldCheck, ExternalLink } from "lucide-react";
import { AppItem } from "@/data/apps";
import { Button } from "@/components/ui/Button";

interface AppCtaBannerProps {
  app: AppItem;
  variant?: "inline" | "bottom";
  lang?: "id" | "en";
}

export const AppCtaBanner: React.FC<AppCtaBannerProps> = ({
  app,
  variant = "bottom",
  lang = "id",
}) => {
  const isEn = lang === "en";

  if (variant === "inline") {
    return (
      <aside className="my-8 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 shadow-md border border-indigo-900/60 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-white/20 shadow-md shrink-0 bg-slate-800">
              <Image
                src={app.icon}
                alt={app.name}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-700/50">
                  {isEn ? "Practical Solution" : "Solusi Praktis"}
                </span>
                <div className="flex items-center text-amber-400 text-xs font-bold gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>5.0</span>
                </div>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white mt-1 leading-snug">
                {isEn ? `Try it directly in ${app.name}` : `Coba langsung di ${app.name}`}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 line-clamp-1 mt-0.5">
                {app.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
            <Button
              href={app.playUrl}
              external
              variant="primary"
              size="sm"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md w-full sm:w-auto justify-center"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isEn ? "Install Free" : "Pasang Gratis"}</span>
            </Button>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <div className="my-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white p-7 sm:p-10 shadow-lg border border-slate-800 relative overflow-hidden">
      {/* Visual neon blurs */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden border-2 border-white/20 shadow-xl shrink-0 bg-slate-800">
            <Image
              src={app.icon}
              alt={app.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-800/60 inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {isEn ? "Official Google Play" : "Resmi di Google Play"}
              </span>
              <div className="flex items-center text-amber-400 text-xs font-bold gap-1 bg-white/10 px-2 py-0.5 rounded-md">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>5.0 • {app.downloads} {isEn ? "Downloads" : "Unduhan"}</span>
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              {app.name}
            </h3>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              {app.tagline}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
          <Button
            href={app.playUrl}
            external
            variant="primary"
            size="lg"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold shadow-lg justify-center gap-2 text-sm"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isEn ? "Get on Google Play" : "Install di Google Play"}</span>
          </Button>

          <Link
            href={`/apps/${app.slug}`}
            className="text-xs text-center font-semibold text-slate-300 hover:text-white underline transition-colors py-1 flex items-center justify-center gap-1"
          >
            <span>{isEn ? "View Screenshots & Features" : "Lihat Screenshot & Detail Fitur"}</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
