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
      : "5.0";

  return (
    <section className="py-10 border-y border-white/10 bg-white/[0.02] backdrop-blur-md relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {/* Stat 1: Total Apps */}
          <div className="flex items-center gap-4 pt-4 md:pt-0 md:px-6 first:pt-0">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
              <Smartphone className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                {totalApps}
              </div>
              <div className="text-xs text-muted font-medium">Aplikasi &amp; Game Rilis</div>
            </div>
          </div>

          {/* Stat 2: Total Downloads */}
          <div className="flex items-center gap-4 pt-4 md:pt-0 md:px-6">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
              <Download className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                3,500+
              </div>
              <div className="text-xs text-muted font-medium">Total Unduhan Pengguna</div>
            </div>
          </div>

          {/* Stat 3: Average Rating */}
          <div className="flex items-center gap-4 pt-4 md:pt-0 md:px-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                {avgRating} <span className="text-sm font-normal text-muted">/ 5.0</span>
              </div>
              <div className="text-xs text-muted font-medium">Rating Rata-Rata Store</div>
            </div>
          </div>

          {/* Stat 4: Kid Safe */}
          <div className="flex items-center gap-4 pt-4 md:pt-0 md:px-6">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                100%
              </div>
              <div className="text-xs text-muted font-medium">Aman untuk Semua Usia</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
