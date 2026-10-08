"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Gamepad2, ExternalLink, ShieldCheck, Download, Star } from "lucide-react";
import { developer, apps } from "@/data/apps";
import { Button } from "@/components/ui/Button";
import { SceneFallback } from "@/components/three/SceneFallback";

const HeroScene = dynamic(() => import("@/components/three/HeroScene.client"), {
  ssr: false,
  loading: () => <SceneFallback />,
});

export const Hero: React.FC = () => {
  const totalApps = apps.length;

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-[#090a10]">
      {/* Subtle Ambient Radial Light (Restrained & Grounded) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-indigo-950/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Publisher Status Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-medium text-gray-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Pengembang Google Play Resmi</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold font-display tracking-tight text-white leading-[1.15]">
              Game Seru &amp; Aplikasi Bermanfaat untuk Android
            </h1>

            {/* Subtitle (Authentic human copy, no em dashes, covers both games and apps) */}
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              D Lucky X merilis game santai dan aplikasi produktivitas harian di Google Play Store. Dari aksi adu penalti, petualangan kucing luar angkasa, edukasi matematika anak, hingga pencatat keuangan dan editor PDF offline yang aman.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Button href="#apps" variant="primary" size="lg" className="w-full sm:w-auto shadow-md">
                <Gamepad2 className="w-5 h-5" />
                Lihat Semua Aplikasi ({totalApps})
              </Button>
              <Button
                href={developer.playStoreUrl}
                external
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-white/15 hover:border-white/30"
              >
                <span>Halaman Google Play</span>
                <ExternalLink className="w-4 h-4 text-cyan-400" />
              </Button>
            </div>

            {/* Verified Developer Stats Bar */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10 max-w-lg mx-auto lg:mx-0">
              <div className="text-left">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-lg">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>4.9</span>
                </div>
                <div className="text-xs text-gray-400">Rating Rata-Rata</div>
              </div>

              <div className="text-left">
                <div className="flex items-center gap-1.5 text-white font-bold text-lg">
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>4,000+</span>
                </div>
                <div className="text-xs text-gray-400">Total Unduhan</div>
              </div>

              <div className="text-left">
                <div className="flex items-center gap-1.5 text-white font-bold text-lg">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>100%</span>
                </div>
                <div className="text-xs text-gray-400">Play Protect Aman</div>
              </div>
            </div>
          </div>

          {/* Right Column: High-Craft 3D Scene */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl bg-[#0f111a]/80 border border-white/10 shadow-2xl p-2 overflow-hidden">
              <HeroScene />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
