"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { apps, developer } from "@/data/apps";

const link = "inline-flex items-center min-h-[36px] text-slate-700 hover:text-slate-950 hover:underline underline-offset-4";

export const Footer: React.FC = () => {
  const pathname = usePathname();
  // The /world game is full screen
  if (pathname === "/world" || pathname?.startsWith("/world/")) return null;

  return (
    <footer className="border-t border-slate-200 bg-white text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-5 max-w-sm">
          <p className="font-display text-xl font-bold text-slate-900">D Lucky X</p>
          <p className="mt-3 text-slate-700 leading-relaxed">
            Independent studio from Indonesia. Casual games and everyday tools for Android.
          </p>
          <p className="mt-4 flex flex-wrap gap-x-5">
            <a href={developer.playStoreUrl} target="_blank" rel="noopener noreferrer" className={`${link} font-bold text-emerald-800`}>
              Google Play
            </a>
            <Link href="/contact/" className={`${link} font-bold`}>
              Contact
            </Link>
          </p>
        </div>

        <nav aria-label="Apps" className="lg:col-span-4">
          <p className="font-bold text-slate-900 mb-2">Apps</p>
          <ul>
            {apps.slice(0, 6).map((app) => (
              <li key={app.slug}>
                <Link href={`/apps/${app.slug}/`} className={link}>
                  {app.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Site" className="lg:col-span-3">
          <p className="font-bold text-slate-900 mb-2">Site</p>
          <ul>
            <li><Link href="/blog/" className={link}>Blog (ID)</Link></li>
            <li><Link href="/en/blog/" className={link}>Blog (EN)</Link></li>
            <li><Link href="/gear/" className={link}>Gear</Link></li>
            <li><Link href="/world/" className={link}>World 3D</Link></li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-wrap items-center justify-between gap-x-6 text-slate-600">
          <p>© {new Date().getFullYear()} D Lucky X</p>
          <p className="flex flex-wrap gap-x-5">
            <Link href="/privacy/" className={link}>Privacy</Link>
            <Link href="/terms/" className={link}>Terms</Link>
            <a href="/sitemap.xml" className={link}>Sitemap</a>
          </p>
        </div>
      </div>
    </footer>
  );
};
