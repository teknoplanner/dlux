"use client";

import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function FloatingNavControls({ lang }: { lang: "id" | "en" }) {
  const [visible, setVisible] = useState(false);
  const isEn = lang === "en";

  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 450) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  if (!visible) return null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 not-prose">
      <button
        type="button"
        onClick={scrollToTop}
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-950 text-white text-xs sm:text-sm font-bold shadow-lg backdrop-blur-md transition-all active:scale-95 border border-slate-700/50 hover:shadow-xl"
        aria-label={isEn ? "Scroll back to top" : "Kembali ke atas"}
      >
        <ArrowUp className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>{isEn ? "Back to top" : "Ke Atas"}</span>
      </button>
    </div>
  );
}
