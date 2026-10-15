"use client";

import React, { useEffect, useState } from "react";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap, ArrowBigUp } from "lucide-react";
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

  // Desktop keyboard indicator bar
  if (!isTouchDevice) {
    return (
      <div className="absolute bottom-6 left-6 pointer-events-none hidden lg:flex items-center gap-2.5 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-teal-500/30 text-xs font-mono text-slate-300 shadow-[0_6px_20px_rgba(0,0,0,0.6)]">
        <span className="font-black text-white bg-slate-800 px-2 py-0.5 rounded border border-white/20 shadow-inner">WASD</span>
        <span className="text-slate-300 font-bold">MOVE</span>
        <span className="text-slate-600 font-black">•</span>
        <span className="font-black text-white bg-slate-800 px-2 py-0.5 rounded border border-white/20 shadow-inner">SPACE</span>
        <span className="text-slate-300 font-bold">JUMP</span>
        <span className="text-slate-600 font-black">•</span>
        <span className="font-black text-teal-400 bg-slate-800 px-2 py-0.5 rounded border border-teal-400/30 shadow-inner">SHIFT</span>
        <span className="text-teal-300 font-bold">SPRINT</span>
        <span className="text-slate-600 font-black">•</span>
        <span className="font-black text-amber-400 bg-slate-800 px-2 py-0.5 rounded border border-amber-400/30 shadow-inner">E</span>
        <span className="text-amber-300 font-bold">TALK</span>
      </div>
    );
  }

  // =========================================================================
  // HANDHELD ARCADE TOUCH CONTROLLER (MOBILE & TABLET)
  // =========================================================================
  return (
    <div className="fixed inset-0 pointer-events-none z-20 select-none touch-none">
      {/* Unified Cross Virtual D-Pad (Left Bottom) */}
      <div
        className="absolute bottom-12 left-4 sm:bottom-14 sm:left-6 pointer-events-auto flex items-center justify-center w-36 h-36"
        style={{ bottom: "max(2.5rem, calc(env(safe-area-inset-bottom, 0px) + 1.5rem))" }}
      >
        {/* D-Pad Base Circle Ring */}
        <div className="relative w-32 h-32 rounded-full bg-slate-950/80 border-2 border-teal-500/30 backdrop-blur-sm shadow-[0_8px_25px_rgba(0,0,0,0.8)] flex items-center justify-center">
          {/* Central Pivot Hub */}
          <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 shadow-inner flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-teal-400/50" />
          </div>

          {/* Up Button */}
          <button
            type="button"
            onTouchStart={(e) => { e.preventDefault(); setInput("forward", true); }}
            onTouchEnd={(e) => { e.preventDefault(); setInput("forward", false); }}
            onTouchCancel={() => setInput("forward", false)}
            onMouseDown={() => setInput("forward", true)}
            onMouseUp={() => setInput("forward", false)}
            className="absolute top-1 left-10 w-12 h-11 rounded-t-xl bg-slate-900/90 active:bg-teal-500 border-t border-x border-white/20 active:border-teal-300 flex items-center justify-center text-teal-300 active:text-slate-950 shadow transition-all touch-none select-none cursor-pointer"
            aria-label="Forward"
          >
            <ArrowUp className="w-6 h-6" />
          </button>

          {/* Down Button */}
          <button
            type="button"
            onTouchStart={(e) => { e.preventDefault(); setInput("backward", true); }}
            onTouchEnd={(e) => { e.preventDefault(); setInput("backward", false); }}
            onTouchCancel={() => setInput("backward", false)}
            onMouseDown={() => setInput("backward", true)}
            onMouseUp={() => setInput("backward", false)}
            className="absolute bottom-1 left-10 w-12 h-11 rounded-b-xl bg-slate-900/90 active:bg-teal-500 border-b border-x border-white/20 active:border-teal-300 flex items-center justify-center text-teal-300 active:text-slate-950 shadow transition-all touch-none select-none cursor-pointer"
            aria-label="Backward"
          >
            <ArrowDown className="w-6 h-6" />
          </button>

          {/* Left Button */}
          <button
            type="button"
            onTouchStart={(e) => { e.preventDefault(); setInput("left", true); }}
            onTouchEnd={(e) => { e.preventDefault(); setInput("left", false); }}
            onTouchCancel={() => setInput("left", false)}
            onMouseDown={() => setInput("left", true)}
            onMouseUp={() => setInput("left", false)}
            className="absolute top-10 left-1 w-11 h-12 rounded-l-xl bg-slate-900/90 active:bg-teal-500 border-l border-y border-white/20 active:border-teal-300 flex items-center justify-center text-teal-300 active:text-slate-950 shadow transition-all touch-none select-none cursor-pointer"
            aria-label="Left"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          {/* Right Button */}
          <button
            type="button"
            onTouchStart={(e) => { e.preventDefault(); setInput("right", true); }}
            onTouchEnd={(e) => { e.preventDefault(); setInput("right", false); }}
            onTouchCancel={() => setInput("right", false)}
            onMouseDown={() => setInput("right", true)}
            onMouseUp={() => setInput("right", false)}
            className="absolute top-10 right-1 w-11 h-12 rounded-r-xl bg-slate-900/90 active:bg-teal-500 border-r border-y border-white/20 active:border-teal-300 flex items-center justify-center text-teal-300 active:text-slate-950 shadow transition-all touch-none select-none cursor-pointer"
            aria-label="Right"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Ergonomic Circular Arcade Action Buttons (Right Bottom) */}
      <div
        className="absolute bottom-12 right-4 sm:bottom-14 sm:right-6 pointer-events-auto flex items-end gap-3"
        style={{ bottom: "max(2.5rem, calc(env(safe-area-inset-bottom, 0px) + 1.5rem))" }}
      >
        {/* Sprint / Nitro Dash Button (B) */}
        <button
          type="button"
          onTouchStart={(e) => { e.preventDefault(); setInput("boost", true); }}
          onTouchEnd={(e) => { e.preventDefault(); setInput("boost", false); }}
          onTouchCancel={() => setInput("boost", false)}
          onMouseDown={() => setInput("boost", true)}
          onMouseUp={() => setInput("boost", false)}
          className="w-13 h-13 sm:w-15 sm:h-15 rounded-full bg-gradient-to-tr from-teal-600 to-cyan-400 border-t border-white/50 border-b-4 border-teal-900 shadow-[0_6px_20px_rgba(20,184,166,0.4)] active:border-b-0 active:translate-y-1 flex items-center justify-center text-slate-950 font-black transition-all touch-none select-none cursor-pointer"
          aria-label="Sprint Boost (B)"
        >
          <Zap className="w-6 h-6 fill-current" />
        </button>

        {/* Jump Button (A) */}
        <button
          type="button"
          onTouchStart={(e) => { e.preventDefault(); setInput("jump", true); }}
          onTouchEnd={(e) => { e.preventDefault(); setInput("jump", false); }}
          onTouchCancel={() => setInput("jump", false)}
          onMouseDown={() => setInput("jump", true)}
          onMouseUp={() => setInput("jump", false)}
          className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-300 border-t border-white/60 border-b-[5px] border-emerald-900 shadow-[0_8px_25px_rgba(16,185,129,0.45)] active:border-b-0 active:translate-y-1 flex items-center justify-center text-slate-950 font-black transition-all touch-none select-none cursor-pointer"
          aria-label="Jump (A)"
        >
          <ArrowBigUp className="w-8 h-8 fill-current" />
        </button>
      </div>
    </div>
  );
};
