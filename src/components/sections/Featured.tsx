"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, Pin, CheckCircle, ArrowRight, Gamepad2, Wrench, GraduationCap, Smartphone, Star, Download } from "lucide-react";
import { apps } from "@/data/apps";
import { Button } from "@/components/ui/Button";
import { ScreenshotCarousel } from "@/components/app/ScreenshotCarousel";

export const Featured: React.FC = () => {
  // Pinned priority: Monster Math: Brain Training as requested
  const pinnedMath = apps.find((a) => a.slug === "monster-math-train-brain") || apps[3];
  const topGame = apps.find((a) => a.slug === "stickman-penalty-rush") || apps[1];
  const topTool = apps.find((a) => a.slug === "offline-pdf-editor") || apps[0];

  const [activeSlug, setActiveSlug] = useState<string>("monster-math-train-brain");

  const currentApp =
    activeSlug === "monster-math-train-brain"
      ? pinnedMath
      : activeSlug === "stickman-penalty-rush"
      ? topGame
      : topTool;

  const getSubcategory = () => {
    if (currentApp.slug === "monster-math-train-brain") return "Math Education & Brain Training";
    if (currentApp.slug === "stickman-penalty-rush") return "Casual Action & Sports";
    return "Document Utility & Privacy";
  };

  const getSubcategoryColor = () => {
    if (currentApp.slug === "monster-math-train-brain") return "text-purple-700";
    if (currentApp.slug === "stickman-penalty-rush") return "text-emerald-700";
    return "text-sky-700";
  };

  return (
    <section id="featured" className="py-20 relative bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header & Spotlight Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-800 mb-3 shadow-2xs">
              <Pin className="w-3.5 h-3.5 text-purple-600 fill-purple-600" />
              <span>FEATURED SPOTLIGHT</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
              Featured Studio Picks
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-xl">
              Our spotlight applications, loved and enjoyed by users on Google Play.
            </p>
          </div>

          {/* Tab Selector: Pinned Monster Math, Game, Tool */}
          <div className="inline-flex p-1 rounded-2xl bg-slate-200/80 border border-slate-300/80 shrink-0">
            <button
              onClick={() => setActiveSlug("monster-math-train-brain")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm transition-all ${
                activeSlug === "monster-math-train-brain"
                  ? "bg-white text-slate-900 shadow-sm font-bold"
                  : "text-slate-700 hover:text-slate-950 font-semibold"
              }`}
            >
              <GraduationCap className="w-4 h-4 text-purple-600" />
              <span>Monster Math</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-800 font-bold ml-0.5">
                Pinned
              </span>
            </button>

            <button
              onClick={() => setActiveSlug("stickman-penalty-rush")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm transition-all ${
                activeSlug === "stickman-penalty-rush"
                  ? "bg-white text-slate-900 shadow-sm font-bold"
                  : "text-slate-700 hover:text-slate-950 font-semibold"
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-emerald-600" />
              <span>Stickman Penalty</span>
            </button>

            <button
              onClick={() => setActiveSlug("offline-pdf-editor")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm transition-all ${
                activeSlug === "offline-pdf-editor"
                  ? "bg-white text-slate-900 shadow-sm font-bold"
                  : "text-slate-700 hover:text-slate-950 font-semibold"
              }`}
            >
              <Wrench className="w-4 h-4 text-sky-600" />
              <span>PDF Editor</span>
            </button>
          </div>
        </div>

        {/* Featured Showcase Card */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Col: Info & Features */}
            <div className="lg:col-span-5 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-100 bg-white shrink-0 shadow-md">
                  <Image
                    src={currentApp.icon}
                    alt={currentApp.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider block mb-1 ${getSubcategoryColor()}`}
                  >
                    {getSubcategory()}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                    {currentApp.name}
                  </h3>
                </div>
              </div>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                {currentApp.tagline}
              </p>

              {/* Feature Checklist */}
              {currentApp.features && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  {currentApp.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-800">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Real Play Store Specs Row */}
              <div className="grid grid-cols-3 gap-3 py-3 border-y border-slate-100 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 text-slate-900 font-bold text-base font-display">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>Android</span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium">Platform</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-slate-900 font-bold text-base font-display">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>{currentApp.rating ? currentApp.rating.toFixed(1) : "5.0"}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    {currentApp.reviewsCount ? `${currentApp.reviewsCount} Reviews` : "Play Store Rating"}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-slate-900 font-bold text-base font-display">
                    <Download className="w-4 h-4 text-sky-600" />
                    <span>{currentApp.downloads}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium">Total Downloads</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  href={currentApp.playUrl}
                  external
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white shadow-sm font-bold"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Get on Google Play
                </Button>
                <Button
                  href={`/apps/${currentApp.slug}`}
                  variant="outline"
                  size="md"
                  className="w-full sm:w-auto bg-white border-slate-300 text-slate-900 hover:bg-slate-50 font-bold"
                >
                  <span>Full Details</span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </Button>
              </div>
            </div>

            {/* Right Col: Screenshot Carousel */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-3 sm:p-4 shadow-inner">
                <ScreenshotCarousel
                  screenshots={currentApp.screenshots}
                  appName={currentApp.name}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
