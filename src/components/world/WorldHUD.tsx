"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Maximize2, Minimize2, Smartphone, Compass, Sparkles, HelpCircle, Trophy, ArrowLeft, Zap } from "lucide-react";
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
  onCancelMinigame?: () => void;
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
  onCancelMinigame,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

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

  const handleExitGame = () => {
    if (document.fullscreenElement) {
      try {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        }
      } catch {}
    }
    window.location.href = "/";
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30 select-none">
      {/* ================================================================= */}
      {/* TOP ARCADE HUD BAR                                               */}
      {/* ================================================================= */}
      <div className="p-4 sm:p-6 flex items-start justify-between">
        {/* Arcade Exit / Pause Button (Top-Left) */}
        <button
          onClick={handleExitGame}
          className="pointer-events-auto group flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-900/90 hover:bg-red-950/90 border border-white/20 hover:border-red-500/50 text-white shadow-[0_4px_0_#020617] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          title="Exit Game to Web"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400 group-hover:text-red-400 group-hover:-translate-x-1 transition-transform" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 group-hover:bg-red-400 animate-pulse" />
          <span className="font-black font-display tracking-wider text-xs sm:text-sm">
            EXIT <span className="text-emerald-400 group-hover:text-red-400">GAME</span>
          </span>
        </button>

        {/* Arcade Location Radar Banner (Top-Center) */}
        <div className="hidden sm:flex items-center gap-2.5 px-6 py-2 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-cyan-400/40 text-white shadow-[0_4px_16px_rgba(6,182,212,0.25)] animate-in fade-in duration-300">
          <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          <span className="font-black text-sm tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-200">
            {location}
          </span>
        </div>

        {/* Top-Right Player Stats & Tactile Utility Buttons */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
          {/* 3D Coin Counter Pill */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-950/90 to-yellow-950/90 backdrop-blur-md border border-amber-400/50 text-amber-300 font-black text-sm shadow-[0_4px_12px_rgba(245,158,11,0.25)]">
            <span className="text-base animate-bounce">🪙</span>
            <span className="font-mono text-base">{coins}</span>
            <span className="text-amber-500/80 text-xs font-mono">/ {totalCoins}</span>
          </div>

          {/* Arcade Tachometer & Nitro Bar */}
          <div className="hidden md:flex flex-col items-end gap-1 px-4 py-1.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-white/20 text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-1.5 text-xs font-mono font-black">
              <span className="text-cyan-400 text-sm">{speedKmH}</span>
              <span className="text-slate-400 text-[10px]">KM/H</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 text-cyan-400" />
              <div className="w-20 h-1.5 rounded-full bg-slate-800 overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 transition-all duration-100"
                  style={{ width: `${nitroPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Sound Mute/Unmute */}
          <button
            onClick={onToggleMute}
            aria-label="Toggle Sound"
            className="p-2.5 sm:p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-white/20 text-white shadow-[0_4px_0_#020617] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            aria-label="Toggle Fullscreen"
            className="hidden sm:flex p-2.5 sm:p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-white/20 text-white shadow-[0_4px_0_#020617] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-cyan-400" /> : <Maximize2 className="w-4 h-4 text-white" />}
          </button>

          {/* Help & Guide */}
          <button
            onClick={() => setShowHelp(true)}
            aria-label="Help & Guide"
            className="p-2.5 sm:p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-white/20 text-white shadow-[0_4px_0_#020617] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* ================================================================= */}
      {/* ACTIVE ARCADE MINIGAME HUD BANNER                                 */}
      {/* ================================================================= */}
      {activeMinigame && (
        <div className="absolute top-20 sm:top-24 inset-x-0 flex justify-center pointer-events-auto px-4 z-40 animate-in slide-in-from-top-4 duration-300">
          <div className="w-full max-w-xl bg-[#070d18]/95 backdrop-blur-2xl border-[3px] border-amber-400/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-[0_16px_40px_rgba(0,0,0,0.9),inset_0_0_20px_rgba(245,158,11,0.2)] text-white space-y-3 relative">
            {/* Corner Rivets */}
            <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_4px_#facc15]" />
            <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_4px_#facc15]" />
            <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_4px_#facc15]" />
            <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_4px_#facc15]" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-[10px] font-mono font-black uppercase tracking-widest px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 shadow">
                  1P ARCADE TRIAL
                </span>
                <h4 className="font-black font-display text-sm sm:text-base text-amber-300 tracking-wide">
                  {activeMinigame.title}
                </h4>
              </div>

              <div className="flex items-center gap-2.5">
                {/* Digital LED Timer */}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono font-black text-xs sm:text-sm border-2 ${
                    activeMinigame.timeLeft <= 10
                      ? "bg-red-950/80 text-red-400 border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)] animate-pulse"
                      : "bg-slate-950 text-cyan-300 border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                  }`}
                >
                  <span className="text-xs">⏱️</span>
                  <span>{Math.max(0, activeMinigame.timeLeft).toFixed(1)}s</span>
                </div>

                {/* Abort button */}
                {activeMinigame.status === "playing" && (
                  <button
                    onClick={onCancelMinigame}
                    className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-300 border border-white/20 text-xs font-mono font-bold transition-all cursor-pointer"
                    title="Cancel Challenge"
                  >
                    ABORT [✕]
                  </button>
                )}
              </div>
            </div>

            {/* Instructions & Score Progress */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 line-clamp-1">{activeMinigame.instructions}</span>
                <span className="font-black text-amber-300 ml-2 whitespace-nowrap bg-slate-950 px-2 py-0.5 rounded border border-amber-400/30">
                  {activeMinigame.score} / {activeMinigame.targetScore} TARGETS
                </span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-white/20 p-0.5 shadow-inner">
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
              <div className="p-3 rounded-xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 font-black text-center text-xs sm:text-sm animate-bounce flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <Trophy className="w-4 h-4 fill-current text-amber-300" />
                <span>CHALLENGE COMPLETE! +5 GOLD TOKENS AWARDED!</span>
              </div>
            )}

            {/* Time Up Toast */}
            {activeMinigame.status === "lost" && (
              <div className="p-3 rounded-xl bg-red-500/20 border-2 border-red-400 text-red-300 font-black text-center text-xs sm:text-sm animate-pulse flex items-center justify-center gap-2">
                <span>💥</span>
                <span>TIME EXPIRED! Talk to the island guide to try again.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* GOAL CELEBRATION ARCADE BANNER                                    */}
      {/* ================================================================= */}
      {showGoal && (
        <div className="absolute top-24 inset-x-0 flex justify-center pointer-events-none animate-in zoom-in-95 duration-300">
          <div className="px-10 py-5 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 text-white font-black text-3xl sm:text-4xl shadow-[0_10px_35px_rgba(16,185,129,0.6)] border-4 border-emerald-300 flex items-center gap-4 animate-bounce">
            <Trophy className="w-10 h-10 text-amber-300 fill-current" />
            <span className="tracking-wider uppercase drop-shadow">GOAAAL! +100 EXP</span>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* PROXIMITY NPC ARCADE ACTION PROMPT                               */}
      {/* ================================================================= */}
      {activeNPC && (
        <div className="absolute bottom-28 inset-x-0 flex justify-center pointer-events-auto animate-in slide-in-from-bottom-4 duration-300">
          <button
            onClick={onInteractNPC}
            className="group px-7 py-3.5 rounded-full bg-slate-900/95 hover:bg-cyan-600 border-2 border-cyan-400/60 text-white font-black text-sm sm:text-base shadow-[0_8px_25px_rgba(6,182,212,0.4)] flex items-center gap-3 active:scale-95 transition-all cursor-pointer"
          >
            <span className="text-2xl animate-pulse">{activeNPC.avatar}</span>
            <span className="tracking-wide">TALK TO {activeNPC.name.toUpperCase()}</span>
            <span className="px-2.5 py-1 rounded-lg bg-cyan-500 text-slate-950 font-black font-mono text-xs shadow-inner">
              [E]
            </span>
          </button>
        </div>
      )}

      {/* ================================================================= */}
      {/* VIRTUAL SMARTPHONE GADGET TRIGGER (Bottom-Right)                  */}
      {/* ================================================================= */}
      <div className="absolute bottom-6 right-6 pointer-events-auto">
        <button
          onClick={onOpenPhone}
          className="group relative flex items-center gap-3 px-6 py-4 rounded-3xl bg-gradient-to-r from-indigo-600 via-cyan-600 to-indigo-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-black text-sm sm:text-base border-t border-white/40 border-b-4 border-indigo-900 active:border-b-0 active:translate-y-1 shadow-[0_8px_24px_rgba(99,102,241,0.45)] transition-all cursor-pointer"
        >
          <Smartphone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="tracking-wide">PHONE HUB &amp; MAP</span>
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400" />
          </span>
        </button>
      </div>

      {/* ================================================================= */}
      {/* ARCADE HELP & GUIDE MODAL                                         */}
      {/* ================================================================= */}
      {showHelp && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-slate-900 border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-black font-display flex items-center gap-2.5 text-cyan-300">
                <Compass className="w-6 h-6 text-cyan-400" />
                D LUCKY WORLD 3D GUIDE
              </h3>
              <button
                onClick={() => setShowHelp(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-slate-300 font-mono">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-white/10">
                <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold flex-shrink-0">
                  1
                </span>
                <p>
                  <strong>Archipelago Exploration:</strong> Use <code className="bg-slate-800 px-1.5 py-0.5 rounded text-emerald-400 font-bold">WASD</code> or touch controls to move freely.
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-white/10">
                <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold flex-shrink-0">
                  2
                </span>
                <p>
                  <strong>Swimming &amp; Running:</strong> Milo sprints across islands on foot and automatically swims gracefully when entering the ocean!
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-white/10">
                <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold flex-shrink-0">
                  3
                </span>
                <p>
                  <strong>Smartphone Hub:</strong> Tap <code className="bg-slate-800 px-1.5 py-0.5 rounded text-cyan-400 font-bold">Phone Hub</code> on the bottom-right for <strong>GPS Minimap &amp; Fast Travel</strong>.
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-white/10">
                <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold flex-shrink-0">
                  4
                </span>
                <p>
                  <strong>Beach Soccer Stadium:</strong> Dribble and strike the giant soccer ball into the goal to score!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black text-base shadow-[0_6px_20px_rgba(16,185,129,0.4)] border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 transition-all cursor-pointer"
            >
              READY TO EXPLORE!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
