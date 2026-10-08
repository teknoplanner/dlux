import React from "react";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { AppGrid } from "@/components/sections/AppGrid";
import { Featured } from "@/components/sections/Featured";
import { About } from "@/components/sections/About";
import { WhyUs } from "@/components/sections/WhyUs";
import { Cta } from "@/components/sections/Cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <AppGrid />
      <Featured />
      <About />
      <WhyUs />
      <Cta />
    </>
  );
}
