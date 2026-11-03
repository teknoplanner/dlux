import { Metadata } from "next";
import { developer } from "@/data/apps";
import { VideoHub } from "@/components/video/VideoHub";
import { generateBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Video Shorts & Trivia Game | D Lucky X",
  description:
    "Koleksi video YouTube Shorts resmi dari D Lucky X. Tonton fakta unik game Roblox, Minecraft, Tetris, rahasia game dev, dan cuplikan game studio.",
  alternates: {
    canonical: `${developer.website}/video/`,
    languages: {
      "x-default": `${developer.website}/video/`,
      id: `${developer.website}/video/`,
    },
  },
  twitter: { card: "summary_large_image" },
  openGraph: {
    title: "Video Shorts & Trivia Game | D Lucky X",
    description:
      "Koleksi video YouTube Shorts resmi dari D Lucky X. Tonton fakta unik game Roblox, Minecraft, Tetris, rahasia game dev, dan cuplikan game studio.",
    url: `${developer.website}/video/`,
    type: "website",
    images: [{ url: `${developer.website}/images/logo.png`, width: 512, height: 512 }],
  },
};

export default function Page() {
  const breadcrumb = generateBreadcrumbSchema([
    { name: "Beranda", url: `${developer.website}/` },
    { name: "Video Shorts", url: `${developer.website}/video/` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <VideoHub />
    </>
  );
}
