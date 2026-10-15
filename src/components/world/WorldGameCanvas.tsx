"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { WorldEngine, NPCData, ActiveMinigame } from "./WorldEngine";
import { WorldAudio } from "./WorldAudio";
import { WorldHUD } from "./WorldHUD";
import { WorldControls } from "./WorldControls";
import { WorldSmartphone } from "./WorldSmartphone";
import { WorldDialogueModal } from "./WorldDialogueModal";
import { WorldLoadingScreen } from "./WorldLoadingScreen";
import { WorldMainMenu } from "./WorldMainMenu";
import { WorldPauseMenu } from "./WorldPauseMenu";
import { Gamepad2, X } from "lucide-react";

export const WorldGameCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<WorldEngine | null>(null);
  const audioRef = useRef<WorldAudio | null>(null);

  // Game UI State
  const [isLoading, setIsLoading] = useState(true);
  const [hasEntered, setHasEntered] = useState(false);
  const [isPauseOpen, setIsPauseOpen] = useState(false);
  const [isControlsModalOpen, setIsControlsModalOpen] = useState(false);
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

    // Periodic coordinate tracking for minimap
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
    const isMobile =
      typeof window !== "undefined" &&
      ("ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches ||
        window.innerWidth < 1024);

    if (fullscreen && !isMobile) {
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
    } else if (isMobile && typeof document !== "undefined" && document.fullscreenElement) {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        }
      } catch {}
    }

    if (engineRef.current) {
      engineRef.current.isTitleScreen = false;
    }
    audioRef.current?.init();
    audioRef.current?.playCoin();
    setHasEntered(true);
    setIsPauseOpen(false);
  };

  const handleToggleMute = useCallback(() => {
    if (audioRef.current) {
      const newMuted = audioRef.current.setMuted(!isMuted);
      setIsMuted(newMuted);
    }
  }, [isMuted]);

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

  const handleFinishLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleReturnToTitle = () => {
    if (engineRef.current) {
      engineRef.current.isTitleScreen = true;
    }
    setIsPauseOpen(false);
    setHasEntered(false);
  };

  const handleExitToWeb = () => {
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

  const completedQuestsCount = Object.values(completedQuests).filter(Boolean).length;

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950 select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Professional AAA Game Loading Screen */}
      {isLoading && (
        <WorldLoadingScreen onFinishLoading={handleFinishLoading} />
      )}

      {/* Professional Video Game Title Screen & Main Menu */}
      {!isLoading && !hasEntered && (
        <WorldMainMenu
          onStartGame={handleEnterWorld}
          audio={audioRef.current}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
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
            onOpenPauseMenu={() => setIsPauseOpen(true)}
            onCancelMinigame={() => engineRef.current?.cancelMinigame()}
          />

          {/* Input Controls (Suspended if Pause Menu is open) */}
          {!isPauseOpen && (
            <WorldControls engine={engineRef.current} onInteract={handleInteract} />
          )}

          {/* Navigator's Slate Drawer Hub */}
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

          {/* In-Game Pause Menu */}
          <WorldPauseMenu
            isOpen={isPauseOpen}
            onResume={() => setIsPauseOpen(false)}
            onOpenMap={() => {
              setIsPauseOpen(false);
              setIsPhoneOpen(true);
            }}
            onOpenControls={() => setIsControlsModalOpen(true)}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onReturnToTitle={handleReturnToTitle}
            onExitToWeb={handleExitToWeb}
            coins={coins}
            totalCoins={totalCoins}
            location={locationName}
            completedQuestsCount={completedQuestsCount}
            audio={audioRef.current}
          />

          {/* In-Game Controls Modal (Triggered from Pause Menu) */}
          {isControlsModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="w-full max-w-lg bg-slate-900 border-2 border-teal-500/40 rounded-3xl p-6 text-white space-y-5 shadow-2xl relative">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <Gamepad2 className="w-5 h-5 text-teal-400" />
                    <h3 className="text-base font-black font-display tracking-wider">
                      CONTROLS QUICK REFERENCE
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsControlsModalOpen(false)}
                    className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-white/10 text-center">
                    <span className="block font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-white/10">WASD</span>
                    <span className="text-[10px] text-slate-400 mt-1 block">Move / Steer</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-white/10 text-center">
                    <span className="block font-bold text-emerald-400 bg-slate-800 px-2 py-0.5 rounded border border-white/10">SPACE</span>
                    <span className="text-[10px] text-slate-400 mt-1 block">Jump / Hop</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-white/10 text-center">
                    <span className="block font-bold text-teal-400 bg-slate-800 px-2 py-0.5 rounded border border-white/10">SHIFT</span>
                    <span className="text-[10px] text-slate-400 mt-1 block">Sprint Dash</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-white/10 text-center">
                    <span className="block font-bold text-amber-400 bg-slate-800 px-2 py-0.5 rounded border border-white/10">E / TAP</span>
                    <span className="text-[10px] text-slate-400 mt-1 block">Talk / Interact</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsControlsModalOpen(false)}
                  className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider"
                >
                  BACK TO PAUSE MENU
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
