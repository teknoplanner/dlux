import React from "react";
import { Play, ArrowRight, Gamepad2 } from "lucide-react";
import { developer } from "@/data/apps";
import { Button } from "@/components/ui/Button";

export const Cta: React.FC = () => {
  return (
    <section className="py-20 relative bg-[#070913] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl bg-[#0e1224] border border-cyan-500/20 p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400">
              <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>TERSEDIA GRATIS DI GOOGLE PLAY STORE</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
              Temukan Game &amp; Aplikasi Favorit Anda
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Jelajahi seluruh karya D Lucky X di Google Play Store. Unduh gratis dan nikmati pengalaman bermain yang mengasyikkan serta aplikasi produktivitas yang aman untuk Anda dan keluarga.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <Button
                href={developer.playStoreUrl}
                external
                variant="primary"
                size="lg"
                className="w-full sm:w-auto shadow-lg shadow-emerald-600/20"
              >
                <Play className="w-4 h-4 fill-current" />
                Buka Halaman Pengembang Google Play
              </Button>

              <Button
                href="#apps"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-slate-700 hover:border-slate-500"
              >
                Pilih Aplikasi
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
