"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Download, Play, Trophy, ShieldCheck } from "lucide-react";
import { apps } from "@/data/apps";
import { Button } from "@/components/ui/Button";
import { ScreenshotCarousel } from "@/components/app/ScreenshotCarousel";

export const Featured: React.FC = () => {
  const featuredApp = apps.find((a) => a.slug === "milo-cat-adventure") || apps[0];

  return (
    <section className="py-16 relative bg-[#090a10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl bg-[#121422] border border-white/10 p-6 sm:p-10 shadow-xl relative overflow-hidden">
          {/* Section Header Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-pink-500/10 border border-pink-500/20 text-xs font-semibold text-pink-300 mb-6">
            <Trophy className="w-4 h-4 text-pink-400" />
            SOROTAN PILIHAN PENGEMBANG
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Col: Info */}
            <div className="lg:col-span-5 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-[22px] overflow-hidden border border-white/15 shrink-0 shadow-md">
                  <Image
                    src={featuredApp.icon}
                    alt={featuredApp.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-xs font-semibold text-pink-400 block mb-0.5">
                    Platformer 2D
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                    {featuredApp.name}
                  </h3>
                </div>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed">
                {featuredApp.description}
              </p>

              <div className="grid grid-cols-3 gap-3 py-3 border-y border-white/10 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 text-amber-400 font-bold text-base">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{featuredApp.rating?.toFixed(1) || "5.0"}</span>
                  </div>
                  <div className="text-[11px] text-gray-400">Rating Toko</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-cyan-400 font-bold text-base">
                    <Download className="w-4 h-4" />
                    <span>{featuredApp.downloads || "500+"}</span>
                  </div>
                  <div className="text-[11px] text-gray-400">Unduhan</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-emerald-400 font-bold text-base">
                    <ShieldCheck className="w-4 h-4" />
                    <span>3+ Usia</span>
                  </div>
                  <div className="text-[11px] text-gray-400">Ramah Anak</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  href={featuredApp.playUrl}
                  external
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Install di Google Play
                </Button>
                <Button
                  href={`/apps/${featuredApp.slug}`}
                  variant="outline"
                  size="md"
                  className="w-full sm:w-auto"
                >
                  Lihat Detail Game
                </Button>
              </div>
            </div>

            {/* Right Col: Screenshot Carousel */}
            <div className="lg:col-span-7">
              <ScreenshotCarousel
                screenshots={featuredApp.screenshots}
                appName={featuredApp.name}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
