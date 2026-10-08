import React from "react";
import Link from "next/link";
import { Gamepad2, Mail, ExternalLink, ShieldCheck, FileText } from "lucide-react";
import { apps, developer } from "@/data/apps";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-12 relative overflow-hidden text-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-200">
          {/* Col 1: Studio Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm">
                <Gamepad2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-xl font-bold font-display tracking-tight text-slate-900">
                  D LUCKY <span className="text-emerald-600">X</span>
                </span>
                <span className="block text-[10px] tracking-widest uppercase text-slate-600 -mt-1 font-bold">
                  Game &amp; App Studio
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              {developer.description}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={developer.playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-100 transition-all shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                Google Play Store
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-100 transition-all shadow-sm"
              >
                <Mail className="w-3.5 h-3.5 text-slate-600" />
                {developer.email}
              </Link>
            </div>
          </div>

          {/* Col 2: Games & Apps List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Our Creations
            </h4>
            <ul className="space-y-2.5">
              {apps.map((app) => (
                <li key={app.slug}>
                  <Link
                    href={`/apps/${app.slug}`}
                    className="text-sm text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2"
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: app.color }}
                    />
                    <span className="truncate">{app.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Legal & Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Information &amp; Support
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-sky-600" />
                  Contact Developer
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href={developer.playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4 text-purple-600" />
                  Official Google Play Profile
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 text-center text-xs text-slate-600 font-medium">
          <p>© {new Date().getFullYear()} D Lucky X</p>
        </div>
      </div>
    </footer>
  );
};
