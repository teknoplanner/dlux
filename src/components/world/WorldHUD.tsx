"use client";

import React, { useState, useEffect } from "react";
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
      {/* PAPER UI KIT TOPBAR                                                 */}
      {/* =================================================================== */}
      <div className="p-3 sm:p-5 flex items-start justify-between gap-2">
        {/* Left: Paper Menu Icon & Milo Player Pill */}
        <div className="pointer-events-auto flex items-center gap-2.5">
          {/* PaperUIKit Menu Button with IconButtonGreen & IconPause */}
          <button
            onClick={onOpenPauseMenu}
            className="relative group w-11 h-11 inline-flex items-center justify-center cursor-pointer select-none active:scale-95 transition-transform"
            title="Menu & Settings (ESC)"
          >
            <img
              src="/assets/ui/paper/Buttons/IconButtons/IconButtonGreen.png"
              alt="Menu"
              className="w-full h-full object-contain group-active:hidden drop-shadow-md"
              draggable={false}
            />
            <img
              src="/assets/ui/paper/Buttons/IconButtons/IconButtonActive.png"
              alt="Menu"
              className="w-full h-full object-contain hidden group-active:block drop-shadow-md"
              draggable={false}
            />
            <div className="absolute inset-0 flex items-center justify-center pb-0.5 group-active:pt-0.5">
              <img
                src="/assets/ui/paper/Icons/GameIcons/IconPause.png"
                alt=""
                className="w-5 h-5 object-contain brightness-95"
                draggable={false}
              />
            </div>
          </button>

          {/* Paper Milo Player Card Pill */}
          <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-[#fffdf6] border-2 border-[#5c3e21] shadow-[0_4px_0_#3e2723] backdrop-blur-sm">
            <div className="w-7 h-7 rounded-full bg-[#fef08a] border-2 border-[#854d0e] flex items-center justify-center text-sm font-black shadow-inner">
              🐱
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-black text-[#3e2723] leading-tight">Milo</span>
              <span className="text-[10px] text-[#047857] font-black uppercase tracking-wider">Explorer</span>
            </div>
          </div>
        </div>

        {/* Center: Paper Island Location Banner */}
        <div className="flex flex-col items-center">
          {showLocationBanner ? (
            <div className="flex items-center gap-2.5 px-6 py-2 rounded-2xl bg-[#fffdf6] border-2 sm:border-3 border-[#5c3e21] shadow-[0_6px_0_#3e2723] backdrop-blur-md animate-in fade-in slide-in-from-top-3 duration-300">
              <span className="text-lg">🏝️</span>
              <span className="text-sm sm:text-base font-black text-[#3e2723] tracking-wide uppercase font-sans">
                {t.hud.locations[bannerLocation as keyof typeof t.hud.locations] || bannerLocation}
              </span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-[#fffdf6]/95 border-2 border-[#5c3e21] shadow-[0_3px_0_#3e2723] text-xs font-black text-[#451a03]">
              <span className="text-sm">🏝️</span>
              <span>{t.hud.locations[location as keyof typeof t.hud.locations] || location}</span>
            </div>
          )}
        </div>

        {/* Right: Currency Leaderboard & Utility Buttons */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Paper Gold Coin Token Pill with Authentic PaperUIKit IconCoin */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#fffdf6] border-2 border-[#5c3e21] shadow-[0_4px_0_#3e2723] text-[#3e2723] font-black text-xs sm:text-sm">
            <img
              src="/assets/ui/paper/Icons/GameIcons/IconCoin.png"
              alt="Coins"
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain -ml-1 drop-shadow-sm"
              draggable={false}
            />
            <span className="tracking-tight text-sm sm:text-base font-extrabold text-[#92400e]">{coins}</span>
            <span className="text-[#a16207] text-xs font-bold">/ {totalCoins}</span>
          </div>

          {/* Paper Map Button */}
          <button
            onClick={onOpenPhone}
            aria-label="Open Map"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#10b981] hover:bg-[#059669] active:bg-[#047857] text-[#fffdf6] font-black text-xs border-2 border-[#064e3b] shadow-[0_4px_0_#064e3b] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            <span className="font-black uppercase tracking-wider">{t.hud.map}</span>
          </button>

          {/* Paper Settings Button with Paper Settings Icon */}
          <button
            onClick={onOpenPauseMenu}
            aria-label="Open Settings"
            title="Settings (ESC)"
            className="w-10 h-10 rounded-2xl bg-[#fffdf6] hover:bg-[#fef9c3] active:bg-[#fef08a] border-2 border-[#5c3e21] shadow-[0_4px_0_#3e2723] active:translate-y-1 active:shadow-none flex items-center justify-center transition-all cursor-pointer p-2"
          >
            <img
              src="/assets/ui/paper/Icons/GameIcons/IconSettings.png"
              alt="Settings"
              className="w-full h-full object-contain"
              draggable={false}
            />
          </button>

          {/* Paper Fullscreen Toggle Button with Paper Play Icon */}
          <button
            onClick={toggleFullscreen}
            aria-label="Toggle Fullscreen"
            className="hidden sm:flex w-10 h-10 rounded-2xl bg-[#fffdf6] hover:bg-[#fef9c3] active:bg-[#fef08a] border-2 border-[#5c3e21] shadow-[0_4px_0_#3e2723] active:translate-y-1 active:shadow-none items-center justify-center transition-all cursor-pointer p-2.5"
          >
            <img
              src="/assets/ui/paper/Icons/GameIcons/IconPlay.png"
              alt="FS"
              className="w-full h-full object-contain"
              draggable={false}
            />
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* ACTIVE ARCADE MINIGAME BANNER                                       */}
      {/* =================================================================== */}
      {activeMinigame && (
        <div className="absolute top-18 sm:top-20 inset-x-0 flex justify-center pointer-events-auto px-4 z-40 animate-in slide-in-from-top-3 duration-200">
          <div className="w-full max-w-lg bg-[#fffdf6] border-2 sm:border-3 border-[#5c3e21] rounded-3xl p-4 sm:p-5 shadow-[0_8px_0_#3e2723] text-[#3e2723] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#f59e0b] border border-[#78350f] animate-ping" />
                <h4 className="font-black text-sm sm:text-base text-[#78350f] uppercase tracking-wide">
                  {activeMinigame.title}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`px-3 py-1 rounded-xl font-black text-xs sm:text-sm border-2 ${
                    activeMinigame.timeLeft <= 10
                      ? "bg-[#fee2e2] text-[#b91c1c] border-[#991b1b] animate-pulse shadow-[0_2px_0_#991b1b]"
                      : "bg-[#ecfdf5] text-[#047857] border-[#065f46] shadow-[0_2px_0_#065f46]"
                  }`}
                >
                  ⏱ {Math.max(0, activeMinigame.timeLeft).toFixed(1)}s
                </div>

                {activeMinigame.status === "playing" && (
                  <button
                    onClick={onCancelMinigame}
                    className="w-8 h-8 rounded-xl bg-[#fee2e2] hover:bg-[#fecaca] border-2 border-[#991b1b] shadow-[0_2px_0_#991b1b] active:translate-y-0.5 active:shadow-none flex items-center justify-center p-1.5 cursor-pointer"
                    title="Quit Challenge"
                  >
                    <img
                      src="/assets/ui/paper/Buttons/ButtonClose2.png"
                      alt="Close"
                      className="w-full h-full object-contain"
                      draggable={false}
                    />
                  </button>
                )}
              </div>
            </div>

            {/* Score & Paper Loading Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-[#5c3e21]">
                <span>{activeMinigame.instructions}</span>
                <span className="font-black text-[#92400e] ml-2 text-sm">
                  {activeMinigame.score} / {activeMinigame.targetScore}
                </span>
              </div>
              <div className="relative w-full h-4 bg-[#f3eedd] rounded-full overflow-hidden border-2 border-[#5c3e21] shadow-inner p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#facc15] via-[#22c55e] to-[#10b981] rounded-full transition-all duration-200 border-r border-[#15803d]"
                  style={{
                    width: `${Math.min(100, (activeMinigame.score / activeMinigame.targetScore) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Victory Toast */}
            {activeMinigame.status === "won" && (
              <div className="p-2.5 rounded-2xl bg-[#dcfce7] border-2 border-[#16a34a] text-[#15803d] font-black text-center text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_3px_0_#16a34a]">
                <img
                  src="/assets/ui/paper/Icons/GameIcons/IconCoin.png"
                  alt="Win"
                  className="w-5 h-5 object-contain"
                  draggable={false}
                />
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
          <div className="px-8 py-4 rounded-3xl bg-[#22c55e] text-[#14532d] font-black text-2xl sm:text-3xl shadow-[0_8px_0_#15803d] border-4 border-[#fffdf6] flex items-center gap-3 animate-bounce">
            <img
              src="/assets/ui/paper/Icons/GameIcons/IconCoin.png"
              alt="Goal"
              className="w-8 h-8 object-contain"
              draggable={false}
            />
            <span className="tracking-wide text-white drop-shadow">{t.common.goalCelebration}</span>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* PAPER UI KIT INTERACTION PROMPT (Near NPC)                          */}
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
              className="group px-5 py-3 rounded-3xl bg-[#fffdf6] hover:bg-[#fef9c3] active:bg-[#fef08a] border-3 border-[#5c3e21] text-[#3e2723] font-black text-sm shadow-[0_6px_0_#3e2723] active:translate-y-1 active:shadow-none flex items-center gap-3 transition-all cursor-pointer"
            >
              <div className="w-9 h-9 rounded-2xl bg-[#fef08a] border-2 border-[#854d0e] flex items-center justify-center text-xl shadow-inner">
                {activeNPC.avatar}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-[#059669] uppercase tracking-wider font-extrabold">
                  {t.common.interact}
                </span>
                <span className="text-[#3e2723] font-black text-sm sm:text-base truncate">
                  {t.common.talkTo} {npcName}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-[#22c55e] text-white font-black text-xs border border-[#15803d] shadow-[0_2px_0_#15803d] ml-1">
                [E]
              </span>
            </button>
          </div>
        );
      })()}
    </div>
  );
};
