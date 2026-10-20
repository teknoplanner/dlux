import { Metadata } from "next";
import { developer } from "@/data/apps";
import { BlogHub } from "@/components/blog/BlogHub";

export const metadata: Metadata = {
  title: "Blog & Panduan Aplikasi Android | D Lucky X",
  description:
    "Kumpulan artikel, tips privasi, panduan belajar anak, dan trik bermain game offline Android dari studio pengembang D Lucky X.",
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
    title: "Blog & Panduan Aplikasi Android | D Lucky X",
    description:
      "Kumpulan artikel, tips privasi, panduan belajar anak, dan trik bermain game offline Android dari studio pengembang D Lucky X.",
    url: `${developer.website}/blog/`,
    type: "website",
    images: [{ url: `${developer.website}/images/logo.png`, width: 512, height: 512 }],
  },
};

export default function Page() {
  return <BlogHub lang="id" />;
}
