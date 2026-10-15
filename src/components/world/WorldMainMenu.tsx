"use client";

import React, { useState, useEffect } from "react";
import { Play, Gamepad2, Map, Volume2, VolumeX, Maximize2, Info, Compass, Sparkles, X, Trophy, Shield, HelpCircle, ArrowRight } from "lucide-react";
import { WorldAudio } from "./WorldAudio";

interface WorldMainMenuProps {
  onStartGame: (fullscreen: boolean) => void;
  audio: WorldAudio | null;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const WorldMainMenu: React.FC<WorldMainMenuProps> = ({
  onStartGame,
  audio,
  isMuted,
  onToggleMute,
}) => {
  const [activeModal, setActiveModal] = useState<"controls" | "atlas" | "settings" | null>(null);

  // Play tactile hover & select sounds
  const handleHover = () => {
    audio?.playMenuHover();
  };

  const handleSelect = (cb: () => void) => {
    audio?.playMenuSelect();
    cb();
  };

  // Keyboard shortcut: Press ENTER or SPACE to start game immediately
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeModal) {
        if (e.code === "Escape") {
          audio?.playMenuBack();
          setActiveModal(null);
        }
        return;
      }
      if (e.code === "Enter" || e.code === "Space") {
        e.preventDefault();
        audio?.playMenuSelect();
        onStartGame(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModal, onStartGame, audio]);

  return (
    <div className="absolute inset-0 z-40 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/80 backdrop-blur-[2px] flex flex-col justify-between p-4 sm:p-8 select-none text-white animate-in fade-in duration-500 overflow-y-auto">
      {/* =================================================================== */}
      {/* TOP BAR: STUDIO MONOGRAM, AUDIO & FULLSCREEN CONTROLS              */}
      {/* =================================================================== */}
      <div className="relative z-10 w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 p-[1.5px] shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <div className="w-full h-full bg-[#040d1a] rounded-[10px] flex items-center justify-center">
              <span className="font-display font-black text-sm text-emerald-400">DL</span>
            </div>
          </div>
          <div>
            <span className="font-display font-bold text-xs tracking-[0.25em] text-slate-200 block uppercase">
              DLUCKYX STUDIOS
            </span>
            <span className="font-mono text-[9px] text-teal-400 tracking-wider font-semibold block uppercase">
              COASTAL ARCHIPELAGO ADVENTURE
            </span>
          </div>
        </div>

        {/* Tactile Audio & Display Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMute}
            onMouseEnter={handleHover}
            aria-label="Toggle Sound"
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/10 hover:border-teal-400/50 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-2 shadow-sm"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-red-400" />
                <span className="text-xs font-mono font-bold hidden sm:inline">MUTED</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold hidden sm:inline">SOUND ON</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* CENTER HERO TITLE & EXPEDITION EMBLEM                               */}
      {/* =================================================================== */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto py-6 max-w-2xl mx-auto space-y-6">
        {/* Game Title Plate */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/80 border border-teal-500/40 text-teal-300 font-mono text-[11px] font-bold tracking-[0.25em] uppercase shadow-lg backdrop-blur-sm">
            <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            <span>ORIGINAL 3D OPEN SEA ADVENTURE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
            D LUCKY <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-400 to-amber-300">WORLD</span>
          </h1>

          <p className="text-xs sm:text-sm font-mono tracking-[0.25em] uppercase text-slate-300 font-semibold max-w-md mx-auto">
            MILO&apos;S COASTAL ARCHIPELAGO EXPEDITION
          </p>
        </div>

        {/* ================================================================= */}
        {/* PRIMARY GAME MENU ACTIONS                                         */}
        {/* ================================================================= */}
        <div className="w-full max-w-sm space-y-2.5 pt-2">
          {/* Hero Play Button: Fullscreen on Desktop / Direct on Mobile */}
          <button
            type="button"
            onMouseEnter={handleHover}
            onClick={() => handleSelect(() => onStartGame(true))}
            className="group relative w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black tracking-wider uppercase border-t border-white/60 border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 shadow-[0_8px_25px_rgba(16,185,129,0.4)] transition-all cursor-pointer flex items-center justify-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-slate-950/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-4 h-4 fill-slate-950 text-slate-950 ml-0.5" />
            </div>
            <span className="text-base sm:text-lg font-display font-black tracking-widest">
              START ADVENTURE
            </span>
          </button>

          {/* Secondary Options Grid */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onMouseEnter={handleHover}
              onClick={() => handleSelect(() => setActiveModal("controls"))}
              className="py-3 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-white/15 hover:border-teal-400/50 text-slate-200 hover:text-white font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <Gamepad2 className="w-4 h-4 text-teal-400" />
              <span>HOW TO PLAY</span>
            </button>

            <button
              type="button"
              onMouseEnter={handleHover}
              onClick={() => handleSelect(() => setActiveModal("atlas"))}
              className="py-3 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-white/15 hover:border-amber-400/50 text-slate-200 hover:text-white font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <Map className="w-4 h-4 text-amber-400" />
              <span>ISLAND ATLAS</span>
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* FOOTER BAR: CONTROLS HINT & COPYRIGHT                               */}
      {/* =================================================================== */}
      <div className="relative z-10 w-full flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-white/10 pt-4 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold text-slate-300">EXPLORATION READY</span>
          <span className="text-slate-600">•</span>
          <span className="hidden sm:inline">PRESS <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700 font-bold">ENTER</kbd> TO EMBARK</span>
          <span className="sm:hidden">KEYBOARD &amp; TOUCH SUPPORTED</span>
        </div>

        <div className="text-slate-500 text-[10px]">
          &copy; 2026 D Lucky X Games. Built with Three.js WebGL.
        </div>
      </div>

      {/* =================================================================== */}
      {/* MODAL 1: HOW TO PLAY & CONTROLS GUIDE                               */}
      {/* =================================================================== */}
      {activeModal === "controls" && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-slate-900/95 border-2 border-teal-500/40 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-400/30">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-display tracking-wide text-white">
                    HOW TO PLAY &amp; CONTROLS
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">Master Milo&apos;s movements on island &amp; sea</p>
                </div>
              </div>
              <button
                onClick={() => {
                  audio?.playMenuBack();
                  setActiveModal(null);
                }}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Keyboard & Gamepad Layout */}
            <div className="space-y-3 font-mono text-xs">
              <h4 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                Keyboard Controls
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-950 border border-white/10 text-center space-y-1">
                  <div className="inline-block px-2 py-0.5 rounded bg-slate-800 text-white font-bold border-b-2 border-slate-700">
                    WASD / ↑↓←→
                  </div>
                  <span className="block text-[10px] text-slate-400">Move / Steer</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-white/10 text-center space-y-1">
                  <div className="inline-block px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold border-b-2 border-slate-700">
                    SPACE
                  </div>
                  <span className="block text-[10px] text-slate-400">Jump / Hop</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-white/10 text-center space-y-1">
                  <div className="inline-block px-2 py-0.5 rounded bg-slate-800 text-teal-400 font-bold border-b-2 border-slate-700">
                    SHIFT
                  </div>
                  <span className="block text-[10px] text-slate-400">Sprint Nitro</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-white/10 text-center space-y-1">
                  <div className="inline-block px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-bold border-b-2 border-slate-700">
                    E
                  </div>
                  <span className="block text-[10px] text-slate-400">Talk / Interact</span>
                </div>
              </div>

              {/* Touchscreen summary */}
              <h4 className="text-[11px] font-bold text-teal-400 uppercase tracking-wider pt-2">
                Mobile &amp; Touch Controls
              </h4>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-white/10 space-y-2 text-slate-300">
                <p>• <strong>Left Screen:</strong> Tactile 4-way D-Pad to walk and steer smoothly.</p>
                <p>• <strong>Right Screen:</strong> Dedicated <strong>Jump</strong> (Green) and <strong>Sprint Dash</strong> (Cyan) action buttons.</p>
                <p>• <strong>Map Button:</strong> Tap MAP at top-right anytime for instant Fast Travel teleportation.</p>
              </div>
            </div>

            <button
              onClick={() => {
                audio?.playMenuSelect();
                setActiveModal(null);
                onStartGame(false);
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              UNDERSTOOD • EMBARK NOW
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 2: ARCHIPELAGO ATLAS PREVIEW                                  */}
      {/* =================================================================== */}
      {activeModal === "atlas" && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-slate-900/95 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  <Map className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-display tracking-wide text-white">
                    ARCHIPELAGO ISLAND ATLAS
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">5 Discoverable territories in D Lucky World</p>
                </div>
              </div>
              <button
                onClick={() => {
                  audio?.playMenuBack();
                  setActiveModal(null);
                }}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">1. Central Plaza</span>
                  <span className="text-[10px] text-teal-400 uppercase tracking-widest font-bold">SPAWN POINT</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  The bustling capital pier with merchant stalls, pedestrian bridges, and fisherman Pak Mamat.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">2. MOBA Sanctuary</span>
                  <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">ANCIENT MONUMENTS</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Marble pillars and rune circles guarded by Grandmaster Valen the Knight.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">3. Beach Stadium</span>
                  <span className="text-[10px] text-amber-400 uppercase tracking-widest font-bold">SOCCER ARENA</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Sandy arena with goal posts and a giant soccer ball ready for your penalty kicks!
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">4. Battle Royale Outpost</span>
                  <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold">TACTICAL DOCKS</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Watchtower fortress with airdrop supply crates and Spec-Ops Ace Jax.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                audio?.playMenuSelect();
                setActiveModal(null);
                onStartGame(false);
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              SET SAIL TO ARCHIPELAGO
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
