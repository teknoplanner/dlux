"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ArrowDown, ExternalLink } from "lucide-react";
import { developer } from "@/data/apps";
import { Button } from "@/components/ui/Button";

// Lazy load 3D scene only on desktop and only after page is idle
const HeroScene = dynamic(() => import("@/components/three/HeroScene.client"), {
  ssr: false,
});

export const Hero: React.FC = () => {
  const [shouldLoad3D, setShouldLoad3D] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Skip heavy 3D on mobile devices, small screens, or reduced-motion preference
    const isMobile =
      window.innerWidth < 1024 ||
      /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (isMobile || prefersReducedMotion) {
      return;
    }

    // On desktop, defer 3D loading until the browser main thread is idle
    const enable3D = () => {
      setShouldLoad3D(true);
    };

    if ("requestIdleCallback" in window) {
      const idleId = (window as unknown as { requestIdleCallback: (cb: () => void, opts: { timeout: number }) => number }).requestIdleCallback(
        enable3D,
        { timeout: 3500 }
      );
      return () => {
        (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId);
      };
    } else {
      const timer = setTimeout(enable3D, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <section className="relative min-h-[88vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#fafaf9]">
      {/* Zero-JS Native GPU Ambient Kinetic Backdrop (Instant FCP/LCP, 0ms TBT) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[550px] sm:w-[750px] h-[350px] bg-gradient-to-tr from-emerald-400/20 via-sky-400/25 to-purple-400/15 blur-3xl rounded-full opacity-75 animate-pulse" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[260px] bg-emerald-400/15 blur-3xl rounded-full" />
        <div className="absolute top-1/4 right-1/4 w-[320px] h-[280px] bg-sky-400/15 blur-3xl rounded-full" />
      </div>

      {/* Interactive 3D Ambient Kinetic Canvas (Deferred for desktop only) */}
      {shouldLoad3D && (
        <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out opacity-100">
          <HeroScene />
        </div>
      )}

      {/* Full-width transparent scrim spreading across the entire hero section */}
      <div className="absolute inset-0 z-[5] pointer-events-none bg-gradient-to-b from-[#fafaf9]/20 via-white/50 to-[#fafaf9]/90 backdrop-blur-[2px]" />

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

