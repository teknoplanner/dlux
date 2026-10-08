import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ShieldCheck, ArrowLeft, Mail } from "lucide-react";
import { apps, developer } from "@/data/apps";
import { GlassCard } from "@/components/ui/GlassCard";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Kebijakan Privasi resmi pengembang D Lucky X untuk Google Play Store.",
};

export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>

        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-xs font-semibold text-pink-300">
            <ShieldCheck className="w-4 h-4" />
            GOOGLE PLAY POLICY COMPLIANCE
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white">
            Kebijakan Privasi (Privacy Policy)
          </h1>
          <p className="text-sm text-muted">
            Terakhir diperbarui: 8 Oktober 2026
          </p>
        </div>

        <GlassCard className="p-8 sm:p-12 space-y-8 text-gray-300 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white font-display">1. Pendahuluan</h2>
            <p>
              Selamat datang di <strong>{developer.name}</strong>. Dokumen Kebijakan Privasi ini menjelaskan bagaimana kami mengelola, mengumpulkan, dan melindungi informasi dari para pengguna yang mengunduh dan menggunakan aplikasi serta game kami melalui Google Play Store.
            </p>
            <p>
              Dengan mengunduh atau menggunakan aplikasi kami, Anda menyetujui ketentuan yang tercantum dalam Kebijakan Privasi ini.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white font-display">2. Kebijakan Privasi Anak (COPPA &amp; Google Play Families)</h2>
            <p>
              Beberapa aplikasi kami, termasuk <em>Baby Shark ABC: Kids Learning</em> dan <em>Monster Math Train Brain</em>, ditujukan untuk anak-anak dan keluarga. Kami sangat berkomitmen mematuhi undang-undang <strong>COPPA (Children&apos;s Online Privacy Protection Act)</strong> dan <strong>Kebijakan Keluarga Google Play (Designed for Families)</strong>.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-300">
              <li>Kami <strong>TIDAK PERNAH</strong> mengumpulkan Informasi Pengenal Pribadi (Personally Identifiable Information / PII) seperti nama, alamat, nomor telepon, atau lokasi persis dari anak-anak di bawah usia 13 tahun.</li>
              <li>Aplikasi anak kami tidak berisi obrolan publik atau fitur interaksi sosial terbuka yang tidak diawasi.</li>
              <li>Iklan apa pun yang ditampilkan di aplikasi anak mematuhi Google Play Families Self-Certified Ads SDKs dan hanya menampilkan iklan yang sesuai dengan rating usia anak.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white font-display">3. Informasi yang Dikumpulkan</h2>
            <p>
              Secara umum, aplikasi dan game kami dapat dimainkan secara offline dan tidak memerlukan registrasi akun pengguna. Data teknis non-pribadi yang dapat dikumpulkan secara otomatis oleh layanan pihak ketiga (seperti Google Play Services, Firebase Crashlytics, atau jaringan iklan terverifikasi) mencakup:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-300">
              <li>Model perangkat keras dan versi sistem operasi Android.</li>
              <li>Log kerusakan sistem (crash logs) dan performa permainan untuk tujuan perbaikan bug teknis.</li>
              <li>Pengidentifikasi iklan anonim (Google Advertising ID) untuk analitik frekuensi iklan pada aplikasi yang memuat iklan.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white font-display">4. Izin Perangkat (App Permissions)</h2>
            <p>
              Aplikasi kami hanya meminta izin perangkat minimal yang benar-benar dibutuhkan agar game dapat berfungsi dengan baik (misalnya penyimpanan data permainan lokal di memori perangkat atau getaran haptik). Kami tidak meminta izin akses kamera, mikrofon, atau kontak pribadi.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white font-display">5. Kebijakan Privasi Khusus Tiap Aplikasi</h2>
            <p>
              Untuk membaca kebijakan privasi spesifik untuk masing-masing judul game kami:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {apps.map((app) => (
                <Link
                  key={app.slug}
                  href={`/privacy/${app.slug}`}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-white/10 text-cyan-300 text-xs font-semibold flex items-center justify-between transition-all"
                >
                  <span>{app.name}</span>
                  <span>&rarr;</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="space-y-3 pt-4 border-t border-white/10">
            <h2 className="text-xl font-bold text-white font-display">6. Kontak &amp; Pertanyaan</h2>
            <p>
              Jika Anda memiliki pertanyaan mengenai Kebijakan Privasi ini, atau ingin meminta klarifikasi seputar penanganan data, silakan hubungi kami di:
            </p>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 inline-flex items-center gap-3 text-cyan-300 font-mono text-sm">
              <Mail className="w-5 h-5 text-cyan-400" />
              <span>{developer.email}</span>
            </div>
          </section>
        </GlassCard>
      </div>
    </div>
  );
}
