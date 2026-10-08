import React from "react";
import { Gamepad2, Sparkles } from "lucide-react";

export const SceneFallback: React.FC = () => {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden select-none">
      {/* Background Neon Orbs */}
      <div className="absolute w-72 h-72 rounded-full bg-purple-600/25 blur-3xl animate-pulse" />
      <div
        className="absolute w-64 h-64 rounded-full bg-cyan-500/20 blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute w-56 h-56 rounded-full bg-pink-500/15 blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      {/* Futuristic Concentric Rings */}
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border border-purple-500/30 border-dashed animate-spin [animation-duration:30s] flex items-center justify-center" />

        {/* Middle Ring */}
        <div className="absolute w-48 h-48 md:w-60 md:h-60 rounded-full border border-cyan-400/30 border-t-cyan-400 animate-spin [animation-duration:15s] flex items-center justify-center" />

        {/* Inner Glass Sphere */}
        <div className="absolute w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-purple-600/40 via-indigo-600/30 to-cyan-500/40 backdrop-blur-md border border-white/20 shadow-2xl shadow-purple-500/30 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-[#0b0b18]/80 flex flex-col items-center justify-center border border-white/10">
            <Gamepad2 className="w-8 h-8 text-cyan-400 animate-bounce" />
          </div>
        </div>

        {/* Orbiting Sparkles */}
        <div className="absolute -top-4 right-12 text-cyan-300 animate-pulse">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="absolute -bottom-2 left-10 text-pink-400 animate-pulse">
          <Sparkles className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
