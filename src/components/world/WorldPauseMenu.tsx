"use client";

import React, { useEffect } from "react";
import { WorldAudio } from "./WorldAudio";
import { WeatherType } from "./WorldWeatherManager";
import { WorldLang, WORLD_STRINGS } from "./worldI18n";
import { GameIconWeather, GameIconAudio, GameIconIsland } from "./WorldGameIcons";

interface WorldPauseMenuProps {
  isOpen: boolean;
  onResume: () => void;
  onOpenMap: () => void;
  onOpenControls: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isMusicEnabled?: boolean;
  onToggleMusic?: () => void;
  currentWeather?: WeatherType;
  onSetWeather?: (weather: WeatherType) => void;
  onReturnToTitle: () => void;
  onExitToWeb: () => void;
  coins: number;
  totalCoins: number;
  location: string;
  completedQuestsCount: number;
  audio: WorldAudio | null;
  lang: WorldLang;
  onToggleLang: (lang: WorldLang) => void;
}

export const WorldPauseMenu: React.FC<WorldPauseMenuProps> = ({
  isOpen,
  onResume,
  onOpenMap,
  onOpenControls,
  isMuted,
  onToggleMute,
  isMusicEnabled = true,
  onToggleMusic,
  currentWeather = "day",
  onSetWeather,
  onReturnToTitle,
  onExitToWeb,
  coins,
  totalCoins,
  location,
  completedQuestsCount,
  audio,
  lang,
  onToggleLang,
}) => {
  const t = WORLD_STRINGS[lang];

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        e.preventDefault();
        audio?.playMenuBack();
        onResume();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onResume, audio]);

  if (!isOpen) return null;

  const handleHover = () => {
    audio?.playMenuHover();
  };

  const handleAction = (cb: () => void) => {
    audio?.playMenuSelect();
    cb();
  };

  const localizedLocation = t.hud.locations[location as keyof typeof t.hud.locations] || location;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 text-[#3e2723] select-none animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#fffdf6] border-3 sm:border-4 border-[#5c3e21] rounded-3xl p-6 sm:p-7 space-y-4 shadow-[0_12px_0_#3e2723] relative">
        {/* PaperUIKit Settings Title Banner */}
        <div className="flex flex-col items-center -mt-12 sm:-mt-14 mb-2">
          <div className="relative">
            <img
              src="/assets/ui/paper/TitleContainers/TitleContainerSettings.png"
              alt="Settings"
              className="h-14 sm:h-16 w-auto drop-shadow-md"
              draggable={false}
            />
            <div className="absolute inset-0 flex items-center justify-center pb-3">
              <span className="text-base sm:text-lg font-black text-[#3e2723] uppercase tracking-wider font-sans drop-shadow-sm">
                {t.pauseMenu.title}
              </span>
            </div>
          </div>
        </div>

        {/* Header bar with Status & Language Toggle */}
        <div className="flex items-center justify-between border-b-2 border-[#ebdcb9] pb-3">
          <p className="text-xs text-[#854d0e] font-extrabold">{t.pauseMenu.suspended}</p>

          {/* Paper Language Toggle Pill */}
          <div className="flex items-center rounded-xl bg-[#f5eedc] border-2 border-[#5c3e21] p-0.5 shadow-sm">
            <button
              type="button"
              onClick={() => {
                audio?.playMenuHover();
                onToggleLang("id");
              }}
              className={`px-3 py-0.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                lang === "id"
                  ? "bg-[#22c55e] text-white shadow-sm border border-[#15803d]"
                  : "text-[#854d0e] hover:text-[#3e2723]"
              }`}
            >
              ID
            </button>
            <button
              type="button"
              onClick={() => {
                audio?.playMenuHover();
                onToggleLang("en");
              }}
              className={`px-3 py-0.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                lang === "en"
                  ? "bg-[#22c55e] text-white shadow-sm border border-[#15803d]"
                  : "text-[#854d0e] hover:text-[#3e2723]"
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Current Expedition Progress Slate */}
        <div className="bg-[#fefce8] rounded-2xl p-4 border-2 border-[#ca8a04] space-y-2.5 text-xs font-bold text-[#854d0e] shadow-[0_3px_0_#ca8a04]">
          <div className="flex items-center justify-between">
            <span className="text-[#a16207]">{t.pauseMenu.currentRegion}:</span>
            <span className="font-black text-[#3e2723] flex items-center gap-1.5 text-sm">
              <GameIconIsland className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{localizedLocation}</span>
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#a16207] flex items-center gap-1.5">
              <img
                src="/assets/ui/paper/Icons/GameIcons/IconCoin.png"
                alt="Coin"
                className="w-4 h-4 object-contain inline"
                draggable={false}
              />
              {t.pauseMenu.goldTokens}:
            </span>
            <span className="font-black text-[#854d0e] text-sm">
              {coins} / {totalCoins}
            </span>
          </div>

          {/* Paper Progress Track */}
          <div className="w-full h-3.5 bg-[#f5eedc] rounded-full overflow-hidden border-2 border-[#5c3e21] p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#facc15] to-[#22c55e] rounded-full transition-all duration-300 border-r border-[#15803d]"
              style={{ width: `${Math.min(100, (coins / totalCoins) * 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <span className="text-[#a16207]">{t.pauseMenu.questsCompleted}:</span>
            <span className="font-black text-[#047857]">
              {completedQuestsCount} / 4
            </span>
          </div>
        </div>

        {/* Tactile Pause Actions with PaperUIKit Buttons */}
        <div className="space-y-2.5 pt-1 flex flex-col items-center w-full">
          {/* Resume Button using PaperUIKit ButtonMediumGreen */}
          <button
            onClick={() => handleAction(onResume)}
            onMouseEnter={handleHover}
            className="relative group w-full inline-flex items-center justify-center cursor-pointer select-none active:scale-95 transition-transform"
          >
            <img
              src="/assets/ui/paper/Buttons/MediumButtons/ButtonMediumGreen.png"
              alt="Resume"
              className="h-12 w-full object-fill group-active:hidden drop-shadow-md rounded-2xl"
              draggable={false}
            />
            <img
              src="/assets/ui/paper/Buttons/MediumButtons/ButtonMediumGreenActive.png"
              alt="Resume"
              className="h-12 w-full object-fill hidden group-active:block drop-shadow-md rounded-2xl"
              draggable={false}
            />
            <span className="absolute inset-0 flex items-center justify-center gap-2 font-black text-[#14532d] text-sm tracking-wide uppercase pb-1 group-active:pt-1">
              <img
                src="/assets/ui/paper/Icons/GameIcons/IconPlay.png"
                alt=""
                className="w-4 h-4 object-contain inline"
                draggable={false}
              />
              <span>{t.pauseMenu.resume}</span>
              <span className="text-xs opacity-80">[ESC]</span>
            </span>
          </button>

          {/* Map & Fast Travel using PaperUIKit ButtonMediumBlue */}
          <button
            onClick={() => handleAction(onOpenMap)}
            onMouseEnter={handleHover}
            className="relative group w-full inline-flex items-center justify-center cursor-pointer select-none active:scale-95 transition-transform"
          >
            <img
              src="/assets/ui/paper/Buttons/MediumButtons/ButtonMediumBlue.png"
              alt="Map"
              className="h-11 w-full object-fill group-active:hidden drop-shadow-md rounded-2xl"
              draggable={false}
            />
            <img
              src="/assets/ui/paper/Buttons/MediumButtons/ButtonMediumBlueActive.png"
              alt="Map"
              className="h-11 w-full object-fill hidden group-active:block drop-shadow-md rounded-2xl"
              draggable={false}
            />
            <span className="absolute inset-0 flex items-center justify-center gap-2 font-black text-[#1e3a8a] text-xs sm:text-sm tracking-wide uppercase pb-1 group-active:pt-1">
              <span>{t.pauseMenu.mapFastTravel}</span>
              <span className="text-xs opacity-75">[M]</span>
            </span>
          </button>

          {/* Audio Sound Effects Toggle in Paper Card */}
          <button
            onClick={onToggleMute}
            onMouseEnter={handleHover}
            className="w-full py-2.5 px-4 rounded-2xl bg-[#fffdf6] hover:bg-[#fef9c3] active:bg-[#fef08a] border-2 border-[#5c3e21] shadow-[0_3px_0_#3e2723] active:translate-y-0.5 active:shadow-none text-xs font-black transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5 text-[#3e2723]">
              <img
                src="/assets/ui/paper/Icons/GameIcons/IconSettings.png"
                alt=""
                className={`w-4 h-4 object-contain ${isMuted ? "grayscale opacity-50" : ""}`}
                draggable={false}
              />
              <span>{t.pauseMenu.soundEffects}</span>
            </div>
            <span className="font-extrabold text-[#854d0e]">{isMuted ? t.common.muted : t.common.soundOn}</span>
          </button>

          {/* Background Music (BGM) Toggle in Paper Card */}
          {onToggleMusic && (
            <button
              onClick={onToggleMusic}
              onMouseEnter={handleHover}
              className="w-full py-2.5 px-4 rounded-2xl bg-[#fffdf6] hover:bg-[#fef9c3] active:bg-[#fef08a] border-2 border-[#5c3e21] shadow-[0_3px_0_#3e2723] active:translate-y-0.5 active:shadow-none text-xs font-black transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-2 text-[#3e2723]">
                <GameIconAudio enabled={isMusicEnabled && !isMuted} className="w-4 h-4 text-amber-800 shrink-0" />
                <span>{t.pauseMenu.backgroundMusic}</span>
              </div>
              <span className={`font-extrabold ${isMusicEnabled && !isMuted ? "text-[#15803d]" : "text-[#b91c1c]"}`}>
                {isMusicEnabled && !isMuted ? t.common.soundOn : t.common.muted}
              </span>
            </button>
          )}

          {/* Weather & Time of Day Selector */}
          {onSetWeather && (
            <div className="w-full p-3 rounded-2xl bg-[#fffdf6] border-2 border-[#5c3e21] shadow-[0_3px_0_#3e2723] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#3e2723] flex items-center gap-1.5 uppercase">
                  <GameIconWeather type="header" className="w-4 h-4 shrink-0" />
                  <span>{t.pauseMenu.weatherTitle}</span>
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-[#fef08a] text-[#854d0e] border border-[#ca8a04]">
                  {currentWeather === "day"
                    ? t.pauseMenu.weatherDay
                    : currentWeather === "night"
                    ? t.pauseMenu.weatherNight
                    : currentWeather === "rain"
                    ? t.pauseMenu.weatherRain
                    : t.pauseMenu.weatherSnow}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {(
                  [
                    { id: "day", label: t.pauseMenu.weatherDay },
                    { id: "night", label: t.pauseMenu.weatherNight },
                    { id: "rain", label: t.pauseMenu.weatherRain },
                    { id: "snow", label: t.pauseMenu.weatherSnow },
                  ] as const
                ).map((item) => {
                  const isActive = currentWeather === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        audio?.playMenuHover();
                        onSetWeather(item.id);
                      }}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border-2 transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#22c55e] text-white border-[#15803d] shadow-sm font-black scale-102"
                          : "bg-[#f5eedc] text-[#854d0e] hover:bg-[#fef9c3] border-[#ca8a04]/50"
                      }`}
                    >
                      <GameIconWeather type={item.id} className="w-5 h-5 mb-0.5 shrink-0" />
                      <span className="text-[10px] font-black tracking-tight">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Return to Title & Exit using Paper Buttons */}
          <div className="grid grid-cols-2 gap-2 w-full pt-1">
            <button
              onClick={() => handleAction(onReturnToTitle)}
              onMouseEnter={handleHover}
              className="py-2.5 px-3 rounded-2xl bg-[#fffdf6] hover:bg-[#fef9c3] active:bg-[#fef08a] border-2 border-[#5c3e21] shadow-[0_3px_0_#3e2723] active:translate-y-0.5 active:shadow-none text-[#5c3e21] text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>{t.pauseMenu.mainTitle}</span>
            </button>

            <button
              onClick={() => handleAction(onExitToWeb)}
              onMouseEnter={handleHover}
              className="py-2.5 px-3 rounded-2xl bg-[#fee2e2] hover:bg-[#fecaca] active:bg-[#fca5a5] border-2 border-[#991b1b] shadow-[0_3px_0_#991b1b] active:translate-y-0.5 active:shadow-none text-[#991b1b] text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>{t.pauseMenu.exitWeb}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
