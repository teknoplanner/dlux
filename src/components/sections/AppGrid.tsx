"use client";

import React, { useState } from "react";
import { apps } from "@/data/apps";
import { AppCard } from "@/components/app/AppCard";

const tabs = [
  ["all", "All"],
  ["game", "Games"],
  ["tool", "Tools"],
  ["education", "Education"],
] as const;

export const AppGrid: React.FC = () => {
  const [active, setActive] = useState<(typeof tabs)[number][0]>("all");
  const count = (key: string) => (key === "all" ? apps.length : apps.filter((a) => a.category === key).length);
  const list = active === "all" ? apps : apps.filter((a) => a.category === active);

  return (
    <section id="apps" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 tracking-tight mb-6">
          Android games and apps
        </h2>

        <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter apps by category">
          {tabs.map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={active === key}
              onClick={() => setActive(key)}
              className={`min-h-[44px] px-4 rounded-lg text-sm font-bold border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
                active === key
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-800 border-slate-300 hover:bg-slate-100"
              }`}
            >
              {label} ({count(key)})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((app) => (
            <AppCard key={app.slug} app={app} />
          ))}
        </div>
      </div>
    </section>
  );
};
