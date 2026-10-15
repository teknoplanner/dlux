"use client";

import React, { useEffect, useState } from "react";
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
      <div className="absolute bottom-6 left-6 pointer-events-none hidden lg:flex items-center gap-2.5 bg-[#fffdf6] border-2 border-[#5c3e21] shadow-[0_4px_0_#3e2723] px-4 py-2 rounded-2xl text-xs font-mono text-[#3e2723]">
        <span className="font-black text-[#3e2723] bg-[#fef08a] px-2 py-0.5 rounded-lg border border-[#854d0e] shadow-sm">WASD</span>
        <span className="text-[#3e2723] font-bold">MOVE</span>
        <span className="text-[#854d0e] font-black">•</span>
        <span className="font-black text-[#3e2723] bg-[#fef08a] px-2 py-0.5 rounded-lg border border-[#854d0e] shadow-sm">SPACE</span>
        <span className="text-[#3e2723] font-bold">JUMP</span>
        <span className="text-[#854d0e] font-black">•</span>
        <span className="font-black text-[#047857] bg-[#dcfce7] px-2 py-0.5 rounded-lg border border-[#16a34a] shadow-sm">SHIFT</span>
        <span className="text-[#047857] font-bold">SPRINT</span>
        <span className="text-[#854d0e] font-black">•</span>
        <span className="font-black text-[#92400e] bg-[#fef08a] px-2 py-0.5 rounded-lg border border-[#ca8a04] shadow-sm">E</span>
        <span className="text-[#92400e] font-bold">TALK</span>
      </div>
    );
  }

  // =========================================================================
  // PAPER UI KIT TOUCH CONTROLLER (MOBILE & TABLET)
  // =========================================================================
  return (
    <div className="fixed inset-0 pointer-events-none z-20 select-none touch-none">
      {/* Paper Virtual D-Pad (Left Bottom) */}
      <div
        className="absolute bottom-12 left-4 sm:bottom-14 sm:left-6 pointer-events-auto flex items-center justify-center w-36 h-36"
        style={{ bottom: "max(2.5rem, calc(env(safe-area-inset-bottom, 0px) + 1.5rem))" }}
      >
        {/* D-Pad Base Paper Ring */}
        <div className="relative w-32 h-32 rounded-full bg-[#fffdf6] border-3 border-[#5c3e21] shadow-[0_6px_0_#3e2723] flex items-center justify-center">
          {/* Central Pivot Hub */}
          <div className="w-10 h-10 rounded-full bg-[#fef08a] border-2 border-[#854d0e] shadow-inner flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-[#854d0e]/60" />
          </div>

          {/* Up Button */}
          <button
            type="button"
            onTouchStart={(e) => { e.preventDefault(); setInput("forward", true); }}
            onTouchEnd={(e) => { e.preventDefault(); setInput("forward", false); }}
            onTouchCancel={() => setInput("forward", false)}
            onMouseDown={() => setInput("forward", true)}
            onMouseUp={() => setInput("forward", false)}
            className="absolute top-1 left-10 w-12 h-11 rounded-t-xl bg-[#fefce8] active:bg-[#fef08a] border-t-2 border-x-2 border-[#5c3e21] flex items-center justify-center text-[#5c3e21] shadow-sm transition-all touch-none select-none cursor-pointer p-2"
            aria-label="Forward"
          >
            <img
              src="/assets/ui/paper/Icons/GameIcons/IconArrow.png"
              alt="Up"
              className="w-5 h-5 object-contain -rotate-90 select-none pointer-events-none drop-shadow-sm"
              draggable={false}
            />
          </button>

          {/* Down Button */}
          <button
            type="button"
            onTouchStart={(e) => { e.preventDefault(); setInput("backward", true); }}
            onTouchEnd={(e) => { e.preventDefault(); setInput("backward", false); }}
            onTouchCancel={() => setInput("backward", false)}
            onMouseDown={() => setInput("backward", true)}
            onMouseUp={() => setInput("backward", false)}
            className="absolute bottom-1 left-10 w-12 h-11 rounded-b-xl bg-[#fefce8] active:bg-[#fef08a] border-b-2 border-x-2 border-[#5c3e21] flex items-center justify-center text-[#5c3e21] shadow-sm transition-all touch-none select-none cursor-pointer p-2"
            aria-label="Backward"
          >
            <img
              src="/assets/ui/paper/Icons/GameIcons/IconArrow.png"
              alt="Down"
              className="w-5 h-5 object-contain rotate-90 select-none pointer-events-none drop-shadow-sm"
              draggable={false}
            />
          </button>

          {/* Left Button */}
          <button
            type="button"
            onTouchStart={(e) => { e.preventDefault(); setInput("left", true); }}
            onTouchEnd={(e) => { e.preventDefault(); setInput("left", false); }}
            onTouchCancel={() => setInput("left", false)}
            onMouseDown={() => setInput("left", true)}
            onMouseUp={() => setInput("left", false)}
            className="absolute top-10 left-1 w-11 h-12 rounded-l-xl bg-[#fefce8] active:bg-[#fef08a] border-l-2 border-y-2 border-[#5c3e21] flex items-center justify-center text-[#5c3e21] shadow-sm transition-all touch-none select-none cursor-pointer p-2"
            aria-label="Left"
          >
            <img
              src="/assets/ui/paper/Icons/GameIcons/IconArrow.png"
              alt="Left"
              className="w-5 h-5 object-contain rotate-180 select-none pointer-events-none drop-shadow-sm"
              draggable={false}
            />
          </button>

          {/* Right Button */}
          <button
            type="button"
            onTouchStart={(e) => { e.preventDefault(); setInput("right", true); }}
            onTouchEnd={(e) => { e.preventDefault(); setInput("right", false); }}
            onTouchCancel={() => setInput("right", false)}
            onMouseDown={() => setInput("right", true)}
            onMouseUp={() => setInput("right", false)}
            className="absolute top-10 right-1 w-11 h-12 rounded-r-xl bg-[#fefce8] active:bg-[#fef08a] border-r-2 border-y-2 border-[#5c3e21] flex items-center justify-center text-[#5c3e21] shadow-sm transition-all touch-none select-none cursor-pointer p-2"
            aria-label="Right"
          >
            <img
              src="/assets/ui/paper/Icons/GameIcons/IconArrow.png"
              alt="Right"
              className="w-5 h-5 object-contain select-none pointer-events-none drop-shadow-sm"
              draggable={false}
            />
          </button>
        </div>
      </div>

      {/* Ergonomic Circular Paper Action Buttons (Right Bottom) */}
      <div
        className="absolute bottom-12 right-4 sm:bottom-14 sm:right-6 pointer-events-auto flex items-end gap-3.5"
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
          className="w-13 h-13 sm:w-15 sm:h-15 rounded-full bg-[#f59e0b] border-3 border-[#b45309] shadow-[0_5px_0_#78350f] active:shadow-none active:translate-y-1 flex flex-col items-center justify-center text-white font-black transition-all touch-none select-none cursor-pointer group"
          aria-label="Sprint Boost (B)"
        >
          <span className="text-sm sm:text-base font-black leading-none drop-shadow">B</span>
          <span className="text-[8px] font-bold uppercase tracking-wider text-[#78350f] mt-0.5">DASH</span>
        </button>

        {/* Jump Button (A) */}
        <button
          type="button"
          onTouchStart={(e) => { e.preventDefault(); setInput("jump", true); }}
          onTouchEnd={(e) => { e.preventDefault(); setInput("jump", false); }}
          onTouchCancel={() => setInput("jump", false)}
          onMouseDown={() => setInput("jump", true)}
          onMouseUp={() => setInput("jump", false)}
          className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#22c55e] border-3 sm:border-4 border-[#15803d] shadow-[0_6px_0_#14532d] active:shadow-none active:translate-y-1 flex flex-col items-center justify-center text-white font-black transition-all touch-none select-none cursor-pointer group"
          aria-label="Jump (A)"
        >
          <img
            src="/assets/ui/paper/Icons/GameIcons/IconArrow.png"
            alt="Jump"
            className="w-5 h-5 sm:w-6 sm:h-6 object-contain -rotate-90 brightness-200 contrast-200 select-none pointer-events-none drop-shadow"
            draggable={false}
          />
          <span className="text-xs sm:text-sm font-black leading-none uppercase tracking-wide mt-0.5">JUMP</span>
        </button>
      </div>
    </div>
  );
};
