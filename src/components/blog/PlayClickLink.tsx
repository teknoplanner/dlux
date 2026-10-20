"use client";

import React from "react";
import { trackPlayStoreClick } from "@/lib/analytics";

// Keeps analytics on the Play Store click while the banner itself stays a server component.
export const PlayClickLink: React.FC<{
  href: string;
  slug: string;
  name: string;
  source: string;
  className?: string;
  children: React.ReactNode;
}> = ({ href, slug, name, source, className, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" onClick={() => trackPlayStoreClick(slug, name, source)} className={className}>
    {children}
  </a>
);
