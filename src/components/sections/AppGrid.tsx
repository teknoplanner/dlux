"use client";

import React, { useState } from "react";
import { Gamepad2, GraduationCap, LayoutGrid } from "lucide-react";
import { apps } from "@/data/apps";
import { AppCard } from "@/components/app/AppCard";

export const AppGrid: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<"all" | "game" | "education">("all");

  const filteredApps = apps.filter((app) => {
    if (activeCategory === "all") return true;
    return app.category === activeCategory;
  });

  const gameCount = apps.filter((a) => a.category === "game").length;
  const eduCount = apps.filter((a) => a.category === "education").length;

  return (
    <section id="apps" className="py-24 relative overflow-hidden">
      {/* Background glow lights */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300">
            <Gamepad2 className="w-4 h-4" />
            SHOWCASE GAMEPLAY
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight">
            Katalog Game &amp; Aplikasi{" "}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Android
            </span>
          </h2>

          <p className="text-base text-gray-300 leading-relaxed">
            Jelajahi karya orisinal D Lucky X. Setiap game dan aplikasi dirancang dengan penuh dedikasi untuk menghadirkan hiburan yang menyenangkan, mendidik, dan berkualitas.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            <button
              onClick={() => setActiveCategory("all")}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeCategory === "all"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/30"
                  : "bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08] border border-white/10"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Semua ({apps.length})
            </button>

            <button
              onClick={() => setActiveCategory("game")}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeCategory === "game"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/30"
                  : "bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08] border border-white/10"
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              Game Seru ({gameCount})
            </button>

            <button
              onClick={() => setActiveCategory("education")}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeCategory === "education"
                  ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/30 border border-cyan-400/30"
                  : "bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08] border border-white/10"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Edukasi ({eduCount})
            </button>
          </div>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
