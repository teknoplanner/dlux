"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Camera,
  Mic,
  Cloud,
  Lock,
  Trash2,
  Users,
  Mail,
  ExternalLink,
  CheckCircle2,
  FileText,
  Languages,
} from "lucide-react";
import { AppItem, developer } from "@/data/apps";

interface KucingPrivacyContentProps {
  app: AppItem;
}

export const KucingPrivacyContent: React.FC<KucingPrivacyContentProps> = ({ app }) => {
  const [lang, setLang] = useState<"id" | "en">("id");

  return (
    <div className="space-y-8">
      {/* Language Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold">
          <Languages className="w-4 h-4 text-emerald-600" />
          <span>Pilih Bahasa Dokumen / Select Document Language:</span>
        </div>

        <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setLang("id")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              lang === "id"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🇮🇩 Bahasa Indonesia (Resmi)
          </button>
          <button
            onClick={() => setLang("en")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              lang === "en"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🇬🇧 English
          </button>
        </div>
      </div>

      {lang === "id" ? (
        /* INDONESIAN VERSION - EXACT FROM USER GOOGLE DOC */
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-9 text-slate-800 text-sm leading-relaxed">
          {/* Header Note */}
          <div className="border-b border-slate-100 pb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
              Kebijakan Privasi (Privacy Policy) : Kucing Atur Duit
            </h2>
            <p className="text-xs text-slate-500 mt-2 font-mono">
              Terakhir Diperbarui: 8 Oktober 2026
            </p>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed mt-4">
              Kebijakan Privasi ini menjelaskan bagaimana Kucing Atur Duit (&quot;Aplikasi&quot;, &quot;kami&quot;) mengumpulkan, menggunakan, menyimpan, dan melindungi informasi Anda saat Anda menggunakan aplikasi seluler kami. Kami berkomitmen penuh untuk menjaga privasi pengguna dan memastikan data finansial Anda tetap aman dan berada di bawah kendali Anda sendiri.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3.5">
            <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-mono font-bold">1</span>
              Prinsip Utama: Privasi dan Penyimpanan Lokal (Offline-First)
            </h3>
            <p className="text-slate-700">
              Aplikasi Kucing Atur Duit dirancang dengan filosofi Offline-First:
            </p>
            <ul className="space-y-2.5 pl-2">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Data Tersimpan Lokal:</strong> Seluruh data transaksi, kategori, anggaran, catatan belanja, celengan impian, dan saldo akun keuangan Anda disimpan secara lokal di memori perangkat Anda (Local SQLite Database).
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Tanpa Server Pihak Ketiga Kami:</strong> Kami tidak memiliki server penyimpanan eksternal milik kami untuk mengumpulkan, memantau, menjual, atau menganalisis catatan keuangan pribadi Anda.
                </span>
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-mono font-bold">2</span>
              Izin Perangkat yang Digunakan &amp; Tujuannya (Permissions)
            </h3>
            <p className="text-slate-700">
              Aplikasi meminta izin perangkat tertentu hanya ketika Anda mengaktifkan atau menggunakan fitur terkait:
            </p>

            <div className="space-y-4 pl-1">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Camera className="w-4 h-4 text-sky-600" />
                  <span>a. Kamera (android.permission.CAMERA)</span>
                </div>
                <p className="text-xs text-slate-700">
                  <strong>Tujuan:</strong> Digunakan khusus untuk fitur Pindai Struk / Nota (Receipt Scanner).
                </p>
                <p className="text-xs text-slate-700">
                  <strong>Penggunaan:</strong> Kamera digunakan untuk mengambil foto struk belanja yang kemudian diproses menggunakan teknologi pengenalan teks di perangkat (On-Device Machine Learning OCR) guna mendeteksi tanggal dan total nominal belanja secara otomatis.
                </p>
                <p className="text-xs text-emerald-700 font-medium">
                  <strong>Privasi:</strong> Foto struk tidak dikirim ke server pengembang mana pun dan hanya diproses langsung di perangkat Anda.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Mic className="w-4 h-4 text-purple-600" />
                  <span>b. Rekam Audio / Mikrofon (android.permission.RECORD_AUDIO)</span>
                </div>
                <p className="text-xs text-slate-700">
                  <strong>Tujuan:</strong> Digunakan khusus untuk fitur Catat Transaksi Lewat Suara (Voice Input).
                </p>
                <p className="text-xs text-slate-700">
                  <strong>Penggunaan:</strong> Mikrofon digunakan untuk mengenali perintah suara pengguna (misalnya: &quot;Beli kopi dua puluh ribu&quot;).
                </p>
                <p className="text-xs text-emerald-700 font-medium">
                  <strong>Privasi:</strong> Rekaman suara tidak disimpan secara permanen dan tidak dikirim ke server pengembang. Pemrosesan suara dilakukan melalui antarmuka sistem speech-to-text bawaan perangkat Anda.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Cloud className="w-4 h-4 text-emerald-600" />
                  <span>c. Akses Internet &amp; Jaringan (android.permission.INTERNET &amp; ACCESS_NETWORK_STATE)</span>
                </div>
                <p className="text-xs text-slate-700">
                  <strong>Tujuan:</strong>
                </p>
                <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
                  <li>Memungkinkan fitur opsional Pencadangan &amp; Pemulihan Google Drive (Google Drive Backup &amp; Restore).</li>
                  <li>Memeriksa ketersediaan koneksi internet saat proses sinkronisasi Google Drive berlangsung.</li>
                  <li>Membuka tautan eksternal jika pengguna memilih untuk mengakses tautan informasi atau apresiasi (misal: Saweria/dukungan pengembang).</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3.5">
            <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-mono font-bold">3</span>
              Layanan Pihak Ketiga (Third-Party Services)
            </h3>
            <p className="text-slate-700">
              Aplikasi dapat memanfaatkan layanan pihak ketiga tepercaya dari Google untuk mendukung fungsionalitas tertentu:
            </p>
            <div className="space-y-3 pl-1">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <h4 className="text-sm font-bold text-slate-900">Google Play Services &amp; Google Drive API</h4>
                <p className="text-xs text-slate-700">
                  Digunakan untuk autentikasi akun Google dan pencadangan file backup aplikasi ke folder terisolasi (App Data Folder) di akun Google Drive pribadi Anda.
                </p>
                <p className="text-xs text-slate-700">
                  Kami tidak memiliki akses ke berkas lain di Google Drive Anda selain berkas cadangan Kucing Atur Duit.
                </p>
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:underline pt-1"
                >
                  <span>Kebijakan Privasi Google</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <h4 className="text-sm font-bold text-slate-900">Google ML Kit (Text Recognition)</h4>
                <p className="text-xs text-slate-700">
                  Digunakan untuk memindai teks pada struk belanja secara lokal (on-device).
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3.5">
            <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-mono font-bold">4</span>
              Keamanan Data (Data Security)
            </h3>
            <p className="text-slate-700">
              Kami mengutamakan keamanan data Anda:
            </p>
            <ul className="space-y-2 pl-2">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Data transaksi Anda berada sepenuhnya di perangkat Anda.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Aplikasi menyediakan fitur Kunci PIN / Biometrik (Sidik Jari) untuk mencegah akses fisik tanpa izin dari orang lain yang memegang perangkat Anda.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Fitur Mode Privasi dapat menyembunyikan nominal saldo dan angka keuangan Anda di layar utama dengan satu sentuhan.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Berkas cadangan (backup file) lokal maupun Google Drive diamankan dengan enkripsi untuk mencegah kebocoran data.</span>
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3.5">
            <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-mono font-bold">5</span>
              Penghapusan dan Retensi Data (Data Retention &amp; Deletion)
            </h3>
            <p className="text-slate-700">
              Karena data tersimpan di perangkat Anda:
            </p>
            <ul className="space-y-2 pl-2">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Anda memiliki kendali penuh untuk menghapus transaksi, akun, atau mereset seluruh data aplikasi kapan saja melalui menu pengaturan aplikasi.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Menghapus aplikasi (Uninstall) atau menghapus data aplikasi melalui pengaturan sistem Android akan menghapus seluruh data lokal secara permanen.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Jika Anda menggunakan fitur pencadangan Google Drive, Anda dapat menghapus berkas cadangan kapan saja melalui aplikasi atau langsung dari akun Google Drive Anda.</span>
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3.5">
            <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-mono font-bold">6</span>
              Privasi Anak-Anak (Children&apos;s Privacy)
            </h3>
            <p className="text-slate-700">
              Kucing Atur Duit dirancang untuk digunakan oleh masyarakat umum. Aplikasi ini tidak secara sengaja mengumpulkan data identifikasi pribadi dari anak-anak di bawah usia 13 tahun (atau batasan usia yang berlaku di wilayah hukum Anda).
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3.5">
            <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-mono font-bold">7</span>
              Perubahan pada Kebijakan Privasi Ini
            </h3>
            <p className="text-slate-700">
              Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu untuk menyesuaikan dengan fitur baru aplikasi atau regulasi yang berlaku. Perubahan akan diberitahukan melalui pembaruan aplikasi dan tanggal &quot;Terakhir Diperbarui&quot; di bagian atas halaman ini.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3.5 pt-4 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-mono font-bold">8</span>
              Kontak Kami
            </h3>
            <p className="text-slate-700">
              Jika Anda memiliki pertanyaan, saran, atau masukan mengenai Kebijakan Privasi ini atau pengelolaan data di aplikasi Kucing Atur Duit, Anda dapat menghubungi kami melalui:
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 inline-flex flex-col sm:flex-row items-start sm:items-center gap-3 text-slate-900 text-xs sm:text-sm font-medium">
              <div className="flex items-center gap-2 font-mono">
                <Mail className="w-4 h-4 text-emerald-600" />
                <span>{developer.email}</span>
              </div>
              <span className="hidden sm:inline text-slate-300">•</span>
              <div className="text-slate-700">
                Aplikasi: <strong>Kucing Atur Duit</strong> (<code className="font-mono">{app.packageId}</code>)
              </div>
            </div>
          </section>
        </div>
      ) : (
        /* ENGLISH VERSION - FULL TRANSLATION OF THE GOOGLE DOC */
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-9 text-slate-800 text-sm leading-relaxed">
          {/* Header Note */}
          <div className="border-b border-slate-100 pb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
              Privacy Policy : Kucing Atur Duit
            </h2>
            <p className="text-xs text-slate-500 mt-2 font-mono">
              Last Updated: October 8, 2026
            </p>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed mt-4">
              This Privacy Policy explains how Kucing Atur Duit (&quot;Application&quot;, &quot;we&quot;, &quot;us&quot;) collects, uses, stores, and protects your information when you use our mobile application. We are fully committed to protecting user privacy and ensuring that your financial records remain safe, confidential, and under your own sole control.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3.5">
            <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-mono font-bold">1</span>
              Core Principle: Offline-First &amp; Local Storage
            </h3>
            <p className="text-slate-700">
              Kucing Atur Duit is engineered with an Offline-First philosophy:
            </p>
            <ul className="space-y-2.5 pl-2">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Local Data Storage:</strong> All transaction records, expense categories, budgets, shopping notes, target savings, and account balances are stored locally within your device internal storage (Local SQLite Database).
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>No Developer Cloud Servers:</strong> We do not operate external developer storage servers to collect, track, sell, or analyze your personal financial records.
                </span>
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-mono font-bold">2</span>
              Device Permissions Requested &amp; Their Purpose
            </h3>
            <p className="text-slate-700">
              The Application requests specific device permissions only when you actively trigger corresponding features:
            </p>

            <div className="space-y-4 pl-1">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Camera className="w-4 h-4 text-sky-600" />
                  <span>a. Camera (android.permission.CAMERA)</span>
                </div>
                <p className="text-xs text-slate-700">
                  <strong>Purpose:</strong> Used exclusively for the Receipt Scanner feature.
                </p>
                <p className="text-xs text-slate-700">
                  <strong>Usage:</strong> The camera captures receipt images which are processed via on-device machine learning OCR (Google ML Kit) to automatically identify the purchase date and transaction total.
                </p>
                <p className="text-xs text-emerald-700 font-medium">
                  <strong>Privacy:</strong> Receipt images are never uploaded to developer servers and are processed purely on your device.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Mic className="w-4 h-4 text-purple-600" />
                  <span>b. Audio Recording / Microphone (android.permission.RECORD_AUDIO)</span>
                </div>
                <p className="text-xs text-slate-700">
                  <strong>Purpose:</strong> Used exclusively for Voice Transaction Input.
                </p>
                <p className="text-xs text-slate-700">
                  <strong>Usage:</strong> The microphone captures speech commands (for instance: &quot;Coffee twenty thousand&quot;).
                </p>
                <p className="text-xs text-emerald-700 font-medium">
                  <strong>Privacy:</strong> Voice recordings are not permanently stored and are never sent to developer servers. Audio transcription is handled locally via Android built-in speech-to-text system APIs.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Cloud className="w-4 h-4 text-emerald-600" />
                  <span>c. Internet &amp; Network State (android.permission.INTERNET &amp; ACCESS_NETWORK_STATE)</span>
                </div>
                <p className="text-xs text-slate-700">
                  <strong>Purpose:</strong>
                </p>
                <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
                  <li>Enables the optional Google Drive Backup &amp; Restore feature.</li>
                  <li>Checks internet connectivity during Google Drive synchronization.</li>
                  <li>Opens external informational or support links if you choose to navigate to them.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3.5">
            <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-mono font-bold">3</span>
              Third-Party Services
            </h3>
            <p className="text-slate-700">
              The Application may leverage trusted Google platform services for specific capabilities:
            </p>
            <div className="space-y-3 pl-1">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <h4 className="text-sm font-bold text-slate-900">Google Play Services &amp; Google Drive API</h4>
                <p className="text-xs text-slate-700">
                  Used for Google Account authentication and saving backup files to an isolated App Data Folder in your personal Google Drive account.
                </p>
                <p className="text-xs text-slate-700">
                  We have zero access to any other files or folders in your Google Drive besides the Kucing Atur Duit backup file.
                </p>
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:underline pt-1"
                >
                  <span>Google Privacy Policy</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <h4 className="text-sm font-bold text-slate-900">Google ML Kit (Text Recognition)</h4>
                <p className="text-xs text-slate-700">
                  Used to recognize text on shopping receipts locally on your device.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3.5">
            <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-mono font-bold">4</span>
              Data Security
            </h3>
            <p className="text-slate-700">
              We prioritize the protection of your personal records:
            </p>
            <ul className="space-y-2 pl-2">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Your financial transaction data remains solely on your physical device.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>The Application provides PIN / Biometric (Fingerprint) lock to protect against unauthorized physical device access.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>A Privacy Mode feature lets you obscure account balances and amounts on the home screen with a single tap.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Local and Google Drive backup files are encrypted to prevent data leakage.</span>
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3.5">
            <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-mono font-bold">5</span>
              Data Retention &amp; Deletion
            </h3>
            <p className="text-slate-700">
              Because data is stored on your device:
            </p>
            <ul className="space-y-2 pl-2">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>You maintain full control to delete individual records, accounts, or reset all data anytime via application settings.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Uninstalling the application or wiping application data via Android system settings permanently erases all local data.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>If you use Google Drive backup, you may delete the backup file at any time from within the app or directly from your Google Drive account.</span>
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3.5">
            <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-mono font-bold">6</span>
              Children&apos;s Privacy
            </h3>
            <p className="text-slate-700">
              Kucing Atur Duit is designed for the general audience. The Application does not knowingly collect personally identifiable information from children under the age of 13.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3.5">
            <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-mono font-bold">7</span>
              Changes to This Privacy Policy
            </h3>
            <p className="text-slate-700">
              We may update this Privacy Policy from time to time to accommodate new features or regulatory requirements. Any updates will be reflected in application updates and the &quot;Last Updated&quot; date at the top of this document.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3.5 pt-4 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-mono font-bold">8</span>
              Contact Us
            </h3>
            <p className="text-slate-700">
              If you have any questions, suggestions, or feedback regarding this Privacy Policy or data handling in Kucing Atur Duit, please contact us:
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 inline-flex flex-col sm:flex-row items-start sm:items-center gap-3 text-slate-900 text-xs sm:text-sm font-medium">
              <div className="flex items-center gap-2 font-mono">
                <Mail className="w-4 h-4 text-emerald-600" />
                <span>{developer.email}</span>
              </div>
              <span className="hidden sm:inline text-slate-300">•</span>
              <div className="text-slate-700">
                Application: <strong>Kucing Atur Duit</strong> (<code className="font-mono">{app.packageId}</code>)
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
