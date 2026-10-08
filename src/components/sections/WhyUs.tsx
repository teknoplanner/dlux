import React from "react";
import { Zap, WifiOff, Baby, Smartphone } from "lucide-react";

export const WhyUs: React.FC = () => {
  const reasons = [
    {
      icon: <Zap className="w-5 h-5 text-cyan-400" />,
      title: "Ringan & Hemat Penyimpanan",
      desc: "Ukuran file hemat memori (rata-rata di bawah 30 MB), cepat diunduh dan tidak membebani kapasitas RAM smartphone Anda.",
    },
    {
      icon: <WifiOff className="w-5 h-5 text-purple-400" />,
      title: "Bisa Dimainkan Offline",
      desc: "Game dan aplikasi dirancang agar tetap dapat berfungsi penuh tanpa ketergantungan kuota data internet.",
    },
    {
      icon: <Baby className="w-5 h-5 text-pink-400" />,
      title: "Aman untuk Seluruh Keluarga",
      desc: "Aplikasi edukasi anak mematuhi kebijakan ketat Google Play Families, tanpa konten negatif atau iklan invasif.",
    },
    {
      icon: <Smartphone className="w-5 h-5 text-emerald-400" />,
      title: "Kompatibel di Berbagai HP",
      desc: "Dioptimalkan agar berjalan stabil di aneka tipe smartphone Android, dari perangkat entry-level hingga flagship.",
    },
  ];

  return (
    <section className="py-20 relative bg-[#070913]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400">
            <span>STANDAR KUALITAS STUDIO</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
            Keunggulan Aplikasi D Lucky X
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Standar teknis yang kami terapkan agar setiap unduhan memberi kenyamanan maksimal untuk pengguna.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {reasons.map((item, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-[#0e1224] border border-slate-800 hover:border-slate-700 transition-all duration-200 shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="text-base font-bold text-white mb-2 font-display">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
