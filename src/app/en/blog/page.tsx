import { Metadata } from "next";
import { developer } from "@/data/apps";
import { BlogHub } from "@/components/blog/BlogHub";

export const metadata: Metadata = {
  title: "Android Apps & Games Blog | Guides & Tips | D Lucky X",
  description:
    "Explore actionable guides on offline PDF editing, penalty shootout techniques, toddler phonics learning, retro 2D platforming, and private feline budgeting from D Lucky X.",
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
    title: "Android Apps & Games Blog | Guides & Tips | D Lucky X",
    description:
      "Explore actionable guides on offline PDF editing, penalty shootout techniques, toddler phonics learning, retro 2D platforming, and private feline budgeting from D Lucky X.",
    url: `${developer.website}/en/blog/`,
    type: "website",
    images: [{ url: `${developer.website}/images/logo.png`, width: 512, height: 512 }],
  },
};

export default function Page() {
  return <BlogHub lang="en" />;
}
