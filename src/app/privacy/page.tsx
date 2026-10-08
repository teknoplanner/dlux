import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ShieldCheck, ArrowLeft, Mail } from "lucide-react";
import { apps, developer } from "@/data/apps";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Kebijakan Privasi resmi pengembang D Lucky X untuk aplikasi Android di Google Play Store.",
};

export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-24 relative overflow-hidden bg-[#fafaf9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>

        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            KEPATUHAN KEBIJAKAN PRIVASI
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-slate-900">
            Kebijakan Privasi (Privacy Policy)
          </h1>
          <p className="text-sm text-slate-500">
            Terakhir diperbarui: 8 Oktober 2026
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-display">1. Pendahuluan</h2>
            <p>
              Selamat datang di <strong>{developer.name}</strong>. Dokumen Kebijakan Privasi ini menjelaskan bagaimana kami mengelola, mengumpulkan, dan melindungi informasi dari para pengguna yang mengunduh dan menggunakan aplikasi serta game kami melalui Google Play Store.
            </p>
            <p>
              Dengan mengunduh atau menggunakan aplikasi kami, Anda menyetujui ketentuan yang tercantum dalam Kebijakan Privasi ini.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-display">2. Kebijakan Privasi Anak (COPPA &amp; Google Play Families)</h2>
            <p>
              Beberapa aplikasi kami, termasuk <em>Baby Shark ABC: Kids Learning</em> dan <em>Monster Math Train Brain</em>, ditujukan untuk anak-anak dan keluarga. Kami sangat berkomitmen mematuhi regulasi <strong>COPPA (Children&apos;s Online Privacy Protection Act)</strong> dan <strong>Kebijakan Keluarga Google Play (Designed for Families)</strong>.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Kami <strong>TIDAK PERNAH</strong> mengumpulkan Informasi Pengenal Pribadi (Personally Identifiable Information) seperti nama, alamat, nomor telepon, atau lokasi persis dari anak-anak di bawah usia 13 tahun.</li>
              <li>Aplikasi anak kami tidak berisi obrolan publik atau fitur interaksi sosial terbuka yang tidak diawasi.</li>
              <li>Iklan apa pun yang ditampilkan di aplikasi anak mematuhi Google Play Families Self-Certified Ads SDKs dan hanya menampilkan iklan yang sesuai dengan rating usia anak.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-display">3. Informasi yang Dikumpulkan</h2>
            <p>
              Secara umum, aplikasi dan game kami dapat dimainkan secara offline dan tidak memerlukan registrasi akun pengguna. Data teknis non-pribadi yang dapat dikumpulkan secara otomatis oleh layanan sistem (seperti Google Play Services untuk laporan performa atau crash) mencakup:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Model perangkat keras dan versi sistem operasi Android.</li>
              <li>Log kerusakan sistem (crash logs) untuk tujuan perbaikan bug teknis.</li>
              <li>Pengidentifikasi iklan anonim (Google Advertising ID) untuk analitik frekuensi iklan pada aplikasi yang memuat iklan.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-display">4. Izin Perangkat (App Permissions)</h2>
            <p>
              Aplikasi kami hanya meminta izin perangkat minimal yang benar-benar dibutuhkan agar game dapat berfungsi dengan baik (misalnya penyimpanan progres lokal di memori perangkat atau getaran haptik). Kami tidak meminta izin akses kamera, mikrofon, atau kontak pribadi.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 font-display">5. Kebijakan Privasi Khusus Tiap Judul</h2>
            <p>
              Untuk membaca kebijakan privasi spesifik untuk masing-masing judul karya kami:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {apps.map((app) => (
                <Link
                  key={app.slug}
                  href={`/privacy/${app.slug}`}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-semibold flex items-center justify-between transition-all"
                >
                  <span>{app.name}</span>
                  <span className="text-slate-400">&rarr;</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 font-display">6. Kontak &amp; Pertanyaan</h2>
            <p>
              Jika Anda memiliki pertanyaan mengenai Kebijakan Privasi ini, atau ingin meminta klarifikasi seputar penanganan data, silakan hubungi kami di:
            </p>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 inline-flex items-center gap-3 text-slate-900 font-mono text-sm">
              <Mail className="w-5 h-5 text-emerald-600" />
              <span>{developer.email}</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
