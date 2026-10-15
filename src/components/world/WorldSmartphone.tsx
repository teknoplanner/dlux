"use client";

import React, { useState } from "react";
import { X, MapPin, CheckCircle2, Circle, Compass, Zap, Gamepad2, Sparkles, Navigation, Users, Trophy, ExternalLink, ArrowRight } from "lucide-react";
import { IslandPOI } from "./WorldEngine";
import { apps } from "@/data/apps";
import { WorldLang, WORLD_STRINGS, BILINGUAL_QUESTS, BILINGUAL_RESIDENTS } from "./worldI18n";

interface WorldSmartphoneProps {
  isOpen: boolean;
  onClose: () => void;
  playerPos: { x: number; z: number };
  pois: IslandPOI[];
  onFastTravel: (islandId: string) => void;
  completedQuests: Record<string, boolean>;
  lang: WorldLang;
}

export const WorldSmartphone: React.FC<WorldSmartphoneProps> = ({
  isOpen,
  onClose,
  playerPos,
  pois,
  onFastTravel,
  completedQuests,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<"map" | "quests" | "residents" | "games">("map");
  const t = WORLD_STRINGS[lang].slate;

  if (!isOpen) return null;

  const quests = Object.entries(BILINGUAL_QUESTS).map(([id, q]) => ({
    id,
    title: q.title[lang],
    desc: q.desc[lang],
    reward: q.reward[lang],
    completed: !!completedQuests[id],
  }));

  // Map coordinate translation (World -100..100 -> SVG 20..280)
  const mapWidth = 300;
  const mapHeight = 300;
  const worldToMap = (x: number, z: number) => {
    const mx = ((x + 100) / 200) * mapWidth;
    const my = ((z + 100) / 200) * mapHeight;
    return { x: Math.max(20, Math.min(mapWidth - 20, mx)), y: Math.max(20, Math.min(mapHeight - 20, my)) };
  };

  const playerMapPos = worldToMap(playerPos.x, playerPos.z);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      {/* Handheld Adventurer's Slate Chassis */}
      <div className="relative w-full max-w-[420px] max-h-[92dvh] h-[660px] bg-gradient-to-b from-[#0b1728] via-[#07101d] to-[#040812] border-2 sm:border-[3px] border-teal-500/50 rounded-3xl sm:rounded-[36px] shadow-[0_20px_60px_rgba(0,0,0,0.9),inset_0_0_20px_rgba(20,184,166,0.15)] overflow-hidden flex flex-col text-white">
        {/* Slate Bezel Header */}
        <div className="px-5 py-3.5 flex items-center justify-between border-b border-teal-500/20 bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse shadow-[0_0_8px_#2dd4bf]" />
            <div>
              <h3 className="text-xs sm:text-sm font-black font-display tracking-widest text-white uppercase flex items-center gap-2">
                <span>{t.title}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 border border-teal-400/30 font-mono">
                  {t.status}
                </span>
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">{t.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Navigator's Slate"
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* TAB 1: CARTOGRAPHIC MAP & FAST TRAVEL */}
          {activeTab === "map" && (
            <div className="space-y-4">
              {/* Stylized Nautical Archipelago SVG Map */}
              <div className="relative w-full aspect-square max-h-[250px] rounded-2xl bg-gradient-to-b from-[#06243d] via-[#041a2e] to-[#02101e] border-2 border-teal-500/40 overflow-hidden shadow-inner mx-auto">
                <svg className="w-full h-full" viewBox={`0 0 ${mapWidth} ${mapHeight}`}>
                  <defs>
                    <radialGradient id="oceanGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#083344" />
                      <stop offset="100%" stopColor="#02131f" />
                    </radialGradient>
                    <pattern id="chartGrid" width="25" height="25" patternUnits="userSpaceOnUse">
                      <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#0e7490" strokeWidth="0.4" strokeOpacity="0.3" />
                    </pattern>
                  </defs>

                  {/* Ocean Base & Grid */}
                  <rect width={mapWidth} height={mapHeight} fill="url(#oceanGlow)" />
                  <rect width={mapWidth} height={mapHeight} fill="url(#chartGrid)" />

                  {/* Archipelago Islands Topography */}
                  {pois.map((poi) => {
                    const m = worldToMap(poi.pos.x, poi.pos.z);
                    const isHub = poi.id === "hub";
                    return (
                      <g key={poi.id}>
                        {/* Sand Reef Ring */}
                        <circle cx={m.x} cy={m.y} r={isHub ? 32 : 24} fill="#fef08a" opacity="0.3" />
                        {/* Tropical Landmass */}
                        <circle cx={m.x} cy={m.y} r={isHub ? 26 : 19} fill={isHub ? "#059669" : "#10b981"} />
                        {/* Core Island Pin */}
                        <circle cx={m.x} cy={m.y} r={3} fill="#fef08a" />
                        <text
                          x={m.x}
                          y={m.y + 14}
                          fontSize="8"
                          fontWeight="bold"
                          fill="#ffffff"
                          textAnchor="middle"
                          fontFamily="monospace"
                          letterSpacing="0.05em"
                        >
                          {poi.name.split(" ")[0]}
                        </text>
                      </g>
                    );
                  })}

                  {/* Live Player Position Marker with Pulse */}
                  <g transform={`translate(${playerMapPos.x}, ${playerMapPos.y})`}>
                    <circle r="9" fill="#2dd4bf" opacity="0.3" className="animate-ping" />
                    <circle r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                  </g>
                </svg>

                {/* GPS Coordinates Plate */}
                <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded-md bg-slate-950/85 text-[9px] font-mono font-bold text-teal-300 border border-teal-500/30">
                  {t.coords}: X {Math.round(playerPos.x)}, Z {Math.round(playerPos.z)}
                </div>
              </div>

              {/* Fast Travel Waypoints */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  <Navigation className="w-3.5 h-3.5 text-teal-400" />
                  <span>{t.fastTravelTitle}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {pois.map((poi) => (
                    <button
                      key={poi.id}
                      onClick={() => {
                        onFastTravel(poi.id);
                        onClose();
                      }}
                      className="p-3 rounded-2xl bg-slate-900/90 hover:bg-teal-700/80 border border-white/10 hover:border-teal-400 text-left transition-all active:scale-95 group shadow-sm cursor-pointer"
                    >
                      <span className="block text-xs font-bold text-white group-hover:text-white truncate">
                        {poi.name}
                      </span>
                      <span className="block text-[10px] text-teal-400 font-mono group-hover:text-teal-200">
                        {t.teleport} &rarr;
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXPEDITION QUEST LOG */}
          {activeTab === "quests" && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.questsTitle}</span>
                </span>
                <span className="text-amber-400 font-bold">
                  {quests.filter((q) => q.completed).length} / {quests.length}
                </span>
              </div>

              {quests.map((q) => (
                <div
                  key={q.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    q.completed
                      ? "bg-emerald-950/30 border-emerald-500/40"
                      : "bg-slate-900/80 border-white/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {q.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                        <h4 className="text-xs font-bold text-white">{q.title}</h4>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">{q.desc}</p>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 shrink-0">
                      {q.reward}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: ISLAND RESIDENTS DIRECTORY */}
          {activeTab === "residents" && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-teal-400" />
                <span>{t.residentsTitle}</span>
              </div>

              <div className="space-y-2">
                {BILINGUAL_RESIDENTS.map((res) => (
                  <div
                    key={res.name.en}
                    className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 flex items-start gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-400/30 flex items-center justify-center text-xl shrink-0">
                      {res.avatar}
                    </div>
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold text-white truncate">{res.name[lang]}</h5>
                        <span className="text-[9px] font-mono text-amber-400 uppercase tracking-wider">
                          {res.location[lang]}
                        </span>
                      </div>
                      <p className="text-[10px] text-teal-300 font-mono">{res.role[lang]}</p>
                      <p className="text-[11px] text-slate-300 leading-snug">{res.desc[lang]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: GAMES LIBRARY */}
          {activeTab === "games" && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.gamesTitle}</span>
              </div>
              {apps.filter((a) => a.category === "game").map((g) => (
                <div key={g.slug} className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <h5 className="text-xs font-bold text-white">{g.name}</h5>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{g.tagline}</p>
                  </div>
                  <a
                    href={g.playUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] shadow flex items-center gap-1 shrink-0 transition-colors"
                  >
                    <span>{t.googlePlay}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Slate Navigation Tabs */}
        <div className="h-16 px-4 bg-slate-950 border-t border-teal-500/20 grid grid-cols-4 items-center shrink-0">
          <button
            onClick={() => setActiveTab("map")}
            className={`flex flex-col items-center gap-1 text-[10px] font-mono font-bold transition-colors cursor-pointer ${
              activeTab === "map" ? "text-teal-400" : "text-slate-500 hover:text-slate-400"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>{t.tabMap}</span>
          </button>
          <button
            onClick={() => setActiveTab("quests")}
            className={`flex flex-col items-center gap-1 text-[10px] font-mono font-bold transition-colors cursor-pointer ${
              activeTab === "quests" ? "text-teal-400" : "text-slate-500 hover:text-slate-400"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.tabQuests}</span>
          </button>
          <button
            onClick={() => setActiveTab("residents")}
            className={`flex flex-col items-center gap-1 text-[10px] font-mono font-bold transition-colors cursor-pointer ${
              activeTab === "residents" ? "text-teal-400" : "text-slate-500 hover:text-slate-400"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{t.tabResidents}</span>
          </button>
          <button
            onClick={() => setActiveTab("games")}
            className={`flex flex-col items-center gap-1 text-[10px] font-mono font-bold transition-colors cursor-pointer ${
              activeTab === "games" ? "text-teal-400" : "text-slate-500 hover:text-slate-400"
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>{t.tabGames}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
