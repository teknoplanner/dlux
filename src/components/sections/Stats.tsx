import React from "react";
import { Smartphone, Layers, ShieldCheck, HeartHandshake } from "lucide-react";
import { apps } from "@/data/apps";

export const Stats: React.FC = () => {
  const totalApps = apps.length;

  return (
    <section className="py-8 border-y border-slate-200 bg-white relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {/* Stat 1: Total Apps */}
          <div className="flex items-center gap-3.5 pt-3 md:pt-0 md:px-6 first:pt-0">
            <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold font-display text-slate-900">
                {totalApps} Karya
              </div>
              <div className="text-xs text-slate-500 font-medium">Koleksi Android</div>
            </div>
          </div>

          {/* Stat 2: Kategori Utama */}
          <div className="flex items-center gap-3.5 pt-3 md:pt-0 md:px-6">
            <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <div className="text-2xl font-bold font-display text-slate-900">
                3 Bidang
              </div>
              <div className="text-xs text-slate-500 font-medium">Game, Alat &amp; Edukasi</div>
            </div>
          </div>

          {/* Stat 3: Bebas Iklan Invasif */}
          <div className="flex items-center gap-3.5 pt-3 md:pt-0 md:px-6">
            <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold font-display text-slate-900">
                Ramah
              </div>
              <div className="text-xs text-slate-500 font-medium">Keluarga &amp; Anak</div>
            </div>
          </div>

          {/* Stat 4: Privasi Terjaga */}
          <div className="flex items-center gap-3.5 pt-3 md:pt-0 md:px-6">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold font-display text-slate-900">
                100%
              </div>
              <div className="text-xs text-slate-500 font-medium">Privasi Terlindungi</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
