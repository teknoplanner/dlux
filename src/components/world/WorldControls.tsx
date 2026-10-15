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

  // Desktop keyboard indicator bar (Floating cleanly at bottom-left)
  if (!isTouchDevice) {
    return (
      <div
        className="fixed pointer-events-none hidden lg:flex items-center gap-2.5 bg-[#fffdf6]/95 backdrop-blur-md border-2 border-[#5c3e21] shadow-[0_4px_0_#3e2723] px-4 py-2 rounded-2xl text-xs font-mono text-[#3e2723] select-none z-20"
        style={{
          bottom: "max(1.5rem, calc(env(safe-area-inset-bottom, 0px) + 1.25rem))",
          left: "max(1.5rem, calc(env(safe-area-inset-left, 0px) + 1.25rem))",
        }}
      >
        <span className="font-black text-[#3e2723] bg-[#fef08a] px-2 py-0.5 rounded-lg border border-[#854d0e] shadow-xs">WASD</span>
        <span className="text-[#3e2723] font-bold">MOVE</span>
        <span className="text-[#854d0e] font-black">•</span>
        <span className="font-black text-[#3e2723] bg-[#fef08a] px-2 py-0.5 rounded-lg border border-[#854d0e] shadow-xs">SPACE</span>
        <span className="text-[#3e2723] font-bold">JUMP</span>
        <span className="text-[#854d0e] font-black">•</span>
        <span className="font-black text-[#047857] bg-[#dcfce7] px-2 py-0.5 rounded-lg border border-[#16a34a] shadow-xs">SHIFT</span>
        <span className="text-[#047857] font-bold">SPRINT</span>
        <span className="text-[#854d0e] font-black">•</span>
        <span className="font-black text-[#92400e] bg-[#fef08a] px-2 py-0.5 rounded-lg border border-[#ca8a04] shadow-xs">E</span>
        <span className="text-[#92400e] font-bold">TALK</span>
        <span className="text-[#854d0e] font-black">•</span>
        <span className="font-black text-[#0284c7] bg-[#e0f2fe] px-2 py-0.5 rounded-lg border border-[#0284c7] shadow-xs">M</span>
        <span className="text-[#0284c7] font-bold">MAP</span>
      </div>
    );
  }

  // =========================================================================
  // PAPER UI KIT TOUCH CONTROLLER (RESPONSIVE MOBILE PHONE & TABLET)
  // =========================================================================
  return (
    <div className="fixed inset-0 pointer-events-none z-20 select-none touch-none">
      
      {/* ===================================================================== */}
      {/* Ergonomic Virtual D-Pad (Left Bottom Thumb Zone)                      */}
      {/* ===================================================================== */}
      <div
        className="fixed pointer-events-auto flex items-center justify-center w-36 h-36 sm:w-44 sm:h-44"
        style={{
          bottom: "max(1.25rem, calc(env(safe-area-inset-bottom, 0px) + 0.75rem))",
          left: "max(1rem, calc(env(safe-area-inset-left, 0px) + 0.5rem))",
        }}
      >
        {/* D-Pad Base Paper Ring */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-[#fffdf6] border-[3px] border-[#5c3e21] shadow-[0_6px_0_#3e2723] flex items-center justify-center">
          
          {/* Central Pivot Hub */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#fef08a] border-2 border-[#854d0e] shadow-inner flex items-center justify-center pointer-events-none">
            <div className="w-3.5 h-3.5 rounded-full bg-[#854d0e]/60" />
          </div>

          {/* Up Button */}
          <button
            type="button"
            onTouchStart={(e) => { e.preventDefault(); setInput("forward", true); }}
            onTouchEnd={(e) => { e.preventDefault(); setInput("forward", false); }}
            onTouchCancel={() => setInput("forward", false)}
            onMouseDown={() => setInput("forward", true)}
            onMouseUp={() => setInput("forward", false)}
            className="absolute top-1 left-9 sm:left-12 w-14 sm:w-16 h-11 sm:h-14 rounded-t-2xl bg-[#fefce8] active:bg-[#fde047] border-t-2 border-x-2 border-[#5c3e21] flex items-center justify-center text-[#5c3e21] shadow-xs active:shadow-none transition-all touch-none select-none cursor-pointer p-2"
            aria-label="Move Forward"
          >
            <img
              src="/assets/ui/paper/Icons/GameIcons/IconArrow.png"
              alt="Up"
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain -rotate-90 select-none pointer-events-none drop-shadow-xs"
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
            className="absolute bottom-1 left-9 sm:left-12 w-14 sm:w-16 h-11 sm:h-14 rounded-b-2xl bg-[#fefce8] active:bg-[#fde047] border-b-2 border-x-2 border-[#5c3e21] flex items-center justify-center text-[#5c3e21] shadow-xs active:shadow-none transition-all touch-none select-none cursor-pointer p-2"
            aria-label="Move Backward"
          >
            <img
              src="/assets/ui/paper/Icons/GameIcons/IconArrow.png"
              alt="Down"
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain rotate-90 select-none pointer-events-none drop-shadow-xs"
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
            className="absolute top-9 sm:top-12 left-1 w-11 sm:w-14 h-14 sm:h-16 rounded-l-2xl bg-[#fefce8] active:bg-[#fde047] border-l-2 border-y-2 border-[#5c3e21] flex items-center justify-center text-[#5c3e21] shadow-xs active:shadow-none transition-all touch-none select-none cursor-pointer p-2"
            aria-label="Turn Left"
          >
            <img
              src="/assets/ui/paper/Icons/GameIcons/IconArrow.png"
              alt="Left"
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain rotate-180 select-none pointer-events-none drop-shadow-xs"
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
            className="absolute top-9 sm:top-12 right-1 w-11 sm:w-14 h-14 sm:h-16 rounded-r-2xl bg-[#fefce8] active:bg-[#fde047] border-r-2 border-y-2 border-[#5c3e21] flex items-center justify-center text-[#5c3e21] shadow-xs active:shadow-none transition-all touch-none select-none cursor-pointer p-2"
            aria-label="Turn Right"
          >
            <img
              src="/assets/ui/paper/Icons/GameIcons/IconArrow.png"
              alt="Right"
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain select-none pointer-events-none drop-shadow-xs"
              draggable={false}
            />
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* Ergonomic Action Buttons (Right Bottom Thumb Zone)                    */}
      {/* ===================================================================== */}
      <div
        className="fixed pointer-events-auto flex items-end gap-3 sm:gap-4"
        style={{
          bottom: "max(1.25rem, calc(env(safe-area-inset-bottom, 0px) + 0.75rem))",
          right: "max(1rem, calc(env(safe-area-inset-right, 0px) + 0.5rem))",
        }}
      >
        {/* Sprint / Nitro Dash Button (B) */}
        <button
          type="button"
          onTouchStart={(e) => { e.preventDefault(); setInput("boost", true); }}
          onTouchEnd={(e) => { e.preventDefault(); setInput("boost", false); }}
          onTouchCancel={() => setInput("boost", false)}
          onMouseDown={() => setInput("boost", true)}
          onMouseUp={() => setInput("boost", false)}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#f59e0b] active:bg-[#d97706] border-[3px] border-[#b45309] shadow-[0_5px_0_#78350f] active:shadow-none active:translate-y-1 flex flex-col items-center justify-center text-white font-black transition-all touch-none select-none cursor-pointer group shrink-0"
          aria-label="Sprint Nitro (B)"
        >
          <span className="text-sm sm:text-base font-black leading-none drop-shadow">⚡ B</span>
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#78350f] mt-0.5">DASH</span>
        </button>

        {/* Jump Button (A) */}
        <button
          type="button"
          onTouchStart={(e) => { e.preventDefault(); setInput("jump", true); }}
          onTouchEnd={(e) => { e.preventDefault(); setInput("jump", false); }}
          onTouchCancel={() => setInput("jump", false)}
          onMouseDown={() => setInput("jump", true)}
          onMouseUp={() => setInput("jump", false)}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#22c55e] active:bg-[#16a34a] border-[3px] sm:border-4 border-[#15803d] shadow-[0_6px_0_#14532d] active:shadow-none active:translate-y-1 flex flex-col items-center justify-center text-white font-black transition-all touch-none select-none cursor-pointer group shrink-0"
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
