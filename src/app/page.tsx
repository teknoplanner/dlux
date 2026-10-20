import React from "react";
import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { AppGrid } from "@/components/sections/AppGrid";
import { Featured } from "@/components/sections/Featured";
import { About } from "@/components/sections/About";
import { apps } from "@/data/apps";
import { generateWebsiteSchema, generateAppsItemListSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: "D Lucky X | Free Android Games & Apps from Indonesia" },
  description:
    "Casual games, learning apps for kids, and an offline PDF editor for Android. Browse every D Lucky X app and install it from Google Play.",
  alternates: {
    canonical: "https://dluckyx.cloud/",
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
      <About />
    </>
  );
}
