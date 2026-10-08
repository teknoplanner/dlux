"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Trophy, CheckCircle, ArrowRight, Gamepad2, Wrench, ShieldCheck, Smartphone } from "lucide-react";
import { apps } from "@/data/apps";
import { Button } from "@/components/ui/Button";
import { ScreenshotCarousel } from "@/components/app/ScreenshotCarousel";

export const Featured: React.FC = () => {
  const topGame = apps.find((a) => a.slug === "stickman-penalty-rush") || apps[1];
  const topTool = apps.find((a) => a.slug === "offline-pdf-editor") || apps[0];

  const [activeTab, setActiveTab] = useState<"game" | "tool">("game");
  const currentApp = activeTab === "game" ? topGame : topTool;

  return (
    <section id="featured" className="py-20 relative bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header & Spotlight Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-800 mb-3 shadow-sm">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>SOROTAN KARYA PILIHAN</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
              Pilihan Unggulan Studio
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-xl">
              Lihat lebih dekat karya andalan kami, baik game aksi seru maupun aplikasi utilitas kerja harian yang aman.
            </p>
          </div>

          {/* Tab Selector: Game vs Tool */}
          <div className="inline-flex p-1 rounded-2xl bg-slate-200/80 border border-slate-300/70 shrink-0">
            <button
              onClick={() => setActiveTab("game")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "game"
                  ? "bg-white text-slate-900 shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-emerald-600" />
              <span>Game Andalan</span>
            </button>
            <button
              onClick={() => setActiveTab("tool")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "tool"
                  ? "bg-white text-slate-900 shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Wrench className="w-4 h-4 text-sky-600" />
              <span>Aplikasi Utilitas</span>
            </button>
          </div>
        </div>

        {/* Featured Showcase Card */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Col: Info & Features */}
            <div className="lg:col-span-5 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-100 bg-white shrink-0 shadow-md">
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
                      activeTab === "game" ? "text-emerald-700" : "text-sky-700"
                    }`}
                  >
                    {activeTab === "game" ? "Aksi & Olahraga Santai" : "Utilitas Dokumen & Privasi"}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                    {currentApp.name}
                  </h3>
                </div>
              </div>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {currentApp.description}
              </p>

              {/* Feature Checklist */}
              {currentApp.features && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  {currentApp.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Honest Specs Row */}
              <div className="grid grid-cols-3 gap-3 py-3 border-y border-slate-100 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 text-slate-900 font-bold text-base font-display">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>Android</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">Platform</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-slate-900 font-bold text-base font-display">
                    <ShieldCheck className="w-4 h-4 text-sky-600" />
                    <span>100%</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">Privasi Terjaga</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-slate-900 font-bold text-base font-display">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                    <span>Gratis</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">Akses Penuh</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  href={currentApp.playUrl}
                  external
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Unduh di Google Play
                </Button>
                <Button
                  href={`/apps/${currentApp.slug}`}
                  variant="outline"
                  size="md"
                  className="w-full sm:w-auto bg-white border-slate-200 text-slate-800 hover:bg-slate-50"
                >
                  <span>Detail Lengkap</span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </Button>
              </div>
            </div>

            {/* Right Col: Screenshot Carousel */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-3 sm:p-4 shadow-inner">
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
