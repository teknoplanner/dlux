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

      {/* Full-width transparent scrim spreading across the entire hero section */}
      <div className="absolute inset-0 z-[5] pointer-events-none bg-gradient-to-b from-[#fafaf9]/30 via-white/60 to-[#fafaf9]/90 backdrop-blur-[3px]" />

      {/* Hero Foreground Content - full width flow without boxed borders */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 relative z-10 text-center pointer-events-none">
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold font-display tracking-tight text-slate-950 leading-[1.05] mb-5">
          Engaging Games.<br />
          Useful Apps.
        </h1>

        <p className="text-base sm:text-lg text-slate-700 max-w-lg mx-auto font-medium leading-relaxed mb-8">
          A collection of casual games and lightweight, secure, and delightful Android apps.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3.5 pointer-events-auto">
          <Button
            href="#apps"
            variant="primary"
            size="lg"
            className="bg-slate-900 hover:bg-slate-800 text-white px-7 py-3.5 shadow-sm text-sm font-bold"
          >
            <span>Explore Apps &amp; Games</span>
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
