"use client";

import React, { useEffect } from "react";
import { Play, Map, Gamepad2, Volume2, VolumeX, RotateCcw, Home, Compass } from "lucide-react";
import { WorldAudio } from "./WorldAudio";
import { WorldLang, WORLD_STRINGS } from "./worldI18n";

interface WorldPauseMenuProps {
  isOpen: boolean;
  onResume: () => void;
  onOpenMap: () => void;
  onOpenControls: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 text-white select-none animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#161b22] border-2 border-slate-700 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl relative">
        {/* Pause Header with Language Switcher */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <h2 className="text-xl font-black text-white tracking-tight">
                {t.pauseMenu.title}
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-medium">{t.pauseMenu.suspended}</p>
          </div>

          {/* Language Toggle Pill */}
          <div className="flex items-center rounded-xl bg-slate-900 border border-slate-700 p-0.5 shadow-sm">
            <button
              type="button"
              onClick={() => {
                audio?.playMenuHover();
                onToggleLang("id");
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                lang === "id"
                  ? "bg-emerald-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
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
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                lang === "en"
                  ? "bg-emerald-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Current Expedition Progress Slate */}
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-2.5 text-xs font-medium">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400 font-bold">{t.pauseMenu.currentRegion}:</span>
            <span className="font-extrabold text-emerald-400 flex items-center gap-1.5">
              🏝️ {localizedLocation}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400 font-bold">{t.pauseMenu.goldTokens}:</span>
            <span className="font-black text-amber-400">
              {coins} / {totalCoins}
            </span>
          </div>

          {/* Miniature Coin Progress Track */}
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (coins / totalCoins) * 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-slate-300 pt-0.5">
            <span className="text-slate-400 font-bold">{t.pauseMenu.questsCompleted}:</span>
            <span className="font-extrabold text-emerald-400">
              {completedQuestsCount} / 4
            </span>
          </div>
        </div>

        {/* Tactile Pause Actions */}
        <div className="space-y-2.5 pt-1">
          {/* Resume Button */}
          <button
            onClick={() => handleAction(onResume)}
            onMouseEnter={handleHover}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-black text-sm uppercase tracking-wide border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>{t.pauseMenu.resume}</span>
            <span className="text-xs opacity-80">[ESC]</span>
          </button>

          {/* Map & Fast Travel */}
          <button
            onClick={() => handleAction(onOpenMap)}
            onMouseEnter={handleHover}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <Map className="w-4 h-4 text-emerald-400" />
              <span>{t.pauseMenu.mapFastTravel}</span>
            </div>
            <span className="text-slate-400">[M]</span>
          </button>

          {/* Controls Guide */}
          <button
            onClick={() => handleAction(onOpenControls)}
            onMouseEnter={handleHover}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2.5 shadow-sm"
          >
            <Gamepad2 className="w-4 h-4 text-emerald-400" />
            <span>{t.pauseMenu.howToPlay}</span>
          </button>

          {/* Audio Toggle */}
          <button
            onClick={onToggleMute}
            onMouseEnter={handleHover}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              <span>{t.pauseMenu.soundEffects}</span>
            </div>
            <span className="font-extrabold text-slate-400">{isMuted ? t.common.muted : t.common.soundOn}</span>
          </button>

          {/* Return to Title & Exit */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => handleAction(onReturnToTitle)}
              onMouseEnter={handleHover}
              className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.pauseMenu.mainTitle}</span>
            </button>

            <button
              onClick={() => handleAction(onExitToWeb)}
              onMouseEnter={handleHover}
              className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-red-950/70 border border-slate-700 hover:border-red-500/40 text-slate-300 hover:text-red-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{t.pauseMenu.exitWeb}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
