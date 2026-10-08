import React from "react";
import { Zap, WifiOff, Baby, Smartphone } from "lucide-react";

export const WhyUs: React.FC = () => {
  const reasons = [
    {
      icon: <Zap className="w-5 h-5 text-sky-600" />,
      title: "Ringan & Hemat Penyimpanan",
      desc: "Ukuran berkas hemat memori, cepat diunduh dan tidak membebani kapasitas RAM smartphone Anda.",
    },
    {
      icon: <WifiOff className="w-5 h-5 text-purple-600" />,
      title: "Bisa Digunakan Penuh Offline",
      desc: "Sebagian besar game dan aplikasi dirancang agar tetap berfungsi penuh tanpa ketergantungan kuota internet.",
    },
    {
      icon: <Baby className="w-5 h-5 text-pink-600" />,
      title: "Aman untuk Seluruh Keluarga",
      desc: "Aplikasi edukasi anak mematuhi kebijakan Google Play Families, bebas konten tidak pantas dan iklan invasif.",
    },
    {
      icon: <Smartphone className="w-5 h-5 text-emerald-600" />,
      title: "Kompatibel di Berbagai HP",
      desc: "Dioptimalkan agar berjalan stabil di aneka tipe smartphone Android, dari perangkat entry-level hingga flagship.",
    },
  ];

  return (
    <section className="py-20 relative bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-sm">
            <span>STANDAR KUALITAS KAMI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
            Keunggulan Aplikasi D Lucky X
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Standar teknis dan kenyamanan yang kami terapkan agar setiap aplikasi memberi pengalaman memuaskan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {reasons.map((item, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all duration-200 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 font-display">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
