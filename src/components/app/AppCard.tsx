"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Download, Play, Info } from "lucide-react";
import { AppItem } from "@/data/apps";
import { TiltCard } from "@/components/ui/TiltCard";

interface AppCardProps {
  app: AppItem;
}

export const AppCard: React.FC<AppCardProps> = ({ app }) => {
  const getCategoryLabel = () => {
    switch (app.category) {
      case "game":
        return "Game";
      case "education":
        return "Edukasi";
      case "tool":
        return "Alat & Utilitas";
      default:
        return "Aplikasi";
    }
  };

  return (
    <TiltCard className="h-full">
      <div className="h-full flex flex-col justify-between rounded-2xl bg-[#11131e]/90 border border-white/10 hover:border-white/25 p-5 transition-all duration-300 shadow-lg hover:shadow-xl group">
        <div>
          {/* Top Header: Authentic Play Store Squircle Icon + Info */}
          <div className="flex items-start gap-4">
            <Link
              href={`/apps/${app.slug}`}
              className="relative w-18 h-18 shrink-0 rounded-[20px] overflow-hidden border border-white/15 shadow-md group-hover:scale-105 transition-transform duration-300"
            >
              <Image
                src={app.icon}
                alt={app.name}
                width={72}
                height={72}
                className="w-full h-full object-cover"
              />
            </Link>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white/5 text-gray-300 border border-white/10">
                  {getCategoryLabel()}
                </span>
                {app.hasAds ? (
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    Iklan
                  </span>
                ) : (
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    Bebas Iklan
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                <Link href={`/apps/${app.slug}`}>{app.name}</Link>
              </h3>
            </div>
          </div>

          {/* Tagline */}
          <p className="mt-3 text-xs sm:text-sm text-gray-300 line-clamp-2 leading-relaxed">
            {app.tagline}
          </p>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {app.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-gray-400 border border-white/5"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Section: Metrics & Action */}
        <div className="mt-5 pt-3.5 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-400">
            {app.rating ? (
              <div className="flex items-center gap-1 font-semibold text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{app.rating.toFixed(1)}</span>
                <span className="text-[10px] text-gray-500 font-normal">/ 5.0</span>
              </div>
            ) : (
              <div className="text-gray-500 text-[11px]">Rilis Baru</div>
            )}

            {app.downloads && (
              <div className="flex items-center gap-1 font-medium text-gray-300 text-xs">
                <Download className="w-3 h-3 text-cyan-400" />
                <span>{app.downloads}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/apps/${app.slug}`}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-200 hover:text-white transition-colors"
            >
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              Detail
            </Link>

            <a
              href={app.playUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-sm transition-colors"
            >
              <Play className="w-3 h-3 fill-current" />
              Install
            </a>
          </div>
        </div>
      </div>
    </TiltCard>
  );
};
