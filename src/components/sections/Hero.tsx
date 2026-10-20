import React from "react";
import { apps, developer } from "@/data/apps";
import { HeroArt } from "./HeroArt";

export const Hero: React.FC = () => {
  return (
    <section className="border-b border-slate-200 bg-[#fafaf9] pt-28 pb-14 sm:pt-32 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        <div className="lg:col-span-7">
          <h1 className="font-display font-bold tracking-tight text-slate-950 text-4xl sm:text-6xl leading-[1.08]">
            Casual games and everyday tools for Android
          </h1>

          <p className="mt-5 max-w-xl text-base sm:text-lg text-slate-700 leading-relaxed">
            D Lucky X is an independent studio from Indonesia. {apps.length} apps on
            Google Play: games, learning apps for kids, and a PDF editor that works offline.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#apps"
              className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            >
              Browse all {apps.length} apps
            </a>
            <a
              href={developer.playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-lg border border-slate-400 text-slate-900 hover:bg-white text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              Open our Google Play page
            </a>
          </div>
        </div>

        <div className="lg:col-span-5">
          <HeroArt />
        </div>
      </div>
    </section>
  );
};
