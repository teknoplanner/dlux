"use client";

import React, { useState, useEffect } from "react";
import { WorldLang, detectUserLanguage, WORLD_STRINGS } from "./worldI18n";
import { getPlayerRealtimeWeather, RealtimeWeatherInfo } from "./WorldWeatherManager";

interface WorldLoadingScreenProps {
  onStartExploration: () => void;
  lang?: WorldLang;
  onOpenControls?: () => void;
}

export const WorldLoadingScreen: React.FC<WorldLoadingScreenProps> = ({
  onStartExploration,
  lang: propLang,
  onOpenControls,
}) => {
  const [lang] = useState<WorldLang>(() => propLang || detectUserLanguage());
  const t = WORLD_STRINGS[lang];
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [realtime, setRealtime] = useState<RealtimeWeatherInfo>(() => getPlayerRealtimeWeather());

  const onStartRef = React.useRef(onStartExploration);
  onStartRef.current = onStartExploration;

  // Track realtime clock periodically
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setRealtime(getPlayerRealtimeWeather());
    }, 5000);
    return () => clearInterval(clockInterval);
  }, []);

  const handleStart = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onStartRef.current?.();
    }, 450);
  };

  // Keyboard shortcut (Enter or Space) to start exploration
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Enter" || e.code === "Space") {
        e.preventDefault();
        handleStart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExiting]);

  // Fast loading progression (~0.9s) so the PLAY button pops up swiftly
  useEffect(() => {
    let completed = false;
    let currentPct = 0;

    const interval = setInterval(() => {
      if (completed) return;

      // Snappy advancement so user doesn't wait long
      const step = 4.5 + Math.random() * 4.0;
      currentPct = Math.min(100, currentPct + step);
      const rounded = Math.floor(currentPct);
      setProgress(rounded);

      if (rounded >= 100 && !completed) {
        completed = true;
        clearInterval(interval);
        setTimeout(() => {
          setIsReady(true);
        }, 120);
      }
    }, 30);

    return () => {
      completed = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-4 sm:p-8 select-none overflow-hidden transition-opacity duration-500 ${
        isExiting ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        // Translucent cinematic vignette so the live 3D island camera POV is visible
        background:
          "radial-gradient(circle at center, rgba(14, 52, 68, 0.45) 0%, rgba(5, 23, 34, 0.82) 100%)",
        color: "#EAF8F7",
      }}
    >
      {/* =================================================================== */}
      {/* TOP BAR: MINIMAL LOGO & REAL-TIME CLOCK BADGE                      */}
      {/* =================================================================== */}
      <div className="w-full max-w-4xl flex items-center justify-between text-xs sm:text-sm font-semibold text-white/90">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 shadow-md">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-emerald-600 animate-ping" />
          <span className="tracking-wider uppercase font-black text-white text-xs sm:text-sm">
            D LUCKY WORLD 3D
          </span>
        </div>

        {/* Real-time IP Weather badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white shadow-md text-xs font-bold">
          <span className="font-mono font-black text-amber-200">{realtime.timeString}</span>
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-[11px] font-black">
            {realtime.isDaytime ? "Siang" : "Malam"}
          </span>
        </div>
      </div>

      {/* =================================================================== */}
      {/* CENTERPIECE: GAME LOGO + GAME UI KIT LOADING BAR / PLAY BUTTON       */}
      {/* =================================================================== */}
      <div className="flex flex-col items-center justify-center my-auto text-center max-w-md px-4 space-y-6">
        {/* Game Title with stylized drop shadow */}
        <div className="space-y-1">
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight drop-shadow-[0_6px_20px_rgba(0,0,0,0.6)] font-sans">
            D Lucky World
          </h1>
        </div>

        {/* Action Area: Either Game UI Kit Loading Bar OR Large Green Play Button */}
        <div className="w-full flex flex-col items-center justify-center min-h-[90px]">
          {!isReady ? (
            /* Game UI Kit Loading Bar */
            <div className="w-full space-y-2 animate-in fade-in duration-200">
              <div className="relative w-full h-8 sm:h-9 select-none">
                {/* Outer Paper Frame */}
                <img
                  src="/assets/ui/paper/LoadingBars/LoadingBarBackground.png"
                  alt=""
                  className="w-full h-full object-fill drop-shadow-lg"
                  draggable={false}
                />
                {/* Yellow Bar Fill with precision CSS clip-path (no image stretching) */}
                <div
                  className="absolute inset-0 transition-all duration-100 ease-out"
                  style={{
                    clipPath: `inset(0 ${100 - progress}% 0 0)`,
                  }}
                >
                  <img
                    src="/assets/ui/paper/LoadingBars/LoadingBarFillYellow.png"
                    alt=""
                    className="w-full h-full object-fill"
                    draggable={false}
                  />
                </div>
              </div>

              {/* Minimal percentage indicator */}
              <div className="flex items-center justify-end px-1 text-xs font-black text-white drop-shadow font-mono">
                <span>{progress}%</span>
              </div>
            </div>
          ) : (
            /* Game UI Kit Large Green PLAY Button (pops up swiftly after brief POV loading) */
            <div className="flex flex-col items-center gap-2 animate-in zoom-in-90 fade-in duration-300">
              <button
                type="button"
                onClick={handleStart}
                className="relative group w-64 sm:w-72 inline-flex items-center justify-center cursor-pointer select-none active:scale-95 transition-transform outline-none focus:outline-none focus-visible:outline-none focus:ring-0 border-none shadow-none"
                style={{ outline: "none", border: "none" }}
              >
                <img
                  src="/assets/ui/paper/Buttons/LargeButtons/ButtonLargeGreen.png"
                  alt="Play"
                  className="h-14 sm:h-16 w-full object-fill group-active:hidden drop-shadow-2xl rounded-2xl"
                  draggable={false}
                />
                <img
                  src="/assets/ui/paper/Buttons/LargeButtons/ButtonLargeGreenActive.png"
                  alt="Play"
                  className="h-14 sm:h-16 w-full object-fill hidden group-active:block drop-shadow-2xl rounded-2xl"
                  draggable={false}
                />
                <span className="absolute inset-0 flex items-center justify-center gap-3 font-black text-[#14532d] text-lg sm:text-xl tracking-wider uppercase pb-1 group-active:pt-1">
                  <img
                    src="/assets/ui/paper/Icons/GameIcons/IconPlay.png"
                    alt=""
                    className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                    draggable={false}
                  />
                  <span>{lang === "id" ? "MAINKAN" : "PLAY NOW"}</span>
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Empty bottom spacer to keep center content perfectly balanced */}
      <div className="h-6" />
    </div>
  );
};
