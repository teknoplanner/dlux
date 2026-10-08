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
    <section id="apps" className="py-20 relative bg-[#0a0b12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
            Koleksi Game &amp; Aplikasi Kami
          </h2>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Pilih game aksi, tantangan puzzle, edukasi balita, atau aplikasi utilitas untuk mempermudah aktivitas harian Anda.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setActiveCategory("all")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeCategory === "all"
                  ? "bg-white text-gray-900 shadow-md"
                  : "bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/10"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Semua ({apps.length})
            </button>

            <button
              onClick={() => setActiveCategory("game")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeCategory === "game"
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                  : "bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/10"
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              Game ({gameCount})
            </button>

            <button
              onClick={() => setActiveCategory("education")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeCategory === "education"
                  ? "bg-purple-500 text-white shadow-md shadow-purple-500/20"
                  : "bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/10"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Edukasi ({eduCount})
            </button>

            <button
              onClick={() => setActiveCategory("tool")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeCategory === "tool"
                  ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
                  : "bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/10"
              }`}
            >
              <Wrench className="w-4 h-4" />
              Aplikasi &amp; Tools ({toolCount})
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
