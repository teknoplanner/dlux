import React from "react";
import { Zap, ShieldCheck, Heart } from "lucide-react";

export const About: React.FC = () => {
  const pillars = [
    {
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      title: "Ringan & Cepat",
      desc: "Ukuran berkas hemat memori dan responsif di berbagai tipe smartphone Android.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      title: "Privasi Utuh",
      desc: "Aman untuk keluarga, mematuhi standar Google Play tanpa pelacakan invasif.",
    },
    {
      icon: <Heart className="w-5 h-5 text-rose-500" />,
      title: "Karya Nyata",
      desc: "Game santai yang menyenangkan dan aplikasi praktis untuk kebutuhan harian.",
    },
  ];

  return (
    <section id="about" className="py-20 relative bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500 mb-2 block">
            Filosofi Studio
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
            Fokus pada Kualitas &amp; Pengalaman Pengguna
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left shadow-sm hover:border-slate-300 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-4 shadow-sm">
                {pillar.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 font-display">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
