import React from "react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

const WorldGameCanvas = dynamic(
  () => import("@/components/world/WorldGameCanvas").then((mod) => mod.WorldGameCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 w-full h-full bg-[#090d16] flex flex-col items-center justify-center select-none text-white z-50">
        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-3xl bg-[#1e293b]/90 border-2 border-amber-400/40 flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
            <span className="text-3xl animate-bounce">🐱</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <p className="font-black text-sm tracking-widest text-amber-300 uppercase">
              MEMUAT D LUCKY WORLD 3D...
            </p>
            <p className="text-xs text-slate-400 font-medium">
              Menyiapkan kepulauan & aset game
            </p>
          </div>
        </div>
      </div>
    ),
  }
);

export const metadata: Metadata = {
  title: "D Lucky World 3D — Coastal Gaming Archipelago",
  description:
    "Explore D Lucky World 3D in your browser! Drive, run, and jump across themed gaming islands with mascot Milo the Cat, collect tokens, score goals, and fast-travel with the virtual smartphone map.",
  alternates: {
    canonical: "https://dluckyx.cloud/world/",
  },
  openGraph: {
    title: "D Lucky World 3D — Coastal Gaming Archipelago",
    description:
      "Play D Lucky World 3D directly in your browser with Three.js. Explore gaming islands with mascot Milo, complete quests, and discover secrets.",
    images: ["/images/blog/milo-cat-panduan-lengkap-game-petualangan-kucing-lucu-dan-menantang-tri.webp"],
  },
};

export default function WorldPage() {
  return (
    <main className="fixed inset-0 w-screen h-screen h-[100dvh] overflow-hidden bg-slate-950 select-none">
      <WorldGameCanvas />
    </main>
  );
}
