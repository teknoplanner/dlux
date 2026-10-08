"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Info, Star, Download } from "lucide-react";
import { AppItem } from "@/data/apps";

interface AppCardProps {
  app: AppItem;
}

export const AppCard: React.FC<AppCardProps> = ({ app }) => {
  const getCategoryDetails = () => {
    switch (app.category) {
      case "game":
        return {
          label: "Game",
          badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
        };
      case "education":
        return {
          label: "Edukasi",
          badgeColor: "bg-purple-50 text-purple-800 border-purple-200",
        };
      case "tool":
        return {
          label: "Alat",
          badgeColor: "bg-sky-50 text-sky-800 border-sky-200",
        };
      default:
        return {
          label: "Aplikasi",
          badgeColor: "bg-slate-50 text-slate-800 border-slate-200",
        };
    }
  };

  const category = getCategoryDetails();

  return (
    <div className="h-full flex flex-col justify-between rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden group">
      <div>
        {/* Real Screenshot Preview Banner (Separate, clear top section) */}
        <div className="relative w-full h-44 bg-slate-100 overflow-hidden border-b border-slate-100">
          {app.screenshots?.[0] ? (
            <Image
              src={app.screenshots[0]}
              alt={`Tangkapan layar ${app.name}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-slate-100" />
          )}

          {/* Floating Category & Age Badges with Solid High Contrast Background */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border shadow-sm ${category.badgeColor} bg-white/95`}
            >
              {category.label}
            </span>

            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/95 text-slate-800 border border-slate-200 shadow-sm">
              Rating {app.contentRating || "3+"}
            </span>
          </div>
        </div>

        {/* Solid Pure White Content Area: Clear, High Contrast, No Overlap */}
        <div className="p-5 bg-white space-y-3">
          {/* App Icon + App Name Row */}
          <div className="flex items-start gap-3.5">
            <Link
              href={`/apps/${app.slug}`}
              className="relative w-14 h-14 shrink-0 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:scale-105 transition-transform duration-200 block"
            >
              <Image
                src={app.icon}
                alt={app.name}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </Link>

            <div className="flex-1 min-w-0">
              {/* App Name: Bold, Large, High-Contrast Slate-950 Text */}
              <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2">
                <Link href={`/apps/${app.slug}`}>{app.name}</Link>
              </h3>

              {/* Play Store Real Stats: Rating & Downloads */}
              <div className="flex items-center gap-2.5 text-xs text-slate-600 mt-1">
                <span className="inline-flex items-center gap-1 font-bold text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {app.rating ? app.rating.toFixed(1) : "5.0"}
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  {app.downloads} Unduhan
                </span>
              </div>
            </div>
          </div>

          {/* Real Play Store Tagline */}
          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {app.tagline}
          </p>
        </div>
      </div>

      {/* Card Footer: Clear Action Buttons */}
      <div className="p-5 pt-3 border-t border-slate-100 bg-slate-50/50">
        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/apps/${app.slug}`}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs transition-colors"
          >
            <Info className="w-3.5 h-3.5 text-slate-500" />
            Detail
          </Link>

          <a
            href={app.playUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white shadow-sm transition-colors"
          >
            <Play className="w-3 h-3 fill-current text-white" />
            Google Play
          </a>
        </div>
      </div>
    </div>
  );
};
