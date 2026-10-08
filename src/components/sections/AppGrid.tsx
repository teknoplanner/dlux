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
    <section id="apps" className="py-20 relative bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500 block">
            Katalog Karya
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
            Game &amp; Aplikasi Android
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
          <button
            onClick={() => setActiveCategory("all")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              activeCategory === "all"
                ? "bg-slate-900 text-white shadow-sm font-bold"
                : "bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Semua ({apps.length})
          </button>

          <button
            onClick={() => setActiveCategory("game")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              activeCategory === "game"
                ? "bg-emerald-600 text-white shadow-sm font-bold"
                : "bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-emerald-400" />
            Game ({gameCount})
          </button>

          <button
            onClick={() => setActiveCategory("tool")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              activeCategory === "tool"
                ? "bg-sky-600 text-white shadow-sm font-bold"
                : "bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            <Wrench className="w-4 h-4 text-sky-400" />
            Alat ({toolCount})
          </button>

          <button
            onClick={() => setActiveCategory("education")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              activeCategory === "education"
                ? "bg-purple-600 text-white shadow-sm font-bold"
                : "bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            <GraduationCap className="w-4 h-4 text-purple-400" />
            Edukasi ({eduCount})
          </button>
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
