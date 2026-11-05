import React from "react";
import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { AppGrid } from "@/components/sections/AppGrid";
import { Featured } from "@/components/sections/Featured";
import { About } from "@/components/sections/About";
import { BuyingGuides } from "@/components/blog/BuyingGuides";
import { apps } from "@/data/apps";
import { generateWebsiteSchema, generateAppsItemListSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: "D Lucky X | Game Android Gratis, Gaming Gear & Panduan Gadget Anak" },
  description:
    "Game Android gratis, aplikasi belajar anak, dan editor PDF offline, plus tips game mobile, rekomendasi gaming gear, dan panduan gadget anak dari studio Indonesia D Lucky X.",
  alternates: {
    canonical: "https://dluckyx.cloud/",
    languages: { "x-default": "https://dluckyx.cloud/" },
  },
};

export default function HomePage() {
  const websiteSchema = generateWebsiteSchema();
  const itemListSchema = generateAppsItemListSchema(apps);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <Hero />
      <AppGrid />
      <Featured />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <BuyingGuides lang="id" />
      </div>
      <About />
    </>
  );
}
