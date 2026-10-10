"use client";
import React, { useEffect, useRef, useState } from "react";
import { Play, Gamepad2 } from "lucide-react";
import { WorldEngine, NPCData, ActiveMinigame } from "./WorldEngine";
import { WorldAudio } from "./WorldAudio";
import { WorldHUD } from "./WorldHUD";
import { WorldControls } from "./WorldControls";
import { WorldSmartphone } from "./WorldSmartphone";
import { WorldDialogueModal } from "./WorldDialogueModal";
import { WorldLoadingScreen } from "./WorldLoadingScreen";

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
  const [activeMinigame, setActiveMinigame] = useState<ActiveMinigame | null>(null);
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
        setSpeedKmH((prev) => (prev === spd ? prev : spd));
      },
      onNitroUpdate: (nit) => {
        const rounded = Math.round(nit);
        setNitroPct((prev) => (prev === rounded ? prev : rounded));
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
      onMinigameUpdate: (game) => {
        setActiveMinigame(game);
      },
    });

    engineRef.current = engine;

    // Periodic coordinate tracking for minimap (only updates when player changes position)
    const coordInterval = setInterval(() => {
      if (engineRef.current) {
        setPlayerCoord((prev) => {
          const px = Math.round(engineRef.current!.playerPos.x * 10) / 10;
          const pz = Math.round(engineRef.current!.playerPos.z * 10) / 10;
          if (prev.x === px && prev.z === pz) return prev;
          return { x: px, z: pz };
        });
      }
    }, 250);

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
      engineRef.current?.setActiveDialogueNPC(activeNPC);
      setDialogueNPC(activeNPC);
    }
  };

  const handleCloseDialogue = () => {
    engineRef.current?.setActiveDialogueNPC(null);
    setDialogueNPC(null);
  };

  const handleStartChallenge = (challengeId: "ring_trial" | "penalty_kick" | "crystal_runes" | "airdrop_hunt") => {
    engineRef.current?.setActiveDialogueNPC(null);
    setDialogueNPC(null);
    engineRef.current?.startMinigame(challengeId);
  };

  const handleFastTravel = (islandId: string) => {
    engineRef.current?.fastTravel(islandId);
  };

  const handleCompleteQuest = (questId: string) => {
    setCompletedQuests((prev) => ({ ...prev, [questId]: true }));
  };

  const handleFinishLoading = React.useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950 select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Professional AAA Game Loading Screen */}
      {isLoading && (
        <WorldLoadingScreen onFinishLoading={handleFinishLoading} />
      )}

      {/* =================================================================== */}
      {/* AAA VIDEO GAME TITLE SCREEN & START MENU                           */}
      {/* =================================================================== */}
      {!isLoading && !hasEntered && (
        <div className="absolute inset-0 z-40 bg-slate-950/75 backdrop-blur-[3px] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-300">
          <div className="max-w-lg w-full flex flex-col items-center text-center space-y-6 my-auto">
            {/* Retro Arcade Title Crest */}
            <div className="space-y-2">
              <div className="inline-block px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[11px] font-bold tracking-[0.25em] uppercase">
                ★ 1P COIN-OP ARCHIPELAGO ★
              </div>
              <h1 className="text-4xl sm:text-6xl font-black font-display tracking-wider text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
                D LUCKY <span className="text-emerald-400">WORLD</span>
              </h1>
              <p className="text-xs sm:text-sm font-mono tracking-widest uppercase text-slate-400 font-semibold">
                COASTAL ADVENTURE: MILO&apos;S QUEST
              </p>
            </div>

            {/* Cabinet Instruction Plate (Authentic Arcade Control Panel) */}
            <div className="w-full bg-slate-900/95 border-2 border-slate-700/80 rounded-xl p-4 shadow-[0_8px_24px_rgba(0,0,0,0.6)] text-left">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Gamepad2 className="w-4 h-4 text-emerald-400" />
                  CONTROL PANEL
                </span>
                <span className="text-[10px] text-slate-400">KEYBOARD &amp; TOUCH</span>
              </div>

              {/* Physical 3D Keycaps */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                  <span className="px-2 py-1 rounded bg-slate-800 text-white font-mono font-bold text-xs border-t border-slate-600 border-b-[3px] border-slate-950 shadow-inner">
                    WASD
                  </span>
                  <span className="text-[10px] font-mono text-slate-300 font-bold uppercase tracking-wider">
                    Move / Run
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                  <span className="px-3 py-1 rounded bg-slate-800 text-emerald-400 font-mono font-bold text-xs border-t border-slate-600 border-b-[3px] border-slate-950 shadow-inner">
                    SPACE
                  </span>
                  <span className="text-[10px] font-mono text-slate-300 font-bold uppercase tracking-wider">
                    Jump
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                  <span className="px-2.5 py-1 rounded bg-slate-800 text-cyan-400 font-mono font-bold text-xs border-t border-slate-600 border-b-[3px] border-slate-950 shadow-inner">
                    SHIFT
                  </span>
                  <span className="text-[10px] font-mono text-slate-300 font-bold uppercase tracking-wider">
                    Sprint Dash
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                  <span className="px-2.5 py-1 rounded bg-slate-800 text-amber-400 font-mono font-bold text-xs border-t border-slate-600 border-b-[3px] border-slate-950 shadow-inner">
                    E
                  </span>
                  <span className="text-[10px] font-mono text-slate-300 font-bold uppercase tracking-wider">
                    Interact / Talk
                  </span>
                </div>
              </div>
            </div>

            {/* Chunky Mechanical Arcade Start Buttons */}
            <div className="w-full space-y-3 pt-1">
              <button
                type="button"
                onClick={() => handleEnterWorld(true)}
                className="w-full group relative py-4 px-6 rounded-xl bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600 hover:from-emerald-300 hover:to-emerald-500 text-slate-950 font-black tracking-wider uppercase border-t-2 border-emerald-200 border-b-[6px] border-emerald-900 active:border-b-0 active:translate-y-[6px] shadow-[0_8px_20px_rgba(16,185,129,0.35)] transition-all cursor-pointer flex items-center justify-center gap-3"
              >
                <Play className="w-5 h-5 fill-slate-950" />
                <span className="text-lg sm:text-xl font-display font-black tracking-widest">
                  PRESS START • FULLSCREEN
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleEnterWorld(false)}
                className="w-full py-2.5 px-4 rounded-lg bg-slate-900/90 hover:bg-slate-800 border-t border-slate-700 border-b-[3px] border-slate-950 active:border-b-0 active:translate-y-[3px] text-xs font-mono font-bold text-slate-300 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Gamepad2 className="w-4 h-4 text-slate-400" />
                <span>PLAY IN WINDOWED MODE</span>
              </button>
            </div>

            {/* Retro Arcade Coin-Op Footer Prompt */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-mono">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>FREE PLAY</span>
              <span className="text-slate-600">•</span>
              <span>PRESS <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 font-bold">F</kbd> FOR FULLSCREEN</span>
            </div>
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
            activeMinigame={activeMinigame}
            showGoal={showGoal}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onOpenPhone={() => setIsPhoneOpen(true)}
            onInteractNPC={handleInteract}
            onCancelMinigame={() => engineRef.current?.cancelMinigame()}
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
            onClose={handleCloseDialogue}
            onCompleteQuest={handleCompleteQuest}
            onStartChallenge={handleStartChallenge}
          />
        </>
      )}
    </div>
  );
};
