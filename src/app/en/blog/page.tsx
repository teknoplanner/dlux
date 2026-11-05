import { Metadata } from "next";
import { developer } from "@/data/apps";
import { BlogHub } from "@/components/blog/BlogHub";

export const metadata: Metadata = {
  title: { absolute: "Mobile Game Tips, Gaming Gear & Kids Tech Guides | D Lucky X" },
  description:
    "Mobile game tips (MLBB, Free Fire, Roblox, Minecraft), phone gaming gear picks, kids tech guides and Android PDF tricks from D Lucky X.",
  alternates: {
    canonical: `${developer.website}/en/blog/`,
    languages: {
      "x-default": `${developer.website}/blog/`,
      en: `${developer.website}/en/blog/`,
      id: `${developer.website}/blog/`,
    },
  },
  twitter: { card: "summary" },
  openGraph: {
    title: "Mobile Game Tips, Gaming Gear & Kids Tech Guides | D Lucky X",
    description:
      "Mobile game tips (MLBB, Free Fire, Roblox, Minecraft), phone gaming gear picks, kids tech guides and Android PDF tricks from D Lucky X.",
    url: `${developer.website}/en/blog/`,
    type: "website",
    images: [{ url: `${developer.website}/images/logo.png`, width: 512, height: 512 }],
  },
};

export default function Page() {
  return <BlogHub lang="en" />;
}
