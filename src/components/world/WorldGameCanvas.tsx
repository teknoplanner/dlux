"use client";

import React, { useEffect, useRef, useState } from "react";
import { Maximize2, Sparkles, Play, Compass } from "lucide-react";
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
    }, 600);

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

      {/* Loading Screen */}
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center gap-4 text-white animate-in fade-out duration-500">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400/50 flex items-center justify-center text-3xl animate-bounce">
            🐱
          </div>
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold font-display tracking-tight text-white">
              D LUCKY <span className="text-emerald-400">WORLD 3D</span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">Memuat Kepulauan Gaming Three.js...</p>
          </div>
          <div className="w-48 h-1.5 rounded-full bg-slate-800 overflow-hidden mt-2">
            <div className="h-full bg-emerald-400 rounded-full animate-pulse w-full" />
          </div>
        </div>
      )}

      {/* Welcome & Fullscreen Entrance Modal (Coastal World Experience) */}
      {!isLoading && !hasEntered && (
        <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-500">
          <div className="max-w-md w-full bg-slate-900/90 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
            {/* Mascot Badge */}
            <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500/20 via-cyan-500/20 to-indigo-500/20 border-2 border-cyan-400/40 flex items-center justify-center text-4xl shadow-xl shadow-cyan-500/20 animate-pulse">
              🐱
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Three.js Archipelago
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
                D LUCKY <span className="text-emerald-400">WORLD 3D</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Jelajahi kepulauan gaming interaktif bersama <strong>Milo the Cat</strong>! Kendarai Cyber Jet Ski di lautan, selesaikan misi, dan raih kemenangan.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-white/10 flex items-center gap-2">
                <span className="text-base">🏄</span>
                <span>Cyber Jet Ski</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-white/10 flex items-center gap-2">
                <span className="text-base">⚽</span>
                <span>Arcade Soccer</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-white/10 flex items-center gap-2">
                <span className="text-base">📱</span>
                <span>GPS Smartphone</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-white/10 flex items-center gap-2">
                <span className="text-base">⚡</span>
                <span>60 FPS Fluid</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => handleEnterWorld(true)}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-black text-base sm:text-lg shadow-xl shadow-emerald-400/30 flex items-center justify-center gap-3 active:scale-98 transition-all cursor-pointer"
              >
                <Maximize2 className="w-5 h-5 text-slate-950" />
                <span>MASUK KE GAME (FULLSCREEN)</span>
              </button>

              <button
                onClick={() => handleEnterWorld(false)}
                className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer underline underline-offset-4"
              >
                Atau main dalam jendela biasa
              </button>
            </div>

            <p className="text-[10px] text-slate-500 font-mono">
              💡 Tekan <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">F</kbd> kapan saja untuk beralih mode Fullscreen.
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

          {/* Input Controls (Keyboard + Mobile Touch Joystick) */}
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
