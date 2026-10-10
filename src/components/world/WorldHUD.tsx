"use client";

import React, { useState } from "react";
import { Volume2, VolumeX, Maximize2, Minimize2, Smartphone, Compass, Sparkles, HelpCircle, Trophy } from "lucide-react";
import { NPCData } from "./WorldEngine";

interface WorldHUDProps {
  location: string;
  coins: number;
  totalCoins: number;
  speedKmH: number;
  nitroPct: number;
  activeNPC: NPCData | null;
  showGoal: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenPhone: () => void;
  onInteractNPC: () => void;
}

export const WorldHUD: React.FC<WorldHUDProps> = ({
  location,
  coins,
  totalCoins,
  speedKmH,
  nitroPct,
  activeNPC,
  showGoal,
  isMuted,
  onToggleMute,
  onOpenPhone,
  onInteractNPC,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30 select-none">
      {/* ================================================================= */}
      {/* TOP BAR                                                          */}
      {/* ================================================================= */}
      <div className="p-4 sm:p-6 flex items-start justify-between">
        {/* Brand Pill (Top-Left) */}
        <div className="pointer-events-auto flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/15 text-white shadow-lg">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-extrabold font-display tracking-tight text-sm sm:text-base">
            D LUCKY <span className="text-emerald-400">WORLD</span>
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            3D LIVE
          </span>
        </div>

        {/* Current Location Pill (Top-Center) */}
        <div className="hidden sm:flex items-center gap-2 px-5 py-2 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/15 text-white shadow-lg animate-in fade-in duration-300">
          <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          <span className="font-bold text-sm text-cyan-200">{location}</span>
        </div>

        {/* Top-Right Player Stats & Utility */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
          {/* Coins Counter */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-950/80 backdrop-blur-md border border-amber-400/30 text-amber-200 font-bold text-sm shadow-lg">
            <span className="text-base">🪙</span>
            <span>{coins}</span>
            <span className="text-amber-500/80 text-xs">/ {totalCoins}</span>
          </div>

          {/* Speedometer & Nitro */}
          <div className="hidden md:flex flex-col items-end gap-1 px-3.5 py-1.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/15 text-white shadow-lg">
            <div className="flex items-center gap-2 text-xs font-mono font-bold">
              <span className="text-cyan-400">{speedKmH}</span>
              <span className="text-slate-400 text-[10px]">KM/H</span>
            </div>
            {/* Nitro Bar */}
            <div className="w-20 h-1.5 rounded-full bg-slate-800 overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-100"
                style={{ width: `${nitroPct}%` }}
              />
            </div>
          </div>

          {/* Audio Mute/Unmute */}
          <button
            onClick={onToggleMute}
            aria-label="Toggle Sound"
            className="p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-white/15 text-white shadow-lg active:scale-95 transition-all"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            aria-label="Toggle Fullscreen"
            className="hidden sm:flex p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-white/15 text-white shadow-lg active:scale-95 transition-all"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Help Button */}
          <button
            onClick={() => setShowHelp(true)}
            aria-label="Help & Guide"
            className="p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-white/15 text-white shadow-lg active:scale-95 transition-all"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* ================================================================= */}
      {/* GOAL CELEBRATION BANNER                                           */}
      {/* ================================================================= */}
      {showGoal && (
        <div className="absolute top-24 inset-x-0 flex justify-center pointer-events-none animate-in zoom-in-95 duration-300">
          <div className="px-8 py-4 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white font-extrabold text-2xl sm:text-3xl shadow-2xl border-2 border-emerald-300 flex items-center gap-3 animate-bounce">
            <Trophy className="w-8 h-8 text-amber-300 fill-current" />
            <span>GOAAAL! +100 EXP</span>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* PROXIMITY NPC BILLBOARD INTERACTION PROMPT                       */}
      {/* ================================================================= */}
      {activeNPC && (
        <div className="absolute bottom-28 inset-x-0 flex justify-center pointer-events-auto animate-in slide-in-from-bottom-3 duration-300">
          <button
            onClick={onInteractNPC}
            className="group px-6 py-3 rounded-full bg-slate-900/90 hover:bg-cyan-600 backdrop-blur-xl border border-cyan-400/50 text-white font-bold text-sm sm:text-base shadow-2xl flex items-center gap-3 active:scale-95 transition-all"
          >
            <span className="text-xl">{activeNPC.avatar}</span>
            <span>Bicara dengan {activeNPC.name}</span>
            <span className="px-2 py-0.5 rounded-md bg-white/20 text-xs font-mono group-hover:bg-white group-hover:text-cyan-900">
              [E]
            </span>
          </button>
        </div>
      )}

      {/* ================================================================= */}
      {/* VIRTUAL SMARTPHONE TRIGGER BUTTON (Bottom-Right)                  */}
      {/* ================================================================= */}
      <div className="absolute bottom-6 right-6 pointer-events-auto">
        <button
          onClick={onOpenPhone}
          className="group relative flex items-center gap-3 px-5 py-3.5 rounded-3xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-sm sm:text-base shadow-2xl shadow-indigo-500/30 border border-white/25 active:scale-95 transition-all"
        >
          <Smartphone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span>Phone Hub &amp; Map</span>
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
          </span>
        </button>
      </div>

      {/* ================================================================= */}
      {/* HELP MODAL                                                        */}
      {/* ================================================================= */}
      {showHelp && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-white/20 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold font-display flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyan-400" />
                Panduan D Lucky World 3D
              </h3>
              <button
                onClick={() => setShowHelp(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold flex-shrink-0">
                  1
                </span>
                <p>
                  <strong>Eksplorasi Kepulauan:</strong> Gunakan keyboard <code className="bg-slate-800 px-1.5 py-0.5 rounded text-white">WASD</code> atau layar sentuh untuk menjelajahi 5 pulau bertema gaming.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold flex-shrink-0">
                  2
                </span>
                <p>
                  <strong>Kendaraan Otomatis:</strong> Di daratan Milo berlari; saat masuk ke lautan, Milo otomatis mengendarai <em>Cyber Jet Ski</em> berkecepatan tinggi!
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold flex-shrink-0">
                  3
                </span>
                <p>
                  <strong>Virtual Smartphone:</strong> Buka <code className="bg-slate-800 px-1.5 py-0.5 rounded text-white">Phone Hub</code> di pojok kanan bawah untuk melihat <strong>Minimap GPS</strong>, teleport antar pulau, dan cek misi.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold flex-shrink-0">
                  4
                </span>
                <p>
                  <strong>Soccer Bay:</strong> Di pulau selatan, tabrak bola sepak raksasa masuk ke gawang untuk mencetak gol!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 font-bold text-white shadow-lg active:scale-95 transition-transform"
            >
              Mulai Menjelajah!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
