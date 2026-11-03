"use client";

import React, { useEffect } from "react";
import { X, ExternalLink } from "lucide-react";
import { ShortVideo } from "@/data/shorts";

interface VideoModalProps {
  video: ShortVideo | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ video, onClose }) => {
  useEffect(() => {
    if (!video) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [video, onClose]);

  if (!video) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm sm:max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/90 text-white">
          <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400">
            YouTube Shorts
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pemutar video"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player 9:16 */}
        <div className="relative w-full aspect-[9/16] bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        </div>

        {/* Footer Info */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 text-left">
          <h2
            id="video-modal-title"
            className="text-sm sm:text-base font-bold text-white line-clamp-2 leading-snug"
          >
            {video.title}
          </h2>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400">
            <span>{video.views ? `${video.views}` : "D Lucky X Shorts"}</span>
            <a
              href={video.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Buka di YouTube
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
