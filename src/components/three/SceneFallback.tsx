import React from "react";
import { Gamepad2, Sparkles, Box } from "lucide-react";

export const SceneFallback: React.FC = () => {
  return (
    <div className="relative w-full h-[460px] md:h-[540px] flex items-center justify-center overflow-hidden select-none bg-slate-50/80 rounded-3xl border border-slate-200">
      <div className="relative w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 p-6 shadow-md flex flex-col items-center text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
          <Box className="w-6 h-6 text-emerald-600 animate-pulse" />
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500">
            D Lucky X • Panggung 3D
          </span>
          <h4 className="text-base sm:text-lg font-bold text-slate-900 font-display">
            Studio Game &amp; Aplikasi Interaktif
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
            Menampilkan 7 obyek tematik 3D: Stickman, Milo Cat, PDF Editor, Kucing Duit, Monster Math, Fruit Match, dan ABC.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Memuat aset interaktif 3D...</span>
        </div>
      </div>
    </div>
  );
};
