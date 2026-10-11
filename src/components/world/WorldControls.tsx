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
    const checkTouch = () => {
      setIsTouchDevice(
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches ||
        window.innerWidth < 1024
      );
    };
    checkTouch();
    window.addEventListener("resize", checkTouch);

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
      window.removeEventListener("resize", checkTouch);
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
      <div className="absolute bottom-6 left-6 pointer-events-none hidden lg:flex items-center gap-2.5 bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-xs font-mono text-slate-300 shadow-[0_6px_20px_rgba(0,0,0,0.6)]">
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
    <div className="fixed inset-0 pointer-events-none z-20 select-none touch-none">
      {/* Left Arcade D-Pad */}
      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 pointer-events-auto flex flex-col items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onTouchStart={(e) => { e.preventDefault(); setInput("forward", true); }}
          onTouchEnd={(e) => { e.preventDefault(); setInput("forward", false); }}
          onTouchCancel={() => setInput("forward", false)}
          onMouseDown={() => setInput("forward", true)}
          onMouseUp={() => setInput("forward", false)}
          onMouseLeave={() => setInput("forward", false)}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-900/90 active:bg-emerald-500 border border-white/20 active:border-emerald-300 flex items-center justify-center text-white shadow-[0_4px_0_#020617] active:translate-y-1 active:shadow-none transition-all touch-none select-none"
          aria-label="Move Forward"
        >
          <ArrowUp className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400" />
        </button>
        <div className="flex gap-1.5 sm:gap-2">
          <button
            type="button"
            onTouchStart={(e) => { e.preventDefault(); setInput("left", true); }}
            onTouchEnd={(e) => { e.preventDefault(); setInput("left", false); }}
            onTouchCancel={() => setInput("left", false)}
            onMouseDown={() => setInput("left", true)}
            onMouseUp={() => setInput("left", false)}
            onMouseLeave={() => setInput("left", false)}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-900/90 active:bg-emerald-500 border border-white/20 active:border-emerald-300 flex items-center justify-center text-white shadow-[0_4px_0_#020617] active:translate-y-1 active:shadow-none transition-all touch-none select-none"
            aria-label="Move Left"
          >
            <ArrowLeft className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400" />
          </button>
          <button
            type="button"
            onTouchStart={(e) => { e.preventDefault(); setInput("backward", true); }}
            onTouchEnd={(e) => { e.preventDefault(); setInput("backward", false); }}
            onTouchCancel={() => setInput("backward", false)}
            onMouseDown={() => setInput("backward", true)}
            onMouseUp={() => setInput("backward", false)}
            onMouseLeave={() => setInput("backward", false)}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-900/90 active:bg-emerald-500 border border-white/20 active:border-emerald-300 flex items-center justify-center text-white shadow-[0_4px_0_#020617] active:translate-y-1 active:shadow-none transition-all touch-none select-none"
            aria-label="Move Backward"
          >
            <ArrowDown className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400" />
          </button>
          <button
            type="button"
            onTouchStart={(e) => { e.preventDefault(); setInput("right", true); }}
            onTouchEnd={(e) => { e.preventDefault(); setInput("right", false); }}
            onTouchCancel={() => setInput("right", false)}
            onMouseDown={() => setInput("right", true)}
            onMouseUp={() => setInput("right", false)}
            onMouseLeave={() => setInput("right", false)}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-900/90 active:bg-emerald-500 border border-white/20 active:border-emerald-300 flex items-center justify-center text-white shadow-[0_4px_0_#020617] active:translate-y-1 active:shadow-none transition-all touch-none select-none"
            aria-label="Move Right"
          >
            <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400" />
          </button>
        </div>
      </div>

      {/* Right Arcade Action Buttons */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 pointer-events-auto flex flex-col items-end gap-2 sm:gap-2.5">
        <button
          type="button"
          onTouchStart={(e) => { e.preventDefault(); setInput("boost", true); }}
          onTouchEnd={(e) => { e.preventDefault(); setInput("boost", false); }}
          onTouchCancel={() => setInput("boost", false)}
          onMouseDown={() => setInput("boost", true)}
          onMouseUp={() => setInput("boost", false)}
          onMouseLeave={() => setInput("boost", false)}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-400 border-t border-white/40 border-b-4 border-cyan-900 shadow-[0_4px_12px_rgba(6,182,212,0.4)] active:border-b-0 active:translate-y-1 flex items-center justify-center text-slate-950 font-black transition-all touch-none select-none"
          aria-label="Boost / Nitro Dash"
        >
          <Zap className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
        </button>
        <button
          type="button"
          onTouchStart={(e) => { e.preventDefault(); setInput("jump", true); }}
          onTouchEnd={(e) => { e.preventDefault(); setInput("jump", false); }}
          onTouchCancel={() => setInput("jump", false)}
          onMouseDown={() => setInput("jump", true)}
          onMouseUp={() => setInput("jump", false)}
          onMouseLeave={() => setInput("jump", false)}
          className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-300 border-t border-white/40 border-b-4 border-emerald-900 shadow-[0_4px_12px_rgba(16,185,129,0.4)] active:border-b-0 active:translate-y-1 flex items-center justify-center text-slate-950 font-black transition-all touch-none select-none"
          aria-label="Jump"
        >
          <ArrowBigUp className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
        </button>
      </div>
    </div>
  );
};
