"use client";

import React, { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";

interface SocialShareProps {
  url: string;
  title: string;
  lang: "id" | "en";
}

export function SocialShare({ url, title, lang }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const isEn = lang === "en";

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
  };

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  return (
    <div className="my-10 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm not-prose">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="font-display font-bold text-slate-900 text-base flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-600" />
            {isEn ? "Share this guide" : "Bagikan panduan ini"}
          </p>
          <p className="text-sm text-slate-500 mt-0.5">
            {isEn
              ? "Help your teammates or friends level up their game!"
              : "Bantu teman atau mabar kamu agar makin jago!"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* WhatsApp */}
          <a
            href={shareLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share to WhatsApp"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium text-sm transition-colors"
          >
            <span className="font-bold">WhatsApp</span>
          </a>

          {/* Twitter / X */}
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share to X (Twitter)"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 font-medium text-sm transition-colors"
          >
            <span className="font-bold">X</span>
          </a>

          {/* Telegram */}
          <a
            href={shareLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share to Telegram"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 font-medium text-sm transition-colors"
          >
            <span className="font-bold">Telegram</span>
          </a>

          {/* Copy Link */}
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-medium text-sm transition-colors"
            aria-label="Copy link to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-bold">
                  {isEn ? "Copied!" : "Tersalin!"}
                </span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>{isEn ? "Copy Link" : "Salin Link"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
