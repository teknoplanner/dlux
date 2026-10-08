"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Gamepad2, ExternalLink, Sparkles, ShieldCheck, Zap, Download } from "lucide-react";
import { developer } from "@/data/apps";
import { Button } from "@/components/ui/Button";
import { SceneFallback } from "@/components/three/SceneFallback";

const HeroScene = dynamic(() => import("@/components/three/HeroScene.client"), {
  ssr: false,
  loading: () => <SceneFallback />,
});

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background radial glow lights */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md text-xs font-semibold text-cyan-300">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>OFFICIAL GOOGLE PLAY DEVELOPER</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-[1.15]">
              Game Seru &amp; Edukasi{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Android Terbaik
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {developer.tagline} Mainkan aksi penalti stickman, platformer kucing luar angkasa, puzzle 3D, hingga edukasi matematika anak.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Button href="#apps" variant="primary" size="lg" className="w-full sm:w-auto">
                <Gamepad2 className="w-5 h-5" />
                Jelajahi Game
              </Button>
              <Button
                href={developer.playStoreUrl}
                external
                variant="outline"
                size="lg"
                className="w-full sm:w-auto group border-cyan-400/30 hover:border-cyan-400/60"
              >
                <span>Google Play Store</span>
                <ExternalLink className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Button>
            </div>

            {/* Trust highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white">100% Aman</div>
                  <div className="text-[11px] text-muted">Play Protect</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white">Ringan &amp; Cepat</div>
                  <div className="text-[11px] text-muted">Tanpa Lag</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                  <Download className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white">3,500+</div>
                  <div className="text-[11px] text-muted">Total Unduhan</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Scene */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl p-1 bg-gradient-to-b from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/10 shadow-2xl shadow-purple-950/40">
              <HeroScene />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
