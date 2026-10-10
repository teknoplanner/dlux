"use client";

import React, { useEffect, useRef, useState } from "react";
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

    // Simulated short smooth intro
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => {
      clearTimeout(timer);
      clearInterval(coordInterval);
      engine.dispose();
      audio.dispose();
    };
  }, []);

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
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400/50 flex items-center justify-center text-3xl animate-bounce">
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

      {/* Coastal World HUD Overlay */}
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
    </div>
  );
};
