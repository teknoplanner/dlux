import React from "react";
import type { Metadata } from "next";
import { WorldGameCanvas } from "@/components/world/WorldGameCanvas";

export const metadata: Metadata = {
  title: "D Lucky World 3D — Coastal Gaming Archipelago",
  description:
    "Explore D Lucky World 3D in your browser! Drive, run, and jump across themed gaming islands with mascot Milo the Cat, collect tokens, score goals, and fast-travel with the virtual smartphone map.",
  openGraph: {
    title: "D Lucky World 3D — Coastal Gaming Archipelago",
    description:
      "Play D Lucky World 3D directly in your browser with Three.js. Explore gaming islands with mascot Milo, complete quests, and discover secrets.",
    images: ["/images/blog/milo-cat-panduan-lengkap-game-petualangan-kucing-lucu-dan-menantang-tri.webp"],
  },
};

export default function WorldPage() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-slate-950 relative select-none">
      <WorldGameCanvas />
    </main>
  );
}
