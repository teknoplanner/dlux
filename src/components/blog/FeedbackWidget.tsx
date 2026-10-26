"use client";

import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, CheckCircle2 } from "lucide-react";

interface FeedbackWidgetProps {
  articleSlug: string;
  lang: "id" | "en";
}

export function FeedbackWidget({ articleSlug, lang }: FeedbackWidgetProps) {
  const [feedback, setFeedback] = useState<"helpful" | "unhelpful" | null>(null);
  const isEn = lang === "en";

  const handleVote = (type: "helpful" | "unhelpful") => {
    setFeedback(type);
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(`feedback_${articleSlug}`, type);
      }
    } catch {
      // Ignore local storage error
    }
  };

  return (
    <div className="my-10 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm not-prose transition-all">
      {feedback ? (
        <div className="flex items-center gap-3 text-emerald-800">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-display font-bold text-slate-900 text-sm sm:text-base">
              {isEn ? "Thank you for your feedback!" : "Terima kasih atas tanggapan Anda!"}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {isEn
                ? "Your response helps the D Lucky X team keep our guides accurate and up-to-date."
                : "Masukan Anda membantu tim D Lucky X terus memperbarui panduan ini agar selalu akurat."}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-display font-bold text-slate-900 text-base">
              {isEn ? "Was this guide helpful?" : "Apakah panduan ini membantu Anda?"}
            </p>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {isEn
                ? "Let us know with 1 click to improve future updates."
                : "Beri tahu kami dengan 1 klik agar panduan ini makin sempurna."}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => handleVote("helpful")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-sm transition-colors border border-emerald-200/60 active:scale-95"
              aria-label={isEn ? "Helpful" : "Bermanfaat"}
            >
              <ThumbsUp className="w-4 h-4 text-emerald-600" />
              <span>{isEn ? "Yes, helpful!" : "Ya, bermanfaat!"}</span>
            </button>

            <button
              type="button"
              onClick={() => handleVote("unhelpful")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-sm transition-colors border border-slate-200 active:scale-95"
              aria-label={isEn ? "Could be better" : "Perlu ditingkatkan"}
            >
              <ThumbsDown className="w-4 h-4 text-slate-500" />
              <span>{isEn ? "Could be better" : "Perlu ditingkatkan"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
