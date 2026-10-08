import React from "react";
import Link from "next/link";
import { Gamepad2, Mail, ExternalLink, ShieldCheck, Heart } from "lucide-react";
import { apps, developer } from "@/data/apps";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#05050b] border-t border-white/10 pt-16 pb-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-purple-600/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Studio Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1.5px]">
                <div className="w-full h-full bg-[#0b0b18] rounded-[10px] flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <span className="text-xl font-bold font-display tracking-tight text-white">
                  D LUCKY <span className="text-cyan-400">X</span>
                </span>
                <span className="block text-[10px] tracking-widest uppercase text-gray-400 -mt-1 font-semibold">
                  Game &amp; App Studio
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              {developer.tagline}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href={developer.playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400/40 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Google Play Developer
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all"
              >
                <Mail className="w-3.5 h-3.5" />
                {developer.email}
              </Link>
            </div>
          </div>

          {/* Col 2: Games List */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Game & Aplikasi
            </h4>
            <ul className="space-y-2.5">
              {apps.map((app) => (
                <li key={app.slug}>
                  <Link
                    href={`/apps/${app.slug}`}
                    className="text-sm text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: app.color }}
                    />
                    {app.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Legal & Resources */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Legal & Dukungan
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Hubungi Developer
                </Link>
              </li>
              <li>
                <a
                  href={developer.playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Play Console Listing
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} D Lucky X. Seluruh hak cipta dilindungi undang-undang.</p>
          <p className="flex items-center gap-1">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> untuk pemain di seluruh dunia.
          </p>
        </div>
      </div>
    </footer>
  );
};
