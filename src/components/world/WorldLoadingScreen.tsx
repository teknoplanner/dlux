"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Compass, ThumbsUp, Star, CheckCircle, ArrowRight, ShieldCheck, Gamepad2 } from "lucide-react";
import { WorldLang, detectUserLanguage, WORLD_STRINGS } from "./worldI18n";

interface WorldLoadingScreenProps {
  onFinishLoading: () => void;
  lang?: WorldLang;
}

const ROBLOX_STYLE_TIPS = [
  "Sprint across stone bridges by holding [SHIFT] on keyboard or tapping [SPRINT] on mobile!",
  "Kick the giant soccer ball at Beach Stadium into the net to score a spectacular GOAL!",
  "Walk straight into the ocean—Milo will automatically swim smoothly across the reefs!",
  "Press [M] anytime to open your Map & Fast Travel to any discovered island instantly!",
  "Meet island villagers like Mang Ujang at the fruit stall and Pak Mamat at the fishing dock!",
  "Find all 30 hidden Gold Tokens scattered across the archipelago to become the Champion!",
];

const LOADING_STATUSES = [
  "Connecting to D Lucky World Server...",
  "Loading 3D Terrain, Beaches & Palms...",
  "Spawning Island Residents & Market Stalls...",
  "Preparing Ocean Currents & Wildlife...",
  "Experience Ready! Launching Adventure...",
];

export const WorldLoadingScreen: React.FC<WorldLoadingScreenProps> = ({ onFinishLoading, lang: propLang }) => {
  const [lang] = useState<WorldLang>(() => propLang || detectUserLanguage());
  const t = WORLD_STRINGS[lang];
  const [progress, setProgress] = useState(0);
  const [tipIdx, setTipIdx] = useState(0);
  const [statusText, setStatusText] = useState(t.loading.statuses[0]);

  const onFinishRef = React.useRef(onFinishLoading);
  onFinishRef.current = onFinishLoading;

  useEffect(() => {
    let completed = false;
    const startTime = Date.now();
    const duration = 1400; // Smooth 1.4s load

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
        }, 150);
      }
    }, 25);

    return () => {
      completed = true;
      clearInterval(interval);
    };
  }, [t]);

  // Cycle tips every 2.6s
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIdx((prev) => (prev + 1) % t.loading.tips.length);
    }, 2600);
    return () => clearInterval(tipInterval);
  }, [t]);

  const handleSkip = () => {
    setProgress(100);
    onFinishRef.current?.();
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#0d1117] flex flex-col justify-between p-4 sm:p-8 text-white select-none overflow-hidden animate-in fade-out duration-300">
      {/* Background Graphic with Stylized Sunbeam & Mesh Pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/15 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 right-1/4 w-[600px] h-[400px] bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* Top Header Bar (Roblox Experience Style) */}
      <div className="relative z-10 w-full flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Roblox-style App Icon / Square Emblem */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-[#161b22] rounded-[10px] flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                D Lucky World 3D
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                {t.common.experience}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">{t.common.byStudio}</p>
          </div>
        </div>

        {/* Skip button */}
        <button
          type="button"
          onClick={handleSkip}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <span>{t.common.skip}</span>
          <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
        </button>
      </div>

      {/* Centerpiece: Roblox Style Experience Cover Card */}
      <div className="relative z-10 w-full max-w-lg mx-auto my-auto bg-[#161b22]/95 border-2 border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-md space-y-5">
        {/* Experience Thumbnail Banner */}
        <div className="relative w-full h-36 sm:h-44 rounded-2xl overflow-hidden bg-gradient-to-tr from-emerald-900 via-teal-800 to-sky-900 border border-white/10 shadow-inner flex flex-col justify-end p-4">
          {/* Decorative Sun & Islands Silhouette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-400/20 via-transparent to-black/60" />

          {/* Tropical Island Badge */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] tracking-wide uppercase shadow">
                ★ OFFICIAL 3D EXPEDITION
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] tracking-tight">
                D LUCKY WORLD <span className="text-amber-400">3D</span>
              </h2>
            </div>
          </div>
        </div>

        {/* Experience Creator & Metadata Pills (Roblox Style) */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs sm:text-sm text-slate-200">DLUCKYX GAMES</span>
            <CheckCircle className="w-4 h-4 text-sky-400 fill-sky-400/20" />
          </div>

          <div className="flex items-center gap-2 text-xs font-bold">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 text-emerald-400 border border-slate-700">
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>98%</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 text-amber-400 border border-slate-700">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>4.9</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-cyan-300 border border-slate-700">
              3D Adventure
            </div>
          </div>
        </div>

        {/* Loading Progress Section (Roblox Chunky Bar) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-bold text-slate-300 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              {statusText}
            </span>
            <span className="font-black text-emerald-400 bg-slate-900 px-2 py-0.5 rounded-lg border border-emerald-500/30">
              {progress}%
            </span>
          </div>

          {/* Chunky Roblox-Style Progress Bar */}
          <div className="w-full h-4 sm:h-5 bg-slate-900 rounded-full border-2 border-slate-700 p-0.5 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-green-400 rounded-full transition-all duration-75 relative shadow-[0_0_12px_rgba(16,185,129,0.5)]"
              style={{ width: `${progress}%` }}
            >
              {/* Highlight Glow Edge */}
              <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/80 rounded-full blur-[0.5px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Roblox Tip Banner */}
      <div className="relative z-10 w-full max-w-lg mx-auto bg-[#161b22]/90 border border-slate-800 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 shadow-md">
        <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <p className="text-xs text-slate-300 font-medium leading-snug line-clamp-2">
          <strong className="text-white">Tip:</strong> {t.loading.tips[tipIdx]}
        </p>
      </div>
    </div>
  );
};
