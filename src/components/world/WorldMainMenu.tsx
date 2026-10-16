"use client";

import React, { useState, useEffect } from "react";
import { WorldAudio } from "./WorldAudio";
import { WeatherType } from "./WorldWeatherManager";
import { WorldLang, WORLD_STRINGS } from "./worldI18n";
import { GameIconAudio, GameIconWeather } from "./WorldGameIcons";

interface WorldMainMenuProps {
  onStartGame: (fullscreen: boolean) => void;
  audio: WorldAudio | null;
  isMuted: boolean;
  onToggleMute: () => void;
  isMusicEnabled?: boolean;
  onToggleMusic?: () => void;
  currentWeather?: WeatherType;
  onSetWeather?: (weather: WeatherType) => void;
  lang: WorldLang;
  onToggleLang: (lang: WorldLang) => void;
}

export const WorldMainMenu: React.FC<WorldMainMenuProps> = ({
  onStartGame,
  audio,
  isMuted,
  onToggleMute,
  isMusicEnabled = true,
  onToggleMusic,
  currentWeather = "day",
  onSetWeather,
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
    <div className="absolute inset-0 z-40 bg-black/75 backdrop-blur-[2px] flex flex-col justify-between p-4 sm:p-8 select-none text-[#3e2723] animate-in fade-in duration-300 overflow-y-auto">
      {/* =================================================================== */}
      {/* TOP BAR: PAPER UI KIT NAVIGATION, LANGUAGE & SERVER STATUS         */}
      {/* =================================================================== */}
      <div className="relative z-10 w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#fffdf6] border-2 border-[#5c3e21] shadow-[0_3px_0_#3e2723] p-1.5 flex items-center justify-center">
            <img
              src="/assets/ui/paper/Icons/GameIcons/IconPlay.png"
              alt="Play"
              className="w-full h-full object-contain"
              draggable={false}
            />
          </div>
          <div>
            <span className="font-black text-sm tracking-tight text-white block drop-shadow">
              D Lucky World 3D
            </span>
            <div className="flex items-center gap-1.5 text-xs text-amber-200/90 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#22c55e] border border-[#15803d]" />
              <span>{t.common.serverStatus}</span>
            </div>
          </div>
        </div>

        {/* Language Switcher & Audio Buttons */}
        <div className="flex items-center gap-2">
          {/* Language Switcher Pill */}
          <div className="flex items-center rounded-2xl bg-[#fffdf6] border-2 border-[#5c3e21] shadow-[0_3px_0_#3e2723] p-0.5">
            <button
              type="button"
              onClick={() => {
                audio?.playMenuHover();
                onToggleLang("id");
              }}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                lang === "id"
                  ? "bg-[#22c55e] text-white shadow-sm border border-[#15803d]"
                  : "text-[#854d0e] hover:text-[#3e2723]"
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
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                lang === "en"
                  ? "bg-[#22c55e] text-white shadow-sm border border-[#15803d]"
                  : "text-[#854d0e] hover:text-[#3e2723]"
              }`}
              title="English"
            >
              EN
            </button>
          </div>

          <button
            onClick={() => handleSelect(() => setActiveModal("settings"))}
            onMouseEnter={handleHover}
            aria-label="Settings"
            className="px-3.5 py-1.5 rounded-2xl bg-[#fffdf6] hover:bg-[#fef9c3] active:bg-[#fef08a] border-2 border-[#5c3e21] text-[#3e2723] shadow-[0_3px_0_#3e2723] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center gap-2 font-black text-xs"
          >
            <img
              src="/assets/ui/paper/Icons/GameIcons/IconSettings.png"
              alt="Settings"
              className="w-4 h-4 object-contain"
              draggable={false}
            />
            <span className="hidden sm:inline font-bold">
              {lang === "id" ? "PENGATURAN" : "SETTINGS"}
            </span>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* CENTERPIECE: PAPER UI KIT GAME CARD & PLAY BUTTON                   */}
      {/* =================================================================== */}
      <div className="relative z-10 w-full max-w-md mx-auto my-auto bg-[#fffdf6] border-4 border-[#5c3e21] rounded-3xl p-6 sm:p-8 shadow-[0_12px_0_#3e2723] space-y-5 text-center">
        {/* Game Title Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fef08a] border-2 border-[#ca8a04] text-[#854d0e] text-xs font-black uppercase tracking-wide shadow-sm">
            <img
              src="/assets/ui/paper/Icons/GameIcons/IconHeart.png"
              alt=""
              className="w-4 h-4 object-contain"
              draggable={false}
            />
            <span>{t.mainMenu.tagline}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#3e2723] tracking-tight uppercase font-sans drop-shadow-sm">
            D LUCKY WORLD <span className="text-[#047857]">3D</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#78350f] font-bold max-w-sm mx-auto leading-relaxed">
            {t.mainMenu.subtitle}
          </p>
        </div>

        {/* PaperUIKit Large Green PLAY Button */}
        <div className="space-y-3 pt-1">
          <button
            type="button"
            onMouseEnter={handleHover}
            onClick={() => handleSelect(() => onStartGame(true))}
            className="relative group w-full inline-flex items-center justify-center cursor-pointer select-none active:scale-95 transition-transform"
          >
            <img
              src="/assets/ui/paper/Buttons/LargeButtons/ButtonLargeGreen.png"
              alt="Play"
              className="h-14 sm:h-16 w-full object-fill group-active:hidden drop-shadow-lg rounded-2xl"
              draggable={false}
            />
            <img
              src="/assets/ui/paper/Buttons/LargeButtons/ButtonLargeGreenActive.png"
              alt="Play"
              className="h-14 sm:h-16 w-full object-fill hidden group-active:block drop-shadow-lg rounded-2xl"
              draggable={false}
            />
            <span className="absolute inset-0 flex items-center justify-center gap-3 font-black text-[#14532d] text-base sm:text-lg tracking-wider uppercase pb-1 group-active:pt-1">
              <img
                src="/assets/ui/paper/Icons/GameIcons/IconPlay.png"
                alt=""
                className="w-6 h-6 object-contain"
                draggable={false}
              />
              <span>{t.mainMenu.playNow}</span>
            </span>
          </button>

          {/* Secondary Action Buttons using PaperUIKit Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onMouseEnter={handleHover}
              onClick={() => handleSelect(() => setActiveModal("controls"))}
              className="relative group inline-flex items-center justify-center cursor-pointer select-none active:scale-95 transition-transform"
            >
              <img
                src="/assets/ui/paper/Buttons/MediumButtons/ButtonMediumBlue.png"
                alt="Controls"
                className="h-11 w-full object-fill group-active:hidden drop-shadow-md rounded-2xl"
                draggable={false}
              />
              <img
                src="/assets/ui/paper/Buttons/MediumButtons/ButtonMediumBlueActive.png"
                alt="Controls"
                className="h-11 w-full object-fill hidden group-active:block drop-shadow-md rounded-2xl"
                draggable={false}
              />
              <span className="absolute inset-0 flex items-center justify-center gap-1.5 font-black text-[#1e3a8a] text-xs uppercase tracking-wide pb-1 group-active:pt-1">
                <span>{t.mainMenu.howToPlay}</span>
              </span>
            </button>

            <button
              type="button"
              onMouseEnter={handleHover}
              onClick={() => handleSelect(() => setActiveModal("atlas"))}
              className="relative group inline-flex items-center justify-center cursor-pointer select-none active:scale-95 transition-transform"
            >
              <img
                src="/assets/ui/paper/Buttons/MediumButtons/ButtonMediumWhite.png"
                alt="Atlas"
                className="h-11 w-full object-fill group-active:hidden drop-shadow-md rounded-2xl"
                draggable={false}
              />
              <img
                src="/assets/ui/paper/Buttons/MediumButtons/ButtonMediumWhiteActive.png"
                alt="Atlas"
                className="h-11 w-full object-fill hidden group-active:block drop-shadow-md rounded-2xl"
                draggable={false}
              />
              <span className="absolute inset-0 flex items-center justify-center gap-1.5 font-black text-[#5c3e21] text-xs uppercase tracking-wide pb-1 group-active:pt-1">
                <span>{t.mainMenu.islandAtlas}</span>
              </span>
            </button>
          </div>
        </div>

        {/* Server & Version Footer */}
        <div className="pt-2 border-t-2 border-[#ebdcb9] flex items-center justify-between text-xs text-[#854d0e] font-extrabold">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
            <span>{t.common.readyToPlay}</span>
          </span>
          <span>{t.common.pressEnter}</span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 w-full flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-white/20 pt-4 text-xs text-slate-300 font-bold">
        <div className="flex items-center gap-2">
          <span>{t.common.keyboardHint}</span>
          <span className="text-amber-400">•</span>
          <span>{t.common.mobileHint}</span>
        </div>
        <div>{t.common.copyright}</div>
      </div>

      {/* =================================================================== */}
      {/* PAPER UI KIT MODAL: HOW TO PLAY                                     */}
      {/* =================================================================== */}
      {activeModal === "controls" && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#fffdf6] border-4 border-[#5c3e21] rounded-3xl p-6 sm:p-7 text-[#3e2723] space-y-4 shadow-[0_12px_0_#3e2723] relative">
            <div className="flex items-center justify-between border-b-2 border-[#ebdcb9] pb-3">
              <div>
                <h3 className="text-lg font-black text-[#3e2723] uppercase">{t.mainMenu.controlsTitle}</h3>
                <p className="text-xs text-[#854d0e] font-bold">{t.mainMenu.controlsDesc}</p>
              </div>

              {/* PaperUIKit Close Button */}
              <button
                onClick={() => {
                  audio?.playMenuBack();
                  setActiveModal(null);
                }}
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

            <div className="space-y-3 text-xs">
              <h4 className="font-black text-[#92400e] uppercase tracking-wide">{t.mainMenu.keyboardTitle}</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-3 rounded-2xl bg-[#fefce8] border-2 border-[#ca8a04] text-center space-y-1 shadow-sm">
                  <span className="inline-block px-2 py-0.5 rounded-lg bg-[#fef08a] text-[#854d0e] font-black border border-[#ca8a04]">WASD</span>
                  <span className="block text-[11px] text-[#854d0e] font-bold">{lang === "id" ? "Bergerak" : "Move / Steer"}</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#fefce8] border-2 border-[#ca8a04] text-center space-y-1 shadow-sm">
                  <span className="inline-block px-2 py-0.5 rounded-lg bg-[#fef08a] text-[#854d0e] font-black border border-[#ca8a04]">SPACE</span>
                  <span className="block text-[11px] text-[#854d0e] font-bold">{lang === "id" ? "Lompat" : "Jump / Hop"}</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#fefce8] border-2 border-[#ca8a04] text-center space-y-1 shadow-sm">
                  <span className="inline-block px-2 py-0.5 rounded-lg bg-[#dcfce7] text-[#15803d] font-black border border-[#16a34a]">SHIFT</span>
                  <span className="block text-[11px] text-[#854d0e] font-bold">{lang === "id" ? "Sprint Cepat" : "Sprint Dash"}</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#fefce8] border-2 border-[#ca8a04] text-center space-y-1 shadow-sm">
                  <span className="inline-block px-2 py-0.5 rounded-lg bg-[#fef08a] text-[#854d0e] font-black border border-[#ca8a04]">E</span>
                  <span className="block text-[11px] text-[#854d0e] font-bold">{lang === "id" ? "Bicara / Aksi" : "Talk / Action"}</span>
                </div>
              </div>

              <h4 className="font-black text-[#047857] uppercase tracking-wide pt-2">{t.mainMenu.touchTitle}</h4>
              <div className="p-3.5 rounded-2xl bg-[#fefce8] border-2 border-[#ca8a04] space-y-1.5 text-[#854d0e] font-bold">
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
              className="relative group w-full inline-flex items-center justify-center cursor-pointer select-none active:scale-95 transition-transform"
            >
              <img
                src="/assets/ui/paper/Buttons/MediumButtons/ButtonMediumGreen.png"
                alt="Start"
                className="h-12 w-full object-fill group-active:hidden drop-shadow-md rounded-2xl"
                draggable={false}
              />
              <img
                src="/assets/ui/paper/Buttons/MediumButtons/ButtonMediumGreenActive.png"
                alt="Start"
                className="h-12 w-full object-fill hidden group-active:block drop-shadow-md rounded-2xl"
                draggable={false}
              />
              <span className="absolute inset-0 flex items-center justify-center font-black text-[#14532d] text-sm tracking-wide uppercase pb-1 group-active:pt-1">
                {t.mainMenu.startBtn}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* PAPER UI KIT MODAL: ISLAND ATLAS                                    */}
      {/* =================================================================== */}
      {activeModal === "atlas" && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#fffdf6] border-4 border-[#5c3e21] rounded-3xl p-6 sm:p-7 text-[#3e2723] space-y-4 shadow-[0_12px_0_#3e2723] relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-[#ebdcb9] pb-3">
              <div>
                <h3 className="text-lg font-black text-[#3e2723] uppercase">{t.mainMenu.atlasTitle}</h3>
                <p className="text-xs text-[#854d0e] font-bold">{t.mainMenu.atlasDesc}</p>
              </div>

              {/* PaperUIKit Close Button */}
              <button
                onClick={() => {
                  audio?.playMenuBack();
                  setActiveModal(null);
                }}
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

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-[#fefce8] border-2 border-[#ca8a04] flex items-start gap-3 shadow-sm">
                <div className="w-8 h-8 rounded-xl bg-[#22c55e] text-white flex items-center justify-center font-black text-sm shrink-0 border border-[#15803d] shadow-[0_2px_0_#15803d]">1</div>
                <div>
                  <h5 className="font-black text-[#3e2723] text-sm">{t.hud.locations["Central Plaza"]}</h5>
                  <p className="text-[#854d0e] text-[11px] font-bold leading-relaxed">
                    {lang === "id"
                      ? "Pusat kepulauan dengan jembatan batu, kios buah Mang Ujang, dan dermaga pancing Pak Mamat."
                      : "The main coastal hub with stone bridges, merchant stalls, and Pak Mamat's fishing pier."}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#fefce8] border-2 border-[#ca8a04] flex items-start gap-3 shadow-sm">
                <div className="w-8 h-8 rounded-xl bg-[#06b6d4] text-white flex items-center justify-center font-black text-sm shrink-0 border border-[#0891b2] shadow-[0_2px_0_#0891b2]">2</div>
                <div>
                  <h5 className="font-black text-[#3e2723] text-sm">{t.hud.locations["MOBA Sanctuary"]}</h5>
                  <p className="text-[#854d0e] text-[11px] font-bold leading-relaxed">
                    {lang === "id"
                      ? "Pilar marmer kuno dan batu rune bercahaya yang dijaga oleh Grandmaster Kesatria Valen."
                      : "Ancient columns and glowing rune stones guarded by Grandmaster Valen the Knight."}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#fefce8] border-2 border-[#ca8a04] flex items-start gap-3 shadow-sm">
                <div className="w-8 h-8 rounded-xl bg-[#f59e0b] text-white flex items-center justify-center font-black text-sm shrink-0 border border-[#b45309] shadow-[0_2px_0_#b45309]">3</div>
                <div>
                  <h5 className="font-black text-[#3e2723] text-sm">{t.hud.locations["Beach Stadium"]}</h5>
                  <p className="text-[#854d0e] text-[11px] font-bold leading-relaxed">
                    {lang === "id"
                      ? "Lapangan pasir pantai dengan gawang dan bola sepak raksasa untuk adu penalti bersama Leo!"
                      : "Sandy pitch with goal posts and a giant soccer ball ready for your penalty kicks with Leo!"}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#fefce8] border-2 border-[#ca8a04] flex items-start gap-3 shadow-sm">
                <div className="w-8 h-8 rounded-xl bg-[#3b82f6] text-white flex items-center justify-center font-black text-sm shrink-0 border border-[#1d4ed8] shadow-[0_2px_0_#1d4ed8]">4</div>
                <div>
                  <h5 className="font-black text-[#3e2723] text-sm">{t.hud.locations["Battle Royale Outpost"]}</h5>
                  <p className="text-[#854d0e] text-[11px] font-bold leading-relaxed">
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
              className="relative group w-full inline-flex items-center justify-center cursor-pointer select-none active:scale-95 transition-transform"
            >
              <img
                src="/assets/ui/paper/Buttons/MediumButtons/ButtonMediumGreen.png"
                alt="Explore"
                className="h-12 w-full object-fill group-active:hidden drop-shadow-md rounded-2xl"
                draggable={false}
              />
              <img
                src="/assets/ui/paper/Buttons/MediumButtons/ButtonMediumGreenActive.png"
                alt="Explore"
                className="h-12 w-full object-fill hidden group-active:block drop-shadow-md rounded-2xl"
                draggable={false}
              />
              <span className="absolute inset-0 flex items-center justify-center font-black text-[#14532d] text-sm tracking-wide uppercase pb-1 group-active:pt-1">
                {t.mainMenu.exploreBtn}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* PAPER UI KIT MODAL: GAME SETTINGS                                   */}
      {/* =================================================================== */}
      {activeModal === "settings" && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#fffdf6] border-4 border-[#5c3e21] rounded-3xl p-6 sm:p-7 text-[#3e2723] space-y-5 shadow-[0_12px_0_#3e2723] relative">
            <div className="flex items-center justify-between border-b-2 border-[#ebdcb9] pb-3">
              <div className="flex items-center gap-2.5">
                <img
                  src="/assets/ui/paper/Icons/GameIcons/IconSettings.png"
                  alt="Settings"
                  className="w-6 h-6 object-contain"
                  draggable={false}
                />
                <h3 className="text-lg font-black text-[#3e2723] uppercase">
                  {lang === "id" ? "PENGATURAN GAME" : "GAME SETTINGS"}
                </h3>
              </div>

              {/* PaperUIKit Close Button */}
              <button
                onClick={() => {
                  audio?.playMenuBack();
                  setActiveModal(null);
                }}
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

            <div className="space-y-3.5 text-xs font-sans">
              {/* Sound Effects Option */}
              <div className="p-3.5 rounded-2xl bg-[#fefce8] border-2 border-[#ca8a04] flex items-center justify-between gap-3 shadow-sm">
                <div>
                  <h5 className="font-black text-[#3e2723] text-sm">
                    {lang === "id" ? "Efek Suara (SFX)" : "Sound Effects (SFX)"}
                  </h5>
                  <p className="text-[#854d0e] text-[11px] font-bold">
                    {isMuted
                      ? (lang === "id" ? "Efek langkah, koin & percikan air dibisukan" : "Footstep, coin & water sounds muted")
                      : (lang === "id" ? "Efek langkah, koin & interaksi aktif" : "All interactive sound effects active")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onToggleMute}
                  className={`px-4 py-2 rounded-xl font-black text-xs border-2 shadow-sm active:translate-y-0.5 transition-all cursor-pointer ${
                    !isMuted
                      ? "bg-[#22c55e] text-white border-[#15803d]"
                      : "bg-[#fee2e2] text-[#991b1b] border-[#b91c1c]"
                  }`}
                >
                  {!isMuted ? (lang === "id" ? "NYALA" : "ON") : (lang === "id" ? "SENYAP" : "MUTED")}
                </button>
              </div>

              {/* Background Music (BGM) Option */}
              {onToggleMusic && (
                <div className="p-3.5 rounded-2xl bg-[#fefce8] border-2 border-[#ca8a04] flex items-center justify-between gap-3 shadow-sm">
                  <div>
                    <h5 className="font-black text-[#3e2723] text-sm flex items-center gap-1.5">
                      <GameIconAudio enabled={isMusicEnabled && !isMuted} className="w-4 h-4 text-[#854d0e] shrink-0" />
                      <span>{lang === "id" ? "Musik Latar (BGM)" : "Background Music (BGM)"}</span>
                    </h5>
                    <p className="text-[#854d0e] text-[11px] font-bold">
                      {isMusicEnabled && !isMuted
                        ? (lang === "id" ? "Lagu petualangan pesisir berputar santai" : "Coastal ocean soundtrack playing")
                        : (lang === "id" ? "Musik latar dimatikan" : "Background soundtrack muted")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onToggleMusic}
                    className={`px-4 py-2 rounded-xl font-black text-xs border-2 shadow-sm active:translate-y-0.5 transition-all cursor-pointer ${
                      isMusicEnabled && !isMuted
                        ? "bg-[#22c55e] text-white border-[#15803d]"
                        : "bg-[#fee2e2] text-[#991b1b] border-[#b91c1c]"
                    }`}
                  >
                    {isMusicEnabled && !isMuted ? (lang === "id" ? "NYALA" : "ON") : (lang === "id" ? "SENYAP" : "MUTED")}
                  </button>
                </div>
              )}

              {/* Weather & Time Atmosphere Option */}
              {onSetWeather && (
                <div className="p-3.5 rounded-2xl bg-[#fefce8] border-2 border-[#ca8a04] space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-black text-[#3e2723] text-sm flex items-center gap-1.5">
                        <GameIconWeather type="header" className="w-4 h-4 shrink-0" />
                        <span>{lang === "id" ? "Suasana Cuaca & Waktu" : "Weather & Time of Day"}</span>
                      </h5>
                      <p className="text-[#854d0e] text-[11px] font-bold">
                        {lang === "id" ? "Pilih kondisi pencahayaan dan atmosfer dunia" : "Choose the lighting and sky atmosphere"}
                      </p>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-[#fef08a] text-[#854d0e] border border-[#ca8a04]">
                      {currentWeather === "day"
                        ? (lang === "id" ? "Siang" : "Day")
                        : currentWeather === "night"
                        ? (lang === "id" ? "Malam" : "Night")
                        : currentWeather === "rain"
                        ? (lang === "id" ? "Hujan" : "Rain")
                        : (lang === "id" ? "Salju" : "Snow")}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 pt-1">
                    {(
                      [
                        { id: "day", label: lang === "id" ? "Siang" : "Day" },
                        { id: "night", label: lang === "id" ? "Malam" : "Night" },
                        { id: "rain", label: lang === "id" ? "Hujan" : "Rain" },
                        { id: "snow", label: lang === "id" ? "Salju" : "Snow" },
                      ] as const
                    ).map((item) => {
                      const isActive = currentWeather === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            audio?.playMenuHover();
                            onSetWeather(item.id);
                          }}
                          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border-2 transition-all cursor-pointer ${
                            isActive
                              ? "bg-[#22c55e] text-white border-[#15803d] shadow-sm font-black scale-102"
                              : "bg-[#fffdf6] text-[#854d0e] hover:bg-[#fef9c3] border-[#ca8a04]/60"
                          }`}
                        >
                          <GameIconWeather type={item.id} className="w-5 h-5 mb-0.5 shrink-0" />
                          <span className="text-[10px] font-black tracking-tight">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Language Switch Option */}
              <div className="p-3.5 rounded-2xl bg-[#fefce8] border-2 border-[#ca8a04] flex items-center justify-between gap-3 shadow-sm">
                <div>
                  <h5 className="font-black text-[#3e2723] text-sm">
                    {lang === "id" ? "Pilihan Bahasa" : "Language"}
                  </h5>
                  <p className="text-[#854d0e] text-[11px] font-bold">
                    {lang === "id" ? "Bahasa Indonesia aktif" : "English active"}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onToggleLang("id")}
                    className={`px-3 py-1.5 rounded-xl font-black text-xs border-2 cursor-pointer transition-all ${
                      lang === "id"
                        ? "bg-[#22c55e] text-white border-[#15803d] shadow-sm"
                        : "bg-[#fffdf6] text-[#854d0e] border-[#ca8a04]"
                    }`}
                  >
                    ID
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleLang("en")}
                    className={`px-3 py-1.5 rounded-xl font-black text-xs border-2 cursor-pointer transition-all ${
                      lang === "en"
                        ? "bg-[#22c55e] text-white border-[#15803d] shadow-sm"
                        : "bg-[#fffdf6] text-[#854d0e] border-[#ca8a04]"
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>

              {/* Controls Quick Shortcut */}
              <div className="p-3.5 rounded-2xl bg-[#fefce8] border-2 border-[#ca8a04] flex items-center justify-between gap-3 shadow-sm">
                <div>
                  <h5 className="font-black text-[#3e2723] text-sm">
                    {lang === "id" ? "Panduan Kontrol" : "Controls Guide"}
                  </h5>
                  <p className="text-[#854d0e] text-[11px] font-bold">
                    {lang === "id" ? "Keyboard WASD & Layar Sentuh" : "Keyboard WASD & Touch Controls"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal("controls")}
                  className="px-3.5 py-1.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-black text-xs border-2 border-[#0284c7] shadow-sm active:translate-y-0.5 cursor-pointer"
                >
                  {lang === "id" ? "LIHAT" : "VIEW"}
                </button>
              </div>
            </div>

            {/* Save & Return Button */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => {
                  audio?.playMenuSelect();
                  setActiveModal(null);
                }}
                className="relative w-full max-w-xs h-12 inline-flex items-center justify-center cursor-pointer active:scale-95 transition-transform group"
              >
                <img
                  src="/assets/ui/paper/Buttons/MediumButtons/ButtonMediumGreen.png"
                  alt="Save"
                  className="w-full h-full object-contain group-active:hidden drop-shadow-md"
                  draggable={false}
                />
                <img
                  src="/assets/ui/paper/Buttons/MediumButtons/ButtonMediumGreenActive.png"
                  alt="Save"
                  className="w-full h-full object-contain hidden group-active:block drop-shadow-md"
                  draggable={false}
                />
                <span className="absolute inset-0 flex items-center justify-center font-black text-xs sm:text-sm text-white tracking-wider pb-1 group-active:pt-1">
                  {lang === "id" ? "SIMPAN & KEMBALI" : "SAVE & RETURN"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
