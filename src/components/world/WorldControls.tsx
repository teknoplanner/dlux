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

  // Touch handlers for mobile buttons
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
      <div className="absolute bottom-6 left-6 pointer-events-none hidden md:flex items-center gap-2 bg-slate-950/60 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-xs font-mono text-slate-300 shadow-lg">
        <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-white/20">WASD / ↑↓←→</span>
        <span>Gerak</span>
        <span className="text-slate-600">•</span>
        <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-white/20">SPACE</span>
        <span>Lompat</span>
        <span className="text-slate-600">•</span>
        <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-white/20">SHIFT</span>
        <span>Nitro</span>
        <span className="text-slate-600">•</span>
        <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-white/20">E</span>
        <span>Interaksi</span>
      </div>
    );
  }

  // Mobile On-Screen Virtual Touch Controls
  return (
    <div className="fixed inset-0 pointer-events-none z-30 select-none">
      {/* Left Steering Pad */}
      <div className="absolute bottom-8 left-6 pointer-events-auto flex flex-col items-center gap-2">
        <button
          onTouchStart={() => setInput("forward", true)}
          onTouchEnd={() => setInput("forward", false)}
          className="w-14 h-14 rounded-2xl bg-slate-900/80 active:bg-emerald-600 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl active:scale-95 transition-transform"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
        <div className="flex gap-2">
          <button
            onTouchStart={() => setInput("left", true)}
            onTouchEnd={() => setInput("left", false)}
            className="w-14 h-14 rounded-2xl bg-slate-900/80 active:bg-emerald-600 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button
            onTouchStart={() => setInput("backward", true)}
            onTouchEnd={() => setInput("backward", false)}
            className="w-14 h-14 rounded-2xl bg-slate-900/80 active:bg-emerald-600 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl active:scale-95 transition-transform"
          >
            <ArrowDown className="w-6 h-6" />
          </button>
          <button
            onTouchStart={() => setInput("right", true)}
            onTouchEnd={() => setInput("right", false)}
            className="w-14 h-14 rounded-2xl bg-slate-900/80 active:bg-emerald-600 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl active:scale-95 transition-transform"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Right Action Buttons */}
      <div className="absolute bottom-8 right-6 pointer-events-auto flex flex-col items-end gap-3">
        <button
          onTouchStart={() => setInput("boost", true)}
          onTouchEnd={() => setInput("boost", false)}
          className="w-16 h-16 rounded-full bg-cyan-600/90 active:bg-cyan-500 backdrop-blur-md border border-cyan-300/40 flex items-center justify-center text-white font-bold shadow-xl active:scale-90 transition-transform"
        >
          <Zap className="w-7 h-7 fill-current" />
        </button>
        <button
          onTouchStart={() => setInput("jump", true)}
          onTouchEnd={() => setInput("jump", false)}
          className="w-16 h-16 rounded-full bg-emerald-600/90 active:bg-emerald-500 backdrop-blur-md border border-emerald-300/40 flex items-center justify-center text-white font-bold shadow-xl active:scale-90 transition-transform"
        >
          <ArrowBigUp className="w-8 h-8 fill-current" />
        </button>
      </div>
    </div>
  );
};
