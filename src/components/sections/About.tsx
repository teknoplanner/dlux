import React from "react";
import { Sparkles, Brain, Heart, Shield, Gamepad2 } from "lucide-react";
import { developer } from "@/data/apps";
import { GlassCard } from "@/components/ui/GlassCard";

export const About: React.FC = () => {
  const pillars = [
    {
      icon: <Sparkles className="w-6 h-6 text-purple-400" />,
      title: "Inovatif & Menyenangkan",
      desc: "Menghadirkan gameplay yang segar dan adiktif tanpa mekanika yang membingungkan pemain.",
      color: "border-purple-500/20 bg-purple-500/5",
    },
    {
      icon: <Brain className="w-6 h-6 text-cyan-400" />,
      title: "Latih Ketangkasan Otak",
      desc: "Membantu anak-anak dan pemain dari segala usia meningkatkan daya ingat, logika, dan kecepatan berpikir.",
      color: "border-cyan-500/20 bg-cyan-500/5",
    },
    {
      icon: <Heart className="w-6 h-6 text-pink-400" />,
      title: "Dibuat Sepenuh Hati",
      desc: "Setiap detail grafis, audio, dan antarmuka dirancang untuk kenyamanan maksimal saat dimainkan berjam-jam.",
      color: "border-pink-500/20 bg-pink-500/5",
    },
    {
      icon: <Shield className="w-6 h-6 text-green-400" />,
      title: "Aman & Kepatuhan Privasi",
      desc: "Mematuhi standar ketat Google Play Families dan COPPA. Tanpa pelacakan data pribadi yang invasif.",
      color: "border-green-500/20 bg-green-500/5",
    },
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-300">
              <Gamepad2 className="w-4 h-4" />
              TENTANG D LUCKY X
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
              Membangun Pengalaman Digital yang{" "}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Menghibur &amp; Bermanfaat
              </span>
            </h2>

            <p className="text-base text-gray-300 leading-relaxed">
              {developer.description}
            </p>

            <p className="text-sm text-gray-400 leading-relaxed">
              Sebagai studio pengembang independen di Google Play Store, komitmen kami adalah menghadirkan aplikasi dan game yang bisa dinikmati siapa saja, kapan saja, baik dalam mode online maupun offline.
            </p>
          </div>

          {/* Right 4 Pillars */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {pillars.map((pillar, idx) => (
              <GlassCard
                key={idx}
                interactive
                className={`p-6 border ${pillar.color}`}
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  {pillar.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 font-display">
                  {pillar.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {pillar.desc}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
