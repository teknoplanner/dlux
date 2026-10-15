"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Maximize2, Minimize2, Map, Trophy, Menu, Zap, X, Sparkles, MessageCircle } from "lucide-react";
import { NPCData, ActiveMinigame } from "./WorldEngine";
import { WorldLang, WORLD_STRINGS, BILINGUAL_NPCS } from "./worldI18n";

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
  lang: WorldLang;
}

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
  lang,
}) => {
  const t = WORLD_STRINGS[lang];
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

  // Trigger landmark banner on new location
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLocationBanner(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard shortcut: [M] opens map, [ESC] opens pause menu
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
      {/* ROBLOX STYLE TOPBAR                                                 */}
      {/* =================================================================== */}
      <div className="p-3 sm:p-5 flex items-start justify-between gap-2">
        {/* Left: Roblox Menu Icon & Milo Player Pill */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Roblox Logo / Shield Menu Button */}
          <button
            onClick={onOpenPauseMenu}
            className="w-10 h-10 rounded-2xl bg-[#161b22]/90 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 text-white flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer backdrop-blur-sm"
            title="Roblox Menu (ESC)"
          >
            <Menu className="w-5 h-5 text-emerald-400" />
          </button>

          {/* Milo Player Card Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#161b22]/90 border border-slate-700 shadow-md backdrop-blur-sm">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-sm font-bold text-emerald-400">
              🐱
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-black text-white leading-tight">Milo</span>
              <span className="text-[10px] text-emerald-400 font-bold">Explorer</span>
            </div>
          </div>
        </div>

        {/* Center: Roblox Island Territory Pill */}
        <div className="flex flex-col items-center">
          {showLocationBanner ? (
            <div className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-[#161b22]/95 border-2 border-emerald-500/60 shadow-[0_10px_25px_rgba(0,0,0,0.8)] backdrop-blur-md animate-in fade-in slide-in-from-top-3 duration-300">
              <span className="text-base">🏝️</span>
              <span className="text-sm sm:text-base font-black text-white tracking-wide">
                {t.hud.locations[bannerLocation as keyof typeof t.hud.locations] || bannerLocation}
              </span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#161b22]/80 border border-slate-700 text-xs font-bold text-slate-300 shadow-sm backdrop-blur-sm">
              <span className="text-xs">🏝️</span>
              <span>{t.hud.locations[location as keyof typeof t.hud.locations] || location}</span>
            </div>
          )}
        </div>

        {/* Right: Currency Leaderboard & Utility Buttons */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Roblox Chunky Gold Token Coin Pill */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#161b22]/95 border border-amber-500/50 text-amber-300 font-black text-xs sm:text-sm shadow-md backdrop-blur-sm">
            <span className="text-base">🪙</span>
            <span className="tracking-tight">{coins}</span>
            <span className="text-amber-500/70 text-xs font-bold">/ {totalCoins}</span>
          </div>

          {/* Map Button */}
          <button
            onClick={onOpenPhone}
            aria-label="Open Map"
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-slate-950 font-black text-xs border-t border-white/40 border-b-2 border-emerald-900 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Map className="w-4 h-4 text-slate-950" />
            <span className="hidden sm:inline">{t.hud.map}</span>
          </button>

          {/* Mute Toggle */}
          <button
            onClick={onToggleMute}
            aria-label="Toggle Sound"
            className="w-10 h-10 rounded-2xl bg-[#161b22]/90 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 text-white flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer backdrop-blur-sm"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            aria-label="Toggle Fullscreen"
            className="hidden sm:flex w-10 h-10 rounded-2xl bg-[#161b22]/90 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 text-white items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer backdrop-blur-sm"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-emerald-400" /> : <Maximize2 className="w-4 h-4 text-white" />}
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* ACTIVE ARCADE MINIGAME BANNER                                       */}
      {/* =================================================================== */}
      {activeMinigame && (
        <div className="absolute top-18 sm:top-20 inset-x-0 flex justify-center pointer-events-auto px-4 z-40 animate-in slide-in-from-top-3 duration-200">
          <div className="w-full max-w-lg bg-[#161b22]/95 backdrop-blur-md border-2 border-amber-500/80 rounded-2xl p-4 shadow-2xl text-white space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <h4 className="font-black text-sm sm:text-base text-amber-300">
                  {activeMinigame.title}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`px-2.5 py-1 rounded-xl font-black text-xs sm:text-sm border ${
                    activeMinigame.timeLeft <= 10
                      ? "bg-red-950/90 text-red-400 border-red-500 animate-pulse"
                      : "bg-slate-900 text-emerald-400 border-emerald-500/50"
                  }`}
                >
                  ⏱ {Math.max(0, activeMinigame.timeLeft).toFixed(1)}s
                </div>

                {activeMinigame.status === "playing" && (
                  <button
                    onClick={onCancelMinigame}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-300 border border-slate-700 cursor-pointer"
                    title="Quit Challenge"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Score & Progress */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">{activeMinigame.instructions}</span>
                <span className="font-extrabold text-amber-300 ml-2">
                  {activeMinigame.score} / {activeMinigame.targetScore}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-200"
                  style={{
                    width: `${Math.min(100, (activeMinigame.score / activeMinigame.targetScore) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Victory Toast */}
            {activeMinigame.status === "won" && (
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-extrabold text-center text-xs sm:text-sm flex items-center justify-center gap-2">
                <Trophy className="w-4 h-4 fill-current text-amber-300" />
                <span>CHALLENGE COMPLETE! +5 COINS AWARDED!</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* GOAL CELEBRATION BANNER                                             */}
      {/* =================================================================== */}
      {showGoal && (
        <div className="absolute top-24 inset-x-0 flex justify-center pointer-events-none animate-in zoom-in-95 duration-200">
          <div className="px-8 py-4 rounded-3xl bg-emerald-500 text-slate-950 font-black text-2xl sm:text-3xl shadow-[0_10px_35px_rgba(16,185,129,0.7)] border-4 border-white flex items-center gap-3 animate-bounce">
            <Trophy className="w-8 h-8 text-amber-300 fill-current" />
            <span className="tracking-wide">{t.common.goalCelebration}</span>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* ROBLOX INTERACTION PROMPT (Near NPC)                                */}
      {/* =================================================================== */}
      {activeNPC && (() => {
        const npcName = BILINGUAL_NPCS[activeNPC.id]?.name[lang] || activeNPC.name;
        return (
          <div
            className="absolute bottom-48 sm:bottom-36 inset-x-0 flex justify-center pointer-events-auto animate-in slide-in-from-bottom-3 duration-200 px-4"
            style={{ bottom: "max(11rem, calc(env(safe-area-inset-bottom, 0px) + 9rem))" }}
          >
            <button
              onClick={onInteractNPC}
              className="group px-5 py-3 rounded-2xl bg-[#161b22]/95 hover:bg-emerald-600 active:bg-emerald-700 border-2 border-emerald-400 text-white font-black text-sm shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center gap-3 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-lg">
                {activeNPC.avatar}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-emerald-400 group-hover:text-slate-950 uppercase tracking-wide font-extrabold">
                  {t.common.interact}
                </span>
                <span className="text-white group-hover:text-slate-950 font-black text-sm truncate">
                  {t.common.talkTo} {npcName}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-lg bg-emerald-500 group-hover:bg-slate-950 text-slate-950 group-hover:text-emerald-400 font-extrabold text-xs shadow-inner ml-1">
                [E]
              </span>
            </button>
          </div>
        );
      })()}
    </div>
  );
};
