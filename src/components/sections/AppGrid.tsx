"use client";

import React, { useState } from "react";
import { Gamepad2, GraduationCap, Wrench, LayoutGrid } from "lucide-react";
import { apps } from "@/data/apps";
import { AppCard } from "@/components/app/AppCard";

export const AppGrid: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<"all" | "game" | "education" | "tool">("all");

  const filteredApps = apps.filter((app) => {
    if (activeCategory === "all") return true;
    return app.category === activeCategory;
  });

  const gameCount = apps.filter((a) => a.category === "game").length;
  const eduCount = apps.filter((a) => a.category === "education").length;
  const toolCount = apps.filter((a) => a.category === "tool").length;

  return (
    <section id="apps" className="py-20 relative bg-[#070913]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400">
            <span>KATALOG RESMI GOOGLE PLAY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
            Koleksi Game &amp; Aplikasi Kami
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Pilih game adu penalti, petualangan kucing, edukasi matematika anak, atau alat produktivitas seperti editor PDF offline dan pengatur keuangan harian.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-4">
            <button
              onClick={() => setActiveCategory("all")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeCategory === "all"
                  ? "bg-white text-slate-950 shadow-md font-bold"
                  : "bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Semua Karya ({apps.length})
            </button>

            <button
              onClick={() => setActiveCategory("game")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeCategory === "game"
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20 font-bold"
                  : "bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800"
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-emerald-400" />
              Game Android ({gameCount})
            </button>

            <button
              onClick={() => setActiveCategory("tool")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeCategory === "tool"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold"
                  : "bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800"
              }`}
            >
              <Wrench className="w-4 h-4 text-cyan-400" />
              Alat &amp; Utilitas ({toolCount})
            </button>

            <button
              onClick={() => setActiveCategory("education")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeCategory === "education"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/20 font-bold"
                  : "bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800"
              }`}
            >
              <GraduationCap className="w-4 h-4 text-purple-400" />
              Edukasi Anak ({eduCount})
            </button>
          </div>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredApps.map((app) => (
            <div key={app.slug} className="h-full">
              <AppCard app={app} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
