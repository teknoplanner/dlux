"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Compass, ArrowRight, Gamepad2, Shield, Radio, Trophy, Zap, Anchor } from "lucide-react";
import { WorldLang, detectUserLanguage, WORLD_STRINGS } from "./worldI18n";

interface WorldLoadingScreenProps {
  onFinishLoading: () => void;
  lang?: WorldLang;
}

export const WorldLoadingScreen: React.FC<WorldLoadingScreenProps> = ({ onFinishLoading, lang: propLang }) => {
  const [lang] = useState<WorldLang>(() => propLang || detectUserLanguage());
  const t = WORLD_STRINGS[lang];
  const [progress, setProgress] = useState(0);
  const [tipIdx, setTipIdx] = useState(0);
  const [statusText, setStatusText] = useState(t.loading.statuses[0]);

  const onFinishRef = React.useRef(onFinishLoading);
  onFinishRef.current = onFinishLoading;

  // Keyboard shortcut (Enter or Space) to skip loading when ready
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Enter" || e.code === "Space") {
        e.preventDefault();
        setProgress(100);
        onFinishRef.current?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    let completed = false;
    const startTime = Date.now();
    const duration = 1600; // Smooth 1.6s cinematic loading

    const interval = setInterval(() => {
      if (completed) return;
      const elapsed = Date.now() - startTime;
      const rawPct = Math.min(100, Math.floor((elapsed / duration) * 100));

      // Ease-out cinematic curve
      const easedPct = Math.min(
        100,
        Math.floor(100 * Math.sin((rawPct / 100) * (Math.PI / 2)))
      );

      setProgress(easedPct);

      const stageIndex = Math.min(
        t.loading.statuses.length - 1,
        Math.floor((easedPct / 100) * t.loading.statuses.length)
      );
      setStatusText(t.loading.statuses[stageIndex]);

      if (easedPct >= 100 && !completed) {
        completed = true;
        clearInterval(interval);
        setTimeout(() => {
          onFinishRef.current?.();
        }, 180);
      }
    }, 25);

    return () => {
      completed = true;
      clearInterval(interval);
    };
  }, [t]);

  // Cycle tips periodically
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIdx((prev) => (prev + 1) % t.loading.tips.length);
    }, 2800);
    return () => clearInterval(tipInterval);
  }, [t]);

  const handleSkip = () => {
    setProgress(100);
    onFinishRef.current?.();
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#030914] flex flex-col justify-between p-4 sm:p-8 text-white select-none overflow-hidden animate-in fade-out duration-300">
      {/* 1. Cinematic Background: Oceanic Nebula, Sunburst Rays & Nautical Grids */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Core Glowing Sun Flare & Ocean Atmosphere */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-gradient-to-b from-teal-500/20 via-cyan-600/10 to-transparent rounded-full blur-[130px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1100px] h-[350px] bg-gradient-to-t from-emerald-600/15 via-teal-900/10 to-transparent rounded-full blur-[140px]" />

        {/* Nautical Cartographic Rings & Compass Rays */}
        <svg
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] opacity-15 stroke-teal-400"
          viewBox="0 0 100 100"
          fill="none"
        >
          <circle cx="50" cy="50" r="48" strokeWidth="0.3" strokeDasharray="2,2" />
          <circle cx="50" cy="50" r="38" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="28" strokeWidth="0.2" strokeDasharray="1,3" />
          <line x1="50" y1="2" x2="50" y2="98" strokeWidth="0.3" />
          <line x1="2" y1="50" x2="98" y2="50" strokeWidth="0.3" />
          <polygon points="50,6 52,14 48,14" fill="#2dd4bf" />
        </svg>

        {/* Ambient Subtle Tech Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#0e7490_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />

        {/* Vignette Edge Shading */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#020611_95%)]" />
      </div>

      {/* 2. Top Header Bar: Studio Crest & Skip Action */}
      <header className="relative z-10 w-full flex items-center justify-between">
        {/* Studio Crest */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-teal-500 to-cyan-500 p-0.5 shadow-[0_0_20px_rgba(45,212,191,0.35)]">
            <div className="w-full h-full bg-[#071322] rounded-[14px] flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xs sm:text-sm text-white tracking-widest font-display uppercase">
                DLUCKYX STUDIOS
              </span>
              <span className="px-1.5 py-0.2 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-[9px] font-mono font-bold">
                PROD
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider">
              GLOBAL EXPEDITION ENGINE • 60 FPS
            </p>
          </div>
        </div>

        {/* Skip button with enter hint */}
        <button
          type="button"
          onClick={handleSkip}
          className="group px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-teal-950/80 active:bg-slate-950 border border-teal-500/30 hover:border-teal-400/70 text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center gap-2 shadow-[0_4px_16px_rgba(0,0,0,0.5)] cursor-pointer"
        >
          <span className="font-mono text-[11px] tracking-wider uppercase">{t.common.skip}</span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-800 text-[9px] font-mono text-slate-300 border border-white/10 group-hover:border-teal-400/40">
            ENTER ↵
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-teal-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </header>

      {/* 3. Center Hero Stage: Grand Game Title & Animated Mascot Spotlight */}
      <main className="relative z-10 w-full max-w-xl mx-auto my-auto flex flex-col items-center text-center space-y-6">
        {/* Hero Character Emblem Stage */}
        <div className="relative flex items-center justify-center">
          {/* Pulsating Glowing Celestial Rings */}
          <div className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-teal-500/30 via-amber-400/20 to-cyan-400/20 blur-xl animate-pulse" />
          <div className="absolute w-36 h-36 rounded-full border border-teal-400/30 animate-[spin_12s_linear_infinite]" />
          <div className="absolute w-40 h-40 rounded-full border border-dashed border-amber-400/30 animate-[spin_20s_linear_infinite_reverse]" />

          {/* Floating Gold Coin Orbits */}
          <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border-2 border-yellow-100 shadow-[0_0_15px_#f59e0b] flex items-center justify-center text-xs animate-bounce">
            🪙
          </div>
          <div className="absolute -bottom-2 -left-2 w-7 h-7 rounded-full bg-gradient-to-tr from-teal-400 to-cyan-300 border border-white/60 shadow-[0_0_12px_#2dd4bf] flex items-center justify-center text-xs">
            ✨
          </div>

          {/* Milo Astronaut Hero Avatar Card */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-b from-[#0b253e] via-[#071727] to-[#040e19] border-2 border-teal-400/60 shadow-[0_15px_40px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(45,212,191,0.25)] flex items-center justify-center">
            <span className="text-5xl sm:text-6xl select-none filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]">
              🐱
            </span>
            {/* Astronaut Helmet Visor Highlight Sheen */}
            <div className="absolute inset-1.5 rounded-[22px] border border-cyan-400/40 pointer-events-none bg-gradient-to-tr from-transparent via-cyan-400/10 to-white/20" />
            <div className="absolute bottom-2 px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-teal-400/50 text-[9px] font-mono font-bold text-teal-300">
              MILO • HERO
            </div>
          </div>
        </div>

        {/* Grand Title Logo Typography */}
        <div className="space-y-2">
          {/* Top Tagline Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-teal-500/20 via-amber-400/15 to-teal-500/20 border border-teal-400/40 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: "6s" }} />
            <span className="text-[10px] sm:text-xs font-black font-mono tracking-widest text-teal-200 uppercase">
              COASTAL ARCHIPELAGO EXPEDITION
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: "6s" }} />
          </div>

          {/* Grand Emblazoned 3D Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white font-display drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] flex items-center justify-center gap-3">
            <span>D LUCKY WORLD</span>
            <span className="px-2.5 py-0.5 rounded-xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 text-slate-950 text-2xl sm:text-3xl font-black shadow-[0_0_24px_rgba(245,158,11,0.6)] border-t border-white/60">
              3D
            </span>
          </h1>

          {/* Subtitle / Island Description */}
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-md mx-auto leading-relaxed drop-shadow-sm">
            {lang === "id"
              ? "Jelajahi pulau tropis, arungi lautan biru, temui warga kepulauan, dan kumpulkan 30 Koin Emas!"
              : "Explore tropical islands, cruise across azure oceans, meet island villagers, and collect all 30 Gold Tokens!"}
          </p>
        </div>
      </main>

      {/* 4. Bottom Game Loading Console: Progress Bar, Status & Rotating Gameplay Tips */}
      <footer className="relative z-10 w-full max-w-xl mx-auto space-y-3.5">
        {/* Status Line: Current Loading Task & Percentage */}
        <div className="flex items-center justify-between text-xs sm:text-sm font-mono">
          <div className="flex items-center gap-2.5 text-teal-300 font-bold">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500" />
            </span>
            <span className="tracking-wide text-[11px] sm:text-xs truncate max-w-[280px] sm:max-w-none">
              {statusText}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-[#071322] border border-teal-500/40 text-teal-300 font-black text-xs sm:text-sm shadow-inner">
            <span>{progress}%</span>
          </div>
        </div>

        {/* Sleek AAA Game Loading Bar */}
        <div className="relative w-full h-4 sm:h-5 bg-[#050f1a] rounded-full border-2 border-teal-500/40 p-0.5 overflow-hidden shadow-[inset_0_2px_8px_rgba(0,0,0,0.8),0_0_20px_rgba(45,212,191,0.2)]">
          {/* Animated Glow Track */}
          <div
            className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-300 rounded-full transition-all duration-75 relative shadow-[0_0_16px_rgba(45,212,191,0.7)]"
            style={{ width: `${progress}%` }}
          >
            {/* Pulsating Leading-Edge Spark */}
            <div className="absolute right-0 top-0 bottom-0 w-3 bg-white rounded-full shadow-[0_0_10px_#ffffff] blur-[0.5px]" />
          </div>
        </div>

        {/* Pro Rotating Gameplay Tip Card */}
        <div className="bg-[#071322]/90 backdrop-blur-md border border-teal-500/25 rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
          <div className="w-7 h-7 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-300 flex items-center justify-center shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <p className="text-[11px] sm:text-xs text-slate-300 leading-snug font-sans">
            <strong className="text-amber-300 font-semibold uppercase tracking-wider font-mono mr-1">
              [TIP]:
            </strong>
            {t.loading.tips[tipIdx]}
          </p>
        </div>
      </footer>
    </div>
  );
};
