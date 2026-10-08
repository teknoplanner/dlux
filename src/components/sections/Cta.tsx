import React from "react";
import { Play, Gamepad2, ArrowRight } from "lucide-react";
import { developer } from "@/data/apps";
import { Button } from "@/components/ui/Button";

export const Cta: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-cyan-900/30 border border-white/15 p-10 sm:p-16 backdrop-blur-2xl text-center relative overflow-hidden shadow-2xl">
          {/* Ambient Lighting */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-cyan-300">
              <Gamepad2 className="w-4 h-4" />
              TERSEDIA GRATIS DI GOOGLE PLAY
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight leading-tight">
              Siap Bermain &amp; Melatih Otak Bersama{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                D Lucky X?
              </span>
            </h2>

            <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Unduh sekarang di Google Play Store dan rasakan keseruan bermain aksi penalti stickman, petualangan luar angkasa kucing Milo, atau latihan berhitung bersama monster!
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button
                href={developer.playStoreUrl}
                external
                variant="primary"
                size="lg"
                className="shadow-purple-500/30"
              >
                <Play className="w-5 h-5 fill-current" />
                Download di Google Play
              </Button>

              <Button
                href="#apps"
                variant="outline"
                size="lg"
                className="group"
              >
                Pilih Game Favorit
                <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
