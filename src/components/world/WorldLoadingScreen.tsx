"use client";

import React, { useState, useEffect } from "react";
import { Compass, Ship, Anchor, Sparkles, Trophy, MapPin, Wind, ShieldAlert, ArrowRight } from "lucide-react";

interface WorldLoadingScreenProps {
  onFinishLoading: () => void;
}

const EXPEDITION_LORE_TIPS = [
  {
    tag: "ISLAND NAVIGATION",
    title: "Sprint Across Bridges",
    desc: "Hold SHIFT or tap Nitro Boost to dash rapidly across bridges and through central plazas.",
  },
  {
    tag: "COASTAL SPORTS",
    title: "Beach Stadium Soccer",
    desc: "Dribble the giant soccer ball at the southern arena into the net to trigger a GOAL celebration!",
  },
  {
    tag: "OCEAN EXPEDITION",
    title: "Open Sea Swimming",
    desc: "Walk straight into the ocean to transition smoothly into graceful swimming across the reefs.",
  },
  {
    tag: "VILLAGE COMMERCE",
    title: "Island Residents & Stalls",
    desc: "Meet Mang Ujang at the fruit stand, Alchemist Luna, and fisherman Pak Mamat along the piers.",
  },
  {
    tag: "TRAVEL COMPENDIUM",
    title: "Minimap & Fast Travel",
    desc: "Press [M] or tap MAP to open your Navigator's Slate for instant teleportation to any discovered island.",
  },
  {
    tag: "CHAMPION'S CALL",
    title: "Collect 30 Golden Tokens",
    desc: "Search beaches, ancient sanctuary steps, and hidden coastal rocks to claim the Archipelago Crown.",
  },
];

const NARRATIVE_STAGES = [
  { threshold: 20, text: "Charting ocean currents & archipelago reefs..." },
  { threshold: 42, text: "Raising Central Plaza, MOBA Sanctuary & Beach Stadium..." },
  { threshold: 68, text: "Welcoming island villagers, fishing piers & merchant stalls..." },
  { threshold: 88, text: "Unfurling sails & tuning the Navigator's compass..." },
  { threshold: 100, text: "Archipelago charted! Anchors weighed & ready!" },
];

export const WorldLoadingScreen: React.FC<WorldLoadingScreenProps> = ({ onFinishLoading }) => {
  const [progress, setProgress] = useState(0);
  const [tipIdx, setTipIdx] = useState(0);
  const [stageText, setStageText] = useState("Charting ocean currents & archipelago reefs...");

  const onFinishRef = React.useRef(onFinishLoading);
  onFinishRef.current = onFinishLoading;

  // Progressive asset loader - smooth ease-out curve
  useEffect(() => {
    let completed = false;
    const startTime = Date.now();
    const duration = 1350; // Snappy 1.35s AAA load feel

    const interval = setInterval(() => {
      if (completed) return;
      const elapsed = Date.now() - startTime;
      const rawPct = Math.min(100, Math.floor((elapsed / duration) * 100));

      // Ease-out sinusoidal curve
      const easedPct = Math.min(
        100,
        Math.floor(100 * Math.sin((rawPct / 100) * (Math.PI / 2)))
      );

      setProgress(easedPct);

      const matchingStage = NARRATIVE_STAGES.find((s) => easedPct <= s.threshold);
      if (matchingStage) {
        setStageText(matchingStage.text);
      }

      if (easedPct >= 100 && !completed) {
        completed = true;
        clearInterval(interval);
        setTimeout(() => {
          onFinishRef.current?.();
        }, 150);
      }
    }, 25);

    return () => {
      completed = true;
      clearInterval(interval);
    };
  }, []);

  // Rotate tips every 2.8s
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIdx((prev) => (prev + 1) % EXPEDITION_LORE_TIPS.length);
    }, 2800);
    return () => clearInterval(tipInterval);
  }, []);

  const handleSkip = () => {
    setProgress(100);
    onFinishRef.current?.();
  };

  const currentTip = EXPEDITION_LORE_TIPS[tipIdx];

  return (
    <div className="absolute inset-0 z-50 bg-[#020612] flex flex-col justify-between p-6 sm:p-12 text-white select-none overflow-hidden animate-in fade-out duration-500">
      {/* Cinematic Ambient Atmosphere Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Nautical Horizon Glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-teal-500/15 via-emerald-600/10 to-transparent rounded-full blur-[160px]" />
        <div className="absolute -bottom-40 right-1/4 w-[600px] h-[500px] bg-amber-500/10 rounded-full blur-[180px]" />

        {/* Subtle Nautical Compass Grid Lines */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.06)_1px,transparent_1px)] bg-[size:32px_32px] opacity-60" />

        {/* Vignette border */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(2,6,18,0.85)_100%)]" />
      </div>

      {/* =================================================================== */}
      {/* TOP BAR: STUDIO BRAND & VERSION                                     */}
      {/* =================================================================== */}
      <div className="relative z-10 w-full flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          {/* Studio Vector Monogram */}
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 p-[1.5px] shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center justify-center">
            <div className="w-full h-full bg-[#040d1a] rounded-[6px] flex items-center justify-center">
              <span className="font-display font-black text-xs text-emerald-400">DL</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-display font-bold tracking-[0.25em] text-slate-200 uppercase">
              DLUCKYX ENTERTAINMENT
            </span>
            <span className="text-[9px] font-mono tracking-widest text-emerald-400/90 font-medium uppercase">
              COASTAL ADVENTURE DIVISION
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-slate-500 font-bold tracking-widest hidden sm:inline">
            ARCHIPELAGO // v2.5.0 STABLE
          </span>
          <button
            type="button"
            onClick={handleSkip}
            className="group px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 text-[10px] font-mono font-bold text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <span>SKIP INTRO</span>
            <ArrowRight className="w-3 h-3 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* CENTERPIECE: STYLIZED ADVENTURE CREST & TITLE                       */}
      {/* =================================================================== */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-6 my-auto max-w-xl mx-auto">
        {/* Authentic Vector Compass Rose / Mascot Emblem */}
        <div className="relative flex items-center justify-center">
          {/* Subtle Outer Dial Ring */}
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-teal-500/30 flex items-center justify-center p-2 animate-[spin_40s_linear_infinite]">
            <div className="w-full h-full rounded-full border border-dashed border-amber-400/30" />
          </div>

          {/* Golden Adventure Medallion */}
          <div className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-b from-[#0f2438] via-[#071322] to-[#030914] border-2 border-amber-400/60 p-2 shadow-[0_0_40px_rgba(20,184,166,0.35),inset_0_0_15px_rgba(245,158,11,0.2)] flex items-center justify-center">
            {/* Custom SVG Golden Compass & Nautical Star */}
            <svg viewBox="0 0 64 64" className="w-12 h-12 text-amber-400 drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]">
              {/* Outer compass ring */}
              <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
              <circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2,3" strokeOpacity="0.6" />
              {/* North / South / East / West needle points */}
              <polygon points="32,6 35,29 32,26 29,29" fill="#facc15" />
              <polygon points="32,58 35,35 32,38 29,35" fill="#ca8a04" />
              <polygon points="6,32 29,29 26,32 29,35" fill="#eab308" />
              <polygon points="58,32 35,29 38,32 35,35" fill="#ca8a04" />
              {/* Center Milo Cat Silhouette Head */}
              <circle cx="32" cy="32" r="6" fill="#0f172a" stroke="#facc15" strokeWidth="1.5" />
              {/* Cat ears */}
              <polygon points="27,28 29,24 31,28" fill="#facc15" />
              <polygon points="33,28 35,24 37,28" fill="#facc15" />
            </svg>
          </div>

          {/* Accent Orbit Pips */}
          <div className="absolute -top-1 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981]" />
          <div className="absolute -bottom-1 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b]" />
        </div>

        {/* Game Title & Subtitle */}
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-teal-950/80 via-emerald-950/80 to-teal-950/80 border border-teal-500/40 text-teal-300 font-mono text-[10px] font-bold tracking-[0.25em] uppercase shadow-sm">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>ORIGINAL 3D ISLAND ODYSSEY</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-teal-200 drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
            D LUCKY WORLD <span className="text-amber-400">3D</span>
          </h1>

          <p className="text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-slate-400 font-medium">
            COASTAL ARCHIPELAGO EXPEDITION
          </p>
        </div>
      </div>

      {/* =================================================================== */}
      {/* BOTTOM PROGRESS TRACK & DISPATCH LOG                                */}
      {/* =================================================================== */}
      <div className="relative z-10 w-full max-w-2xl mx-auto space-y-4">
        {/* Loading Phase Text & Percentage Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-teal-300 font-bold tracking-wide">
              <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
              <span>{stageText}</span>
            </div>
            <span className="font-mono font-bold text-amber-400 tracking-wider text-xs px-2.5 py-0.5 rounded bg-slate-900 border border-amber-400/30">
              {progress}%
            </span>
          </div>

          {/* Crafted Game Loading Track (Brushed Brass & Deep Navy Rail) */}
          <div className="relative w-full h-3 bg-slate-950 rounded-full border border-teal-500/40 p-0.5 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
            <div
              className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-amber-400 rounded-full transition-all duration-75 relative shadow-[0_0_12px_rgba(16,185,129,0.5)]"
              style={{ width: `${progress}%` }}
            >
              {/* Illuminated leading sparkle edge */}
              <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-white rounded-full blur-[0.5px] shadow-[0_0_6px_#ffffff]" />
            </div>
          </div>
        </div>

        {/* Voyager's Field Guide Lore Card */}
        <div className="p-3 sm:p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 flex items-start gap-3 transition-opacity duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.4)]">
          <div className="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-400/30 text-teal-300 flex items-center justify-center shrink-0 mt-0.5">
            <Compass className="w-4 h-4" />
          </div>
          <div className="space-y-0.5 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-wider text-amber-400 uppercase">
                {currentTip.tag}
              </span>
              <span className="text-slate-600 text-xs">•</span>
              <span className="text-xs font-bold text-white truncate">
                {currentTip.title}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-snug line-clamp-2">
              {currentTip.desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
