"use client";

import React, { useEffect, useState } from "react";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap, ArrowBigUp, MessageSquare } from "lucide-react";
import { WorldEngine } from "./WorldEngine";

interface WorldControlsProps {
  engine: WorldEngine | null;
  onInteract?: () => void;
}

export const WorldControls: React.FC<WorldControlsProps> = ({ engine, onInteract }) => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!engine) return;
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          engine.inputs.forward = true;
          break;
        case "KeyS":
        case "ArrowDown":
          engine.inputs.backward = true;
          break;
        case "KeyA":
        case "ArrowLeft":
          engine.inputs.left = true;
          break;
        case "KeyD":
        case "ArrowRight":
          engine.inputs.right = true;
          break;
        case "Space":
          engine.inputs.jump = true;
          break;
        case "ShiftLeft":
        case "ShiftRight":
          engine.inputs.boost = true;
          break;
        case "KeyE":
          engine.inputs.interact = true;
          onInteract?.();
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!engine) return;
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          engine.inputs.forward = false;
          break;
        case "KeyS":
        case "ArrowDown":
          engine.inputs.backward = false;
          break;
        case "KeyA":
        case "ArrowLeft":
          engine.inputs.left = false;
          break;
        case "KeyD":
        case "ArrowRight":
          engine.inputs.right = false;
          break;
        case "Space":
          engine.inputs.jump = false;
          break;
        case "ShiftLeft":
        case "ShiftRight":
          engine.inputs.boost = false;
          break;
        case "KeyE":
          engine.inputs.interact = false;
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [engine, onInteract]);

  const setInput = (key: keyof WorldEngine["inputs"], val: boolean) => {
    if (engine) {
      engine.inputs[key] = val;
      if (key === "interact" && val) {
        onInteract?.();
      }
    }
  };

  if (!isTouchDevice) {
    return (
      <div className="absolute bottom-6 left-6 pointer-events-none hidden md:flex items-center gap-2.5 bg-slate-900/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-xs font-mono text-slate-300 shadow-[0_6px_20px_rgba(0,0,0,0.6)]">
        <span className="font-black text-white bg-slate-800 px-2 py-0.5 rounded border border-white/20 shadow-inner">WASD / ↑↓←→</span>
        <span className="text-slate-300 font-bold">MOVE</span>
        <span className="text-slate-600 font-black">•</span>
        <span className="font-black text-white bg-slate-800 px-2 py-0.5 rounded border border-white/20 shadow-inner">SPACE</span>
        <span className="text-slate-300 font-bold">JUMP</span>
        <span className="text-slate-600 font-black">•</span>
        <span className="font-black text-cyan-400 bg-slate-800 px-2 py-0.5 rounded border border-cyan-400/30 shadow-inner">SHIFT</span>
        <span className="text-cyan-300 font-bold">NITRO</span>
        <span className="text-slate-600 font-black">•</span>
        <span className="font-black text-amber-400 bg-slate-800 px-2 py-0.5 rounded border border-amber-400/30 shadow-inner">E</span>
        <span className="text-amber-300 font-bold">INTERACT</span>
      </div>
    );
  }

  // =========================================================================
  // ARCADE CONSOLE TOUCH CONTROLLER (MOBILE / TABLET)
  // =========================================================================
  return (
    <div className="fixed inset-0 pointer-events-none z-30 select-none">
      {/* Left Arcade D-Pad */}
      <div className="absolute bottom-8 left-6 pointer-events-auto flex flex-col items-center gap-2">
        <button
          onTouchStart={() => setInput("forward", true)}
          onTouchEnd={() => setInput("forward", false)}
          className="w-16 h-16 rounded-2xl bg-slate-900/90 active:bg-emerald-500 border border-white/20 active:border-emerald-300 flex items-center justify-center text-white shadow-[0_5px_0_#020617] active:translate-y-1 active:shadow-none transition-all"
        >
          <ArrowUp className="w-8 h-8 text-emerald-400" />
        </button>
        <div className="flex gap-2">
          <button
            onTouchStart={() => setInput("left", true)}
            onTouchEnd={() => setInput("left", false)}
            className="w-16 h-16 rounded-2xl bg-slate-900/90 active:bg-emerald-500 border border-white/20 active:border-emerald-300 flex items-center justify-center text-white shadow-[0_5px_0_#020617] active:translate-y-1 active:shadow-none transition-all"
          >
            <ArrowLeft className="w-8 h-8 text-emerald-400" />
          </button>
          <button
            onTouchStart={() => setInput("backward", true)}
            onTouchEnd={() => setInput("backward", false)}
            className="w-16 h-16 rounded-2xl bg-slate-900/90 active:bg-emerald-500 border border-white/20 active:border-emerald-300 flex items-center justify-center text-white shadow-[0_5px_0_#020617] active:translate-y-1 active:shadow-none transition-all"
          >
            <ArrowDown className="w-8 h-8 text-emerald-400" />
          </button>
          <button
            onTouchStart={() => setInput("right", true)}
            onTouchEnd={() => setInput("right", false)}
            className="w-16 h-16 rounded-2xl bg-slate-900/90 active:bg-emerald-500 border border-white/20 active:border-emerald-300 flex items-center justify-center text-white shadow-[0_5px_0_#020617] active:translate-y-1 active:shadow-none transition-all"
          >
            <ArrowRight className="w-8 h-8 text-emerald-400" />
          </button>
        </div>
      </div>

      {/* Right Arcade Action Buttons */}
      <div className="absolute bottom-8 right-6 pointer-events-auto flex flex-col items-end gap-3.5">
        <button
          onTouchStart={() => setInput("boost", true)}
          onTouchEnd={() => setInput("boost", false)}
          className="w-18 h-18 p-4 rounded-3xl bg-gradient-to-tr from-cyan-600 to-teal-400 border-t border-white/40 border-b-4 border-cyan-900 shadow-[0_6px_20px_rgba(6,182,212,0.5)] active:border-b-0 active:translate-y-1 flex items-center justify-center text-slate-950 font-black transition-all"
        >
          <Zap className="w-8 h-8 fill-current" />
        </button>
        <button
          onTouchStart={() => setInput("jump", true)}
          onTouchEnd={() => setInput("jump", false)}
          className="w-18 h-18 p-4 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-300 border-t border-white/40 border-b-4 border-emerald-900 shadow-[0_6px_20px_rgba(16,185,129,0.5)] active:border-b-0 active:translate-y-1 flex items-center justify-center text-slate-950 font-black transition-all"
        >
          <ArrowBigUp className="w-9 h-9 fill-current" />
        </button>
      </div>
    </div>
  );
};
