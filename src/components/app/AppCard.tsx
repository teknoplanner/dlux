"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Download, Play, Info } from "lucide-react";
import { AppItem } from "@/data/apps";
import { TiltCard } from "@/components/ui/TiltCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface AppCardProps {
  app: AppItem;
}

export const AppCard: React.FC<AppCardProps> = ({ app }) => {
  const isEducation = app.category === "education";

  return (
    <TiltCard className="h-full">
      <div className="h-full flex flex-col justify-between rounded-3xl bg-white/[0.04] border border-white/10 hover:border-white/20 p-6 backdrop-blur-xl transition-all duration-300 shadow-xl group hover:shadow-2xl">
        <div>
          {/* Top Header: Icon + Info */}
          <div className="flex items-start gap-4">
            <div
              className="relative w-18 h-18 rounded-2xl p-1 shrink-0 transition-transform group-hover:scale-105 duration-300"
              style={{
                background: `linear-gradient(135deg, ${app.color}40, rgba(255,255,255,0.05))`,
                boxShadow: `0 8px 20px -6px ${app.color}30`,
              }}
            >
              <Image
                src={app.icon}
                alt={app.name}
                width={72}
                height={72}
                className="w-16 h-16 rounded-xl object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <Badge
                  variant={isEducation ? "cyan" : "purple"}
                  size="sm"
                >
                  {isEducation ? "Edukasi" : "Game"}
                </Badge>
                {app.contentRating && (
                  <Badge variant="outline" size="sm">
                    {app.contentRating}
                  </Badge>
                )}
                {app.hasAds ? (
                  <Badge variant="amber" size="sm">
                    Iklan
                  </Badge>
                ) : (
                  <Badge variant="green" size="sm">
                    Bebas Iklan
                  </Badge>
                )}
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                <Link href={`/apps/${app.slug}`}>{app.name}</Link>
              </h3>
            </div>
          </div>

          {/* Tagline */}
          <p className="mt-3 text-sm text-gray-300 line-clamp-2 leading-relaxed">
            {app.tagline}
          </p>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {app.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.03] text-gray-400 border border-white/5"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Section: Metrics & Action */}
        <div className="mt-6 pt-4 border-t border-white/10 space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-400">
            {app.rating ? (
              <div className="flex items-center gap-1.5 font-semibold text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{app.rating.toFixed(1)} / 5.0</span>
              </div>
            ) : (
              <div className="text-gray-500">Rilis Baru</div>
            )}

            {app.downloads && (
              <div className="flex items-center gap-1.5 font-medium text-gray-300">
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>{app.downloads} Unduhan</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <Button
              href={`/apps/${app.slug}`}
              variant="outline"
              size="sm"
              className="w-full text-xs font-semibold"
            >
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              Detail
            </Button>
            <Button
              href={app.playUrl}
              external
              variant="primary"
              size="sm"
              className="w-full text-xs font-semibold"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Install
            </Button>
          </div>
        </div>
      </div>
    </TiltCard>
  );
};
