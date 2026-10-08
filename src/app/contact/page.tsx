"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Send, CheckCircle2, Gamepad2, ExternalLink } from "lucide-react";
import { developer } from "@/data/apps";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-static";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
            <Mail className="w-4 h-4" />
            HUBUNGI PENGEMBANG
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-slate-900">
            Kontak &amp; Dukungan Pengguna
          </h1>
          <p className="text-base text-slate-600 max-w-xl mx-auto">
            Punya pertanyaan seputar game atau aplikasi, laporan kendala teknis, atau proposal kerja sama? Tim D Lucky X siap mendengar masukan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Col: Contact Info */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-lg font-bold font-display text-slate-900">
                Email Dukungan
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kirim pesan langsung ke inbox resmi developer kami untuk respon cepat dalam 1-2 hari kerja.
              </p>
              <a
                href={`mailto:${developer.email}`}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-slate-900 hover:bg-slate-100 transition-all font-mono text-sm"
              >
                <Mail className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="truncate">{developer.email}</span>
              </a>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-lg font-bold font-display text-slate-900">
                Halaman Google Play
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lihat daftar semua game, pembaruan versi terbaru, dan ulasan pemain lain langsung di Play Store.
              </p>
              <a
                href={developer.playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-800 hover:bg-slate-100 transition-all"
              >
                <span className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-emerald-600" />
                  Halaman Developer Google Play
                </span>
                <ExternalLink className="w-4 h-4 text-slate-500" />
              </a>
            </div>
          </div>

          {/* Right Col: Contact Form */}
          <div className="md:col-span-7">
            <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold font-display text-slate-900">
                    Pesan Anda Terkirim!
                  </h3>
                  <p className="text-sm text-slate-600 max-w-sm mx-auto">
                    Terima kasih telah menghubungi D Lucky X. Kami akan meninjau pesan Anda sesegera mungkin.
                  </p>
                  <Button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", subject: "", message: "" });
                    }}
                    variant="outline"
                    size="sm"
                    className="border-slate-300 text-slate-800 hover:bg-slate-50"
                  >
                    Kirim Pesan Lain
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-xl font-bold font-display text-slate-900 mb-2">
                    Kirim Pesan Cepat
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nama Anda"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-800 text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="nama@email.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-800 text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Subjek
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Laporan Kendala / Saran / Kerjasama"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-800 text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Pesan
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tuliskan pesan Anda di sini..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-800 text-sm transition-all resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full justify-center bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                    Kirim Pesan
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
