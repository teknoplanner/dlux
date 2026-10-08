"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Gamepad2, ExternalLink, ShieldCheck, Download, Star, Sparkles } from "lucide-react";
import { developer, apps } from "@/data/apps";
import { Button } from "@/components/ui/Button";
import { SceneFallback } from "@/components/three/SceneFallback";

const HeroScene = dynamic(() => import("@/components/three/HeroScene.client"), {
  ssr: false,
  loading: () => <SceneFallback />,
});

export const Hero: React.FC = () => {
  const totalApps = apps.length;
  const gameCount = apps.filter((a) => a.category === "game").length;
  const toolCount = apps.filter((a) => a.category === "tool").length;
  const eduCount = apps.filter((a) => a.category === "education").length;

  return (
    <section className="relative pt-32 pb-16 md:pt-36 md:pb-20 overflow-hidden bg-[#070913]">
      {/* Background Subtle Gradient Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/20 via-[#070913]/90 to-[#070913] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Headlines & Game Studio Info */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Publisher Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 text-xs font-mono text-cyan-300 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold tracking-wide">PENGEMBANG GOOGLE PLAY RESMI</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold font-display tracking-tight text-white leading-[1.12]">
              Game Seru &amp; Aplikasi Android Bermanfaat
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              D Lucky X merilis ragam hiburan game aksi &amp; santai serta aplikasi utilitas produktivitas di Google Play Store. Dari adu penalti stickman, petualangan kucing luar angkasa, edukasi matematika anak, hingga pencatat keuangan dan editor PDF offline yang aman.
            </p>

            {/* Category Quick Tags */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-300">
                <span>🎮</span> {gameCount} Game Android
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-300">
                <span>🛠️</span> {toolCount} Alat Produktivitas
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300">
                <span>🧠</span> {eduCount} Edukasi Anak
              </span>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3">
              <Button href="#apps" variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-emerald-600/20">
                <Gamepad2 className="w-5 h-5" />
                Jelajahi Semua Karya ({totalApps})
              </Button>
              <Button
                href={developer.playStoreUrl}
                external
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-slate-700 hover:border-cyan-400/50 hover:bg-slate-800/40"
              >
                <span>Halaman Google Play</span>
                <ExternalLink className="w-4 h-4 text-cyan-400" />
              </Button>
            </div>

            {/* Studio HUD Metrics Bar */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
              <div className="text-left">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-lg font-display">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>4.9</span>
                </div>
                <div className="text-xs text-slate-400 font-medium">Rating Rata-Rata</div>
              </div>

              <div className="text-left">
                <div className="flex items-center gap-1.5 text-white font-bold text-lg font-display">
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>4,000+</span>
                </div>
                <div className="text-xs text-slate-400 font-medium">Total Unduhan</div>
              </div>

              <div className="text-left">
                <div className="flex items-center gap-1.5 text-white font-bold text-lg font-display">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>100%</span>
                </div>
                <div className="text-xs text-slate-400 font-medium">Play Protect Aman</div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Cyber Console Stage */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl bg-[#0c0f1e] border border-cyan-500/20 shadow-2xl overflow-hidden p-2">
              {/* HUD Header Bar */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>D LUCKY X • 3D STAGE</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>INTERACTIVE</span>
                </div>
              </div>

              {/* 3D Scene */}
              <HeroScene />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
