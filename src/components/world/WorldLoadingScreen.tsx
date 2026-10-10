"use client";

import React, { useState, useEffect } from "react";
import { Compass, Sparkles, Shield, Trophy, Zap, Terminal } from "lucide-react";

interface WorldLoadingScreenProps {
  onFinishLoading: () => void;
}

const GAME_TIPS = [
  "💡 TIP: Hold SHIFT to activate Nitro Boost and sprint dash across bridges!",
  "💡 TIP: Strike the giant soccer ball at the Beach Arena to score spectacular goals!",
  "💡 TIP: Dive into the open ocean to swim gracefully across the archipelago!",
  "💡 TIP: Complete arcade challenges on each island to earn Gold Tokens & EXP!",
  "💡 TIP: Open the Smartphone Hub in the bottom-right corner for Minimap GPS & Fast Travel!",
  "💡 TIP: Collect all 30 Gold Tokens across the islands to become the Archipelago Champion!",
];

const LOADING_STAGES = [
  { threshold: 22, text: "Initializing WebGL 2.0 & Three.js Bloom Pipeline..." },
  { threshold: 45, text: "Building Voxel Archipelago, Beach Stadium & Sanctuary..." },
  { threshold: 70, text: "Syncing Champion Beacons, Ocean Particles & 3D Colliders..." },
  { threshold: 90, text: "Loading Procedural Audio Bank & Milo Controls..." },
  { threshold: 100, text: "Archipelago Ready! Opening Adventure Portal..." },
];

export const WorldLoadingScreen: React.FC<WorldLoadingScreenProps> = ({ onFinishLoading }) => {
  const [progress, setProgress] = useState(0);
  const [tipIdx, setTipIdx] = useState(0);
  const [currentStageText, setCurrentStageText] = useState("Initializing Graphics Engine...");

  // Ref keeps the latest callback without triggering effect restarts
  const onFinishRef = React.useRef(onFinishLoading);
  onFinishRef.current = onFinishLoading;

  // Progressive asset loader - strictly runs once on mount
  useEffect(() => {
    let completed = false;
    const startTime = Date.now();
    const duration = 1200; // Snappy 1.2s smooth load

    const interval = setInterval(() => {
      if (completed) return;
      const elapsed = Date.now() - startTime;
      const rawPct = Math.min(100, Math.floor((elapsed / duration) * 100));

      // Ease-out curve
      const easedPct = Math.min(
        100,
        Math.floor(100 * Math.sin((rawPct / 100) * (Math.PI / 2)))
      );

      setProgress(easedPct);

      const matchingStage = LOADING_STAGES.find((s) => easedPct <= s.threshold);
      if (matchingStage) {
        setCurrentStageText(matchingStage.text);
      }

      if (easedPct >= 100 && !completed) {
        completed = true;
        clearInterval(interval);
        setTimeout(() => {
          onFinishRef.current?.();
        }, 120);
      }
    }, 25);

    return () => {
      completed = true;
      clearInterval(interval);
    };
  }, []);

  // Rotate tips every 2.4s
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIdx((prev) => (prev + 1) % GAME_TIPS.length);
    }, 2400);
    return () => clearInterval(tipInterval);
  }, []);

  const handleSkip = () => {
    setProgress(100);
    onFinishRef.current?.();
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#030712] flex flex-col items-center justify-between p-6 sm:p-12 text-white select-none overflow-hidden animate-in fade-out duration-500">
      {/* Background Animated Cyber Ambient Lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] animate-pulse delay-700" />
        {/* Subtle scanning grid line */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black_40%,transparent_100%)] opacity-40" />
      </div>

      {/* Top Studio Header */}
      <div className="relative z-10 w-full flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-xs font-black tracking-[0.3em] uppercase text-emerald-400">
            DLUCKYX ENTERTAINMENT STUDIOS
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-slate-500 font-bold tracking-widest hidden sm:inline">
            BUILD // v2.6.4-RELEASE
          </span>
          <button
            type="button"
            onClick={handleSkip}
            className="px-2.5 py-1 rounded bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-[10px] font-mono font-bold text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <span>SKIP</span>
            <span className="text-emerald-400">▶▶</span>
          </button>
        </div>
      </div>

      {/* Central Hero Crest & Grand Title */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-6 my-auto">
        {/* Glowing Cat Hero Holographic Emblem */}
        <div className="relative">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-500 via-emerald-400 to-cyan-400 p-[3px] shadow-[0_0_50px_rgba(6,182,212,0.4)] animate-pulse">
            <div className="w-full h-full bg-[#0a0f1d] rounded-[21px] flex items-center justify-center text-5xl sm:text-6xl shadow-inner">
              🐱
            </div>
          </div>
          {/* Orbital Satellite Dots */}
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-cyan-400 border-2 border-[#030712] shadow-[0_0_10px_#06b6d4] animate-ping" />
          <div className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-[#030712] shadow-[0_0_8px_#f59e0b]" />
        </div>

        {/* Studio Game Logo */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-mono text-[11px] font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            OFFICIAL 3D COASTAL EXPEDITION
          </div>
          <h1 className="text-4xl sm:text-6xl font-black font-display tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-teal-300 drop-shadow-[0_4px_24px_rgba(6,182,212,0.5)]">
            D LUCKY WORLD <span className="text-amber-400">3D</span>
          </h1>
          <p className="text-xs sm:text-sm font-mono tracking-[0.25em] uppercase text-slate-400 font-bold">
            COASTAL GAMING ARCHIPELAGO // MILO&apos;S ODYSSEY
          </p>
        </div>
      </div>

      {/* Bottom Loading Progress Engine & Tips Marquee */}
      <div className="relative z-10 w-full max-w-2xl space-y-4">
        {/* Loading Phase Text & Percentage Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-2 text-cyan-300 font-bold tracking-wide">
              <Terminal className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
              {currentStageText}
            </span>
            <span className="font-black text-amber-400 tracking-wider text-sm px-2 py-0.5 rounded bg-slate-900 border border-amber-400/30">
              [ {progress}% ]
            </span>
          </div>

          {/* Dual-Layer Beveled Loading Track */}
          <div className="w-full h-3.5 bg-slate-950 rounded-full border-2 border-cyan-500/50 p-0.5 overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-400 rounded-full transition-all duration-75 relative shadow-[0_0_12px_#38bdf8]"
              style={{ width: `${progress}%` }}
            >
              {/* Illuminated head sparkle */}
              <div className="absolute right-0 top-0 bottom-0 w-3 bg-white rounded-full blur-[1px] shadow-[0_0_8px_#ffffff]" />
            </div>
          </div>
        </div>

        {/* Dynamic Game Tips Marquee */}
        <div className="min-h-[44px] flex items-center justify-center p-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-center">
          <p className="text-xs sm:text-sm text-slate-300 font-mono tracking-wide transition-opacity duration-300">
            {GAME_TIPS[tipIdx]}
          </p>
        </div>
      </div>
    </div>
  );
};
