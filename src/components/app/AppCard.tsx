"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Download, Play, Info, Check } from "lucide-react";
import { AppItem } from "@/data/apps";

interface AppCardProps {
  app: AppItem;
}

export const AppCard: React.FC<AppCardProps> = ({ app }) => {
  const getCategoryDetails = () => {
    switch (app.category) {
      case "game":
        return {
          label: "Game Android",
          color: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
          icon: "🎮",
        };
      case "education":
        return {
          label: "Edukasi Anak",
          color: "bg-purple-500/10 text-purple-300 border-purple-500/30",
          icon: "🧠",
        };
      case "tool":
        return {
          label: "Alat & Produktivitas",
          color: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
          icon: "🛠️",
        };
      default:
        return {
          label: "Aplikasi",
          color: "bg-slate-500/10 text-slate-300 border-slate-500/30",
          icon: "📱",
        };
    }
  };

  const category = getCategoryDetails();

  return (
    <div className="h-full flex flex-col justify-between rounded-2xl bg-[#0e1222] border border-slate-800 hover:border-slate-600/80 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 overflow-hidden group">
      <div>
        {/* Screenshot Preview Banner */}
        <div className="relative w-full h-44 bg-slate-950 overflow-hidden">
          {app.screenshots?.[0] ? (
            <Image
              src={app.screenshots[0]}
              alt={`Screenshot ${app.name}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-slate-900" />
          )}

          {/* Top Floating Badges on Banner */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border backdrop-blur-md ${category.color} bg-[#0a0d1a]/80`}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </span>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/70 text-gray-300 border border-white/10 backdrop-blur-md">
                {app.contentRating || "3+"}
              </span>
              {app.hasAds ? (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                  Iklan
                </span>
              ) : (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                  Bebas Iklan
                </span>
              )}
            </div>
          </div>

          {/* Bottom Gradient Fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1222] via-transparent to-black/40 pointer-events-none" />
        </div>

        {/* Card Body with App Icon Offset */}
        <div className="px-5 pb-2 -mt-7 relative z-20">
          {/* Icon & Title Row */}
          <div className="flex items-end gap-3.5 mb-3">
            <Link
              href={`/apps/${app.slug}`}
              className="relative w-16 h-16 shrink-0 rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-900 shadow-xl group-hover:scale-105 transition-transform duration-300"
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
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors truncate font-display">
                <Link href={`/apps/${app.slug}`}>{app.name}</Link>
              </h3>
              <p className="text-xs text-slate-400 truncate">
                {app.packageId}
              </p>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
            {app.tagline}
          </p>

          {/* Quick Features List */}
          {app.features && app.features.length > 0 && (
            <div className="space-y-1 mb-3 pt-2 border-t border-slate-800/80">
              {app.features.slice(0, 2).map((feat, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-300 truncate">
                  <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {app.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-800/60 text-slate-400 border border-slate-700/50"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer: Metrics & Install CTA */}
      <div className="px-5 pt-3 pb-4 border-t border-slate-800/80 space-y-3 mt-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          {app.rating ? (
            <div className="flex items-center gap-1 font-semibold text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{app.rating.toFixed(1)}</span>
              <span className="text-[10px] text-slate-500 font-normal">/ 5.0</span>
            </div>
          ) : (
            <div className="text-slate-500 text-[11px]">Rilis Baru</div>
          )}

          {app.downloads && (
            <div className="flex items-center gap-1 font-medium text-slate-300 text-xs">
              <Download className="w-3 h-3 text-cyan-400" />
              <span>{app.downloads} Unduhan</span>
            </div>
          )}
        </div>

        {/* Dual Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/apps/${app.slug}`}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
          >
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            Detail &amp; Fitur
          </Link>

          <a
            href={app.playUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-md shadow-emerald-950 transition-colors"
          >
            <Play className="w-3 h-3 fill-current" />
            Install
          </a>
        </div>
      </div>
    </div>
  );
};
