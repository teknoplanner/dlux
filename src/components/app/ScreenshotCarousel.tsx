"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";

interface ScreenshotCarouselProps {
  screenshots: string[];
  appName: string;
}

export const ScreenshotCarousel: React.FC<ScreenshotCarouselProps> = ({
  screenshots,
  appName,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!screenshots || screenshots.length === 0) {
    return null;
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group">
      {/* Scroll controls */}
      <div className="hidden sm:flex items-center justify-between absolute -top-12 right-0 gap-2">
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Horizontal scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {screenshots.map((src, index) => (
          <div
            key={index}
            onClick={() => setSelectedImage(src)}
            className="snap-start shrink-0 w-[280px] sm:w-[380px] md:w-[460px] aspect-video rounded-2xl overflow-hidden relative cursor-pointer border border-white/10 hover:border-cyan-400/50 transition-all duration-300 group/item shadow-lg"
          >
            <Image
              src={src}
              alt={`${appName} gameplay screenshot ${index + 1}`}
              fill
              className="object-cover group-hover/item:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity flex items-end justify-between p-4">
              <span className="text-xs text-white font-medium">Screenshot {index + 1}</span>
              <div className="p-1.5 rounded-lg bg-black/60 text-cyan-400">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Lightbox */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
        >
          <button
            onClick={() => setSelectedImage(null)}
            aria-label="Tutup preview"
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all z-50"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
          >
            <Image
              src={selectedImage}
              alt={`${appName} preview`}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
