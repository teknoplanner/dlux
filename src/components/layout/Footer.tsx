import React from "react";
import Link from "next/link";
import {
  Mail,
  ExternalLink,
  ShieldCheck,
  FileText,
  BookOpen,
  Sparkles,
  Gamepad2,
  Lock,
  ArrowUpRight,
  Smartphone,
  CheckCircle,
} from "lucide-react";
import { apps, developer } from "@/data/apps";
import { BrandLogo } from "@/components/ui/BrandLogo";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#070c18] text-slate-400 relative overflow-hidden border-t border-slate-800/80">
      {/* Decorative top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-emerald-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-14 border-b border-slate-800/80">
          
          {/* Col 1: Studio Brand & Mission */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 group inline-flex">
              <BrandLogo className="w-10 h-10 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300 overflow-hidden flex-shrink-0" />
              <div>
                <span className="text-xl font-bold font-display tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  D LUCKY <span className="text-emerald-400">X</span>
                </span>
                <span className="block text-[10px] tracking-widest uppercase text-slate-400 -mt-1 font-semibold">
                  Game &amp; App Studio
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Independent indie studio crafting lightweight, engaging casual games, and privacy-respecting Android applications.
            </p>

            <div className="pt-1 flex flex-col gap-2">
              <a
                href={developer.playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between gap-2 text-xs font-medium px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-emerald-500/50 hover:bg-slate-850 transition-all group"
              >
                <span className="flex items-center gap-2">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  Google Play Profile
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center justify-between gap-2 text-xs font-medium px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-emerald-500/50 hover:bg-slate-850 transition-all group"
              >
                <span className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  {developer.email}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </Link>
            </div>
          </div>

          {/* Col 2: Top Games & Apps */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />
              Apps &amp; Games
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {apps.slice(0, 6).map((app) => (
                <li key={app.slug}>
                  <Link
                    href={`/apps/${app.slug}/`}
                    className="hover:text-emerald-400 text-slate-400 transition-colors flex items-center justify-between group"
                  >
                    <span className="truncate">{app.name}</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800/80 group-hover:border-emerald-500/40 group-hover:text-emerald-300 transition-colors">
                      {app.category === "game" ? "Game" : "App"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Navigation & Guides */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              Guides &amp; Resources
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-white text-slate-400 transition-colors flex items-center gap-2"
                >
                  Home Studio
                </Link>
              </li>
              <li>
                <Link
                  href="/#featured"
                  className="hover:text-white text-slate-400 transition-colors flex items-center gap-2"
                >
                  Featured Spotlight
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-emerald-400 text-slate-400 transition-colors flex items-center gap-2"
                >
                  Blog &amp; Guides (ID)
                </Link>
              </li>
              <li>
                <Link
                  href="/en/blog"
                  className="hover:text-emerald-400 text-slate-400 transition-colors flex items-center gap-2"
                >
                  Articles &amp; Tips (EN)
                </Link>
              </li>
              <li>
                <Link
                  href="/gear"
                  className="hover:text-emerald-400 text-slate-400 transition-colors flex items-center gap-2"
                >
                  Gear &amp; Hardware
                </Link>
              </li>
              <li>
                <Link
                  href="/#about"
                  className="hover:text-white text-slate-400 transition-colors flex items-center gap-2"
                >
                  About Studio
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white text-slate-400 transition-colors flex items-center gap-2"
                >
                  Contact Developer
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust, Safety & Legal */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Privacy &amp; Trust
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white text-slate-400 transition-colors flex items-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white text-slate-400 transition-colors flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="/app-ads.txt"
                  target="_blank"
                  className="hover:text-white text-slate-400 transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
                  App-Ads.txt Verified
                </a>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  className="hover:text-white text-slate-400 transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Google XML Sitemap
                </a>
              </li>
            </ul>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              <span className="font-semibold text-emerald-400 block mb-0.5">
                Google Play Safety Standards
              </span>
              All our applications strictly comply with Google Play Data Safety policies, ensuring complete privacy with zero unauthorized data tracking.
            </div>
          </div>
        </div>


        {/* Bottom Bar: Copyright & Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} D Lucky X. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
            <span>•</span>
            <a href="/sitemap.xml" className="hover:text-white transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
