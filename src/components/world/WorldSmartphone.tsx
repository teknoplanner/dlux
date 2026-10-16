"use client";

import React, { useState } from "react";
import { IslandPOI } from "./WorldEngine";
import { apps } from "@/data/apps";
import { WorldLang, WORLD_STRINGS, BILINGUAL_QUESTS, BILINGUAL_RESIDENTS } from "./worldI18n";
import {
  GameIconMap,
  GameIconQuest,
  GameIconResidents,
  GameIconArcade,
  GameIconResidentBadge,
  GameIconIsland,
} from "./WorldGameIcons";

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
    return { x: Math.max(22, Math.min(mapWidth - 22, mx)), y: Math.max(22, Math.min(mapHeight - 22, my)) };
  };

  const playerMapPos = worldToMap(playerPos.x, playerPos.z);

  // Island theme accents for vintage paper cartography
  const getIslandTheme = (id: string) => {
    switch (id) {
      case "hub":
        return { beach: "#fef08a", land: "#4ade80", border: "#15803d", text: "#166534" };
      case "moba":
        return { beach: "#e0f2fe", land: "#38bdf8", border: "#0284c7", text: "#0369a1" };
      case "br":
        return { beach: "#fee2e2", land: "#f87171", border: "#dc2626", text: "#991b1b" };
      case "hex":
        return { beach: "#fef3c7", land: "#f59e0b", border: "#d97706", text: "#92400e" };
      case "soccer":
        return { beach: "#dcfce7", land: "#22c55e", border: "#16a34a", text: "#14532d" };
      default:
        return { beach: "#fef08a", land: "#4ade80", border: "#15803d", text: "#166534" };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      {/* Paper Navigator Atlas Parchment Book Chassis */}
      <div className="relative w-full max-w-[480px] max-h-[92dvh] h-[700px] bg-[#fffdf6] border-4 border-[#5c3e21] rounded-3xl sm:rounded-[36px] shadow-[0_16px_0_#3e2723,0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col text-[#3e2723]">
        
        {/* =================================================================== */}
        {/* PAPER UI KIT HEADER                                                 */}
        {/* =================================================================== */}
        <div className="px-5 py-3.5 flex items-center justify-between border-b-2 border-[#ebdcb9] bg-[#fbf6ea] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#fef08a] border-2 border-[#ca8a04] flex items-center justify-center text-lg shadow-sm">
              🧭
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-[#3e2723] uppercase tracking-wide">
                  {t.title}
                </h3>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] border border-[#16a34a] font-extrabold uppercase tracking-wider">
                  {t.status}
                </span>
              </div>
              <p className="text-[11px] text-[#854d0e] font-bold">{t.subtitle}</p>
            </div>
          </div>

          {/* PaperUIKit Close Button with Tactile Active State */}
          <button
            onClick={onClose}
            aria-label="Close Island Atlas"
            className="w-10 h-10 inline-flex items-center justify-center cursor-pointer active:scale-95 transition-transform group shrink-0"
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

        {/* =================================================================== */}
        {/* PAPER TABS SELECTOR                                                 */}
        {/* =================================================================== */}
        <div className="px-4 py-2.5 bg-[#f5eedb] border-b-2 border-[#ebdcb9] grid grid-cols-4 gap-1.5 shrink-0">
          <button
            onClick={() => setActiveTab("map")}
            className={`py-2 px-1 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "map"
                ? "bg-[#22c55e] text-white border-2 border-[#15803d] shadow-[0_3px_0_#14532d] translate-y-[-1px]"
                : "bg-[#fffdf6] text-[#5c3e21] border-2 border-[#d6c7a7] hover:bg-[#fefce8] shadow-[0_2px_0_#b5a485] active:translate-y-0.5 active:shadow-none"
            }`}
          >
            <GameIconMap className="w-4 h-4 shrink-0" />
            <span>{t.tabMap}</span>
          </button>

          <button
            onClick={() => setActiveTab("quests")}
            className={`py-2 px-1 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "quests"
                ? "bg-[#22c55e] text-white border-2 border-[#15803d] shadow-[0_3px_0_#14532d] translate-y-[-1px]"
                : "bg-[#fffdf6] text-[#5c3e21] border-2 border-[#d6c7a7] hover:bg-[#fefce8] shadow-[0_2px_0_#b5a485] active:translate-y-0.5 active:shadow-none"
            }`}
          >
            <GameIconQuest className="w-4 h-4 shrink-0" />
            <span>{t.tabQuests}</span>
          </button>

          <button
            onClick={() => setActiveTab("residents")}
            className={`py-2 px-1 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "residents"
                ? "bg-[#22c55e] text-white border-2 border-[#15803d] shadow-[0_3px_0_#14532d] translate-y-[-1px]"
                : "bg-[#fffdf6] text-[#5c3e21] border-2 border-[#d6c7a7] hover:bg-[#fefce8] shadow-[0_2px_0_#b5a485] active:translate-y-0.5 active:shadow-none"
            }`}
          >
            <GameIconResidents className="w-4 h-4 shrink-0" />
            <span>{t.tabResidents}</span>
          </button>

          <button
            onClick={() => setActiveTab("games")}
            className={`py-2 px-1 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "games"
                ? "bg-[#22c55e] text-white border-2 border-[#15803d] shadow-[0_3px_0_#14532d] translate-y-[-1px]"
                : "bg-[#fffdf6] text-[#5c3e21] border-2 border-[#d6c7a7] hover:bg-[#fefce8] shadow-[0_2px_0_#b5a485] active:translate-y-0.5 active:shadow-none"
            }`}
          >
            <GameIconArcade className="w-4 h-4 shrink-0" />
            <span>{t.tabGames}</span>
          </button>
        </div>

        {/* =================================================================== */}
        {/* SCROLLABLE CONTENT BODY                                             */}
        {/* =================================================================== */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* --------------------------------------------------------------- */}
          {/* TAB 1: ANTIQUE PARCHMENT ARCHIPELAGO MAP & FAST TRAVEL          */}
          {/* --------------------------------------------------------------- */}
          {activeTab === "map" && (
            <div className="space-y-4">
              
              {/* Paper Cartography Chart Container */}
              <div className="relative w-full aspect-square max-h-[260px] rounded-3xl bg-[#fdf8ec] border-3 border-[#ca8a04] overflow-hidden shadow-inner mx-auto">
                <svg className="w-full h-full" viewBox={`0 0 ${mapWidth} ${mapHeight}`}>
                  <defs>
                    {/* Vintage Parchment Ocean Gradient */}
                    <radialGradient id="paperOcean" cx="50%" cy="50%" r="65%">
                      <stop offset="0%" stopColor="#fefbf2" />
                      <stop offset="70%" stopColor="#f8eed2" />
                      <stop offset="100%" stopColor="#ebd9b0" />
                    </radialGradient>

                    {/* Subtle Nautical Wave Pattern */}
                    <pattern id="nauticalWaves" width="30" height="20" patternUnits="userSpaceOnUse">
                      <path
                        d="M 0 10 Q 7.5 5 15 10 T 30 10"
                        fill="none"
                        stroke="#d4c194"
                        strokeWidth="0.8"
                        strokeOpacity="0.45"
                      />
                    </pattern>
                  </defs>

                  {/* Ocean Base & Sea Lines */}
                  <rect width={mapWidth} height={mapHeight} fill="url(#paperOcean)" />
                  <rect width={mapWidth} height={mapHeight} fill="url(#nauticalWaves)" />

                  {/* Compass Rhumb Lines */}
                  <circle cx="150" cy="150" r="110" fill="none" stroke="#ca8a04" strokeWidth="0.6" strokeDasharray="3,4" opacity="0.4" />
                  <line x1="150" y1="20" x2="150" y2="280" stroke="#ca8a04" strokeWidth="0.5" strokeDasharray="2,3" opacity="0.35" />
                  <line x1="20" y1="150" x2="280" y2="150" stroke="#ca8a04" strokeWidth="0.5" strokeDasharray="2,3" opacity="0.35" />

                  {/* Vintage Compass Rose at Bottom-Left */}
                  <g transform="translate(42, 258)">
                    <circle r="16" fill="#fffdf6" stroke="#ca8a04" strokeWidth="1.2" />
                    <polygon points="0,-14 3,-3 14,0 3,3 0,14 -3,3 -14,0 -3,-3" fill="#ca8a04" opacity="0.8" />
                    <polygon points="0,-14 3,-3 0,0 -3,-3" fill="#b45309" />
                    <text x="0" y="-16" fontSize="7" fontWeight="bold" fill="#78350f" textAnchor="middle">N</text>
                  </g>

                  {/* Connecting Bridges (Dashed Stone Pathways) */}
                  <line x1="150" y1="150" x2="52" y2="52" stroke="#854d0e" strokeWidth="3" strokeDasharray="4,3" strokeLinecap="round" opacity="0.75" />
                  <line x1="150" y1="150" x2="252" y2="52" stroke="#854d0e" strokeWidth="3" strokeDasharray="4,3" strokeLinecap="round" opacity="0.75" />
                  <line x1="150" y1="150" x2="52" y2="248" stroke="#854d0e" strokeWidth="3" strokeDasharray="4,3" strokeLinecap="round" opacity="0.75" />
                  <line x1="150" y1="150" x2="252" y2="248" stroke="#854d0e" strokeWidth="3" strokeDasharray="4,3" strokeLinecap="round" opacity="0.75" />

                  {/* Archipelago Islands Topography */}
                  {pois.map((poi) => {
                    const m = worldToMap(poi.pos.x, poi.pos.z);
                    const isHub = poi.id === "hub";
                    const theme = getIslandTheme(poi.id);

                    return (
                      <g
                        key={poi.id}
                        className="cursor-pointer group"
                        onClick={() => {
                          onFastTravel(poi.id);
                          onClose();
                        }}
                      >
                        {/* Sand Coastal Shelf */}
                        <circle
                          cx={m.x}
                          cy={m.y}
                          r={isHub ? 34 : 25}
                          fill={theme.beach}
                          stroke="#ca8a04"
                          strokeWidth="1.5"
                          opacity="0.95"
                        />
                        {/* Cut-Paper Island Landmass */}
                        <circle
                          cx={m.x}
                          cy={m.y}
                          r={isHub ? 27 : 19}
                          fill={theme.land}
                          stroke={theme.border}
                          strokeWidth="2"
                        />
                        {/* Central Landmark Beacon */}
                        <circle
                          cx={m.x}
                          cy={m.y}
                          r={isHub ? 6 : 4.5}
                          fill="#ffffff"
                          stroke={theme.border}
                          strokeWidth="1.5"
                        />

                        {/* Island Label Pill */}
                        <rect
                          x={m.x - 36}
                          y={m.y + (isHub ? 14 : 11)}
                          width="72"
                          height="14"
                          rx="5"
                          fill="#fffdf6"
                          stroke="#5c3e21"
                          strokeWidth="1"
                        />
                        <text
                          x={m.x}
                          y={m.y + (isHub ? 24 : 21)}
                          fontSize="7.5"
                          fontWeight="bold"
                          fill="#3e2723"
                          textAnchor="middle"
                          fontFamily="sans-serif"
                        >
                          {poi.name.split(" ")[0]}
                        </text>
                      </g>
                    );
                  })}

                  {/* Real-time Player Pin Marker */}
                  <g transform={`translate(${playerMapPos.x}, ${playerMapPos.y})`} className="pointer-events-none">
                    <circle r="11" fill="#f59e0b" opacity="0.35" className="animate-ping" />
                    <circle r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                    <circle r="2" fill="#ffffff" />
                    <rect x="-18" y="-19" width="36" height="11" rx="4" fill="#3e2723" stroke="#fffdf6" strokeWidth="1" />
                    <text x="0" y="-11" fontSize="6.5" fontWeight="black" fill="#ffffff" textAnchor="middle">
                      {lang === "id" ? "KAMU" : "YOU"}
                    </text>
                  </g>
                </svg>

                {/* Paper Coordinate Tag */}
                <div className="absolute top-2.5 left-2.5 px-3 py-1 rounded-xl bg-[#fffdf6] text-[10px] font-black text-[#854d0e] border-2 border-[#ca8a04] shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                  <span>{t.coords}: X {Math.round(playerPos.x)}, Z {Math.round(playerPos.z)}</span>
                </div>
              </div>

              {/* Fast Travel Waypoints Section */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-[#5c3e21] uppercase tracking-wider flex items-center gap-1.5">
                    <img
                      src="/assets/ui/paper/Icons/GameIcons/IconArrow.png"
                      alt="Waypoints"
                      className="w-4 h-4 object-contain"
                      draggable={false}
                    />
                    <span>{t.fastTravelTitle}</span>
                  </h4>
                  <span className="text-[10px] text-[#854d0e] font-bold">5 Destinasi</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {pois.map((poi) => {
                    const theme = getIslandTheme(poi.id);
                    return (
                      <div
                        key={poi.id}
                        className="p-3 rounded-2xl bg-[#fefce8] border-2 border-[#ca8a04] flex items-center justify-between gap-2 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="min-w-0 flex-1">
                          <h5 className="text-xs font-black text-[#3e2723] truncate">{poi.name}</h5>
                          <span
                            className="inline-block text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded mt-0.5 border"
                            style={{
                              backgroundColor: theme.beach,
                              color: theme.text,
                              borderColor: theme.border,
                            }}
                          >
                            X:{Math.round(poi.pos.x)} Z:{Math.round(poi.pos.z)}
                          </span>
                        </div>

                        {/* PaperUIKit Fast Travel Button */}
                        <button
                          onClick={() => {
                            onFastTravel(poi.id);
                            onClose();
                          }}
                          className="relative w-22 h-9 inline-flex items-center justify-center cursor-pointer active:scale-95 transition-transform group shrink-0"
                          title={`${t.teleport} -> ${poi.name}`}
                        >
                          <img
                            src="/assets/ui/paper/Buttons/SmallButtons/ButtonSmallGreen.png"
                            alt={t.teleport}
                            className="w-full h-full object-contain group-active:hidden drop-shadow-sm"
                            draggable={false}
                          />
                          <img
                            src="/assets/ui/paper/Buttons/SmallButtons/ButtonSmallGreenActive.png"
                            alt={t.teleport}
                            className="w-full h-full object-contain hidden group-active:block drop-shadow-sm"
                            draggable={false}
                          />
                          <span className="absolute inset-0 flex items-center justify-center font-black text-[10px] text-white tracking-wider pb-0.5 group-active:pt-0.5 uppercase">
                            {t.teleport}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------- */}
          {/* TAB 2: EXPEDITION QUEST LOG                                     */}
          {/* --------------------------------------------------------------- */}
          {activeTab === "quests" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-[#ebdcb9]">
                <div className="flex items-center gap-2">
                  <GameIconQuest className="w-5 h-5 text-amber-800 shrink-0" />
                  <h4 className="text-xs font-black text-[#5c3e21] uppercase tracking-wide">
                    {t.questsTitle}
                  </h4>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#fef08a] border-2 border-[#ca8a04] text-xs font-black text-[#854d0e]">
                  <img
                    src="/assets/ui/paper/Icons/GameIcons/IconCoin.png"
                    alt="Coins"
                    className="w-4 h-4 object-contain"
                    draggable={false}
                  />
                  <span>
                    {quests.filter((q) => q.completed).length} / {quests.length}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                {quests.map((q) => (
                  <div
                    key={q.id}
                    className={`p-3.5 rounded-2xl border-2 transition-all shadow-sm ${
                      q.completed
                        ? "bg-[#ecfdf5] border-[#16a34a]"
                        : "bg-[#fefce8] border-[#ca8a04]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {q.completed ? (
                            <img
                              src="/assets/ui/paper/Icons/GameIcons/IconCheckmark.png"
                              alt="Done"
                              className="w-5 h-5 object-contain shrink-0"
                              draggable={false}
                            />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-[#ca8a04] bg-[#fffdf6] shrink-0" />
                          )}
                          <h5
                            className={`text-xs font-black ${
                              q.completed ? "text-[#15803d] line-through opacity-85" : "text-[#3e2723]"
                            }`}
                          >
                            {q.title}
                          </h5>
                        </div>
                        <p className="text-[11px] text-[#854d0e] font-medium leading-relaxed pl-7">
                          {q.desc}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#fffdf6] border-2 border-[#ca8a04] shadow-xs shrink-0">
                        <img
                          src="/assets/ui/paper/Icons/GameIcons/IconCoin.png"
                          alt="Reward"
                          className="w-4 h-4 object-contain"
                          draggable={false}
                        />
                        <span className="text-[10px] font-black text-[#92400e]">{q.reward}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------- */}
          {/* TAB 3: ISLAND RESIDENTS DIRECTORY                               */}
          {/* --------------------------------------------------------------- */}
          {activeTab === "residents" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-[#ebdcb9]">
                <div className="flex items-center gap-2">
                  <GameIconResidents className="w-5 h-5 text-amber-800 shrink-0" />
                  <h4 className="text-xs font-black text-[#5c3e21] uppercase tracking-wide">
                    {t.residentsTitle}
                  </h4>
                </div>
                <span className="text-[10px] text-[#854d0e] font-bold">
                  {BILINGUAL_RESIDENTS.length} Karakter
                </span>
              </div>

              <div className="space-y-2">
                {BILINGUAL_RESIDENTS.map((res) => (
                  <div
                    key={res.name.en}
                    className="p-3 rounded-2xl bg-[#fefce8] border-2 border-[#ca8a04] flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-[#fffdf6] border-2 border-[#ca8a04] flex items-center justify-center p-1 shrink-0 shadow-inner">
                      <GameIconResidentBadge role={res.id} className="w-full h-full object-contain" fallbackEmoji={res.avatar} />
                    </div>
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-black text-[#3e2723] truncate">{res.name[lang]}</h5>
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-[#fef08a] text-[#854d0e] border border-[#ca8a04] uppercase">
                          {res.location[lang]}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#059669] font-black uppercase tracking-wide">
                        {res.role[lang]}
                      </p>
                      <p className="text-[11px] text-[#854d0e] font-medium leading-snug">
                        {res.desc[lang]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------- */}
          {/* TAB 4: GAMES & APPS SHOWCASE                                    */}
          {/* --------------------------------------------------------------- */}
          {activeTab === "games" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-[#ebdcb9]">
                <div className="flex items-center gap-2">
                  <GameIconArcade className="w-5 h-5 text-amber-800 shrink-0" />
                  <h4 className="text-xs font-black text-[#5c3e21] uppercase tracking-wide">
                    {t.gamesTitle}
                  </h4>
                </div>
                <span className="text-[10px] text-[#854d0e] font-bold">Arcade DLuckyX</span>
              </div>

              <div className="space-y-2.5">
                {apps.filter((a) => a.category === "game").map((g) => (
                  <div
                    key={g.slug}
                    className="p-3.5 rounded-2xl bg-[#fefce8] border-2 border-[#ca8a04] flex items-center justify-between gap-3 shadow-sm"
                  >
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <h5 className="text-xs font-black text-[#3e2723]">{g.name}</h5>
                      <p className="text-[11px] text-[#854d0e] font-medium line-clamp-1">{g.tagline}</p>
                    </div>

                    <a
                      href={g.playUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative w-24 h-9 inline-flex items-center justify-center cursor-pointer active:scale-95 transition-transform group shrink-0"
                    >
                      <img
                        src="/assets/ui/paper/Buttons/SmallButtons/ButtonSmallGreen.png"
                        alt={t.googlePlay}
                        className="w-full h-full object-contain group-active:hidden drop-shadow-sm"
                        draggable={false}
                      />
                      <img
                        src="/assets/ui/paper/Buttons/SmallButtons/ButtonSmallGreenActive.png"
                        alt={t.googlePlay}
                        className="w-full h-full object-contain hidden group-active:block drop-shadow-sm"
                        draggable={false}
                      />
                      <span className="absolute inset-0 flex items-center justify-center font-black text-[10px] text-white tracking-wider pb-0.5 group-active:pt-0.5 uppercase gap-1">
                        <img
                          src="/assets/ui/paper/Icons/GameIcons/IconPlay.png"
                          alt="Play"
                          className="w-3.5 h-3.5 object-contain"
                          draggable={false}
                        />
                        <span>{t.googlePlay}</span>
                      </span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
