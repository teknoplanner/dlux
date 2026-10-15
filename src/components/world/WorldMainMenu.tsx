"use client";

import React, { useState, useEffect } from "react";
import { Play, Gamepad2, Map, Volume2, VolumeX, Sparkles, X, Globe } from "lucide-react";
import { WorldAudio } from "./WorldAudio";
import { WorldLang, WORLD_STRINGS } from "./worldI18n";

interface WorldMainMenuProps {
  onStartGame: (fullscreen: boolean) => void;
  audio: WorldAudio | null;
  isMuted: boolean;
  onToggleMute: () => void;
  lang: WorldLang;
  onToggleLang: (lang: WorldLang) => void;
}

export const WorldMainMenu: React.FC<WorldMainMenuProps> = ({
  onStartGame,
  audio,
  isMuted,
  onToggleMute,
  lang,
  onToggleLang,
}) => {
  const [activeModal, setActiveModal] = useState<"controls" | "atlas" | "settings" | null>(null);
  const t = WORLD_STRINGS[lang];

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
    <div className="absolute inset-0 z-40 bg-gradient-to-t from-[#0d1117]/95 via-[#0d1117]/50 to-[#0d1117]/80 backdrop-blur-[2px] flex flex-col justify-between p-4 sm:p-8 select-none text-white animate-in fade-in duration-300 overflow-y-auto">
      {/* =================================================================== */}
      {/* TOP BAR: ROBLOX-STYLE NAVIGATION, LANGUAGE & SERVER STATUS         */}
      {/* =================================================================== */}
      <div className="relative z-10 w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-[#161b22] rounded-[10px] flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <span className="font-black text-sm tracking-tight text-white block">
              D Lucky World 3D
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{t.common.serverStatus}</span>
            </div>
          </div>
        </div>

        {/* Language Switcher & Audio Buttons */}
        <div className="flex items-center gap-2">
          {/* Language Switcher Pill */}
          <div className="flex items-center rounded-xl bg-[#161b22] border border-slate-700 p-0.5 shadow-sm">
            <button
              type="button"
              onClick={() => {
                audio?.playMenuHover();
                onToggleLang("id");
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                lang === "id"
                  ? "bg-emerald-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Bahasa Indonesia"
            >
              ID
            </button>
            <button
              type="button"
              onClick={() => {
                audio?.playMenuHover();
                onToggleLang("en");
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                lang === "en"
                  ? "bg-emerald-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
              title="English"
            >
              EN
            </button>
          </div>

          <button
            onClick={onToggleMute}
            onMouseEnter={handleHover}
            aria-label="Toggle Sound"
            className="px-3 py-1.5 rounded-xl bg-[#161b22] hover:bg-slate-700 active:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-sm font-bold text-xs"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-red-400" />
                <span className="hidden sm:inline">{t.common.muted}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">{t.common.soundOn}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* CENTERPIECE: ROBLOX STYLE GAME CARD & PLAY BUTTON                   */}
      {/* =================================================================== */}
      <div className="relative z-10 w-full max-w-md mx-auto my-auto bg-[#161b22]/95 border-2 border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-md space-y-6 text-center">
        {/* Game Title Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.mainMenu.tagline}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            D LUCKY WORLD <span className="text-amber-400">3D</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-sm mx-auto">
            {t.mainMenu.subtitle}
          </p>
        </div>

        {/* Big Chunky Roblox Green PLAY Button */}
        <div className="space-y-3 pt-1">
          <button
            type="button"
            onMouseEnter={handleHover}
            onClick={() => handleSelect(() => onStartGame(true))}
            className="group relative w-full py-4 sm:py-5 px-6 rounded-2xl bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600 hover:from-emerald-300 hover:to-emerald-500 text-slate-950 font-black tracking-wider uppercase border-t-2 border-emerald-200 border-b-[6px] border-emerald-900 active:border-b-0 active:translate-y-[6px] shadow-[0_10px_30px_rgba(16,185,129,0.45)] transition-all cursor-pointer flex items-center justify-center gap-3 text-lg sm:text-xl"
          >
            <div className="w-8 h-8 rounded-full bg-slate-950/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
            </div>
            <span>{t.mainMenu.playNow}</span>
          </button>

          {/* Secondary Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onMouseEnter={handleHover}
              onClick={() => handleSelect(() => setActiveModal("controls"))}
              className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <Gamepad2 className="w-4 h-4 text-emerald-400" />
              <span>{t.mainMenu.howToPlay}</span>
            </button>

            <button
              type="button"
              onMouseEnter={handleHover}
              onClick={() => handleSelect(() => setActiveModal("atlas"))}
              className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <Map className="w-4 h-4 text-amber-400" />
              <span>{t.mainMenu.islandAtlas}</span>
            </button>
          </div>
        </div>

        {/* Server & Version Footer */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{t.common.readyToPlay}</span>
          </span>
          <span>{t.common.pressEnter}</span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 w-full flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-800 pt-4 text-xs text-slate-400 font-medium">
        <div className="flex items-center gap-2">
          <span>{t.common.keyboardHint}</span>
          <span className="text-slate-600">•</span>
          <span>{t.common.mobileHint}</span>
        </div>
        <div>{t.common.copyright}</div>
      </div>

      {/* =================================================================== */}
      {/* ROBLOX STYLE MODAL: HOW TO PLAY                                     */}
      {/* =================================================================== */}
      {activeModal === "controls" && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#161b22] border-2 border-slate-700 rounded-3xl p-6 sm:p-7 text-white space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">{t.mainMenu.controlsTitle}</h3>
                  <p className="text-xs text-slate-400">{t.mainMenu.controlsDesc}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  audio?.playMenuBack();
                  setActiveModal(null);
                }}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <h4 className="font-extrabold text-amber-400 uppercase tracking-wide">{t.mainMenu.keyboardTitle}</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
                  <span className="inline-block px-2 py-0.5 rounded bg-slate-800 text-white font-extrabold border-b-2 border-slate-700">WASD</span>
                  <span className="block text-[11px] text-slate-400">{lang === "id" ? "Bergerak" : "Move / Steer"}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
                  <span className="inline-block px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-extrabold border-b-2 border-slate-700">SPACE</span>
                  <span className="block text-[11px] text-slate-400">{lang === "id" ? "Lompat" : "Jump / Hop"}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
                  <span className="inline-block px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-extrabold border-b-2 border-slate-700">SHIFT</span>
                  <span className="block text-[11px] text-slate-400">{lang === "id" ? "Sprint Cepat" : "Sprint Dash"}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
                  <span className="inline-block px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-extrabold border-b-2 border-slate-700">E</span>
                  <span className="block text-[11px] text-slate-400">{lang === "id" ? "Bicara / Aksi" : "Talk / Action"}</span>
                </div>
              </div>

              <h4 className="font-extrabold text-teal-400 uppercase tracking-wide pt-2">{t.mainMenu.touchTitle}</h4>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-slate-300">
                <p>{t.mainMenu.touchDesc1}</p>
                <p>{t.mainMenu.touchDesc2}</p>
                <p>{t.mainMenu.touchDesc3}</p>
              </div>
            </div>

            <button
              onClick={() => {
                audio?.playMenuSelect();
                setActiveModal(null);
                onStartGame(false);
              }}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase tracking-wide shadow-md active:scale-95 transition-all"
            >
              {t.mainMenu.startBtn}
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* ROBLOX STYLE MODAL: ISLAND ATLAS                                    */}
      {/* =================================================================== */}
      {activeModal === "atlas" && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#161b22] border-2 border-slate-700 rounded-3xl p-6 sm:p-7 text-white space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Map className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">{t.mainMenu.atlasTitle}</h3>
                  <p className="text-xs text-slate-400">{t.mainMenu.atlasDesc}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  audio?.playMenuBack();
                  setActiveModal(null);
                }}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">1</div>
                <div>
                  <h5 className="font-bold text-white text-sm">{t.hud.locations["Central Plaza"]}</h5>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {lang === "id"
                      ? "Pusat kepulauan dengan jembatan batu, kios buah Mang Ujang, dan dermaga pancing Pak Mamat."
                      : "The main coastal hub with stone bridges, merchant stalls, and Pak Mamat's fishing pier."}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm shrink-0">2</div>
                <div>
                  <h5 className="font-bold text-white text-sm">{t.hud.locations["MOBA Sanctuary"]}</h5>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {lang === "id"
                      ? "Pilar marmer kuno dan batu rune bercahaya yang dijaga oleh Grandmaster Kesatria Valen."
                      : "Ancient columns and glowing rune stones guarded by Grandmaster Valen the Knight."}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">3</div>
                <div>
                  <h5 className="font-bold text-white text-sm">{t.hud.locations["Beach Stadium"]}</h5>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {lang === "id"
                      ? "Lapangan pasir pantai dengan gawang dan bola sepak raksasa untuk adu penalti bersama Leo!"
                      : "Sandy pitch with goal posts and a giant soccer ball ready for your penalty kicks with Leo!"}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-sm shrink-0">4</div>
                <div>
                  <h5 className="font-bold text-white text-sm">{t.hud.locations["Battle Royale Outpost"]}</h5>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {lang === "id"
                      ? "Menara pantau tinggi dengan peti suplai airdrop taktis yang diawasi Prajurit Jax."
                      : "High watchtower with supply caches and Spec-Ops Ace Jax."}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                audio?.playMenuSelect();
                setActiveModal(null);
                onStartGame(false);
              }}
              className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm uppercase tracking-wide shadow-md active:scale-95 transition-all"
            >
              {t.mainMenu.exploreBtn}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
