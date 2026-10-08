import React from "react";
import { Zap, WifiOff, Baby, Smartphone } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export const WhyUs: React.FC = () => {
  const reasons = [
    {
      icon: <Zap className="w-6 h-6 text-cyan-400" />,
      title: "Ringan & Hemat Kuota",
      desc: "Ukuran aplikasi di bawah 30 MB. Tidak menghabiskan memori smartphone Anda dan cepat diunduh bahkan di jaringan lambat.",
    },
    {
      icon: <WifiOff className="w-6 h-6 text-purple-400" />,
      title: "Dukungan Mode Offline",
      desc: "Nikmati game favorit Anda kapan pun dan di mana pun tanpa harus selalu terhubung ke jaringan internet aktif.",
    },
    {
      icon: <Baby className="w-6 h-6 text-pink-400" />,
      title: "Aman untuk Anak & Balita",
      desc: "Kategori edukasi mematuhi aturan Google Play Families. Tanpa konten kekerasan atau iklan yang tidak pantas.",
    },
    {
      icon: <Smartphone className="w-6 h-6 text-green-400" />,
      title: "Optimal di Semua HP",
      desc: "Dioptimalkan dengan cermat sehingga berjalan mulus di perangkat Android spesifikasi menengah ke bawah.",
    },
  ];

  return (
    <section className="py-20 relative bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
            Mengapa Memilih Aplikasi Kami?
          </h2>
          <p className="text-base text-gray-300 leading-relaxed">
            Standar kualitas tinggi yang kami terapkan pada setiap proyek untuk memberikan kenyamanan bermain terbaik.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((item, index) => (
            <GlassCard key={index} className="p-6 relative group hover:border-cyan-500/30">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-display">
                {item.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {item.desc}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};
