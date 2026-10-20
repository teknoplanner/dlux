import React from "react";

// Decorative: a phone being cooled (spinning fan) while a stylus signs on its screen.
export const GearArt: React.FC = () => (
  <svg viewBox="0 0 480 340" aria-hidden="true" className="hv w-full h-auto max-w-md mx-auto lg:max-w-none">
    <circle className="hv-blob" cx="240" cy="170" r="150" fill="#d1fae5" />
    <g className="hv-float">
      <rect x="150" y="24" width="150" height="292" rx="26" fill="#0f172a" />
      <rect x="160" y="38" width="130" height="264" rx="18" fill="#fff" />
      <rect x="176" y="62" width="98" height="8" rx="4" fill="#0f172a" />
      <rect x="176" y="82" width="98" height="5" rx="2.5" fill="#cbd5e1" />
      <rect x="176" y="94" width="74" height="5" rx="2.5" fill="#cbd5e1" />
      <path
        className="hv-sign"
        d="M176 190 q10 -34 18 0 t18 0 t18 -14 t24 6"
        pathLength="160"
        fill="none"
        stroke="#d97706"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="160"
      />
      <line x1="176" y1="214" x2="274" y2="214" stroke="#cbd5e1" strokeWidth="2" />
      <g transform="translate(276 192) rotate(40)">
        <rect x="-7" y="-112" width="14" height="98" rx="7" fill="#047857" />
        <rect x="-7" y="-112" width="14" height="22" rx="7" fill="#0f172a" />
        <path d="M-7 -14 h14 l-7 14 Z" fill="#0f172a" />
      </g>
    </g>
    <g className="hv-float hv-d1">
      <circle cx="372" cy="262" r="52" fill="#0f172a" />
      <g className="hv-spin">
        <ellipse cx="372" cy="236" rx="11" ry="24" fill="#a7f3d0" />
        <ellipse cx="372" cy="288" rx="11" ry="24" fill="#a7f3d0" />
        <ellipse cx="346" cy="262" rx="24" ry="11" fill="#a7f3d0" />
        <ellipse cx="398" cy="262" rx="24" ry="11" fill="#a7f3d0" />
      </g>
      <circle cx="372" cy="262" r="9" fill="#fbbf24" />
    </g>
    <g className="hv-float hv-d3">
      <rect x="50" y="120" width="76" height="32" rx="16" fill="#0f172a" />
      <circle cx="108" cy="136" r="9" fill="#fbbf24" />
    </g>
  </svg>
);
