import React from "react";
import Link from "next/link";
import { Gamepad2, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-24 pb-16 px-4 relative overflow-hidden">
      {/* Background neon blur */}
      <div className="absolute w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-md w-full text-center space-y-6 relative z-10">
        <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-pink-400 shadow-2xl shadow-pink-500/20">
          <Gamepad2 className="w-10 h-10 animate-bounce" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-sm uppercase tracking-widest text-cyan-400 font-bold">
            ERROR 404
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-white">
            Level Tidak Ditemukan!
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            Halaman atau game yang Anda cari mungkin telah berpindah lokasi atau belum dirilis.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button href="/" variant="primary" size="md" className="w-full sm:w-auto">
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Button>
          <Button href="/#apps" variant="outline" size="md" className="w-full sm:w-auto">
            <Gamepad2 className="w-4 h-4 text-cyan-400" />
            Koleksi Game
          </Button>
        </div>
      </div>
    </div>
  );
}
