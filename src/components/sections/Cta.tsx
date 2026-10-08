import React from "react";
import { Play, ArrowRight } from "lucide-react";
import { developer } from "@/data/apps";
import { Button } from "@/components/ui/Button";

export const Cta: React.FC = () => {
  return (
    <section className="py-20 relative bg-[#07080d] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl bg-[#111320] border border-white/10 p-8 sm:p-14 text-center relative overflow-hidden shadow-xl">
          <div className="max-w-2xl mx-auto space-y-5 relative z-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Tersedia Gratis di Google Play Store
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
              Temukan Aplikasi &amp; Game Favorit Anda
            </h2>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Jelajahi seluruh karya D Lucky X di Google Play Store. Unduh gratis dan nikmati pengalaman bermain serta aplikasi produktivitas yang aman untuk Anda dan keluarga.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <Button
                href={developer.playStoreUrl}
                external
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Play className="w-4 h-4 fill-current" />
                Buka Halaman Pengembang Google Play
              </Button>

              <Button
                href="#apps"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                Pilih Aplikasi
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
