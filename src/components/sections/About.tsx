import React from "react";
import { Sparkles, Brain, Heart, Shield } from "lucide-react";
import { developer } from "@/data/apps";

export const About: React.FC = () => {
  const pillars = [
    {
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      title: "Desain Intuitif & Menyenangkan",
      desc: "Menghadirkan gameplay dan antarmuka yang ramah pengguna tanpa kerumitan yang membingungkan.",
    },
    {
      icon: <Brain className="w-5 h-5 text-cyan-400" />,
      title: "Asah Logika & Ketangkasan",
      desc: "Membantu anak-anak dan keluarga melatih fokus, berhitung, dan daya ingat harian.",
    },
    {
      icon: <Heart className="w-5 h-5 text-rose-400" />,
      title: "Aplikasi Bermanfaat",
      desc: "Selain game hiburan, kami membuat alat praktis seperti editor PDF dan pencatat anggaran keuangan.",
    },
    {
      icon: <Shield className="w-5 h-5 text-emerald-400" />,
      title: "Privasi Pengguna Terjaga",
      desc: "Mematuhi standar Google Play Families dan COPPA. Tanpa pengumpulan data invasif yang merugikan pengguna.",
    },
  ];

  return (
    <section id="about" className="py-20 relative bg-[#090c18] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400">
              <span>PROFIL PENGEMBANG</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
              Membangun Game Seru &amp; Aplikasi Bermanfaat
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {developer.description}
            </p>

            <p className="text-sm text-slate-300 leading-relaxed">
              Kami percaya bahwa aplikasi mobile yang baik harus ringan di perangkat, menjaga privasi pengguna, dan memberikan nilai nyata baik untuk hiburan santai maupun produktivitas kerja harian.
            </p>
          </div>

          {/* Right 4 Pillars */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#0e1224] border border-slate-800 hover:border-slate-700 transition-all duration-200 shadow-lg"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center mb-3">
                  {pillar.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-1.5 font-display">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
