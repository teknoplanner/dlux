"use client";

import React, { useState } from "react";
import { X, MapPin, CheckCircle2, Circle, Compass, Zap, Gamepad2, Sparkles, Navigation, Wifi, Battery } from "lucide-react";
import { IslandPOI } from "./WorldEngine";
import { apps, developer } from "@/data/apps";

interface Quest {
  id: string;
  title: string;
  desc: string;
  reward: string;
  completed: boolean;
}

interface WorldSmartphoneProps {
  isOpen: boolean;
  onClose: () => void;
  playerPos: { x: number; z: number };
  pois: IslandPOI[];
  onFastTravel: (islandId: string) => void;
  completedQuests: Record<string, boolean>;
}

export const WorldSmartphone: React.FC<WorldSmartphoneProps> = ({
  isOpen,
  onClose,
  playerPos,
  pois,
  onFastTravel,
  completedQuests,
}) => {
  const [activeTab, setActiveTab] = useState<"map" | "quests" | "locker" | "games">("map");

  if (!isOpen) return null;

  const quests: Quest[] = [
    {
      id: "moba",
      title: "Holy Blade of MOBA",
      desc: "Visit MOBA Sanctuary and speak with Valen the Knight.",
      reward: "+50 EXP",
      completed: !!completedQuests["moba"],
    },
    {
      id: "soccer",
      title: "World Class Striker",
      desc: "Score 1 goal in Soccer Arena bay by driving the ball into the net.",
      reward: "+100 EXP",
      completed: !!completedQuests["soccer"],
    },
    {
      id: "airdrop",
      title: "Airdrop Hunter",
      desc: "Explore Battle Royale Outpost and find the parachuted airdrop crate.",
      reward: "+50 EXP",
      completed: !!completedQuests["airdrop"],
    },
    {
      id: "tokens",
      title: "Arcade Token Collector",
      desc: "Collect at least 15 arcade token coins across the archipelago.",
      reward: "+100 EXP",
      completed: !!completedQuests["tokens"],
    },
  ];

  // Map coordinate translation (World -100..100 -> SVG 20..280)
  const mapWidth = 300;
  const mapHeight = 300;
  const worldToMap = (x: number, z: number) => {
    const mx = ((x + 100) / 200) * mapWidth;
    const my = ((z + 100) / 200) * mapHeight;
    return { x: Math.max(15, Math.min(mapWidth - 15, mx)), y: Math.max(15, Math.min(mapHeight - 15, my)) };
  };

  const playerMapPos = worldToMap(playerPos.x, playerPos.z);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      {/* Smartphone Device Frame */}
      <div className="relative w-full max-w-[360px] h-[640px] bg-slate-900 border-4 border-slate-700/80 rounded-[44px] shadow-2xl overflow-hidden flex flex-col text-white">
        {/* Device Notch & Status Bar */}
        <div className="h-10 px-6 pt-3 flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-white/5 bg-slate-950/80">
          <span className="font-bold text-white">09:41</span>
          <div className="w-16 h-4 bg-slate-900 rounded-full mx-auto" />
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3 h-3 text-cyan-400" />
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>

        {/* Smartphone Header */}
        <div className="px-5 py-3 flex items-center justify-between bg-slate-900 border-b border-white/10">
          <div>
            <h3 className="text-base font-bold font-display tracking-tight text-white flex items-center gap-1.5">
              <span>D Lucky OS</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                PRO
              </span>
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">Archipelago Companion v2.0</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* TAB 1: GPS MINIMAP & FAST TRAVEL */}
          {activeTab === "map" && (
            <div className="space-y-4">
              <div className="relative w-full aspect-square rounded-3xl bg-sky-950/90 border border-cyan-400/30 overflow-hidden shadow-inner">
                {/* Stylized Archipelago SVG Map */}
                <svg className="w-full h-full" viewBox={`0 0 ${mapWidth} ${mapHeight}`}>
                  {/* Water grid */}
                  <defs>
                    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#0284c7" strokeWidth="0.5" strokeOpacity="0.25" />
                    </pattern>
                  </defs>
                  <rect width={mapWidth} height={mapHeight} fill="#082f49" />
                  <rect width={mapWidth} height={mapHeight} fill="url(#grid)" />

                  {/* Islands Circles */}
                  {pois.map((poi) => {
                    const m = worldToMap(poi.pos.x, poi.pos.z);
                    const isHub = poi.id === "hub";
                    return (
                      <g key={poi.id}>
                        {/* Sand shelf */}
                        <circle cx={m.x} cy={m.y} r={isHub ? 32 : 26} fill="#fef08a" opacity="0.4" />
                        {/* Land */}
                        <circle cx={m.x} cy={m.y} r={isHub ? 26 : 21} fill="#15803d" />
                        <text
                          x={m.x}
                          y={m.y + 4}
                          fontSize="9"
                          fontWeight="bold"
                          fill="#ffffff"
                          textAnchor="middle"
                          fontFamily="sans-serif"
                        >
                          {poi.name.split(" ")[0]}
                        </text>
                      </g>
                    );
                  })}

                  {/* Live Player Dot with Ping */}
                  <g transform={`translate(${playerMapPos.x}, ${playerMapPos.y})`}>
                    <circle r="7" fill="#38bdf8" opacity="0.4" className="animate-ping" />
                    <circle r="4.5" fill="#f97316" stroke="#ffffff" strokeWidth="1.5" />
                  </g>
                </svg>

                <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-slate-900/80 text-[10px] font-mono text-cyan-300 border border-white/10">
                  GPS: {Math.round(playerPos.x)}, {Math.round(playerPos.z)}
                </div>
              </div>

              {/* Fast Travel POI Teleport Buttons */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
                  <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Fast Travel Teleport</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {pois.map((poi) => (
                    <button
                      key={poi.id}
                      onClick={() => {
                        onFastTravel(poi.id);
                        onClose();
                      }}
                      className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-cyan-600 border border-white/10 text-left transition-all active:scale-95 group"
                    >
                      <span className="block text-xs font-bold text-white group-hover:text-white">
                        {poi.name}
                      </span>
                      <span className="block text-[10px] text-cyan-400 font-mono group-hover:text-cyan-100">
                        Teleport &rarr;
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: QUESTS TRACKER */}
          {activeTab === "quests" && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Archipelago Quests ({quests.filter((q) => q.completed).length}/{quests.length})</span>
              </div>
              {quests.map((q) => (
                <div
                  key={q.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    q.completed
                      ? "bg-emerald-950/40 border-emerald-500/40"
                      : "bg-slate-800/80 border-white/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {q.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-500" />
                        )}
                        <h4 className="text-xs font-bold text-white">{q.title}</h4>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">{q.desc}</p>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                      {q.reward}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: MILO'S GEAR LOCKER */}
          {activeTab === "locker" && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Milo's Hero Gear</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-white/10 space-y-3 text-center">
                <div className="w-16 h-16 rounded-full bg-orange-500/20 border-2 border-orange-400/50 flex items-center justify-center text-3xl mx-auto shadow-inner">
                  🐱
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Milo the Space Hero Cat</h4>
                  <p className="text-xs text-slate-400">Official Studio Mascot</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-left pt-2 text-xs">
                  <div className="p-2 rounded-xl bg-slate-900 border border-white/10">
                    <span className="text-[10px] text-slate-400 block font-mono">EQUIPPED</span>
                    <span className="font-bold text-cyan-300">Cyber Visor</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-white/10">
                    <span className="text-[10px] text-slate-400 block font-mono">EQUIPPED</span>
                    <span className="font-bold text-blue-400">Hero Cape</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GAMES LIBRARY */}
          {activeTab === "games" && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>D Lucky X Games</span>
              </div>
              {apps.filter((a) => a.category === "game").map((g) => (
                <div key={g.slug} className="p-3 rounded-2xl bg-slate-800/80 border border-white/10 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <h5 className="text-xs font-bold text-white">{g.name}</h5>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{g.tagline}</p>
                  </div>
                  <a
                    href={g.playUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] shadow flex-shrink-0"
                  >
                    Play Store
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Smartphone Navigation Bar */}
        <div className="h-16 px-4 bg-slate-950 border-t border-white/10 grid grid-cols-4 items-center">
          <button
            onClick={() => setActiveTab("map")}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
              activeTab === "map" ? "text-cyan-400" : "text-slate-500"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Map</span>
          </button>
          <button
            onClick={() => setActiveTab("quests")}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
              activeTab === "quests" ? "text-cyan-400" : "text-slate-500"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Quests</span>
          </button>
          <button
            onClick={() => setActiveTab("locker")}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
              activeTab === "locker" ? "text-cyan-400" : "text-slate-500"
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Gear</span>
          </button>
          <button
            onClick={() => setActiveTab("games")}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
              activeTab === "games" ? "text-cyan-400" : "text-slate-500"
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Games</span>
          </button>
        </div>
      </div>
    </div>
  );
};
