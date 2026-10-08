"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Download, Play, Trophy, ShieldCheck, CheckCircle, ArrowRight, Gamepad2, Wrench } from "lucide-react";
import { apps } from "@/data/apps";
import { Button } from "@/components/ui/Button";
import { ScreenshotCarousel } from "@/components/app/ScreenshotCarousel";

export const Featured: React.FC = () => {
  const topGame = apps.find((a) => a.slug === "stickman-penalty-rush") || apps[1];
  const topTool = apps.find((a) => a.slug === "offline-pdf-editor") || apps[0];

  const [activeTab, setActiveTab] = useState<"game" | "tool">("game");
  const currentApp = activeTab === "game" ? topGame : topTool;

  return (
    <section className="py-20 relative bg-[#090c18] border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header & Spotlight Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400 mb-3">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>SOROTAN KARYA PILIHAN</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
              Pilihan Utama Pengembang
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-xl">
              Lihat lebih dekat karya unggulan kami, baik game aksi seru maupun aplikasi produktivitas harian yang aman.
            </p>
          </div>

          {/* Tab Selector: Game vs Tool */}
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab("game")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "game"
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Game Andalan</span>
            </button>
            <button
              onClick={() => setActiveTab("tool")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "tool"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Aplikasi Utilitas</span>
            </button>
          </div>
        </div>

        {/* Featured Showcase Card */}
        <div className="rounded-3xl bg-[#0e1224] border border-slate-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Col: Info & Features */}
            <div className="lg:col-span-5 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-900 shrink-0 shadow-lg">
                  <Image
                    src={currentApp.icon}
                    alt={currentApp.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider block mb-1 ${
                      activeTab === "game" ? "text-emerald-400" : "text-cyan-400"
                    }`}
                  >
                    {activeTab === "game" ? "Aksi & Olahraga Arcade" : "Utilitas & Privasi Dokumen"}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                    {currentApp.name}
                  </h3>
                </div>
              </div>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {currentApp.description}
              </p>

              {/* Feature Checklist */}
              {currentApp.features && (
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  {currentApp.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Metrics Row */}
              <div className="grid grid-cols-3 gap-3 py-3 border-y border-slate-800/80 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 text-amber-400 font-bold text-base font-display">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{currentApp.rating?.toFixed(1) || "5.0"}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Rating Toko</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-cyan-400 font-bold text-base font-display">
                    <Download className="w-4 h-4" />
                    <span>{currentApp.downloads || "500+"}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Unduhan</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-emerald-400 font-bold text-base font-display">
                    <ShieldCheck className="w-4 h-4" />
                    <span>3+ Usia</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Play Protect</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  href={currentApp.playUrl}
                  external
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto shadow-md"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Install di Google Play
                </Button>
                <Button
                  href={`/apps/${currentApp.slug}`}
                  variant="outline"
                  size="md"
                  className="w-full sm:w-auto border-slate-700 hover:border-slate-500"
                >
                  <span>Detail Lengkap</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Button>
              </div>
            </div>

            {/* Right Col: Screenshot Carousel */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-2 sm:p-4">
                <ScreenshotCarousel
                  screenshots={currentApp.screenshots}
                  appName={currentApp.name}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
