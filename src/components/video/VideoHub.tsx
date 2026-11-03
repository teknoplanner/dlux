"use client";

import React, { useState, useMemo } from "react";
import { shorts, youtubeChannel, ShortVideo } from "@/data/shorts";
import { VideoModal } from "@/components/video/VideoModal";
import { Play, Sparkles, Youtube, Search, Film } from "lucide-react";

export const VideoHub: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "trivia" | "showcase">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVideo, setActiveVideo] = useState<ShortVideo | null>(null);

  const triviaCount = useMemo(() => shorts.filter((s) => s.category === "trivia").length, []);
  const showcaseCount = useMemo(() => shorts.filter((s) => s.category === "showcase").length, []);

  const filteredShorts = useMemo(() => {
    return shorts.filter((short) => {
      const matchCategory =
        selectedCategory === "all" ? true : short.category === selectedCategory;
      const matchQuery =
        searchQuery.trim() === ""
          ? true
          : short.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            short.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="bg-[#fafaf9] pt-28 pb-20 sm:pt-32 sm:pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <header className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200/80 text-red-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Youtube className="w-4 h-4 text-red-600" />
            <span>YouTube Shorts Channel</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-950 tracking-tight leading-tight">
            Video Shorts &amp; <span className="text-emerald-700">Trivia Game</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-700 leading-relaxed">
            Kumpulan video pendek seputar fakta unik dunia game, rahasia di balik layar game development, serta cuplikan gameplay seru dari studio D Lucky X.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href={youtubeChannel.shortsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/20 transition-all hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              <Youtube className="w-4 h-4 fill-current" />
              Buka Channel @dlux-tech
            </a>
          </div>
        </header>

        {/* Filter Controls & Search */}
        <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                selectedCategory === "all"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-950"
              }`}
            >
              <Film className="w-4 h-4" />
              Semua
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                selectedCategory === "all" ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"
              }`}>
                {shorts.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory("trivia")}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                selectedCategory === "trivia"
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-950"
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              Fakta &amp; Trivia Game
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                selectedCategory === "trivia" ? "bg-emerald-800 text-emerald-100" : "bg-slate-100 text-slate-600"
              }`}>
                {triviaCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory("showcase")}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                selectedCategory === "showcase"
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-950"
              }`}
            >
              Showcase Game
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                selectedCategory === "showcase" ? "bg-emerald-800 text-emerald-100" : "bg-slate-100 text-slate-600"
              }`}>
                {showcaseCount}
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari Roblox, Minecraft..."
              className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Video Cards Grid */}
        {filteredShorts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <p className="text-lg font-bold text-slate-800">Tidak ada video yang sesuai</p>
            <p className="text-sm text-slate-500 mt-1">Coba cari dengan kata kunci lain atau pilih tab Semua.</p>
            <button
              type="button"
              onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}
              className="mt-4 px-4 py-2 text-sm font-bold text-emerald-700 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredShorts.map((short) => (
              <article
                key={short.id}
                onClick={() => setActiveVideo(short)}
                className="group relative cursor-pointer flex flex-col rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 focus-within:ring-2 focus-within:ring-emerald-500"
              >
                {/* 9:16 Video Aspect Container */}
                <div className="relative aspect-[9/16] w-full overflow-hidden bg-slate-950">
                  <img
                    src={short.thumbnail}
                    alt={short.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback to standard YouTube thumbnail if dynamic thumb fails
                      (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${short.id}/hqdefault.jpg`;
                    }}
                  />

                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/20 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                    <div className="flex flex-wrap gap-1.5">
                      {short.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold border border-white/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {short.views && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 backdrop-blur-md text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                        {short.views}
                      </span>
                    )}
                  </div>

                  {/* Centered Play Button (Hover / Focus) */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 group-hover:bg-red-600">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Bottom Title & Action */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
                    <h2 className="text-white font-bold text-sm sm:text-base leading-snug line-clamp-3 group-hover:text-emerald-300 transition-colors">
                      {short.title}
                    </h2>
                    <p className="mt-2 text-xs text-slate-300 flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                      Klik untuk putar
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Bottom Banner CTA */}
        <section className="mt-16 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="max-w-xl text-center md:text-left">
            <span className="text-emerald-400 font-bold uppercase tracking-wider text-xs">
              Update Video Rutin
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-display font-extrabold text-white">
              Suka Konten Fakta &amp; Rahasia Game?
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
              Dukung kami dengan subscribe channel YouTube resmi D Lucky X untuk menonton update shorts terbaru seputar dunia game dan edukasi.
            </p>
          </div>
          <a
            href={youtubeChannel.channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 min-h-[44px] px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-red-600/25 transition-all hover:scale-105"
          >
            <Youtube className="w-5 h-5 fill-current" />
            Kunjungi Channel YouTube
          </a>
        </section>
      </div>

      {/* Lightbox Video Player Modal */}
      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </div>
  );
};
