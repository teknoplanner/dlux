import React from "react";
import { Gamepad2, Play, Sparkles } from "lucide-react";

export const SceneFallback: React.FC = () => {
  return (
    <div className="relative w-full h-[460px] md:h-[540px] flex items-center justify-center overflow-hidden select-none bg-[#0a0d1a] rounded-3xl border border-white/10">
      {/* Subtle Structural Console Silhouette */}
      <div className="relative w-80 h-52 sm:w-96 sm:h-60 rounded-3xl bg-[#121628] border-2 border-cyan-500/30 p-4 shadow-2xl flex flex-col justify-between">
        {/* Top Console Bar */}
        <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 border-b border-white/10 pb-2">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <Gamepad2 className="w-4 h-4" />
            <span>D LUCKY X CONSOLE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>60 FPS</span>
          </div>
        </div>

        {/* Center Screen Mock */}
        <div className="flex-1 my-3 rounded-xl bg-[#070912] border border-cyan-500/20 p-4 flex flex-col items-center justify-center text-center space-y-2">
          <span className="text-[10px] uppercase font-mono tracking-wider text-pink-400 font-semibold">
            OFFICIAL ANDROID STUDIO
          </span>
          <h4 className="text-base sm:text-lg font-bold text-white font-display">
            Stickman • Milo • PDF Editor &bull; Kucing Duit
          </h4>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Play className="w-3 h-3 fill-current" />
            <span>Google Play Ready</span>
          </div>
        </div>

        {/* Bottom Status */}
        <div className="flex items-center justify-between text-[10px] font-mono text-gray-500">
          <span>PORTAL READY</span>
          <div className="flex items-center gap-1 text-amber-400">
            <Sparkles className="w-3 h-3" />
            <span>7 APLIKASI AKTIF</span>
          </div>
        </div>
      </div>
    </div>
  );
};
