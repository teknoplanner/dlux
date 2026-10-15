"use client";

import React, { useEffect } from "react";
import { Play, Map, Gamepad2, Volume2, VolumeX, RotateCcw, Home, Compass, Trophy } from "lucide-react";
import { WorldAudio } from "./WorldAudio";

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
}) => {
  // ESC key resumes the game
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

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 text-white select-none animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-[#040914] border-2 border-teal-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-40 bg-teal-500/15 rounded-full blur-[70px] pointer-events-none" />

        {/* Pause Header */}
        <div className="relative text-center space-y-1.5 border-b border-white/10 pb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-300 font-mono text-[10px] font-bold tracking-[0.25em] uppercase">
            <Compass className="w-3 h-3 text-amber-400" />
            <span>EXPEDITION SUSPENDED</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display tracking-wider text-white">
            GAME PAUSED
          </h2>
        </div>

        {/* Current Expedition Progress Slate */}
        <div className="relative bg-slate-950/80 rounded-2xl p-4 border border-white/10 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-[11px] text-slate-400">CURRENT REGION:</span>
            <span className="font-bold text-teal-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {location}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span className="text-[11px] text-slate-400">GOLDEN TOKENS:</span>
            <span className="font-bold text-amber-400">
              {coins} / {totalCoins}
            </span>
          </div>

          {/* Miniature Coin Progress Track */}
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (coins / totalCoins) * 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-slate-300 pt-1">
            <span className="text-[11px] text-slate-400">QUESTS COMPLETED:</span>
            <span className="font-bold text-emerald-400">
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
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm uppercase tracking-wider border-t border-white/50 border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 shadow-[0_6px_20px_rgba(16,185,129,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>RESUME EXPEDITION</span>
            <span className="text-[10px] opacity-80">[ESC]</span>
          </button>

          {/* Map & Fast Travel */}
          <button
            onClick={() => handleAction(onOpenMap)}
            onMouseEnter={handleHover}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-white/10 hover:border-teal-400/50 text-slate-200 hover:text-white font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <Map className="w-4 h-4 text-teal-400" />
              <span>ARCHIPELAGO MAP &amp; FAST TRAVEL</span>
            </div>
            <span className="text-[10px] text-slate-400">[M]</span>
          </button>

          {/* Controls Guide */}
          <button
            onClick={() => handleAction(onOpenControls)}
            onMouseEnter={handleHover}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-white/10 hover:border-teal-400/50 text-slate-200 hover:text-white font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2.5 shadow-sm"
          >
            <Gamepad2 className="w-4 h-4 text-teal-400" />
            <span>HOW TO PLAY &amp; CONTROLS</span>
          </button>

          {/* Audio Toggle */}
          <button
            onClick={onToggleMute}
            onMouseEnter={handleHover}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-white/10 hover:border-teal-400/50 text-slate-200 hover:text-white font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              <span>SOUND EFFECTS &amp; AMBIENCE</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400">{isMuted ? "OFF" : "ON"}</span>
          </button>

          {/* Return to Title */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
            <button
              onClick={() => handleAction(onReturnToTitle)}
              onMouseEnter={handleHover}
              className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-white/10 text-slate-400 hover:text-white font-mono text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>MAIN TITLE</span>
            </button>

            <button
              onClick={() => handleAction(onExitToWeb)}
              onMouseEnter={handleHover}
              className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-red-950/70 border border-white/10 hover:border-red-500/40 text-slate-400 hover:text-red-300 font-mono text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>EXIT TO WEB</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
