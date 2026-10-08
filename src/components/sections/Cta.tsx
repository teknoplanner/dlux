import React from "react";
import { Play, ArrowRight, Gamepad2 } from "lucide-react";
import { developer } from "@/data/apps";
import { Button } from "@/components/ui/Button";

export const Cta: React.FC = () => {
  return (
    <section className="py-20 relative bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-14 text-center relative overflow-hidden shadow-xl">
          <div className="max-w-2xl mx-auto space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-emerald-400">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>TERSEDIA DI GOOGLE PLAY STORE</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
              Mulai Mainkan &amp; Gunakan Aplikasi Kami
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Jelajahi seluruh karya D Lucky X di Google Play Store. Unduh gratis dan nikmati pengalaman bermain game yang seru serta aplikasi produktivitas yang aman untuk Anda dan keluarga.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3">
              <Button
                href={developer.playStoreUrl}
                external
                variant="primary"
                size="lg"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md"
              >
                <Play className="w-4 h-4 fill-current" />
                Kunjungi Google Play
              </Button>

              <Button
                href="#apps"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <span>Lihat Semua Aplikasi</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
