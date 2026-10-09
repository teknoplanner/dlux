"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Play, Menu, X, Gamepad2, Sparkles, BookOpen, Home } from "lucide-react";
import { developer } from "@/data/apps";
import { Button } from "@/components/ui/Button";
import { BrandLogo } from "@/components/ui/BrandLogo";

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <BrandLogo className="w-10 h-10 rounded-xl shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform duration-300 overflow-hidden flex-shrink-0" />
            <div>
              <span className="text-xl font-bold font-display tracking-tight text-slate-900">
                D LUCKY <span className="text-emerald-600">X</span>
              </span>
              <span className="block text-[10px] tracking-widest uppercase text-slate-500 -mt-1 font-semibold">
                Game &amp; App Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            <Link
              href="/"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/#featured"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Featured
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/gear"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Gear
            </Link>
          </nav>

          {/* Action CTA Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              href={developer.playStoreUrl}
              external
              variant="primary"
              size="sm"
              className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm font-bold"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Google Play
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open Navigation Menu"
            aria-expanded={mobileMenuOpen}
            className="md:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-xl border-b border-slate-200 px-6 py-6 space-y-3 shadow-xl">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 text-sm font-semibold text-slate-800 hover:text-emerald-600 py-2.5 border-b border-slate-100"
          >
            <Home className="w-4 h-4 text-emerald-600" />
            Home
          </Link>
          <Link
            href="/#featured"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 text-sm font-semibold text-slate-800 hover:text-emerald-600 py-2.5 border-b border-slate-100"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Featured Spotlight
          </Link>
          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 text-sm font-semibold text-slate-800 hover:text-emerald-600 py-2.5 border-b border-slate-100"
          >
            <BookOpen className="w-4 h-4 text-indigo-600" />
            Blog &amp; Panduan
          </Link>
          <Link
            href="/gear"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 text-sm font-semibold text-slate-800 hover:text-emerald-600 py-2.5 border-b border-slate-100"
          >
            <Gamepad2 className="w-4 h-4 text-cyan-600" />
            Gear
          </Link>
          <div className="pt-2">
            <Button
              href={developer.playStoreUrl}
              external
              variant="primary"
              size="md"
              className="w-full justify-center bg-slate-900 text-white font-bold"
            >
              <Play className="w-4 h-4 fill-current" />
              Visit Google Play
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
