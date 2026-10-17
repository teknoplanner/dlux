"use client";

import React, { useState, useEffect } from "react";
import { NPCData } from "./WorldEngine";
import { WorldLang, BILINGUAL_NPCS } from "./worldI18n";
import { GameIconResidentBadge } from "./WorldGameIcons";

interface WorldDialogueModalProps {
  npc: NPCData | null;
  onClose: () => void;
  onCompleteQuest?: (questId: string) => void;
  onStartChallenge?: (challengeId: "ring_trial" | "penalty_kick" | "crystal_runes" | "airdrop_hunt" | "hex_mario_run") => void;
  lang: WorldLang;
}

export const WorldDialogueModal: React.FC<WorldDialogueModalProps> = ({
  npc,
  onClose,
  onCompleteQuest,
  onStartChallenge,
  lang,
}) => {
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => {
    setLineIdx(0);
  }, [npc]);

  // Keyboard shortcut to advance dialogue (Space, Enter, or E)
  useEffect(() => {
    if (!npc) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter" || e.code === "KeyE") {
        e.preventDefault();
        handleNext();
      } else if (e.code === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  if (!npc) return null;

  // Resolve bilingual dialogue lines
  const biNpc = BILINGUAL_NPCS[npc.id];
  const dialogueLines: string[] = biNpc?.dialogue[lang] ?? npc.dialogue;
  const displayName: string = biNpc?.name[lang] ?? npc.name;

  // Bilingual challenge title/instructions
  const challengeTitle: string | undefined = biNpc?.challenge?.title[lang];
  const challengeInstructions: string | undefined = biNpc?.challenge?.instructions[lang];

  const currentLine = dialogueLines[lineIdx] || "";
  const isLastLine = lineIdx >= dialogueLines.length - 1;

  const handleNext = () => {
    if (isLastLine) {
      if (npc.id === "valen") onCompleteQuest?.("moba");
      onClose();
    } else {
      setLineIdx((prev) => prev + 1);
    }
  };

  const handleStartGame = () => {
    if (npc.arcadeChallenge) {
      onStartChallenge?.(npc.arcadeChallenge.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 p-3 sm:p-6 flex justify-center pointer-events-none animate-in fade-in slide-in-from-bottom-6 duration-300 select-none">
      {/* Authentic PaperUIKit Adventure Dialogue Box */}
      <div className="w-full max-w-3xl pointer-events-auto relative">
        {/* Character Title Ribbon from PaperUIKit TitleContainerCharacterName */}
        <div className="absolute -top-8 sm:-top-10 left-4 sm:left-8 z-20 flex items-center">
          <div className="relative">
            <img
              src="/assets/ui/paper/TitleContainers/TitleContainerCharacterName.png"
              alt=""
              className="h-12 sm:h-14 w-auto drop-shadow-md"
              draggable={false}
            />
            <div className="absolute inset-0 flex items-center justify-center pb-2.5 px-6">
              <span className="text-xs sm:text-sm font-black text-[#3e2723] uppercase tracking-wider font-sans drop-shadow-sm truncate max-w-[240px]">
                {displayName}
              </span>
            </div>
          </div>
        </div>

        {/* Main Dialogue Paper Parchment Box */}
        <div className="relative bg-[#fffdf6] border-3 sm:border-4 border-[#5c3e21] rounded-3xl p-5 sm:p-7 shadow-[0_12px_0_#3e2723] text-[#3e2723] space-y-4">
          {/* PaperUIKit ButtonClose */}
          <button
            onClick={onClose}
            aria-label="Close Dialogue"
            className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-10 h-10 inline-flex items-center justify-center cursor-pointer active:scale-95 transition-transform z-30 group"
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

          {/* Dialogue Body & Character Portrait */}
          <div className="flex items-start gap-4 sm:gap-6 pt-2">
            {/* Character Portrait Stage */}
            <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#fef08a] border-3 border-[#854d0e] p-1 shadow-[0_4px_0_#854d0e] flex items-center justify-center">
                <div className="w-full h-full rounded-2xl bg-[#fffdf6] flex items-center justify-center p-1.5 shadow-inner select-none">
                  <GameIconResidentBadge role={npc.id} className="w-full h-full object-contain" fallbackEmoji={npc.avatar} />
                </div>
              </div>
              <span className="text-[10px] font-black text-[#5c3e21] bg-[#f5eedc] px-2 py-0.5 rounded-full border border-[#854d0e]">
                {npc.island}
              </span>
            </div>

            {/* Prose Text Box with Quotation Styling */}
            <div className="flex-1 min-h-[72px] sm:min-h-[84px] flex flex-col justify-center pr-4">
              <p className="text-sm sm:text-base md:text-lg text-[#3e2723] font-bold leading-relaxed font-sans drop-shadow-sm select-text">
                <span className="text-[#d97706] font-serif text-lg sm:text-2xl font-black mr-1 select-none">
                  &ldquo;
                </span>
                {currentLine}
                <span className="text-[#d97706] font-serif text-lg sm:text-2xl font-black ml-1 select-none">
                  &rdquo;
                </span>
              </p>
            </div>
          </div>

          {/* Arcade Challenge Dispatch Card */}
          {npc.arcadeChallenge && (
            <div className="relative overflow-hidden rounded-2xl border-2 border-[#ca8a04] bg-[#fefce8] p-3.5 sm:p-4 shadow-[0_4px_0_#ca8a04]">
              <div className="flex items-center justify-between pb-2 border-b border-[#ca8a04]/30 text-[10px] font-black uppercase tracking-widest text-[#854d0e]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] border border-[#854d0e] animate-ping" />
                  MISI TANTANGAN KEPULAUAN
                </span>
                <span className="text-[#047857] font-black flex items-center gap-1">
                  <img
                    src="/assets/ui/paper/Icons/GameIcons/IconCoin.png"
                    alt=""
                    className="w-4 h-4 object-contain inline"
                    draggable={false}
                  />
                  HADIAH: +5 KOIN EMAS
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2.5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-[#fef08a] border border-[#854d0e] text-[#854d0e] shadow-sm">
                      {npc.arcadeChallenge.badge}
                    </span>
                    <h5 className="text-sm sm:text-base font-black text-[#78350f] tracking-wide">
                      {challengeTitle ?? npc.arcadeChallenge.title}
                    </h5>
                  </div>
                  <p className="text-xs text-[#854d0e] font-medium leading-normal">
                    {challengeInstructions ?? npc.arcadeChallenge.instructions}
                  </p>
                </div>

                {/* PaperUIKit ButtonMediumBlue for Challenge */}
                <button
                  onClick={handleStartGame}
                  className="relative group inline-flex items-center justify-center cursor-pointer select-none active:scale-95 transition-transform shrink-0"
                >
                  <img
                    src="/assets/ui/paper/Buttons/MediumButtons/ButtonMediumBlue.png"
                    alt="Start"
                    className="h-11 sm:h-12 w-auto group-active:hidden drop-shadow-md"
                    draggable={false}
                  />
                  <img
                    src="/assets/ui/paper/Buttons/MediumButtons/ButtonMediumBlueActive.png"
                    alt="Start"
                    className="h-11 sm:h-12 w-auto hidden group-active:block drop-shadow-md"
                    draggable={false}
                  />
                  <span className="absolute inset-0 flex items-center justify-center gap-1.5 font-black text-[#1e3a8a] text-xs sm:text-sm tracking-wide uppercase pb-1 group-active:pt-1">
                    <img
                      src="/assets/ui/paper/Icons/GameIcons/IconPlay.png"
                      alt=""
                      className="w-4 h-4 object-contain"
                      draggable={false}
                    />
                    <span>MULAI MISI</span>
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Footer Actions & Controls */}
          <div className="flex items-center justify-between pt-2 border-t-2 border-[#ebdcb9] text-xs">
            {/* Story Dialogue Progress Dots */}
            <div className="flex items-center gap-2.5">
              <span className="text-[#854d0e] font-black hidden sm:inline text-xs">
                {lineIdx + 1} / {dialogueLines.length}
              </span>
              <div className="flex gap-1.5">
                {dialogueLines.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      idx === lineIdx
                        ? "w-8 bg-[#22c55e] border border-[#15803d] shadow-[0_2px_0_#15803d]"
                        : "w-2.5 bg-[#e5d5b5] border border-[#854d0e]/40"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Advance Button with PaperUIKit ButtonMediumGreen */}
            <button
              onClick={handleNext}
              className="relative group inline-flex items-center justify-center cursor-pointer select-none active:scale-95 transition-transform"
            >
              <img
                src="/assets/ui/paper/Buttons/MediumButtons/ButtonMediumGreen.png"
                alt="Next"
                className="h-11 sm:h-12 w-auto group-active:hidden drop-shadow-md"
                draggable={false}
              />
              <img
                src="/assets/ui/paper/Buttons/MediumButtons/ButtonMediumGreenActive.png"
                alt="Next"
                className="h-11 sm:h-12 w-auto hidden group-active:block drop-shadow-md"
                draggable={false}
              />
              <span className="absolute inset-0 flex items-center justify-center gap-1.5 font-black text-[#14532d] text-xs sm:text-sm tracking-wide uppercase pb-1 group-active:pt-1">
                {isLastLine ? (
                  <>
                    <img
                      src="/assets/ui/paper/Icons/GameIcons/IconCheckmark.png"
                      alt=""
                      className="w-4 h-4 object-contain"
                      draggable={false}
                    />
                    <span>SELESAI [E]</span>
                  </>
                ) : (
                  <>
                    <span>LANJUT [E]</span>
                    <img
                      src="/assets/ui/paper/Icons/GameIcons/IconNext.png"
                      alt=""
                      className="w-3.5 h-3.5 object-contain"
                      draggable={false}
                    />
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
