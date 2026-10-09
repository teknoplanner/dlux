import React from "react";

interface BrandLogoProps {
  className?: string;
  size?: number;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = "w-10 h-10",
  size,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="D Lucky X Logo"
    >
      <defs>
        {/* Background Gradient */}
        <linearGradient id="brandBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0a1122" />
          <stop offset="50%" stopColor="#040813" />
          <stop offset="100%" stopColor="#010206" />
        </linearGradient>

        {/* Outer Border Glow */}
        <linearGradient id="brandBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#10b981" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
        </linearGradient>

        {/* Central Ambient Glow */}
        <radialGradient id="brandBloom" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.7" />
          <stop offset="45%" stopColor="#06b6d4" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        {/* Emerald Beam Gradients */}
        <linearGradient id="brandEmeraldLight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="35%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <linearGradient id="brandEmeraldDark" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="40%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>

        {/* Cyan Beam Gradients */}
        <linearGradient id="brandCyanLight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="35%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="brandCyanDark" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="40%" stopColor="#0891b2" />
          <stop offset="100%" stopColor="#0e7490" />
        </linearGradient>

        {/* Core Star Gradient */}
        <linearGradient id="brandGemStar" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="25%" stopColor="#f0fdf4" />
          <stop offset="65%" stopColor="#a7f3d0" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>

        <filter id="brandGlow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="brandShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="14"
            stdDeviation="16"
            floodColor="#000000"
            floodOpacity="0.9"
          />
        </filter>
      </defs>

      {/* Squircle Container */}
      <rect width="512" height="512" rx="118" fill="url(#brandBg)" />
      <rect
        x="12"
        y="12"
        width="488"
        height="488"
        rx="106"
        fill="none"
        stroke="url(#brandBorder)"
        strokeWidth="5"
      />

      {/* Ambient Glow */}
      <circle cx="256" cy="256" r="200" fill="url(#brandBloom)" />

      <g transform="translate(256, 256)" filter="url(#brandGlow)">
        {/* UNDER BEAM (Cyan, at +45 deg) */}
        <g transform="rotate(45)" filter="url(#brandShadow)">
          {/* Left Wing */}
          <path
            d="M -175 -48 L -70 -48 L -70 0 L -175 0 Z"
            fill="url(#brandCyanLight)"
          />
          <path
            d="M -175 0 L -70 0 L -70 48 L -175 48 Z"
            fill="url(#brandCyanDark)"
          />
          <path
            d="M -175 -48 L -220 0 L -175 48 Z"
            fill="url(#brandCyanLight)"
          />

          {/* Right Wing */}
          <path
            d="M 70 -48 L 175 -48 L 175 0 L 70 0 Z"
            fill="url(#brandCyanLight)"
          />
          <path
            d="M 70 0 L 175 0 L 175 48 L 70 48 Z"
            fill="url(#brandCyanDark)"
          />
          <path
            d="M 175 -48 L 220 0 L 175 48 Z"
            fill="url(#brandCyanLight)"
          />

          {/* Inner Accent Glow Lines */}
          <line
            x1="-170"
            y1="0"
            x2="-75"
            y2="0"
            stroke="#a5f3fc"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.85"
          />
          <line
            x1="75"
            y1="0"
            x2="170"
            y2="0"
            stroke="#a5f3fc"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.85"
          />
        </g>

        {/* OVER BEAM (Emerald, at -45 deg) */}
        <g transform="rotate(-45)" filter="url(#brandShadow)">
          <path
            d="M -175 -48 L 175 -48 L 175 0 L -175 0 Z"
            fill="url(#brandEmeraldLight)"
          />
          <path
            d="M -175 0 L 175 0 L 175 48 L -175 48 Z"
            fill="url(#brandEmeraldDark)"
          />
          {/* Outer Angled Cuts */}
          <path
            d="M -175 -48 L -220 0 L -175 48 Z"
            fill="url(#brandEmeraldLight)"
          />
          <path
            d="M 175 -48 L 220 0 L 175 48 Z"
            fill="url(#brandEmeraldLight)"
          />
          {/* Spine Highlight */}
          <line
            x1="-165"
            y1="0"
            x2="165"
            y2="0"
            stroke="#a7f3d0"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.9"
          />
        </g>

        {/* CENTERPIECE: The Lucky Diamond Star Nexus */}
        <g filter="url(#brandShadow)">
          <rect
            x="-62"
            y="-62"
            width="124"
            height="124"
            rx="26"
            transform="rotate(45)"
            fill="#020610"
            stroke="#34d399"
            strokeWidth="4.5"
          />
          {/* 4-Leaf Lucky Clover Star */}
          <path
            d="M 0 -64 Q 0 0 64 0 Q 0 0 0 64 Q 0 0 -64 0 Q 0 0 0 -64 Z"
            fill="url(#brandGemStar)"
          />
          {/* Core Spark */}
          <circle cx="0" cy="0" r="12" fill="#ffffff" />
        </g>
      </g>
    </svg>
  );
};
