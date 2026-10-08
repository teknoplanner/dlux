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
    <div className="h-full flex flex-col justify-between rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1 overflow-hidden group">
      <div>
        {/* Real Screenshot Preview Banner */}
        <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
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

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border backdrop-blur-md bg-white/95 shadow-sm ${category.badgeColor}`}
            >
              {category.label}
            </span>

            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white/95 text-slate-700 border border-slate-200 shadow-sm">
              Rating {app.contentRating || "3+"}
            </span>
          </div>

          {/* Bottom Gradient Fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Card Body with App Icon Offset */}
        <div className="px-5 pb-2 -mt-7 relative z-20">
          {/* Icon & Title Row */}
          <div className="flex items-end gap-3.5 mb-3">
            <Link
              href={`/apps/${app.slug}`}
              className="relative w-16 h-16 shrink-0 rounded-2xl overflow-hidden border-2 border-white bg-white shadow-md group-hover:scale-105 transition-transform duration-300"
            >
              <Image
                src={app.icon}
                alt={app.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </Link>

            <div className="flex-1 min-w-0 pb-1">
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate font-display">
                <Link href={`/apps/${app.slug}`}>{app.name}</Link>
              </h3>
              {/* Play Store Real Stats */}
              <div className="flex items-center gap-3 text-xs text-slate-600 mt-0.5">
                <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {app.rating ? app.rating.toFixed(1) : "5.0"}
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
                  <Download className="w-3 h-3 text-slate-400" />
                  {app.downloads}
                </span>
              </div>
            </div>
          </div>

          {/* Real Play Store Tagline */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
            {app.tagline}
          </p>
        </div>
      </div>

      {/* Card Footer: Actions */}
      <div className="px-5 pt-3 pb-4 border-t border-slate-100 space-y-2.5 mt-2">
        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/apps/${app.slug}`}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors"
          >
            <Info className="w-3.5 h-3.5 text-slate-500" />
            Detail
          </Link>

          <a
            href={app.playUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white shadow-sm transition-colors"
          >
            <Play className="w-3 h-3 fill-current" />
            Google Play
          </a>
        </div>
      </div>
    </div>
  );
};
