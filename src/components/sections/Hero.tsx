"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ArrowDown, ExternalLink } from "lucide-react";
import { developer } from "@/data/apps";
import { Button } from "@/components/ui/Button";

const HeroScene = dynamic(() => import("@/components/three/HeroScene.client"), {
  ssr: false,
});

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#fafaf9]">
      {/* Interactive 3D Ambient Kinetic Canvas */}
      <HeroScene />

      {/* Hero Foreground Content with Soft Scrim for 100% High Contrast */}
      <div className="max-w-3xl mx-auto px-6 sm:px-10 py-8 rounded-3xl relative z-10 text-center pointer-events-none bg-white/45 backdrop-blur-[2px] border border-white/70 shadow-xs">
        <span className="inline-block text-xs font-mono font-bold uppercase tracking-widest text-slate-700 bg-white/80 border border-slate-200/80 px-3.5 py-1 rounded-full shadow-2xs mb-4 pointer-events-auto">
          D Lucky X • Indie Studio
        </span>

        <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold font-display tracking-tight text-slate-950 leading-[1.05] mb-5">
          Game Seru.<br />
          Aplikasi Bermanfaat.
        </h1>

        <p className="text-base sm:text-lg text-slate-700 max-w-lg mx-auto font-medium leading-relaxed mb-8">
          Koleksi game santai dan aplikasi Android yang ringan, aman, dan menyenangkan.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3.5 pointer-events-auto">
          <Button
            href="#apps"
            variant="primary"
            size="lg"
            className="bg-slate-900 hover:bg-slate-800 text-white px-7 py-3.5 shadow-sm text-sm font-bold"
          >
            <span>Lihat Karya</span>
            <ArrowDown className="w-4 h-4 ml-1" />
          </Button>

          <Button
            href={developer.playStoreUrl}
            external
            variant="outline"
            size="lg"
            className="bg-white hover:bg-slate-50 border-slate-300 text-slate-900 px-7 py-3.5 shadow-sm text-sm font-bold"
          >
            <span>Google Play</span>
            <ExternalLink className="w-4 h-4 text-slate-600 ml-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};
