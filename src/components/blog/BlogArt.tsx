import React from "react";

// Decorative: an article page that writes itself, a bookmark that swings, a phone that drifts.
export const BlogArt: React.FC = () => (
  <svg viewBox="0 0 480 340" aria-hidden="true" className="hv w-full h-auto max-w-md mx-auto lg:max-w-none">
    <circle className="hv-blob" cx="240" cy="170" r="150" fill="#d1fae5" />
    <g className="hv-float hv-d2">
      <rect x="40" y="150" width="70" height="130" rx="14" fill="#0f172a" />
      <rect x="47" y="162" width="56" height="106" rx="8" fill="#fff" />
      <rect x="55" y="174" width="40" height="6" rx="3" fill="#047857" />
      <rect x="55" y="190" width="40" height="4" rx="2" fill="#cbd5e1" />
      <rect x="55" y="200" width="30" height="4" rx="2" fill="#cbd5e1" />
    </g>
    <g className="hv-float">
      <rect x="140" y="30" width="230" height="280" rx="16" fill="#fff" stroke="#cbd5e1" strokeWidth="2" />
      <rect x="156" y="46" width="198" height="96" rx="10" fill="#047857" />
      <circle cx="318" cy="76" r="14" fill="#fbbf24" />
      <path d="M156 142 L220 98 L262 126 L300 104 L354 142 Z" fill="#065f46" />
      <rect className="hv-type" x="156" y="160" width="150" height="12" rx="6" fill="#0f172a" />
      <rect className="hv-type hv-t2" x="156" y="188" width="198" height="7" rx="3.5" fill="#cbd5e1" />
      <rect className="hv-type hv-t3" x="156" y="206" width="180" height="7" rx="3.5" fill="#cbd5e1" />
      <rect className="hv-type hv-t4" x="156" y="224" width="198" height="7" rx="3.5" fill="#cbd5e1" />
      <rect className="hv-type hv-t5" x="156" y="242" width="120" height="7" rx="3.5" fill="#cbd5e1" />
    </g>
    <path className="hv-swing" d="M336 30 h28 v46 l-14 -10 l-14 10 Z" fill="#fbbf24" />
    <g className="hv-float hv-d1">
      <rect x="384" y="196" width="72" height="40" rx="10" fill="#0f172a" />
      <rect x="396" y="212" width="48" height="8" rx="4" fill="#fbbf24" />
    </g>
  </svg>
);
