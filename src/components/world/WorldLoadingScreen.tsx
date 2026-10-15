"use client";

import React, { useState, useEffect } from "react";
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
    let currentPct = 0;

    // Smooth progressive advancement in stages (~2.2s total)
    const interval = setInterval(() => {
      if (completed) return;

      let step = 0;
      if (currentPct < 25) {
        step = 1.8 + Math.random() * 1.6;
      } else if (currentPct < 60) {
        step = 2.4 + Math.random() * 2.0;
      } else if (currentPct < 88) {
        step = 1.8 + Math.random() * 1.5;
      } else if (currentPct < 98) {
        step = 1.0 + Math.random() * 1.2;
      } else {
        step = 1.0;
      }

      currentPct = Math.min(100, currentPct + step);
      const rounded = Math.floor(currentPct);
      setProgress(rounded);

      const stageIndex = Math.min(
        t.loading.statuses.length - 1,
        Math.floor((rounded / 100) * t.loading.statuses.length)
      );
      setStatusText(t.loading.statuses[stageIndex]);

      if (rounded >= 100 && !completed) {
        completed = true;
        clearInterval(interval);
        setTimeout(() => {
          onFinishRef.current?.();
        }, 300);
      }
    }, 40);

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
    <div className="absolute inset-0 z-50 bg-[#0f172a] flex flex-col justify-between p-4 sm:p-8 text-[#3e2723] select-none overflow-hidden animate-in fade-out duration-300">
      {/* 1. Paper Craft Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a]">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-amber-500/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-emerald-500/10 rounded-full blur-[130px]" />
      </div>

      {/* 2. Top Header Bar: Paper Studio Crest & Skip Button */}
      <header className="relative z-10 w-full flex items-center justify-between">
        {/* Studio Crest with Paper Coin Icon */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#fffdf6] border-2 border-[#5c3e21] shadow-[0_3px_0_#3e2723] flex items-center justify-center p-1.5">
            <img
              src="/assets/ui/paper/Icons/GameIcons/IconCoin.png"
              alt="Logo"
              className="w-full h-full object-contain"
              draggable={false}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm text-[#fffdf6] tracking-wider uppercase drop-shadow">
                DLUCKYX STUDIOS
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#22c55e] text-white text-[10px] font-black border border-[#15803d] shadow-sm">
                3D
              </span>
            </div>
            <p className="text-[11px] text-amber-200/80 font-bold tracking-wide">
              COASTAL ARCHIPELAGO EXPEDITION
            </p>
          </div>
        </div>

        {/* PaperUIKit Skip Button using ButtonSmallWhite & IconNext */}
        <button
          type="button"
          onClick={handleSkip}
          className="relative group inline-flex items-center justify-center cursor-pointer select-none active:scale-95 transition-transform"
        >
          <img
            src="/assets/ui/paper/Buttons/SmallButtons/ButtonSmallWhite.png"
            alt="Skip"
            className="h-9 sm:h-10 w-auto group-active:hidden drop-shadow-md"
            draggable={false}
          />
          <img
            src="/assets/ui/paper/Buttons/SmallButtons/ButtonSmallWhiteActive.png"
            alt="Skip"
            className="h-9 sm:h-10 w-auto hidden group-active:block drop-shadow-md"
            draggable={false}
          />
          <span className="absolute inset-0 flex items-center justify-center gap-1.5 font-black text-[#5c3e21] text-xs uppercase tracking-wider pb-1 group-active:pt-1">
            <span>{t.common.skip}</span>
            <img
              src="/assets/ui/paper/Icons/GameIcons/IconNext.png"
              alt=""
              className="w-3.5 h-3.5 object-contain"
              draggable={false}
            />
          </span>
        </button>
      </header>

      {/* 3. Centerpiece: Paper Card Title Banner */}
      <main className="relative z-10 w-full max-w-lg mx-auto my-auto text-center">
        <div className="bg-[#fffdf6] border-4 border-[#5c3e21] rounded-3xl p-6 sm:p-8 shadow-[0_12px_0_#3e2723] space-y-4">
          {/* Top Tagline Pill with Heart Icon */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fef08a] border-2 border-[#ca8a04] shadow-sm">
            <img
              src="/assets/ui/paper/Icons/GameIcons/IconHeart.png"
              alt=""
              className="w-4 h-4 object-contain animate-bounce"
              draggable={false}
            />
            <span className="text-[11px] font-black tracking-widest text-[#854d0e] uppercase">
              ISLAND EXPLORATION
            </span>
          </div>

          {/* Grand Emblazoned 3D Title */}
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#3e2723] uppercase font-sans drop-shadow-sm flex items-center justify-center gap-2">
            <span>D LUCKY WORLD</span>
            <span className="px-2.5 py-0.5 rounded-xl bg-[#22c55e] text-white text-2xl sm:text-3xl font-black border-2 border-[#15803d] shadow-[0_3px_0_#15803d]">
              3D
            </span>
          </h1>

          {/* Subtitle / Island Description */}
          <p className="text-xs sm:text-sm text-[#78350f] font-bold max-w-sm mx-auto leading-relaxed">
            {lang === "id"
              ? "Jelajahi kepulauan tropis, temui warga desa, selesaikan misi tantangan, dan kumpulkan 30 Koin Emas!"
              : "Explore tropical islands, meet friendly villagers, complete missions, and collect 30 Gold Coins!"}
          </p>
        </div>
      </main>

      {/* 4. Bottom Console: Authentic PaperUIKit Loading Bar, Status & Rotating Gameplay Tips */}
      <footer className="relative z-10 w-full max-w-xl mx-auto space-y-3">
        {/* Status Line: Current Loading Task & Percentage */}
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-[#fef08a] font-black">
            <span className="w-2.5 h-2.5 rounded-full bg-[#facc15] border border-[#a16207] animate-ping" />
            <span className="tracking-wide text-xs truncate max-w-[280px] sm:max-w-none text-slate-100 font-extrabold">
              {statusText}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#fffdf6] border-2 border-[#5c3e21] shadow-[0_2px_0_#3e2723] text-[#3e2723] font-black text-xs sm:text-sm">
            <span>{progress}%</span>
          </div>
        </div>

        {/* PaperUIKit Authentic Game Loading Bar (Zero CSS borders, pure UI kit assets) */}
        <div className="relative w-full h-7 sm:h-8 flex items-center justify-start overflow-hidden rounded-full drop-shadow-lg">
          <img
            src="/assets/ui/paper/LoadingBars/LoadingBarBackground.png"
            alt=""
            className="absolute inset-0 w-full h-full object-fill select-none"
            draggable={false}
          />
          <div
            className="absolute left-[3px] top-[3px] bottom-[3px] overflow-hidden rounded-full transition-all duration-200"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          >
            <img
              src="/assets/ui/paper/LoadingBars/LoadingBarFillYellow.png"
              alt=""
              className="w-full h-full object-fill"
              draggable={false}
            />
          </div>
        </div>

        {/* PaperUIKit Rotating Gameplay Tip Card with IconCoin */}
        <div className="bg-[#fffdf6] border-2 sm:border-3 border-[#5c3e21] rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-[0_4px_0_#3e2723] text-[#3e2723]">
          <div className="w-8 h-8 rounded-xl bg-[#fef08a] border-2 border-[#854d0e] flex items-center justify-center shrink-0 shadow-inner">
            <img
              src="/assets/ui/paper/Icons/GameIcons/IconCoin.png"
              alt=""
              className="w-5 h-5 object-contain"
              draggable={false}
            />
          </div>
          <p className="text-[11px] sm:text-xs leading-snug font-sans font-bold">
            <strong className="text-[#92400e] font-black uppercase tracking-wider mr-1">
              [TIP]:
            </strong>
            {t.loading.tips[tipIdx]}
          </p>
        </div>
      </footer>
    </div>
  );
};
