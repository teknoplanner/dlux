import React from "react";

// Decorative hero illustration: one phone world (penalty kick) with three app
// worlds drifting around it (PDF signing, ABC blocks, math). Pure SVG + CSS loop.
export const HeroArt: React.FC = () => (
  <svg
    viewBox="0 0 480 480"
    role="img"
    aria-label="Illustration of an Android phone showing a penalty kick, with a signed PDF, letter blocks and a math tile floating around it"
    className="hv w-full h-auto max-w-sm mx-auto lg:max-w-none"
  >
    <circle className="hv-blob" cx="240" cy="240" r="205" fill="#d1fae5" />

    {/* phone */}
    <rect x="150" y="56" width="180" height="368" rx="30" fill="#0f172a" />
    <rect x="160" y="72" width="160" height="336" rx="22" fill="#047857" />
    <g fill="none" stroke="#ecfdf5" strokeWidth="2" opacity=".55">
      <rect x="196" y="96" width="88" height="40" />
      <line x1="160" y1="250" x2="320" y2="250" />
      <circle cx="240" cy="250" r="26" />
    </g>
    <rect x="196" y="92" width="88" height="6" rx="3" fill="#ecfdf5" />
    <rect className="hv-gk" x="228" y="112" width="24" height="12" rx="4" fill="#f8fafc" />
    <g className="hv-ball">
      <circle cx="240" cy="352" r="13" fill="#fff" stroke="#0f172a" strokeWidth="2.5" />
      <circle cx="240" cy="352" r="4.5" fill="#0f172a" />
    </g>
    <rect x="218" y="64" width="44" height="6" rx="3" fill="#0f172a" />

    {/* PDF being signed */}
    <g transform="translate(14 0) rotate(-8 90 190)">
      <g className="hv-float">
        <rect x="36" y="112" width="112" height="148" rx="10" fill="#fff" stroke="#cbd5e1" strokeWidth="2" />
        <g stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round">
          <line x1="54" y1="134" x2="128" y2="134" />
          <line x1="54" y1="152" x2="116" y2="152" />
          <line x1="54" y1="170" x2="124" y2="170" />
        </g>
        <path
          className="hv-sign"
          d="M54 226 q10 -34 18 0 t18 0 t18 -14 t20 6"
          pathLength="160"
          fill="none"
          stroke="#d97706"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="160"
        />
      </g>
    </g>

    {/* ABC blocks */}
    <g className="hv-float hv-d1">
      <rect x="352" y="96" width="50" height="50" rx="12" fill="#0f172a" />
      <text x="377" y="130" textAnchor="middle" fontSize="28" fontWeight="700" fill="#fbbf24">A</text>
    </g>
    <g className="hv-float hv-d2">
      <rect x="396" y="154" width="50" height="50" rx="12" fill="#047857" />
      <text x="421" y="188" textAnchor="middle" fontSize="28" fontWeight="700" fill="#fff">B</text>
    </g>
    <g className="hv-float hv-d3">
      <rect x="348" y="212" width="50" height="50" rx="12" fill="#fbbf24" />
      <text x="373" y="246" textAnchor="middle" fontSize="28" fontWeight="700" fill="#0f172a">C</text>
    </g>

    {/* math tile */}
    <g className="hv-float hv-d2">
      <rect x="320" y="338" width="124" height="64" rx="14" fill="#fff" stroke="#cbd5e1" strokeWidth="2" />
      <text x="382" y="380" textAnchor="middle" fontSize="26" fontWeight="700" fill="#0f172a">2 + 3 = 5</text>
    </g>
  </svg>
);
