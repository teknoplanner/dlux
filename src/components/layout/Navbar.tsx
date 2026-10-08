"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Play, Menu, X, Gamepad2, ShieldCheck, Mail } from "lucide-react";
import { developer } from "@/data/apps";
import { Button } from "@/components/ui/Button";

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#07070f]/85 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/40 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all duration-300">
              <div className="w-full h-full bg-[#0b0b18] rounded-[10px] flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold font-display tracking-tight bg-gradient-to-r from-white via-gray-100 to-purple-200 bg-clip-text text-transparent">
                D LUCKY <span className="text-cyan-400">X</span>
              </span>
              <span className="block text-[10px] tracking-widest uppercase text-muted -mt-1 font-semibold">
                Game Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/#apps"
              className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors"
            >
              Aplikasi & Game
            </Link>
            <Link
              href="/#about"
              className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors"
            >
              Tentang Kami
            </Link>
            <Link
              href="/privacy"
              className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors"
            >
              Kontak
            </Link>
          </nav>

          {/* Action CTA Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              href={developer.playStoreUrl}
              external
              variant="secondary"
              size="sm"
              className="shadow-cyan-500/20"
            >
              <Play className="w-4 h-4 fill-current" />
              Google Play
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0a18]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <Link
            href="/#apps"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 text-base font-medium text-gray-200 hover:text-cyan-400 py-2 border-b border-white/5"
          >
            <Gamepad2 className="w-5 h-5 text-purple-400" />
            Aplikasi & Game
          </Link>
          <Link
            href="/#about"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 text-base font-medium text-gray-200 hover:text-cyan-400 py-2 border-b border-white/5"
          >
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            Tentang Kami
          </Link>
          <Link
            href="/privacy"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 text-base font-medium text-gray-200 hover:text-cyan-400 py-2 border-b border-white/5"
          >
            <ShieldCheck className="w-5 h-5 text-pink-400" />
            Privacy Policy
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 text-base font-medium text-gray-200 hover:text-cyan-400 py-2 border-b border-white/5"
          >
            <Mail className="w-5 h-5 text-amber-400" />
            Kontak & Dukungan
          </Link>
          <div className="pt-2">
            <Button
              href={developer.playStoreUrl}
              external
              variant="secondary"
              size="md"
              className="w-full justify-center"
            >
              <Play className="w-4 h-4 fill-current" />
              Buka di Google Play
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
