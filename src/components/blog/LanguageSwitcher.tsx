"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Globe, ArrowRight } from "lucide-react";

interface LanguageSwitcherProps {
  currentLang: "id" | "en";
  slug: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLang, slug }) => {
  const [showAutoSuggest, setShowAutoSuggest] = useState(false);

  useEffect(() => {
    // If currently on ID page, check if user might prefer English (non-ID locale or international IP)
    if (currentLang === "id") {
      const savedLang = typeof window !== "undefined" ? localStorage.getItem("preferred_lang") : null;
      if (!savedLang) {
        const browserLang =
          (navigator.languages && navigator.languages[0]) ||
          navigator.language ||
          "";
        const isNonIdLocale = !browserLang.toLowerCase().startsWith("id");
        if (isNonIdLocale) {
          setShowAutoSuggest(true);
        }
      }
    }
  }, [currentLang]);

  const setManualPreference = (lang: "id" | "en") => {
    try {
      localStorage.setItem("preferred_lang", lang);
    } catch {
      // ignore localStorage quota errors
    }
  };

  const targetUrl = currentLang === "id" ? `/en/blog/${slug}` : `/blog/${slug}`;

  return (
    <div className="space-y-3">
      {/* Auto-suggest Banner for non-ID visitors on Indonesian page */}
      {showAutoSuggest && (
        <div className="rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white p-3.5 sm:p-4 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm">
            <Globe className="w-4 h-4 text-sky-200 shrink-0" />
            <span>
              Visiting from outside Indonesia? This article is available in full English.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                setShowAutoSuggest(false);
                setManualPreference("id");
              }}
              className="text-xs text-white/80 hover:text-white px-2.5 py-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              Stay on ID
            </button>
            <Link
              href={`/en/blog/${slug}`}
              onClick={() => setManualPreference("en")}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-indigo-700 hover:bg-sky-50 px-3 py-1.5 rounded-lg shadow-xs transition-colors"
            >
              <span>Read English Version</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Manual Language Toggle Pill */}
      <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-medium">
        <Link
          href={`/blog/${slug}`}
          onClick={() => setManualPreference("id")}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
            currentLang === "id"
              ? "bg-white text-slate-900 shadow-2xs font-bold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <span>🇮🇩</span>
          <span>Bahasa Indonesia</span>
        </Link>

        <Link
          href={`/en/blog/${slug}`}
          onClick={() => setManualPreference("en")}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
            currentLang === "en"
              ? "bg-white text-slate-900 shadow-2xs font-bold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <span>🇬🇧</span>
          <span>English Version</span>
        </Link>
      </div>
    </div>
  );
};
