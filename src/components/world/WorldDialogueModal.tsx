"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, X, ArrowRight, CheckCircle2 } from "lucide-react";
import { NPCData } from "./WorldEngine";

interface WorldDialogueModalProps {
  npc: NPCData | null;
  onClose: () => void;
  onCompleteQuest?: (questId: string) => void;
}

export const WorldDialogueModal: React.FC<WorldDialogueModalProps> = ({ npc, onClose, onCompleteQuest }) => {
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => {
    setLineIdx(0);
  }, [npc]);

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

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 p-4 sm:p-8 flex justify-center pointer-events-none animate-in fade-in slide-in-from-bottom-6 duration-300">
      <div className="w-full max-w-2xl bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl pointer-events-auto relative text-white space-y-4">
        {/* Header with NPC Info */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-2xl shadow-inner">
              {npc.avatar}
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold font-display text-white flex items-center gap-2">
                {npc.name}
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  {npc.island}
                </span>
              </h4>
              <p className="text-xs text-slate-400">{npc.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dialogue Bubble */}
        <div className="min-h-[70px] flex items-center">
          <p className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed">
            &ldquo;{currentLine}&rdquo;
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex gap-1.5">
            {npc.dialogue.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === lineIdx ? "w-6 bg-cyan-400" : "w-2 bg-slate-700"
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
          >
            {isLastLine ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> Selesai
              </>
            ) : (
              <>
                Lanjut <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
