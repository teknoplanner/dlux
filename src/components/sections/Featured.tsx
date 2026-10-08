"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Download, Play, Trophy, Sparkles, ShieldCheck } from "lucide-react";
import { apps } from "@/data/apps";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ScreenshotCarousel } from "@/components/app/ScreenshotCarousel";

export const Featured: React.FC = () => {
  // Select Milo Cat Adventure or Monster Math as spotlight
  const featuredApp = apps.find((a) => a.slug === "milo-cat-adventure") || apps[0];

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-white/[0.02] via-purple-950/10 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl bg-gradient-to-r from-purple-900/20 via-white/[0.04] to-cyan-900/20 border border-white/10 p-8 sm:p-12 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-xs font-semibold text-pink-300 mb-8">
            <Trophy className="w-4 h-4 text-pink-400" />
            GAME UNGGULAN BULAN INI
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Col: Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-20 h-20 rounded-2xl p-1 shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${featuredApp.color}, #0b0b18)`,
                  }}
                >
                  <Image
                    src={featuredApp.icon}
                    alt={featuredApp.name}
                    width={80}
                    height={80}
                    className="w-full h-full rounded-xl object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="pink" size="sm">
                      Pilihan Editor
                    </Badge>
                    <span className="text-xs text-muted">2D Platformer</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                    {featuredApp.name}
                  </h3>
                </div>
              </div>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                {featuredApp.description}
              </p>

              <div className="grid grid-cols-3 gap-3 py-4 border-y border-white/10">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 font-bold text-lg">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{featuredApp.rating?.toFixed(1) || "5.0"}</span>
                  </div>
                  <div className="text-[11px] text-muted">Rating Pemain</div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-cyan-400 font-bold text-lg">
                    <Download className="w-4 h-4" />
                    <span>{featuredApp.downloads || "500+"}</span>
                  </div>
                  <div className="text-[11px] text-muted">Unduhan</div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-green-400 font-bold text-lg">
                    <ShieldCheck className="w-4 h-4" />
                    <span>3+ Usia</span>
                  </div>
                  <div className="text-[11px] text-muted">Ramah Anak</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Button
                  href={featuredApp.playUrl}
                  external
                  variant="accent"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Install Sekarang
                </Button>
                <Button
                  href={`/apps/${featuredApp.slug}`}
                  variant="outline"
                  size="lg"
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
