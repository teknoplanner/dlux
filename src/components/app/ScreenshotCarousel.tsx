"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Maximize2, Smartphone, Monitor } from "lucide-react";

// Pre-computed dimensions for instant zero-layout-shift (CLS) rendering
export const SCREENSHOT_METADATA: Record<string, { width: number; height: number; ratio: number }> = {
  // Baby Shark ABC
  "/images/apps/baby-shark-abc-kids-learning/screenshot-1.webp": { width: 580, height: 387, ratio: 580 / 387 },
  "/images/apps/baby-shark-abc-kids-learning/screenshot-2.webp": { width: 580, height: 1030, ratio: 580 / 1030 },
  "/images/apps/baby-shark-abc-kids-learning/screenshot-3.webp": { width: 580, height: 326, ratio: 580 / 326 },

  // Fruity Merge 3D
  "/images/apps/fruity-merge-3d-match-puzzle/screenshot-1.webp": { width: 580, height: 387, ratio: 580 / 387 },
  "/images/apps/fruity-merge-3d-match-puzzle/screenshot-2.webp": { width: 580, height: 391, ratio: 580 / 391 },
  "/images/apps/fruity-merge-3d-match-puzzle/screenshot-3.webp": { width: 580, height: 389, ratio: 580 / 389 },
  "/images/apps/fruity-merge-3d-match-puzzle/screenshot-4.webp": { width: 580, height: 387, ratio: 580 / 387 },

  // Kucing Atur Duit (Portrait)
  "/images/apps/kucing-atur-duit/screenshot-1.webp": { width: 580, height: 1289, ratio: 580 / 1289 },
  "/images/apps/kucing-atur-duit/screenshot-2.webp": { width: 580, height: 1289, ratio: 580 / 1289 },
  "/images/apps/kucing-atur-duit/screenshot-3.webp": { width: 580, height: 1289, ratio: 580 / 1289 },
  "/images/apps/kucing-atur-duit/screenshot-4.webp": { width: 580, height: 1289, ratio: 580 / 1289 },

  // Milo Cat Adventure (Landscape)
  "/images/apps/milo-cat-adventure/screenshot-1.webp": { width: 580, height: 324, ratio: 580 / 324 },
  "/images/apps/milo-cat-adventure/screenshot-2.webp": { width: 580, height: 324, ratio: 580 / 324 },
  "/images/apps/milo-cat-adventure/screenshot-3.webp": { width: 580, height: 324, ratio: 580 / 324 },
  "/images/apps/milo-cat-adventure/screenshot-4.webp": { width: 580, height: 326, ratio: 580 / 326 },

  // Monster Math Train Brain (Portrait)
  "/images/apps/monster-math-train-brain/screenshot-1.webp": { width: 580, height: 870, ratio: 580 / 870 },
  "/images/apps/monster-math-train-brain/screenshot-2.webp": { width: 580, height: 863, ratio: 580 / 863 },
  "/images/apps/monster-math-train-brain/screenshot-3.webp": { width: 580, height: 869, ratio: 580 / 869 },
  "/images/apps/monster-math-train-brain/screenshot-4.webp": { width: 580, height: 874, ratio: 580 / 874 },

  // Offline PDF Editor (Landscape banner + Portrait screens)
  "/images/apps/offline-pdf-editor/screenshot-1.webp": { width: 580, height: 283, ratio: 580 / 283 },
  "/images/apps/offline-pdf-editor/screenshot-2.webp": { width: 580, height: 1289, ratio: 580 / 1289 },
  "/images/apps/offline-pdf-editor/screenshot-3.webp": { width: 580, height: 1289, ratio: 580 / 1289 },
  "/images/apps/offline-pdf-editor/screenshot-4.webp": { width: 580, height: 1289, ratio: 580 / 1289 },

  // Stickman Penalty Rush (Landscape)
  "/images/apps/stickman-penalty-rush/screenshot-1.webp": { width: 580, height: 326, ratio: 580 / 326 },
  "/images/apps/stickman-penalty-rush/screenshot-2.webp": { width: 580, height: 326, ratio: 580 / 326 },
  "/images/apps/stickman-penalty-rush/screenshot-3.webp": { width: 580, height: 326, ratio: 580 / 326 },
};

interface ScreenshotCarouselProps {
  screenshots: string[];
  appName: string;
  heightClass?: string;
}

export const ScreenshotCarousel: React.FC<ScreenshotCarouselProps> = ({
  screenshots,
  appName,
  heightClass = "h-[320px] sm:h-[400px] md:h-[460px]",
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [dynamicRatios, setDynamicRatios] = useState<Record<string, number>>({});

  const getRatio = (src: string): number => {
    if (SCREENSHOT_METADATA[src]?.ratio) {
      return SCREENSHOT_METADATA[src].ratio;
    }
    if (dynamicRatios[src]) {
      return dynamicRatios[src];
    }
    return 16 / 9; // Fallback default
  };

  const handleImageLoad = (src: string, e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth && naturalHeight && !SCREENSHOT_METADATA[src]) {
      const ratio = naturalWidth / naturalHeight;
      setDynamicRatios((prev) => ({ ...prev, [src]: ratio }));
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -380 : 380;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Keyboard navigation for modal lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") {
        setSelectedIndex(null);
      } else if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : screenshots.length - 1));
      } else if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => (prev !== null && prev < screenshots.length - 1 ? prev + 1 : 0));
      }
    },
    [selectedIndex, screenshots.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!screenshots || screenshots.length === 0) {
    return null;
  }

  const selectedSrc = selectedIndex !== null ? screenshots[selectedIndex] : null;
  const selectedRatio = selectedSrc ? getRatio(selectedSrc) : 1;
  const isSelectedPortrait = selectedRatio < 1;

  return (
    <div className="relative group">
      {/* Scroll controls */}
      <div className="hidden sm:flex items-center justify-end absolute -top-12 right-0 gap-2">
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-all shadow-2xs hover:shadow-xs active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-all shadow-2xs hover:shadow-xs active:scale-95"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Play Store-style Horizontal scroll container */}
      <div
        ref={scrollRef}
        className={`${heightClass} flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none scroll-smooth items-stretch`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {screenshots.map((src, index) => {
          const ratio = getRatio(src);
          const isPortrait = ratio < 1;

          return (
            <div
              key={index}
              onClick={() => setSelectedIndex(index)}
              style={{ aspectRatio: `${ratio}` }}
              className="snap-start shrink-0 h-full rounded-2xl overflow-hidden relative cursor-pointer border border-slate-200/90 hover:border-slate-400 bg-slate-900/5 hover:bg-slate-900/10 transition-all duration-300 group/item shadow-2xs hover:shadow-md flex items-center justify-center p-1"
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-950/5">
                <Image
                  src={src}
                  alt={`${appName} screenshot ${index + 1}`}
                  fill
                  sizes={isPortrait ? "(max-width: 640px) 200px, 300px" : "(max-width: 640px) 350px, 600px"}
                  loading="lazy"
                  onLoad={(e) => handleImageLoad(src, e)}
                  className="object-contain group-hover/item:scale-[1.02] transition-transform duration-300 select-none"
                />
              </div>

              {/* Hover Badge */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity flex items-end justify-between p-3 pointer-events-none">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-medium border border-white/10">
                  {isPortrait ? (
                    <Smartphone className="w-3 h-3 text-cyan-400" />
                  ) : (
                    <Monitor className="w-3 h-3 text-amber-400" />
                  )}
                  <span>
                    {isPortrait ? "Portrait" : "Landscape"} • {index + 1}
                  </span>
                </div>
                <div className="p-1.5 rounded-lg bg-white/25 text-white backdrop-blur-md">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Lightbox */}
      {selectedSrc && selectedIndex !== null && (
        <div
          onClick={() => setSelectedIndex(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
        >
          {/* Top Bar with counter & close */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-6xl flex items-center justify-between pb-3 text-white text-xs sm:text-sm font-medium z-50"
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-white font-display text-sm sm:text-base">{appName}</span>
              <span className="text-white/40">•</span>
              <span className="text-white/80">
                Screenshot {selectedIndex + 1} of {screenshots.length}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/10 text-white/70 text-[11px] font-mono uppercase">
                {isSelectedPortrait ? "Portrait" : "Landscape"}
              </span>
            </div>
            <button
              onClick={() => setSelectedIndex(null)}
              aria-label="Close preview"
              className="p-2.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Image Display Area with Prev/Next buttons */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex items-center justify-center max-w-[94vw] max-h-[82vh]"
          >
            {/* Prev Button */}
            {screenshots.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : screenshots.length - 1);
                }}
                aria-label="Previous screenshot"
                className="absolute -left-3 sm:-left-6 lg:-left-12 z-20 p-2 sm:p-3 rounded-full bg-slate-900/80 border border-white/20 text-white hover:bg-slate-800 transition-all shadow-lg active:scale-95"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}

            {/* Responsive Screenshot Container (Never Cropped) */}
            <div
              style={{
                aspectRatio: `${selectedRatio}`,
                maxHeight: "80vh",
                maxWidth: isSelectedPortrait ? "min(90vw, 480px)" : "min(92vw, 1050px)",
                width: isSelectedPortrait ? "auto" : "100%",
                height: isSelectedPortrait ? "80vh" : "auto",
              }}
              className="relative rounded-2xl overflow-hidden border border-white/15 bg-black shadow-2xl flex items-center justify-center"
            >
              <Image
                src={selectedSrc}
                alt={`${appName} preview ${selectedIndex + 1}`}
                fill
                priority
                className="object-contain select-none"
              />
            </div>

            {/* Next Button */}
            {screenshots.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex(selectedIndex < screenshots.length - 1 ? selectedIndex + 1 : 0);
                }}
                aria-label="Next screenshot"
                className="absolute -right-3 sm:-right-6 lg:-right-12 z-20 p-2 sm:p-3 rounded-full bg-slate-900/80 border border-white/20 text-white hover:bg-slate-800 transition-all shadow-lg active:scale-95"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}
          </div>

          {/* Thumbnail Dots Indicator */}
          {screenshots.length > 1 && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 pt-4 z-50"
            >
              {screenshots.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedIndex(i)}
                  aria-label={`Go to screenshot ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    selectedIndex === i
                      ? "w-7 bg-white"
                      : "w-2 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
