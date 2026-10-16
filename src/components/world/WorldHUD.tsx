"use client";

import React, { useState, useEffect } from "react";
import { NPCData, ActiveMinigame } from "./WorldEngine";
import { WeatherType } from "./WorldWeatherManager";
import { WorldLang, WORLD_STRINGS, BILINGUAL_NPCS } from "./worldI18n";
import {
  GameIconWeather,
  GameIconAudio,
  GameIconMap,
  GameIconIsland,
  GameIconSprint,
  GameIconMilo,
  GameIconResidentBadge,
} from "./WorldGameIcons";

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
  isMusicEnabled?: boolean;
  onToggleMusic?: () => void;
  currentWeather?: WeatherType;
  onCycleWeather?: () => void;
  isAutoRealtime?: boolean;
  isIntroCinematic?: boolean;
  onSkipCinematic?: () => void;
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
  isMusicEnabled = true,
  onToggleMusic,
  currentWeather = "day",
  onCycleWeather,
  isAutoRealtime = true,
  isIntroCinematic = false,
  onSkipCinematic,
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

  const getWeatherLabel = (w: WeatherType) => {
    switch (w) {
      case "day":
        return lang === "id" ? "Siang" : "Day";
      case "night":
        return lang === "id" ? "Malam" : "Night";
      case "rain":
        return lang === "id" ? "Hujan" : "Rain";
      case "snow":
        return lang === "id" ? "Salju" : "Snow";
      default:
        return lang === "id" ? "Siang" : "Day";
    }
  };
  const weatherLabel = getWeatherLabel(currentWeather);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 select-none">
      {/* =================================================================== */}
      {/* CINEMATIC INTRO LETTERBOX & TITLE OVERLAY                           */}
      {/* =================================================================== */}
      {isIntroCinematic && (
        <div className="fixed inset-0 pointer-events-none z-50 flex flex-col justify-between select-none">
          {/* Top Letterbox Bar */}
          <div className="w-full h-14 sm:h-20 bg-black/85 backdrop-blur-sm border-b border-white/10 flex items-center justify-between px-4 sm:px-8 animate-in fade-in slide-in-from-top-full duration-700">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-white/85 font-black tracking-widest text-xs uppercase font-mono">
                {t.pauseMenu.cinematicTitle}
              </span>
            </div>
            {onSkipCinematic && (
              <button
                onClick={onSkipCinematic}
                className="pointer-events-auto px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/25 active:scale-95 text-white/90 text-xs font-bold border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
              >
                <span>{lang === "id" ? "Lewati" : "Skip"}</span>
                <span className="text-[10px] text-white/60">[WASD / Click]</span>
                <span>⏭️</span>
              </button>
            )}
          </div>

          {/* Center Cinematic Card */}
          <div className="self-center text-center px-6 py-4 bg-black/55 backdrop-blur-md rounded-3xl border border-white/15 shadow-2xl animate-in zoom-in-95 duration-1000 max-w-lg mx-4">
            <div className="flex items-center justify-center gap-2 text-xl sm:text-3xl font-black text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] tracking-wide">
              <GameIconIsland className="w-7 h-7 sm:w-9 sm:h-9 drop-shadow-md shrink-0" />
              <span>{t.pauseMenu.cinematicTitle}</span>
            </div>
            <div className="mt-1.5 text-xs sm:text-sm text-cyan-200 font-medium tracking-wider">
              {t.pauseMenu.cinematicSubtitle}
            </div>
          </div>

          {/* Bottom Letterbox Bar */}
          <div className="w-full h-14 sm:h-20 bg-black/85 backdrop-blur-sm border-t border-white/10 flex items-center justify-center px-4 animate-in fade-in slide-in-from-bottom-full duration-700">
            <span className="text-white/70 text-xs sm:text-sm font-medium tracking-wide">
              {t.pauseMenu.cinematicSkip}
            </span>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* PAPER UI KIT TOPBAR (RESPONSIVE PHONE / TABLET / DESKTOP)           */}
      {/* =================================================================== */}
      <div className={`p-2 sm:p-4 lg:p-5 pt-[max(0.6rem,env(safe-area-inset-top))] px-[max(0.6rem,env(safe-area-inset-left))] pr-[max(0.6rem,env(safe-area-inset-right))] flex items-start justify-between gap-1.5 sm:gap-3 transition-opacity duration-300 ${
        isIntroCinematic ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}>
        
        {/* Left: Paper Menu Icon, Milo Player Pill & Speedometer */}
        <div className="pointer-events-auto flex flex-col items-start gap-1">
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* PaperUIKit Menu Button with IconButtonGreen & IconPause */}
            <button
              onClick={onOpenPauseMenu}
              className="relative group w-10 h-10 sm:w-11 sm:h-11 inline-flex items-center justify-center cursor-pointer select-none active:scale-95 transition-transform shrink-0"
              title="Menu & Settings (ESC)"
              aria-label="Menu"
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
                  className="w-4 h-4 sm:w-5 sm:h-5 object-contain brightness-95"
                  draggable={false}
                />
              </div>
            </button>

            {/* Paper Milo Player Card Pill (Hidden on narrow mobile, visible on tablet/desktop) */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#fffdf6] border-2 border-[#5c3e21] shadow-[0_3px_0_#3e2723] backdrop-blur-sm">
              <div className="w-6 h-6 rounded-full bg-[#fef08a] border-2 border-[#854d0e] flex items-center justify-center p-0.5 shadow-inner">
                <GameIconMilo className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-black text-[#3e2723] leading-tight">Milo</span>
                <span className="text-[9px] text-[#047857] font-black uppercase tracking-wider">Explorer</span>
              </div>
            </div>
          </div>

          {/* Speedometer & Nitro (Shows when moving or on tablet/desktop) */}
          {speedKmH > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-xl bg-[#fffdf6]/95 border-2 border-[#5c3e21] shadow-[0_2px_0_#3e2723] text-[#3e2723] backdrop-blur-sm animate-in fade-in duration-200">
              <GameIconSprint className="w-3.5 h-3.5 text-[#f59e0b] shrink-0" />
              <span className="font-mono text-xs sm:text-sm font-black text-[#047857]">
                {speedKmH} <span className="text-[9px] font-sans text-[#78350f]">KM/H</span>
              </span>
              <div className="hidden sm:block w-10 h-1.5 bg-[#f3eedd] rounded-full overflow-hidden border border-[#5c3e21] p-[1px] ml-0.5">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full transition-all duration-150"
                  style={{ width: `${Math.max(0, Math.min(100, nitroPct))}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Center: Paper Island Location Banner (Safely constrained to prevent overlap) */}
        <div className="flex-1 max-w-[130px] sm:max-w-xs md:max-w-md mx-auto flex flex-col items-center justify-center">
          {showLocationBanner ? (
            <div className="flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-6 py-1.5 sm:py-2 rounded-2xl bg-[#fffdf6] border-2 sm:border-[3px] border-[#5c3e21] shadow-[0_4px_0_#3e2723] backdrop-blur-md animate-in fade-in slide-in-from-top-3 duration-300 max-w-full">
              <GameIconIsland className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-amber-700" />
              <span className="text-xs sm:text-base font-black text-[#3e2723] tracking-wide uppercase font-sans truncate">
                {t.hud.locations[bannerLocation as keyof typeof t.hud.locations] || bannerLocation}
              </span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-2xl bg-[#fffdf6]/95 border-2 border-[#5c3e21] shadow-[0_2px_0_#3e2723] text-xs font-black text-[#451a03]">
              <GameIconIsland className="w-3.5 h-3.5 shrink-0 text-amber-700" />
              <span className="truncate">{t.hud.locations[location as keyof typeof t.hud.locations] || location}</span>
            </div>
          )}
        </div>

        {/* Right: Currency Leaderboard & Utility Buttons */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Paper Gold Coin Token Pill */}
          <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-2xl bg-[#fffdf6] border-2 border-[#5c3e21] shadow-[0_3px_0_#3e2723] text-[#3e2723] font-black text-xs sm:text-sm">
            <img
              src="/assets/ui/paper/Icons/GameIcons/IconCoin.png"
              alt="Coins"
              className="w-4 h-4 sm:w-5 sm:h-5 object-contain -ml-0.5 drop-shadow-sm shrink-0"
              draggable={false}
            />
            <span className="tracking-tight text-xs sm:text-sm font-extrabold text-[#92400e]">{coins}</span>
            <span className="text-[#a16207] text-[10px] sm:text-xs font-bold">/{totalCoins}</span>
          </div>

          {/* Paper Weather Switcher Button */}
          {onCycleWeather && (
            <button
              onClick={onCycleWeather}
              aria-label="Toggle Weather"
              title={lang === "id" ? `Cuaca: ${weatherLabel} (Klik untuk ganti cuaca)` : `Weather: ${weatherLabel} (Click to change)`}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-2xl bg-[#fffdf6] hover:bg-[#fef9c3] active:bg-[#fef08a] border-2 border-[#5c3e21] shadow-[0_3px_0_#3e2723] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer min-h-[38px] sm:min-h-[40px] shrink-0"
            >
              <GameIconWeather type={currentWeather} className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="font-black text-[11px] sm:text-xs text-[#3e2723] uppercase hidden lg:inline">
                {weatherLabel}
              </span>
            </button>
          )}

          {/* Paper Music Toggle Button */}
          {onToggleMusic && (
            <button
              onClick={onToggleMusic}
              aria-label="Toggle Music"
              title={isMusicEnabled ? (lang === "id" ? "Musik Latar: Aktif (Klik untuk matikan)" : "Background Music: On (Click to mute)") : (lang === "id" ? "Musik Latar: Senyap (Klik untuk aktifkan)" : "Background Music: Off (Click to unmute)")}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl border-2 border-[#5c3e21] shadow-[0_3px_0_#3e2723] active:translate-y-0.5 active:shadow-none flex items-center justify-center transition-all cursor-pointer p-1.5 shrink-0 ${
                isMusicEnabled ? "bg-[#fffdf6] hover:bg-[#fef9c3] text-[#3e2723]" : "bg-[#fee2e2] hover:bg-[#fecaca] text-[#991b1b]"
              }`}
            >
              <GameIconAudio enabled={isMusicEnabled && !isMuted} className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {/* Paper Map Button */}
          <button
            onClick={onOpenPhone}
            aria-label={t.hud.map}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-2xl bg-[#10b981] hover:bg-[#059669] active:bg-[#047857] text-[#fffdf6] font-black text-xs border-2 border-[#064e3b] shadow-[0_3px_0_#064e3b] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer min-h-[38px] sm:min-h-[40px]"
          >
            <GameIconMap className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span className="font-black uppercase tracking-wider hidden sm:inline">{t.hud.map}</span>
          </button>

          {/* Paper Settings Button */}
          <button
            onClick={onOpenPauseMenu}
            aria-label="Settings"
            title="Settings (ESC)"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#fffdf6] hover:bg-[#fef9c3] active:bg-[#fef08a] border-2 border-[#5c3e21] shadow-[0_3px_0_#3e2723] active:translate-y-0.5 active:shadow-none flex items-center justify-center transition-all cursor-pointer p-2 shrink-0"
          >
            <img
              src="/assets/ui/paper/Icons/GameIcons/IconSettings.png"
              alt="Settings"
              className="w-full h-full object-contain"
              draggable={false}
            />
          </button>

          {/* Paper Fullscreen Toggle Button (Visible on tablet/desktop) */}
          <button
            onClick={toggleFullscreen}
            aria-label="Toggle Fullscreen"
            className="hidden md:flex w-10 h-10 rounded-2xl bg-[#fffdf6] hover:bg-[#fef9c3] active:bg-[#fef08a] border-2 border-[#5c3e21] shadow-[0_3px_0_#3e2723] active:translate-y-0.5 active:shadow-none items-center justify-center transition-all cursor-pointer p-2.5 shrink-0"
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
      {/* ACTIVE ARCADE MINIGAME BANNER (RESPONSIVE)                          */}
      {/* =================================================================== */}
      {activeMinigame && (
        <div className="absolute top-16 sm:top-20 inset-x-0 flex justify-center pointer-events-auto px-3 sm:px-4 z-40 animate-in slide-in-from-top-3 duration-200">
          <div className="w-full max-w-sm sm:max-w-lg bg-[#fffdf6] border-2 sm:border-[3px] border-[#5c3e21] rounded-3xl p-3.5 sm:p-5 shadow-[0_8px_0_#3e2723] text-[#3e2723] space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] border border-[#78350f] animate-ping shrink-0" />
                <h4 className="font-black text-xs sm:text-base text-[#78350f] uppercase tracking-wide truncate">
                  {activeMinigame.title}
                </h4>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <div
                  className={`px-2.5 py-0.5 sm:py-1 rounded-xl font-black text-xs sm:text-sm border-2 ${
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
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#fee2e2] hover:bg-[#fecaca] border-2 border-[#991b1b] shadow-[0_2px_0_#991b1b] active:translate-y-0.5 active:shadow-none flex items-center justify-center p-1.5 cursor-pointer"
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
              <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-[#5c3e21]">
                <span className="truncate pr-2">{activeMinigame.instructions}</span>
                <span className="font-black text-[#92400e] text-xs sm:text-sm shrink-0">
                  {activeMinigame.score} / {activeMinigame.targetScore}
                </span>
              </div>
              <div className="relative w-full h-3 sm:h-4 bg-[#f3eedd] rounded-full overflow-hidden border-2 border-[#5c3e21] shadow-inner p-0.5">
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
              <div className="p-2 sm:p-2.5 rounded-2xl bg-[#dcfce7] border-2 border-[#16a34a] text-[#15803d] font-black text-center text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_3px_0_#16a34a]">
                <img
                  src="/assets/ui/paper/Icons/GameIcons/IconCoin.png"
                  alt="Win"
                  className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
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
        <div className="absolute top-20 sm:top-24 inset-x-0 flex justify-center pointer-events-none animate-in zoom-in-95 duration-200 px-4">
          <div className="px-6 sm:px-8 py-3 sm:py-4 rounded-3xl bg-[#22c55e] text-[#14532d] font-black text-xl sm:text-3xl shadow-[0_8px_0_#15803d] border-4 border-[#fffdf6] flex items-center gap-3 animate-bounce">
            <img
              src="/assets/ui/paper/Icons/GameIcons/IconCoin.png"
              alt="Goal"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
              draggable={false}
            />
            <span className="tracking-wide text-white drop-shadow">{t.common.goalCelebration}</span>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* PAPER UI KIT INTERACTION PROMPT (Near NPC)                          */}
      {/* =================================================================== */}
      {activeNPC && !isIntroCinematic && (() => {
        const npcName = BILINGUAL_NPCS[activeNPC.id]?.name[lang] || activeNPC.name;
        return (
          <div
            className="absolute inset-x-0 flex justify-center pointer-events-auto animate-in slide-in-from-bottom-3 duration-200 px-4"
            style={{ bottom: "max(8.5rem, calc(env(safe-area-inset-bottom, 0px) + 7.5rem))" }}
          >
            <button
              onClick={onInteractNPC}
              className="group px-4 sm:px-6 py-2.5 sm:py-3 rounded-3xl bg-[#fffdf6] hover:bg-[#fef9c3] active:bg-[#fef08a] border-2 sm:border-[3px] border-[#5c3e21] text-[#3e2723] font-black text-xs sm:text-sm shadow-[0_6px_0_#3e2723] active:translate-y-1 active:shadow-none flex items-center gap-2.5 sm:gap-3 transition-all cursor-pointer min-h-[48px]"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-[#fef08a] border-2 border-[#854d0e] flex items-center justify-center p-1 shadow-inner shrink-0">
                <GameIconResidentBadge role={activeNPC.id} className="w-full h-full" fallbackEmoji={activeNPC.avatar} />
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="text-[9px] sm:text-[10px] text-[#059669] uppercase tracking-wider font-extrabold">
                  {t.common.interact}
                </span>
                <span className="text-[#3e2723] font-black text-xs sm:text-base truncate max-w-[160px] sm:max-w-none">
                  {t.common.talkTo} {npcName}
                </span>
              </div>
              <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-xl bg-[#22c55e] text-white font-black text-[10px] sm:text-xs border border-[#15803d] shadow-[0_2px_0_#15803d] shrink-0 ml-1">
                [E]
              </span>
            </button>
          </div>
        );
      })()}
    </div>
  );
};
