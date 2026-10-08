import React from "react";
import { Download, Star, Smartphone, ShieldCheck } from "lucide-react";
import { apps } from "@/data/apps";

export const Stats: React.FC = () => {
  const totalApps = apps.length;

  const validRatings = apps.filter((a) => a.rating !== undefined);
  const avgRating =
    validRatings.length > 0
      ? (
          validRatings.reduce((sum, a) => sum + (a.rating || 0), 0) /
          validRatings.length
        ).toFixed(1)
      : "4.9";

  return (
    <section className="py-8 border-y border-white/10 bg-[#0e101a] relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {/* Stat 1: Total Apps */}
          <div className="flex items-center gap-3.5 pt-3 md:pt-0 md:px-6 first:pt-0">
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold font-display text-white">
                {totalApps}
              </div>
              <div className="text-xs text-gray-400 font-medium">Aplikasi &amp; Game</div>
            </div>
          </div>

          {/* Stat 2: Total Downloads */}
          <div className="flex items-center gap-3.5 pt-3 md:pt-0 md:px-6">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
              <Download className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-2xl font-bold font-display text-white">
                4,000+
              </div>
              <div className="text-xs text-gray-400 font-medium">Total Unduhan</div>
            </div>
          </div>

          {/* Stat 3: Average Rating */}
          <div className="flex items-center gap-3.5 pt-3 md:pt-0 md:px-6">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <div className="text-2xl font-bold font-display text-white">
                {avgRating} <span className="text-xs font-normal text-gray-400">/ 5.0</span>
              </div>
              <div className="text-xs text-gray-400 font-medium">Rating Toko</div>
            </div>
          </div>

          {/* Stat 4: Safe for All */}
          <div className="flex items-center gap-3.5 pt-3 md:pt-0 md:px-6">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-2xl font-bold font-display text-white">
                100%
              </div>
              <div className="text-xs text-gray-400 font-medium">Terverifikasi Aman</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
