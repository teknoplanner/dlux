import { Metadata } from "next";
import { developer } from "@/data/apps";
import { BlogHub } from "@/components/blog/BlogHub";

export const metadata: Metadata = {
  title: { absolute: "Tips Game Mobile, Gaming Gear & Panduan Gadget Anak | D Lucky X" },
  description:
    "Tips game mobile (MLBB, Free Fire, Roblox, Minecraft), rekomendasi gaming gear HP, panduan gadget anak, dan trik PDF di Android dari D Lucky X.",
  alternates: {
    canonical: `${developer.website}/blog/`,
    languages: {
      "x-default": `${developer.website}/blog/`,
      id: `${developer.website}/blog/`,
      en: `${developer.website}/en/blog/`,
    },
  },
  twitter: { card: "summary" },
  openGraph: {
    title: "Tips Game Mobile, Gaming Gear & Panduan Gadget Anak | D Lucky X",
    description:
      "Tips game mobile (MLBB, Free Fire, Roblox, Minecraft), rekomendasi gaming gear HP, panduan gadget anak, dan trik PDF di Android dari D Lucky X.",
    url: `${developer.website}/blog/`,
    type: "website",
    images: [{ url: `${developer.website}/images/logo.png`, width: 512, height: 512 }],
  },
};

export default function Page() {
  return <BlogHub lang="id" />;
}
