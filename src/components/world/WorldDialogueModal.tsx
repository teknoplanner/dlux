"use client";

import React, { useState, useEffect } from "react";
import { X, ArrowRight, CheckCircle2, ChevronRight, Award, Compass, Shield, Radio, Trophy, Zap } from "lucide-react";
import { NPCData } from "./WorldEngine";

interface WorldDialogueModalProps {
  npc: NPCData | null;
  onClose: () => void;
  onCompleteQuest?: (questId: string) => void;
  onStartChallenge?: (challengeId: "ring_trial" | "penalty_kick" | "crystal_runes" | "airdrop_hunt") => void;
}

export const WorldDialogueModal: React.FC<WorldDialogueModalProps> = ({
  npc,
  onClose,
  onCompleteQuest,
  onStartChallenge,
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

  const currentLine = npc.dialogue[lineIdx] || "";
  const isLastLine = lineIdx >= npc.dialogue.length - 1;

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

  const getNpcBadge = (id: string) => {
    switch (id) {
      case "lexa":
        return { label: "NAVIGATOR", color: "from-amber-400 to-yellow-500", icon: <Compass className="w-3.5 h-3.5" /> };
      case "valen":
        return { label: "GRANDMASTER", color: "from-cyan-400 to-blue-500", icon: <Shield className="w-3.5 h-3.5" /> };
      case "jax":
        return { label: "SPEC-OPS ACE", color: "from-emerald-400 to-teal-500", icon: <Radio className="w-3.5 h-3.5" /> };
      case "leo":
        return { label: "STRIKER #10", color: "from-amber-400 to-orange-500", icon: <Trophy className="w-3.5 h-3.5" /> };
      default:
        return { label: "CHAMPION", color: "from-cyan-400 to-blue-500", icon: <Award className="w-3.5 h-3.5" /> };
    }
  };

  const badge = getNpcBadge(npc.id);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 p-3 sm:p-6 flex justify-center pointer-events-none animate-in fade-in slide-in-from-bottom-6 duration-300">
      {/* =================================================================== */}
      {/* AUTHENTIC RETRO-ARCADE / JRPG GAME DIALOGUE CHASSIS                 */}
      {/* =================================================================== */}
      <div className="w-full max-w-3xl pointer-events-auto relative">
        {/* Character Identity Ribbon (Overhanging top-left plate) */}
        <div className="absolute -top-7 left-4 sm:left-8 z-10 flex items-center gap-2">
          <div className="px-4 py-1.5 rounded-t-xl bg-slate-950 border-t-2 border-x-2 border-cyan-400/80 shadow-[0_-4px_12px_rgba(6,182,212,0.3)] flex items-center gap-2.5">
            <span className={`px-2 py-0.5 rounded text-[10px] font-black font-mono tracking-widest text-slate-950 bg-gradient-to-r ${badge.color} flex items-center gap-1 shadow-sm`}>
              {badge.icon}
              {badge.label}
            </span>
            <span className="text-sm sm:text-base font-black font-display tracking-wider text-white">
              {npc.name.toUpperCase()}
            </span>
            <span className="text-[11px] font-mono text-cyan-300 font-bold hidden sm:inline">
              // {npc.island}
            </span>
            {/* Animated Audio Equalizer Speech Indicator */}
            <div className="flex items-end gap-0.5 h-3 pl-1">
              <span className="w-1 bg-emerald-400 rounded-full animate-[bounce_0.6s_infinite_100ms] h-full" />
              <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_0.6s_infinite_250ms] h-2/3" />
              <span className="w-1 bg-amber-400 rounded-full animate-[bounce_0.6s_infinite_400ms] h-full" />
            </div>
          </div>
        </div>

        {/* Main Dialogue Mechanical Box */}
        <div className="relative bg-[#070d18]/95 backdrop-blur-2xl border-[3px] border-cyan-500/70 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_0_24px_rgba(6,182,212,0.15)] text-white space-y-4">
          {/* Metallic Corner Rivets (Game Arcade Console Detailing) */}
          <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-amber-400 border border-amber-200 shadow-[0_0_6px_#facc15]" />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 border border-amber-200 shadow-[0_0_6px_#facc15]" />
          <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-amber-400 border border-amber-200 shadow-[0_0_6px_#facc15]" />
          <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-amber-400 border border-amber-200 shadow-[0_0_6px_#facc15]" />

          {/* Close button (Styled as retro cancel switch) */}
          <button
            onClick={onClose}
            aria-label="Close Dialogue"
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-xl bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-300 border border-white/20 transition-all cursor-pointer z-10"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Dialogue Body & Character Bust Layout */}
          <div className="flex items-start gap-4 sm:gap-6 pt-1">
            {/* 3D Character Avatar Portrait Stage */}
            <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-950 border-2 border-cyan-400/60 p-1 shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center">
                <div className="w-full h-full rounded-xl bg-gradient-to-tr from-cyan-950 to-slate-900 flex items-center justify-center text-3xl sm:text-4xl shadow-inner select-none">
                  {npc.avatar}
                </div>
                {/* Status indicator pin */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                LVL 99
              </span>
            </div>

            {/* Prose Text Box with Authentic Game Quotation Styling */}
            <div className="flex-1 min-h-[72px] sm:min-h-[84px] flex flex-col justify-center pr-6">
              <p className="text-sm sm:text-lg text-slate-100 font-medium leading-relaxed font-sans drop-shadow-sm select-text">
                <span className="text-amber-400 font-serif text-lg sm:text-2xl font-black mr-1.5 select-none">
                  &ldquo;
                </span>
                {currentLine}
                <span className="text-amber-400 font-serif text-lg sm:text-2xl font-black ml-1 select-none">
                  &rdquo;
                </span>
              </p>
            </div>
          </div>

          {/* =============================================================== */}
          {/* IN-GAME ARCADE MISSION DISPATCH TICKET                          */}
          {/* =============================================================== */}
          {npc.arcadeChallenge && (
            <div className="relative overflow-hidden rounded-xl border-2 border-amber-400/70 bg-gradient-to-r from-amber-950/70 via-slate-950/90 to-amber-950/70 p-3.5 sm:p-4 shadow-[0_4px_20px_rgba(245,158,11,0.25)]">
              {/* Caution Hazard Header Bar */}
              <div className="flex items-center justify-between pb-2 border-b border-amber-400/20 text-[10px] font-mono font-bold uppercase tracking-widest text-amber-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  /// ARCADE MISSION DISPATCH ///
                </span>
                <span className="text-emerald-400 font-black">
                  REWARD: +5 🪙 TOKENS &amp; EXP
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2.5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-amber-400 text-slate-950 shadow">
                      {npc.arcadeChallenge.badge}
                    </span>
                    <h5 className="text-sm sm:text-base font-black font-display text-amber-200 tracking-wide">
                      {npc.arcadeChallenge.title}
                    </h5>
                  </div>
                  <p className="text-xs text-amber-300/90 font-mono leading-normal">
                    {npc.arcadeChallenge.instructions}
                  </p>
                </div>

                {/* Chunky 3D Arcade Challenge Trigger Button */}
                <button
                  onClick={handleStartGame}
                  className="flex-shrink-0 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider border-t border-white/60 border-b-4 border-amber-700 active:border-b-0 active:translate-y-1 shadow-[0_6px_20px_rgba(245,158,11,0.5)] transition-all cursor-pointer whitespace-nowrap"
                >
                  <Zap className="w-4 h-4 fill-current text-slate-950" />
                  <span>ACCEPT CHALLENGE</span>
                </button>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* FOOTER ACTIONS & GAMEPLAY CONTROLS BAR                          */}
          {/* =============================================================== */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-mono">
            {/* Story Dialogue Progress Dots & Counter */}
            <div className="flex items-center gap-3">
              <span className="text-slate-400 font-bold hidden sm:inline">
                LOG: {lineIdx + 1} / {npc.dialogue.length}
              </span>
              <div className="flex gap-1.5">
                {npc.dialogue.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === lineIdx
                        ? "w-7 bg-gradient-to-r from-cyan-400 to-teal-300 shadow-[0_0_8px_#06b6d4]"
                        : "w-2 bg-slate-800 border border-white/10"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Advance Button with Tactile Keyboard Prompts */}
            <button
              onClick={handleNext}
              className="group flex items-center gap-2.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm tracking-wide border-t border-white/50 border-b-4 border-cyan-800 active:border-b-0 active:translate-y-1 shadow-[0_6px_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
            >
              {isLastLine ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>FINISH [E]</span>
                </>
              ) : (
                <>
                  <span>NEXT [E]</span>
                  <ChevronRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
