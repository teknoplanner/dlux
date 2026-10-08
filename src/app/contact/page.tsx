"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Send, CheckCircle2, Gamepad2, ExternalLink } from "lucide-react";
import { developer } from "@/data/apps";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

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
    <div className="pt-32 pb-24 relative overflow-hidden">
      {/* Background glow lights */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

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
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-300">
            <Mail className="w-4 h-4" />
            HUBUNGI PENGEMBANG
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white">
            Kontak &amp; Dukungan Pemain
          </h1>
          <p className="text-base text-gray-300 max-w-xl mx-auto">
            Punya pertanyaan seputar game, laporan bug teknis, atau proposal kerja sama? Tim D Lucky X siap mendengar masukan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Col: Contact Info */}
          <div className="md:col-span-5 space-y-6">
            <GlassCard className="p-6 space-y-4">
              <h3 className="text-lg font-bold font-display text-white">
                Email Dukungan
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Kirim pesan langsung ke inbox resmi developer kami untuk respon cepat dalam 1-2 hari kerja.
              </p>
              <a
                href={`mailto:${developer.email}`}
                className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 text-cyan-300 hover:text-cyan-200 hover:border-cyan-400/40 transition-all font-mono text-sm"
              >
                <Mail className="w-5 h-5 text-cyan-400" />
                <span>{developer.email}</span>
              </a>
            </GlassCard>

            <GlassCard className="p-6 space-y-4">
              <h3 className="text-lg font-bold font-display text-white">
                Halaman Google Play
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Lihat daftar semua game, pembaruan versi terbaru, dan ulasan pemain lain langsung di Play Store.
              </p>
              <a
                href={developer.playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-semibold text-purple-300 hover:text-white hover:border-purple-400/40 transition-all"
              >
                <span className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-purple-400" />
                  Google Play Developer Page
                </span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </GlassCard>
          </div>

          {/* Right Col: Contact Form */}
          <div className="md:col-span-7">
            <GlassCard className="p-8">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto text-green-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold font-display text-white">
                    Pesan Anda Terkirim!
                  </h3>
                  <p className="text-sm text-gray-300 max-w-sm mx-auto">
                    Terima kasih telah menghubungi D Lucky X. Kami akan meninjau pesan Anda sesegera mungkin.
                  </p>
                  <Button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", subject: "", message: "" });
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Kirim Pesan Lain
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-xl font-bold font-display text-white mb-2">
                    Kirim Pesan Cepat
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nama Anda"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="nama@email.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Subjek
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Laporan Bug / Feedback / Kerjasama"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Pesan
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tuliskan pesan Anda di sini..."
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 text-sm resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full justify-center shadow-purple-600/25"
                  >
                    <Send className="w-4 h-4" />
                    Kirim Pesan
                  </Button>
                </form>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
