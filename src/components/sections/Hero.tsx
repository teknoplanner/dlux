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

      {/* Hero Foreground Content: Minimal, Punchy, Clean */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10 text-center pointer-events-none">
        <span className="inline-block text-xs font-mono font-bold uppercase tracking-widest text-slate-500 mb-4 pointer-events-auto">
          D Lucky X • Indie Studio
        </span>

        <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold font-display tracking-tight text-slate-900 leading-[1.05] mb-5">
          Game Seru.<br />
          Aplikasi Bermanfaat.
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-lg mx-auto font-normal leading-relaxed mb-8">
          Koleksi game santai dan aplikasi Android yang ringan, aman, dan menyenangkan.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3.5 pointer-events-auto">
          <Button
            href="#apps"
            variant="primary"
            size="lg"
            className="bg-slate-900 hover:bg-slate-800 text-white px-7 py-3.5 shadow-sm text-sm font-semibold"
          >
            <span>Lihat Karya</span>
            <ArrowDown className="w-4 h-4 ml-1" />
          </Button>

          <Button
            href={developer.playStoreUrl}
            external
            variant="outline"
            size="lg"
            className="bg-white/85 backdrop-blur-md border-slate-300 text-slate-800 hover:bg-white px-7 py-3.5 shadow-sm text-sm font-semibold"
          >
            <span>Google Play</span>
            <ExternalLink className="w-4 h-4 text-slate-500 ml-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};
