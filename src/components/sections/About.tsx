import React from "react";
import Link from "next/link";
import { developer } from "@/data/apps";

export const About: React.FC = () => (
  <section id="about" className="py-16 sm:py-24 border-t border-slate-200 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-12 gap-6 md:gap-12">
      <h2 className="md:col-span-4 text-3xl sm:text-4xl font-bold font-display text-slate-900 tracking-tight">
        About D Lucky X
      </h2>
      <div className="md:col-span-8 max-w-2xl">
        <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
          {developer.description}
        </p>
        <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold">
          <a
            href={developer.playStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-800 underline underline-offset-4 py-2"
          >
            See every app on Google Play
          </a>
          <Link href="/contact/" className="text-slate-900 underline underline-offset-4 py-2">
            Contact the developer
          </Link>
        </p>
      </div>
    </div>
  </section>
);
