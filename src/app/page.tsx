import React from "react";
import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { AppGrid } from "@/components/sections/AppGrid";
import { Featured } from "@/components/sections/Featured";
import { About } from "@/components/sections/About";
import { Cta } from "@/components/sections/Cta";
import { apps } from "@/data/apps";
import { generateWebsiteSchema, generateAppsItemListSchema } from "@/lib/seo";

export const metadata: Metadata = {
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
      <Stats />
      <AppGrid />
      <Featured />
      <About />
      <Cta />
    </>
  );
}
