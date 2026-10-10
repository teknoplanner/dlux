"use client";

import React, { useEffect, useRef, useState } from "react";
import { Maximize2, Sparkles, Play, Gamepad2, Zap, ArrowBigUp, Volume2, VolumeX } from "lucide-react";
import { WorldEngine, NPCData } from "./WorldEngine";
import { WorldAudio } from "./WorldAudio";
import { WorldHUD } from "./WorldHUD";
import { WorldControls } from "./WorldControls";
import { WorldSmartphone } from "./WorldSmartphone";
import { WorldDialogueModal } from "./WorldDialogueModal";

export const WorldGameCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<WorldEngine | null>(null);
  const audioRef = useRef<WorldAudio | null>(null);

  // Game UI State
  const [isLoading, setIsLoading] = useState(true);
  const [hasEntered, setHasEntered] = useState(false);
  const [locationName, setLocationName] = useState("Central Plaza");
  const [coins, setCoins] = useState(0);
  const [totalCoins, setTotalCoins] = useState(30);
  const [speedKmH, setSpeedKmH] = useState(0);
  const [nitroPct, setNitroPct] = useState(100);
  const [activeNPC, setActiveNPC] = useState<NPCData | null>(null);
  const [dialogueNPC, setDialogueNPC] = useState<NPCData | null>(null);
  const [showGoal, setShowGoal] = useState(false);
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playerCoord, setPlayerCoord] = useState({ x: 0, z: 0 });
  const [completedQuests, setCompletedQuests] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize Audio
    const audio = new WorldAudio();
    audioRef.current = audio;

    // Initialize Engine
    const engine = new WorldEngine(mountRef.current, audio, {
      onCoinsUpdate: (c, tot) => {
        setCoins(c);
        setTotalCoins(tot);
      },
      onLocationUpdate: (loc) => {
        setLocationName(loc);
      },
      onSpeedUpdate: (spd) => {
        setSpeedKmH(spd);
      },
      onNitroUpdate: (nit) => {
        setNitroPct(nit);
      },
      onGoal: () => {
        setShowGoal(true);
        setTimeout(() => setShowGoal(false), 3500);
      },
      onProximityChange: (npc) => {
        setActiveNPC(npc);
      },
      onQuestProgress: (questId) => {
        setCompletedQuests((prev) => ({ ...prev, [questId]: true }));
      },
    });

    engineRef.current = engine;

    // Periodic coordinate tracking for minimap
    const coordInterval = setInterval(() => {
      if (engineRef.current) {
        setPlayerCoord({
          x: engineRef.current.playerPos.x,
          z: engineRef.current.playerPos.z,
        });
      }
    }, 200);

    // Initial load timer
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    // Fullscreen key toggle (F key)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyF") {
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
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      clearInterval(coordInterval);
      window.removeEventListener("keydown", handleKeyDown);

      // Cleanly exit fullscreen on navigation back to prevent errors
      if (document.fullscreenElement) {
        try {
          if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          } else if ((document as any).webkitExitFullscreen) {
            (document as any).webkitExitFullscreen();
          }
        } catch {}
      }

      engine.dispose();
      audio.dispose();
    };
  }, []);

  const handleEnterWorld = async (fullscreen: boolean) => {
    if (fullscreen) {
      try {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if ((elem as any).webkitRequestFullscreen) {
          await (elem as any).webkitRequestFullscreen();
        }
      } catch (err) {
        console.warn("Fullscreen request dismissed or unsupported:", err);
      }
    }
    audioRef.current?.init();
    audioRef.current?.playCoin();
    setHasEntered(true);
  };

  const handleToggleMute = () => {
    if (audioRef.current) {
      const newMuted = audioRef.current.setMuted(!isMuted);
      setIsMuted(newMuted);
    }
  };

  const handleInteract = () => {
    if (activeNPC) {
      setDialogueNPC(activeNPC);
    }
  };

  const handleFastTravel = (islandId: string) => {
    engineRef.current?.fastTravel(islandId);
  };

  const handleCompleteQuest = (questId: string) => {
    setCompletedQuests((prev) => ({ ...prev, [questId]: true }));
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950 select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Arcade Loading Screen */}
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-slate-950/95 flex flex-col items-center justify-center gap-5 text-white animate-in fade-out duration-500">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-[3px] shadow-[0_0_40px_rgba(16,185,129,0.5)] animate-pulse">
              <div className="w-full h-full bg-slate-950 rounded-[21px] flex items-center justify-center text-4xl">
                🐱
              </div>
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-ping" />
          </div>

          <div className="text-center space-y-1.5">
            <h2 className="text-2xl font-black font-display tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 drop-shadow-[0_2px_10px_rgba(16,185,129,0.4)]">
              D LUCKY WORLD 3D
            </h2>
            <p className="text-xs text-emerald-400/80 font-mono tracking-widest uppercase">
              INITIALIZING THREE.JS ARCHIPELAGO...
            </p>
          </div>

          {/* Cyberpunk Arcade Loading Bar */}
          <div className="w-64 h-3 rounded-full bg-slate-900 border border-emerald-500/40 p-0.5 overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 rounded-full animate-[pulse_1s_infinite] w-full" />
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* AAA VIDEO GAME TITLE SCREEN & START MENU                           */}
      {/* =================================================================== */}
      {!isLoading && !hasEntered && (
        <div className="absolute inset-0 z-40 bg-gradient-to-b from-slate-950/80 via-slate-950/70 to-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in zoom-in-95 duration-500">
          <div className="max-w-xl w-full flex flex-col items-center text-center space-y-6 my-auto">
            {/* Top Arcade Ribbon */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(16,185,129,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
              <span>OFFICIAL 3D BROWSER ADVENTURE</span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
            </div>

            {/* 3D Title Crest */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-300 drop-shadow-[0_4px_24px_rgba(16,185,129,0.5)]">
                D LUCKY <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">WORLD</span>
              </h1>
              <p className="text-xs sm:text-sm font-mono tracking-widest uppercase text-cyan-300 font-bold drop-shadow">
                ★ COASTAL GAMING ARCHIPELAGO • MILO&apos;S QUEST ★
              </p>
            </div>

            {/* Arcade Feature Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-emerald-500/30 shadow-lg text-left space-y-1">
                <div className="text-xl">🏄</div>
                <div className="text-xs font-bold text-white">Cyber Jet Ski</div>
                <div className="text-[10px] text-slate-400 font-mono">Water drift &amp; wake</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-cyan-500/30 shadow-lg text-left space-y-1">
                <div className="text-xl">⚽</div>
                <div className="text-xs font-bold text-white">Beach Soccer</div>
                <div className="text-[10px] text-slate-400 font-mono">Ball bounce &amp; goals</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-indigo-500/30 shadow-lg text-left space-y-1">
                <div className="text-xl">📱</div>
                <div className="text-xs font-bold text-white">Smart Radar</div>
                <div className="text-[10px] text-slate-400 font-mono">GPS fast travel</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-amber-500/30 shadow-lg text-left space-y-1">
                <div className="text-xl">🪙</div>
                <div className="text-xs font-bold text-white">30 Tokens</div>
                <div className="text-[10px] text-slate-400 font-mono">Islands secrets</div>
              </div>
            </div>

            {/* Arcade Control Deck Guide */}
            <div className="w-full p-4 rounded-2xl bg-slate-900/90 border border-white/10 shadow-2xl space-y-2.5 text-left">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>🕹️ ARCADE CONTROL DECK</span>
                <span className="text-emerald-400">KEYBOARD &amp; TOUCH</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="flex items-center gap-2 bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-white/10">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold border-b-2 border-slate-700 text-[11px]">WASD</span>
                  <span className="text-slate-300 text-[11px]">Gerak</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-white/10">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold border-b-2 border-slate-700 text-[11px]">SPACE</span>
                  <span className="text-slate-300 text-[11px]">Lompat</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-white/10">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold border-b-2 border-slate-700 text-[11px]">SHIFT</span>
                  <span className="text-slate-300 text-[11px]">Nitro</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-white/10">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-bold border-b-2 border-slate-700 text-[11px]">E</span>
                  <span className="text-slate-300 text-[11px]">Bicara</span>
                </div>
              </div>
            </div>

            {/* Heavy 3D Tactile Arcade Button (NOT a generic web button!) */}
            <div className="w-full space-y-3 pt-2">
              <button
                onClick={() => handleEnterWorld(true)}
                className="w-full group relative py-5 px-8 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-black text-lg sm:text-xl tracking-wider uppercase border-t border-white/40 border-b-[6px] border-emerald-700 active:border-b-0 active:translate-y-[6px] shadow-[0_12px_32px_rgba(16,185,129,0.5)] transition-all cursor-pointer flex items-center justify-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-slate-950 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
                <span>▶ PRESS START • PLAY FULLSCREEN</span>
              </button>

              <button
                onClick={() => handleEnterWorld(false)}
                className="py-2.5 px-6 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/15 text-xs font-mono font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                🎮 Main Mode Jendela Biasa
              </button>
            </div>

            <p className="text-[11px] text-slate-500 font-mono">
              💡 Tekan <kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-bold">F</kbd> kapan saja untuk beralih mode Fullscreen.
            </p>
          </div>
        </div>
      )}

      {/* Coastal World HUD Overlay */}
      {hasEntered && (
        <>
          <WorldHUD
            location={locationName}
            coins={coins}
            totalCoins={totalCoins}
            speedKmH={speedKmH}
            nitroPct={nitroPct}
            activeNPC={activeNPC}
            showGoal={showGoal}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onOpenPhone={() => setIsPhoneOpen(true)}
            onInteractNPC={handleInteract}
          />

          {/* Input Controls */}
          <WorldControls engine={engineRef.current} onInteract={handleInteract} />

          {/* Virtual Smartphone Drawer Hub */}
          <WorldSmartphone
            isOpen={isPhoneOpen}
            onClose={() => setIsPhoneOpen(false)}
            playerPos={playerCoord}
            pois={engineRef.current?.pois || []}
            onFastTravel={handleFastTravel}
            completedQuests={completedQuests}
          />

          {/* NPC Dialogue Bottom Sheet */}
          <WorldDialogueModal
            npc={dialogueNPC}
            onClose={() => setDialogueNPC(null)}
            onCompleteQuest={handleCompleteQuest}
          />
        </>
      )}
    </div>
  );
};
