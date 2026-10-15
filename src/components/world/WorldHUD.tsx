"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Maximize2, Minimize2, Map, Compass, Trophy, Menu, Zap, X, Shield, Sparkles } from "lucide-react";
import { NPCData, ActiveMinigame } from "./WorldEngine";

interface WorldHUDProps {
  location: string;
  coins: number;
  totalCoins: number;
  speedKmH: number;
  nitroPct: number;
  activeNPC: NPCData | null;
  activeMinigame?: ActiveMinigame | null;
  showGoal: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenPhone: () => void;
  onInteractNPC: () => void;
  onOpenPauseMenu: () => void;
  onCancelMinigame?: () => void;
}

// Landmark lore subtitles for cinematic territory banner
const LOCATION_LORE: Record<string, string> = {
  "Central Plaza": "Port of Beginnings & Merchant Docks",
  "MOBA Sanctuary": "Ancient Citadel of the Sacred Blades",
  "Beach Stadium": "Coastal Arena & Striker's Shore",
  "Battle Royale Outpost": "Fortified Watchtower & Supply Caches",
  "Open Ocean": "Azure Reefs & Maritime Channel",
};

export const WorldHUD: React.FC<WorldHUDProps> = ({
  location,
  coins,
  totalCoins,
  speedKmH,
  nitroPct,
  activeNPC,
  activeMinigame,
  showGoal,
  isMuted,
  onToggleMute,
  onOpenPhone,
  onInteractNPC,
  onOpenPauseMenu,
  onCancelMinigame,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [bannerLocation, setBannerLocation] = useState(location);
  const [showLocationBanner, setShowLocationBanner] = useState(true);

  // Sync fullscreen state
  useEffect(() => {
    const handleFSChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFSChange);
    document.addEventListener("webkitfullscreenchange", handleFSChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFSChange);
      document.removeEventListener("webkitfullscreenchange", handleFSChange);
    };
  }, []);

  // Trigger cinematic landmark banner whenever entering a new location
  useEffect(() => {
    if (location !== bannerLocation) {
      setBannerLocation(location);
      setShowLocationBanner(true);
      const timer = setTimeout(() => {
        setShowLocationBanner(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [location, bannerLocation]);

  // Initial banner auto-hide
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLocationBanner(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard shortcut: [M] opens map
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyM") {
        e.preventDefault();
        onOpenPhone();
      } else if (e.code === "Escape") {
        e.preventDefault();
        onOpenPauseMenu();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenPhone, onOpenPauseMenu]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      } else if ((elem as any).webkitRequestFullscreen) {
        (elem as any).webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30 select-none">
      {/* =================================================================== */}
      {/* TOP NAVIGATION & EXPEDITION STATUS BAR                             */}
      {/* =================================================================== */}
      <div className="p-3 sm:p-6 flex items-start justify-between gap-2">
        {/* Expedition Menu & Hero Badge (Top-Left) */}
        <button
          onClick={onOpenPauseMenu}
          className="pointer-events-auto group flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-teal-500/40 hover:border-teal-400 text-white shadow-[0_4px_16px_rgba(0,0,0,0.5)] active:scale-95 transition-all cursor-pointer backdrop-blur-md"
          title="Open Pause Menu (ESC)"
        >
          <Menu className="w-4 h-4 text-teal-400 group-hover:rotate-90 transition-transform" />
          <div className="flex flex-col text-left">
            <span className="font-display font-black tracking-wider text-xs sm:text-sm leading-tight text-white">
              MENU
            </span>
            <span className="text-[9px] font-mono text-slate-400 font-bold hidden sm:inline">
              [ESC]
            </span>
          </div>
        </button>

        {/* Cinematic Territory Nameplate (Top-Center) */}
        <div className="flex flex-col items-center">
          {showLocationBanner ? (
            <div className="flex flex-col items-center px-6 py-2.5 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-amber-400/50 text-white shadow-[0_8px_30px_rgba(0,0,0,0.7)] animate-in fade-in slide-in-from-top-4 duration-500 text-center">
              <div className="flex items-center gap-2 text-amber-400 text-[10px] font-mono font-bold tracking-[0.25em] uppercase">
                <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                <span>TERRITORY DISCOVERED</span>
              </div>
              <h3 className="font-black font-display text-base sm:text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-teal-200">
                {bannerLocation}
              </h3>
              <p className="text-[10px] font-mono text-slate-300 tracking-wider">
                {LOCATION_LORE[bannerLocation] || "Archipelago Region"}
              </p>
            </div>
          ) : (
            /* Minimalist compass header when banner fades */
            <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-sm border border-white/10 text-slate-300 text-xs font-mono font-bold shadow-sm">
              <Compass className="w-3.5 h-3.5 text-teal-400" />
              <span>{location}</span>
            </div>
          )}
        </div>

        {/* Top-Right Player Stats & Utility Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Embossed Golden Token Counter */}
          <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-gradient-to-r from-[#1f1906] to-[#2c2007] backdrop-blur-md border border-amber-400/60 text-amber-300 font-black text-xs sm:text-sm shadow-[0_4px_16px_rgba(245,158,11,0.25)]">
            {/* Custom SVG Golden Star Token */}
            <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-current drop-shadow">
              <circle cx="12" cy="12" r="10" fill="#f59e0b" stroke="#fef08a" strokeWidth="1.5" />
              <polygon points="12,5 14,9 18.5,9.5 15,13 16,17.5 12,15 8,17.5 9,13 5.5,9.5 10,9" fill="#78350f" />
            </svg>
            <span className="font-mono text-xs sm:text-base tracking-tight">{coins}</span>
            <span className="text-amber-500/70 text-[10px] sm:text-xs font-mono font-bold">/ {totalCoins}</span>
          </div>

          {/* Navigator's Map Slate Button */}
          <button
            onClick={onOpenPhone}
            aria-label="Open Navigator's Map Slate"
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-slate-950 font-black text-xs border-t border-white/40 border-b-2 border-teal-900 shadow-[0_4px_12px_rgba(20,184,166,0.3)] active:scale-95 transition-all cursor-pointer"
          >
            <Map className="w-3.5 h-3.5 text-slate-950" />
            <span className="font-mono text-xs">MAP</span>
            <span className="text-[10px] text-slate-900 font-mono hidden sm:inline">[M]</span>
          </button>

          {/* Agility Sprint Gauge (Desktop Only) */}
          <div className="hidden lg:flex flex-col items-end gap-1 px-3.5 py-1.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-white/15 text-white shadow-md">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-300">
              <Zap className="w-3 h-3 text-teal-400" />
              <span className="text-[10px] uppercase tracking-wider text-slate-400">AGILITY</span>
              <span className="text-teal-300 text-xs font-black">{Math.round(speedKmH)} KM/H</span>
            </div>
            <div className="w-24 h-1.5 rounded-full bg-slate-950 overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-teal-400 via-emerald-400 to-amber-400 transition-all duration-75"
                style={{ width: `${nitroPct}%` }}
              />
            </div>
          </div>

          {/* Audio Mute/Unmute */}
          <button
            onClick={onToggleMute}
            aria-label="Toggle Sound"
            className="p-2 sm:p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-white/15 text-white shadow-md active:scale-95 transition-all cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            aria-label="Toggle Fullscreen"
            className="hidden sm:flex p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-white/15 text-white shadow-md active:scale-95 transition-all cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-teal-400" /> : <Maximize2 className="w-4 h-4 text-white" />}
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* ACTIVE ARCADE MINIGAME BANNER                                       */}
      {/* =================================================================== */}
      {activeMinigame && (
        <div className="absolute top-20 sm:top-24 inset-x-0 flex justify-center pointer-events-auto px-4 z-40 animate-in slide-in-from-top-4 duration-300">
          <div className="w-full max-w-xl bg-slate-950/95 backdrop-blur-2xl border-2 border-amber-400/80 rounded-3xl p-4 sm:p-5 shadow-[0_16px_40px_rgba(0,0,0,0.9)] text-white space-y-3 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <span className="text-[10px] font-mono font-black uppercase tracking-widest px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 shadow">
                  CHALLENGE
                </span>
                <h4 className="font-black font-display text-sm sm:text-base text-amber-300 tracking-wide">
                  {activeMinigame.title}
                </h4>
              </div>

              <div className="flex items-center gap-2.5">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono font-black text-xs sm:text-sm border-2 ${
                    activeMinigame.timeLeft <= 10
                      ? "bg-red-950/80 text-red-400 border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)] animate-pulse"
                      : "bg-slate-900 text-teal-300 border-teal-400/60 shadow-[0_0_10px_rgba(20,184,166,0.3)]"
                  }`}
                >
                  <span className="text-xs">⏱</span>
                  <span>{Math.max(0, activeMinigame.timeLeft).toFixed(1)}s</span>
                </div>

                {activeMinigame.status === "playing" && (
                  <button
                    onClick={onCancelMinigame}
                    className="p-1 rounded-lg bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-300 border border-white/20 transition-all cursor-pointer"
                    title="Abort Challenge"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Target Progress */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 line-clamp-1">{activeMinigame.instructions}</span>
                <span className="font-black text-amber-300 ml-2 whitespace-nowrap bg-slate-900 px-2 py-0.5 rounded border border-amber-400/30">
                  {activeMinigame.score} / {activeMinigame.targetScore} TARGETS
                </span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-white/20 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 rounded-full transition-all duration-300 shadow-[0_0_8px_#facc15]"
                  style={{
                    width: `${Math.min(100, (activeMinigame.score / activeMinigame.targetScore) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Victory Toast */}
            {activeMinigame.status === "won" && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 font-black text-center text-xs sm:text-sm animate-bounce flex items-center justify-center gap-2">
                <Trophy className="w-4 h-4 fill-current text-amber-300" />
                <span>CHALLENGE COMPLETE! +5 GOLD TOKENS AWARDED!</span>
              </div>
            )}

            {/* Lost Toast */}
            {activeMinigame.status === "lost" && (
              <div className="p-3 rounded-xl bg-red-500/20 border-2 border-red-400 text-red-300 font-black text-center text-xs sm:text-sm animate-pulse flex items-center justify-center gap-2">
                <span>TIME EXPIRED! Talk to the island resident to try again.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* GOAL CELEBRATION BANNER                                             */}
      {/* =================================================================== */}
      {showGoal && (
        <div className="absolute top-24 inset-x-0 flex justify-center pointer-events-none animate-in zoom-in-95 duration-300">
          <div className="px-10 py-5 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 text-white font-black text-3xl sm:text-4xl shadow-[0_10px_35px_rgba(16,185,129,0.6)] border-4 border-emerald-300 flex items-center gap-4 animate-bounce">
            <Trophy className="w-10 h-10 text-amber-300 fill-current" />
            <span className="tracking-wider uppercase drop-shadow">GOAAAL! +100 EXP</span>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* PROXIMITY NPC ACTION PROMPT                                         */}
      {/* =================================================================== */}
      {activeNPC && (
        <div
          className="absolute bottom-48 sm:bottom-36 inset-x-0 flex justify-center pointer-events-auto animate-in slide-in-from-bottom-4 duration-300 px-4"
          style={{ bottom: "max(11rem, calc(env(safe-area-inset-bottom, 0px) + 9rem))" }}
        >
          <button
            onClick={onInteractNPC}
            className="group px-5 py-3 sm:px-7 sm:py-3.5 rounded-full bg-slate-900/95 hover:bg-teal-600 border-2 border-teal-400/70 text-white font-black text-xs sm:text-base shadow-[0_8px_25px_rgba(20,184,166,0.4)] flex items-center gap-2.5 sm:gap-3.5 active:scale-95 transition-all cursor-pointer max-w-sm backdrop-blur-md"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-base sm:text-lg">
              {activeNPC.avatar}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                TALK WITH RESIDENT
              </span>
              <span className="tracking-wide text-white font-display uppercase font-bold truncate">
                {activeNPC.name}
              </span>
            </div>
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-teal-400 text-slate-950 font-black font-mono text-xs shadow-inner ml-1">
              [E]
            </span>
            <span className="sm:hidden px-2 py-0.5 rounded-md bg-teal-400 text-slate-950 font-black font-mono text-[10px] ml-1">
              TAP
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
