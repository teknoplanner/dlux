"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { WorldEngine, NPCData, ActiveMinigame } from "./WorldEngine";
import { WorldAudio } from "./WorldAudio";
import { WeatherType } from "./WorldWeatherManager";
import { WorldHUD } from "./WorldHUD";
import { WorldControls } from "./WorldControls";
import { WorldSmartphone } from "./WorldSmartphone";
import { WorldDialogueModal } from "./WorldDialogueModal";
import { WorldLoadingScreen } from "./WorldLoadingScreen";
import { WorldMainMenu } from "./WorldMainMenu";
import { WorldPauseMenu } from "./WorldPauseMenu";
import { WorldLang, detectUserLanguage, saveUserLanguage } from "./worldI18n";

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
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [currentWeather, setCurrentWeather] = useState<WeatherType>("day");
  const [playerCoord, setPlayerCoord] = useState({ x: 0, z: 0 });
  const [completedQuests, setCompletedQuests] = useState<Record<string, boolean>>({});
  const [lang, setLang] = useState<WorldLang>(() => detectUserLanguage());
  const [isIntroCinematic, setIsIntroCinematic] = useState(false);

  const handleToggleLang = useCallback((newLang: WorldLang) => {
    setLang(newLang);
    saveUserLanguage(newLang);
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize Audio
    const audio = new WorldAudio();
    audioRef.current = audio;
    setIsMusicEnabled(audio.getMusicEnabled());

    // Allow initial frame of WorldLoadingScreen to paint cleanly before launching 3D engine
    const initTimer = setTimeout(() => {
      if (!mountRef.current) return;

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
        onWeatherUpdate: (w) => {
          setCurrentWeather(w);
        },
        onCinematicUpdate: (active) => {
          setIsIntroCinematic(active);
        },
      });

      engineRef.current = engine;
    }, 60);

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

    // Keyboard shortcuts: Fullscreen (F key), Cycle Weather (V key)
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
      } else if (e.code === "KeyV") {
        const next = engineRef.current?.cycleWeather();
        if (next) {
          setCurrentWeather(next);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(initTimer);
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

      if (engineRef.current) {
        engineRef.current.dispose();
        engineRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.dispose();
        audioRef.current = null;
      }
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
    if (isMusicEnabled && !isMuted) {
      audioRef.current?.playMusic();
    }
    setHasEntered(true);
    setIsPauseOpen(false);
  };

  const handleToggleMute = useCallback(() => {
    if (audioRef.current) {
      const newMuted = audioRef.current.setMuted(!isMuted);
      setIsMuted(newMuted);
    }
  }, [isMuted]);

  const handleToggleMusic = useCallback(() => {
    if (audioRef.current) {
      const next = audioRef.current.toggleMusic();
      setIsMusicEnabled(next);
    }
  }, []);

  const handleSetWeather = useCallback((w: WeatherType) => {
    engineRef.current?.setWeather(w);
    setCurrentWeather(w);
  }, []);

  const handleCycleWeather = useCallback(() => {
    const next = engineRef.current?.cycleWeather();
    if (next) {
      setCurrentWeather(next);
    }
  }, []);

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

  const handleStartExploration = async () => {
    await handleEnterWorld(false);
    setIsLoading(false);
    engineRef.current?.startIntroCinematic();
  };

  const handleSkipCinematic = () => {
    engineRef.current?.skipIntroCinematic();
  };

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
        <WorldLoadingScreen
          onStartExploration={handleStartExploration}
          lang={lang}
        />
      )}

      {/* Professional Video Game Title Screen & Main Menu */}
      {!isLoading && !hasEntered && (
        <WorldMainMenu
          onStartGame={handleEnterWorld}
          audio={audioRef.current}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          isMusicEnabled={isMusicEnabled}
          onToggleMusic={handleToggleMusic}
          currentWeather={currentWeather}
          onSetWeather={handleSetWeather}
          lang={lang}
          onToggleLang={handleToggleLang}
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
            isMusicEnabled={isMusicEnabled}
            onToggleMusic={handleToggleMusic}
            currentWeather={currentWeather}
            onCycleWeather={handleCycleWeather}
            isIntroCinematic={isIntroCinematic}
            onSkipCinematic={handleSkipCinematic}
            onOpenPhone={() => setIsPhoneOpen(true)}
            onInteractNPC={handleInteract}
            onOpenPauseMenu={() => setIsPauseOpen(true)}
            onCancelMinigame={() => engineRef.current?.cancelMinigame()}
            lang={lang}
          />

          {/* Input Controls (Suspended if Pause Menu is open or during Intro Cinematic) */}
          {!isPauseOpen && !isIntroCinematic && (
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
            lang={lang}
          />

          {/* NPC Dialogue Bottom Sheet */}
          <WorldDialogueModal
            npc={dialogueNPC}
            onClose={handleCloseDialogue}
            onCompleteQuest={handleCompleteQuest}
            onStartChallenge={handleStartChallenge}
            lang={lang}
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
            isMusicEnabled={isMusicEnabled}
            onToggleMusic={handleToggleMusic}
            currentWeather={currentWeather}
            onSetWeather={handleSetWeather}
            onReturnToTitle={handleReturnToTitle}
            onExitToWeb={handleExitToWeb}
            coins={coins}
            totalCoins={totalCoins}
            location={locationName}
            completedQuestsCount={completedQuestsCount}
            audio={audioRef.current}
            lang={lang}
            onToggleLang={handleToggleLang}
          />

          {/* In-Game Controls Modal (Triggered from Pause Menu) */}
          {isControlsModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="w-full max-w-lg bg-[#fffdf6] border-4 border-[#5c3e21] rounded-3xl p-6 sm:p-7 text-[#3e2723] space-y-5 shadow-[0_12px_0_#3e2723] relative">
                <div className="flex items-center justify-between border-b-2 border-[#ebdcb9] pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🎮</span>
                    <h3 className="text-base sm:text-lg font-black text-[#3e2723] uppercase tracking-wide">
                      {lang === "id" ? "PANDUAN KONTROL" : "CONTROLS QUICK REFERENCE"}
                    </h3>
                  </div>
                  {/* Paper Close Button */}
                  <button
                    onClick={() => setIsControlsModalOpen(false)}
                    className="w-10 h-10 inline-flex items-center justify-center cursor-pointer active:scale-95 transition-transform group"
                  >
                    <img
                      src="/assets/ui/paper/Buttons/ButtonClose2.png"
                      alt="Close"
                      className="w-full h-full object-contain group-active:hidden drop-shadow-md"
                      draggable={false}
                    />
                    <img
                      src="/assets/ui/paper/Buttons/ButtonClose2Active.png"
                      alt="Close"
                      className="w-full h-full object-contain hidden group-active:block drop-shadow-md"
                      draggable={false}
                    />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-sans">
                  <div className="p-3 rounded-2xl bg-[#fefce8] border-2 border-[#ca8a04] text-center shadow-sm">
                    <span className="block font-black text-[#3e2723] bg-[#fef08a] px-2.5 py-1 rounded-xl border border-[#ca8a04]">WASD / ARROWS</span>
                    <span className="text-[11px] font-bold text-[#854d0e] mt-1.5 block">{lang === "id" ? "Bergerak & Belok" : "Move / Steer"}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#fefce8] border-2 border-[#ca8a04] text-center shadow-sm">
                    <span className="block font-black text-[#15803d] bg-[#dcfce7] px-2.5 py-1 rounded-xl border border-[#16a34a]">SPACE</span>
                    <span className="text-[11px] font-bold text-[#854d0e] mt-1.5 block">{lang === "id" ? "Lompat" : "Jump / Hop"}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#fefce8] border-2 border-[#ca8a04] text-center shadow-sm">
                    <span className="block font-black text-[#0369a1] bg-[#e0f2fe] px-2.5 py-1 rounded-xl border border-[#0284c7]">SHIFT</span>
                    <span className="text-[11px] font-bold text-[#854d0e] mt-1.5 block">{lang === "id" ? "Lari Cepat (Sprint)" : "Sprint Dash"}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#fefce8] border-2 border-[#ca8a04] text-center shadow-sm">
                    <span className="block font-black text-[#b45309] bg-[#fef3c7] px-2.5 py-1 rounded-xl border border-[#d97706]">E / TAP</span>
                    <span className="text-[11px] font-bold text-[#854d0e] mt-1.5 block">{lang === "id" ? "Interaksi NPC" : "Talk / Interact"}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#fefce8] border-2 border-[#ca8a04] text-center shadow-sm">
                    <span className="block font-black text-[#047857] bg-[#d1fae5] px-2.5 py-1 rounded-xl border border-[#059669]">M</span>
                    <span className="text-[11px] font-bold text-[#065f46] mt-1.5 block">{lang === "id" ? "Peta & Fast Travel" : "Map & Teleport"}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#fefce8] border-2 border-[#ca8a04] text-center shadow-sm">
                    <span className="block font-black text-[#7c3aed] bg-[#ede9fe] px-2.5 py-1 rounded-xl border border-[#7c3aed]">V</span>
                    <span className="text-[11px] font-bold text-[#5b21b6] mt-1.5 block">{lang === "id" ? "Ganti Cuaca" : "Cycle Weather"}</span>
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => setIsControlsModalOpen(false)}
                    className="relative w-full max-w-xs h-12 inline-flex items-center justify-center cursor-pointer active:scale-95 transition-transform group"
                  >
                    <img
                      src="/assets/ui/paper/Buttons/MediumButtons/ButtonMediumGreen.png"
                      alt="Back"
                      className="w-full h-full object-contain group-active:hidden drop-shadow-md"
                      draggable={false}
                    />
                    <img
                      src="/assets/ui/paper/Buttons/MediumButtons/ButtonMediumGreenActive.png"
                      alt="Back"
                      className="w-full h-full object-contain hidden group-active:block drop-shadow-md"
                      draggable={false}
                    />
                    <span className="absolute inset-0 flex items-center justify-center font-black text-xs sm:text-sm text-white tracking-wider pb-1 group-active:pt-1">
                      {lang === "id" ? "KEMBALI KE PAUSE MENU" : "BACK TO PAUSE MENU"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
