"use client";

import React from "react";

// =============================================================================
// HIGH-QUALITY GAME UI VECTOR ICONS FOR ANTIGRAVITY WORLD
// Stylized, crisp, vibrant Game UI badges inspired by AAA adventure / JRPG games
// =============================================================================

export interface GameIconProps {
  className?: string;
  size?: number;
}

// -----------------------------------------------------------------------------
// 1. WEATHER ICONS (Day Sun, Night Moon, Rain Cloud, Snowflake, Weather Compass)
// -----------------------------------------------------------------------------
export const GameIconWeather: React.FC<GameIconProps & { type: "day" | "night" | "rain" | "snow" | "header" }> = ({
  type,
  className = "w-5 h-5",
  size,
}) => {
  const style = size ? { width: size, height: size } : undefined;

  switch (type) {
    case "day":
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} style={style} aria-label="Daytime Sun">
          <circle cx="16" cy="16" r="6.5" fill="url(#sunCoreGrad)" stroke="#b45309" strokeWidth="1.2" />
          <g stroke="#f59e0b" strokeWidth="2" strokeLinecap="round">
            <line x1="16" y1="3" x2="16" y2="6.5" />
            <line x1="16" y1="25.5" x2="16" y2="29" />
            <line x1="3" y1="16" x2="6.5" y2="16" />
            <line x1="25.5" y1="16" x2="29" y2="16" />
            <line x1="6.8" y1="6.8" x2="9.3" y2="9.3" />
            <line x1="22.7" y1="22.7" x2="25.2" y2="25.2" />
            <line x1="6.8" y1="25.2" x2="9.3" y2="22.7" />
            <line x1="22.7" y1="9.3" x2="25.2" y2="6.8" />
          </g>
          <circle cx="14" cy="14" r="2" fill="#fef08a" opacity="0.8" />
          <defs>
            <radialGradient id="sunCoreGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="60%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#f59e0b" />
            </radialGradient>
          </defs>
        </svg>
      );

    case "night":
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} style={style} aria-label="Night Moon">
          <path
            d="M23 18.5C22.2 23 18.2 26.5 13.5 26.5C7.7 26.5 3 21.8 3 16C3 10.8 6.8 6.5 11.8 5.6C10.6 7.6 10 9.9 10 12.5C10 18 14.5 22.5 20 22.5C21.1 22.5 22.1 22.3 23 21.9V18.5Z"
            fill="url(#moonGrad)"
            stroke="#1e3a8a"
            strokeWidth="1.2"
          />
          {/* Twinkling starlets */}
          <path d="M24 7L24.8 9.2L27 10L24.8 10.8L24 13L23.2 10.8L21 10L23.2 9.2L24 7Z" fill="#fde047" />
          <path d="M26 19L26.5 20.5L28 21L26.5 21.5L26 23L25.5 21.5L24 21L25.5 20.5L26 19Z" fill="#93c5fd" />
          <defs>
            <linearGradient id="moonGrad" x1="5" y1="6" x2="21" y2="25" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="55%" stopColor="#93c5fd" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
      );

    case "rain":
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} style={style} aria-label="Rain">
          {/* Cloud body */}
          <path
            d="M9 20C6.2 20 4 17.8 4 15C4 12.5 5.8 10.5 8.2 10.1C9.2 6.5 12.5 4 16.5 4C21.2 4 25 7.8 25 12.5C25 12.7 25 12.9 25 13.1C26.7 13.9 28 15.8 28 18C28 20.8 25.8 23 23 23H9C7.3 23 9 20 9 20Z"
            fill="url(#rainCloudGrad)"
            stroke="#334155"
            strokeWidth="1.2"
          />
          {/* Rain droplets */}
          <g stroke="#06b6d4" strokeWidth="1.8" strokeLinecap="round">
            <line x1="10" y1="23" x2="8" y2="27" />
            <line x1="16" y1="23" x2="14" y2="28" />
            <line x1="22" y1="23" x2="20" y2="27" />
          </g>
          <defs>
            <linearGradient id="rainCloudGrad" x1="16" y1="4" x2="16" y2="23" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
          </defs>
        </svg>
      );

    case "snow":
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} style={style} aria-label="Snow">
          <g stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round">
            <line x1="16" y1="4" x2="16" y2="28" />
            <line x1="5.6" y1="10" x2="26.4" y2="22" />
            <line x1="5.6" y1="22" x2="26.4" y2="10" />
            {/* Ice crystal branches */}
            <path d="M13 7L16 9.5L19 7" fill="none" strokeWidth="1.4" />
            <path d="M13 25L16 22.5L19 25" fill="none" strokeWidth="1.4" />
            <path d="M8 12.5L10.5 13.5L9.5 16" fill="none" strokeWidth="1.4" />
            <path d="M24 19.5L21.5 18.5L22.5 16" fill="none" strokeWidth="1.4" />
          </g>
          <circle cx="16" cy="16" r="2.4" fill="#bae6fd" stroke="#0284c7" strokeWidth="1" />
        </svg>
      );

    case "header":
    default:
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} style={style} aria-label="Weather Atmosphere">
          {/* Sun behind cloud */}
          <circle cx="12" cy="12" r="5" fill="url(#sunCoreGrad)" stroke="#b45309" strokeWidth="1" />
          <path
            d="M12 21C9.8 21 8 19.2 8 17C8 15 9.4 13.3 11.4 12.9C12.2 10.1 14.8 8 18 8C21.9 8 25 11.1 25 15C26.7 15.5 28 17.1 28 19C28 21.2 26.2 23 24 23H12"
            fill="url(#sunCloudGrad)"
            stroke="#475569"
            strokeWidth="1.2"
          />
          <defs>
            <linearGradient id="sunCloudGrad" x1="18" y1="8" x2="18" y2="23" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            <radialGradient id="sunCoreGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="60%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#f59e0b" />
            </radialGradient>
          </defs>
        </svg>
      );
  }
};

// -----------------------------------------------------------------------------
// 2. AUDIO / MUSIC TOGGLE ICON
// -----------------------------------------------------------------------------
export const GameIconAudio: React.FC<GameIconProps & { enabled: boolean }> = ({
  enabled,
  className = "w-5 h-5",
  size,
}) => {
  const style = size ? { width: size, height: size } : undefined;
  if (enabled) {
    return (
      <svg viewBox="0 0 32 32" fill="none" className={className} style={style} aria-label="Music Playing">
        {/* Melodic Eighth Note */}
        <path
          d="M11 23C8.8 23 7 21.2 7 19C7 16.8 8.8 15 11 15C12 15 12.9 15.4 13.5 16V8C13.5 6.9 14.4 6 15.5 6H21C22.1 6 23 6.9 23 8V11C23 11.6 22.6 12 22 12H16V19C16 19.3 16 19.7 15.9 20C15.4 21.7 13.9 23 11 23Z"
          fill="url(#musicNoteGrad)"
          stroke="#15803d"
          strokeWidth="1.2"
        />
        {/* Animated Soundwave Arc */}
        <path d="M22 15C24.5 16.5 26 19 26 22" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M24 12C27.5 14.5 29.5 18 29.5 22" stroke="#4ade80" strokeWidth="1.6" strokeLinecap="round" />
        <defs>
          <linearGradient id="musicNoteGrad" x1="15" y1="6" x2="11" y2="23" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} style={style} aria-label="Music Muted">
      <path
        d="M11 23C8.8 23 7 21.2 7 19C7 16.8 8.8 15 11 15C12 15 12.9 15.4 13.5 16V8C13.5 6.9 14.4 6 15.5 6H21C22.1 6 23 6.9 23 8V11C23 11.6 22.6 12 22 12H16V19"
        fill="#94a3b8"
        stroke="#475569"
        strokeWidth="1.2"
      />
      {/* Red Strike-through bar */}
      <line x1="5" y1="5" x2="27" y2="27" stroke="#ef4444" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="5" y1="5" x2="27" y2="27" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeDasharray="2 3" />
    </svg>
  );
};

// -----------------------------------------------------------------------------
// 3. MAP / ATLAS ICON
// -----------------------------------------------------------------------------
export const GameIconMap: React.FC<GameIconProps> = ({ className = "w-5 h-5", size }) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} style={style} aria-label="Island Map">
      {/* Folded Map Canvas */}
      <path d="M4 8L11 5L21 9L28 6V24L21 27L11 23L4 26V8Z" fill="url(#mapPaperGrad)" stroke="#78350f" strokeWidth="1.4" strokeLinejoin="round" />
      {/* Fold lines */}
      <line x1="11" y1="5" x2="11" y2="23" stroke="#b45309" strokeWidth="1" strokeDasharray="1.5 1.5" />
      <line x1="21" y1="9" x2="21" y2="27" stroke="#b45309" strokeWidth="1" strokeDasharray="1.5 1.5" />
      {/* Island contours */}
      <ellipse cx="16" cy="16" rx="3.5" ry="2.5" fill="#a7f3d0" stroke="#047857" strokeWidth="0.8" />
      {/* Red Treasure X Spot */}
      <path d="M19 13L23 17M23 13L19 17" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" />
      <defs>
        <linearGradient id="mapPaperGrad" x1="16" y1="5" x2="16" y2="27" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fffdf6" />
          <stop offset="100%" stopColor="#fef08a" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// -----------------------------------------------------------------------------
// 4. COMPASS ROSE ICON
// -----------------------------------------------------------------------------
export const GameIconCompass: React.FC<GameIconProps> = ({ className = "w-5 h-5", size }) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} style={style} aria-label="Compass">
      {/* Outer Brass Ring */}
      <circle cx="16" cy="16" r="13" fill="#fffdf6" stroke="#b45309" strokeWidth="2" />
      <circle cx="16" cy="16" r="11" fill="none" stroke="#ca8a04" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
      {/* Compass Needle (North Red, South Slate) */}
      <polygon points="16,5 19,16 16,14" fill="#dc2626" stroke="#991b1b" strokeWidth="0.8" />
      <polygon points="16,5 13,16 16,14" fill="#ef4444" stroke="#991b1b" strokeWidth="0.8" />
      <polygon points="16,27 19,16 16,18" fill="#475569" stroke="#1e293b" strokeWidth="0.8" />
      <polygon points="16,27 13,16 16,18" fill="#64748b" stroke="#1e293b" strokeWidth="0.8" />
      {/* Brass Center Rivet */}
      <circle cx="16" cy="16" r="2.2" fill="#facc15" stroke="#78350f" strokeWidth="1" />
    </svg>
  );
};

// -----------------------------------------------------------------------------
// 5. QUEST / EXPEDITION SCROLL ICON
// -----------------------------------------------------------------------------
export const GameIconQuest: React.FC<GameIconProps> = ({ className = "w-5 h-5", size }) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} style={style} aria-label="Quests Scroll">
      {/* Rolled Parchment Scroll */}
      <path
        d="M6 8C6 6.3 7.3 5 9 5H24C25.7 5 27 6.3 27 8C27 9.7 25.7 11 24 11V24C24 25.7 22.7 27 21 27H7C5.3 27 4 25.7 4 24C4 22.3 5.3 21 7 21H24"
        fill="url(#scrollParchmentGrad)"
        stroke="#78350f"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      {/* Script text lines */}
      <line x1="10" y1="14" x2="20" y2="14" stroke="#a16207" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="10" y1="17.5" x2="18" y2="17.5" stroke="#a16207" strokeWidth="1.2" strokeLinecap="round" />
      {/* Royal Wax Seal */}
      <circle cx="21" cy="21" r="3.2" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
      <circle cx="21" cy="21" r="1.4" fill="#f87171" />
      <defs>
        <linearGradient id="scrollParchmentGrad" x1="16" y1="5" x2="16" y2="27" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fffdf6" />
          <stop offset="100%" stopColor="#fde047" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// -----------------------------------------------------------------------------
// 6. RESIDENTS / VILLAGERS DIRECTORY ICON
// -----------------------------------------------------------------------------
export const GameIconResidents: React.FC<GameIconProps> = ({ className = "w-5 h-5", size }) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} style={style} aria-label="Residents">
      {/* Left Adventurer */}
      <circle cx="10" cy="12" r="3.5" fill="#fde047" stroke="#78350f" strokeWidth="1.2" />
      <path d="M5 23C5 19.5 7.5 17.5 10 17.5C12.5 17.5 15 19.5 15 23" fill="#38bdf8" stroke="#0369a1" strokeWidth="1.2" strokeLinecap="round" />
      {/* Right / Center Hero */}
      <circle cx="20" cy="11" r="4.2" fill="#fed7aa" stroke="#78350f" strokeWidth="1.2" />
      <path d="M14 24C14 20 17 17 20 17C23 17 26 20 26 24" fill="#f97316" stroke="#c2410c" strokeWidth="1.2" strokeLinecap="round" />
      {/* Feathery explorer hat plume */}
      <path d="M18 6C19.5 4.5 22 4.5 23 5C22.5 7 21 7.5 19.5 7.5" fill="#10b981" stroke="#047857" strokeWidth="0.8" />
    </svg>
  );
};

// -----------------------------------------------------------------------------
// 7. ARCADE / MINIGAMES CONTROLLER ICON
// -----------------------------------------------------------------------------
export const GameIconArcade: React.FC<GameIconProps> = ({ className = "w-5 h-5", size }) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} style={style} aria-label="Arcade Games">
      {/* Game Controller Chassis */}
      <path
        d="M6 14C6 11 9 10 16 10C23 10 26 11 26 14C26 19 28 24 24.5 26C21.5 27.5 19 23 16 23C13 23 10.5 27.5 7.5 26C4 24 6 19 6 14Z"
        fill="url(#gamepadGrad)"
        stroke="#5c3e21"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* D-Pad Cross */}
      <g fill="#3e2723">
        <rect x="10" y="14" width="3" height="7" rx="1" />
        <rect x="8" y="16" width="7" height="3" rx="1" />
      </g>
      {/* Colored Action Buttons */}
      <circle cx="21" cy="15" r="1.4" fill="#ef4444" stroke="#991b1b" strokeWidth="0.6" />
      <circle cx="23.5" cy="17.5" r="1.4" fill="#22c55e" stroke="#15803d" strokeWidth="0.6" />
      <circle cx="18.5" cy="17.5" r="1.4" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="0.6" />
      <circle cx="21" cy="20" r="1.4" fill="#eab308" stroke="#a16207" strokeWidth="0.6" />
      <defs>
        <linearGradient id="gamepadGrad" x1="16" y1="10" x2="16" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fffdf6" />
          <stop offset="100%" stopColor="#fed7aa" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// -----------------------------------------------------------------------------
// 8. TROPICAL ISLAND LOCATION CREST ICON
// -----------------------------------------------------------------------------
export const GameIconIsland: React.FC<GameIconProps> = ({ className = "w-5 h-5", size }) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} style={style} aria-label="Island Location">
      {/* Golden Sandy Knoll */}
      <ellipse cx="16" cy="24" rx="12" ry="4.5" fill="#fde047" stroke="#b45309" strokeWidth="1.2" />
      {/* Ocean Wavelets */}
      <path d="M3 25C5 24 7 26 9 25C11 24 13 26 15 25" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M17 26C19 25 21 27 23 26C25 25 27 27 29 26" stroke="#0284c7" strokeWidth="1.2" strokeLinecap="round" />
      {/* Palm Tree Trunk */}
      <path d="M15 23C15 17 18 13 19 9" stroke="#78350f" strokeWidth="2.2" strokeLinecap="round" />
      {/* Palm Fronds */}
      <path d="M19 9C15 7 11 8 8 11" stroke="#15803d" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M19 9C17 6 18 3 20 2" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
      <path d="M19 9C23 7 26 8 28 12" stroke="#15803d" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M19 9C22 10 24 13 25 16" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" />
      {/* Coconut cluster */}
      <circle cx="17.5" cy="10" r="1.3" fill="#78350f" />
      <circle cx="19.5" cy="10.5" r="1.3" fill="#78350f" />
    </svg>
  );
};

// -----------------------------------------------------------------------------
// 9. SPRINT / SPEED NITRO ICON
// -----------------------------------------------------------------------------
export const GameIconSprint: React.FC<GameIconProps> = ({ className = "w-5 h-5", size }) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} style={style} aria-label="Sprint Nitro">
      {/* Glowing Lightning Energy Bolt */}
      <polygon
        points="18,3 8,17 15,17 13,29 24,14 17,14"
        fill="url(#sprintBoltGrad)"
        stroke="#b45309"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      {/* Inner highlight core */}
      <polygon points="17,6 10,16 15,16 14,24 21,15 16,15" fill="#fef08a" opacity="0.8" />
      <defs>
        <linearGradient id="sprintBoltGrad" x1="16" y1="3" x2="16" y2="29" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="45%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// -----------------------------------------------------------------------------
// 10. MILO THE EXPLORER CAT PORTRAIT ICON
// -----------------------------------------------------------------------------
export const GameIconMilo: React.FC<GameIconProps> = ({ className = "w-6 h-6", size }) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} style={style} aria-label="Milo Cat Avatar">
      {/* Cat Ears */}
      <polygon points="7,14 9,4 15,10" fill="#f97316" stroke="#c2410c" strokeWidth="1" />
      <polygon points="8.5,12 10,6 13.5,9.5" fill="#fecaca" />
      <polygon points="25,14 23,4 17,10" fill="#f97316" stroke="#c2410c" strokeWidth="1" />
      <polygon points="23.5,12 22,6 18.5,9.5" fill="#fecaca" />
      {/* Head */}
      <ellipse cx="16" cy="18" rx="10.5" ry="9" fill="#fed7aa" stroke="#c2410c" strokeWidth="1.2" />
      {/* Ginger Stripes */}
      <path d="M16 10V14M13 11L14 14M19 11L18 14" stroke="#ea580c" strokeWidth="1.2" strokeLinecap="round" />
      {/* Big Sparkling Green Eyes */}
      <ellipse cx="12" cy="17" rx="2.5" ry="3" fill="#15803d" />
      <circle cx="11.2" cy="16" r="1" fill="#ffffff" />
      <ellipse cx="20" cy="17" rx="2.5" ry="3" fill="#15803d" />
      <circle cx="19.2" cy="16" r="1" fill="#ffffff" />
      {/* Cute Pink Nose & Mouth */}
      <polygon points="16,21 14.8,19.5 17.2,19.5" fill="#f43f5e" />
      <path d="M16 21C15 23 13.5 22.5 13 22M16 21C17 23 18.5 22.5 19 22" stroke="#78350f" strokeWidth="1" strokeLinecap="round" />
      {/* Cheerful Explorer Green Bandana */}
      <path d="M8 24C12 26 20 26 24 24L16 29Z" fill="#10b981" stroke="#047857" strokeWidth="1" />
      <circle cx="16" cy="27" r="1" fill="#facc15" />
    </svg>
  );
};

// -----------------------------------------------------------------------------
// 11. CHRONOMETER / CLOCK ICON
// -----------------------------------------------------------------------------
export const GameIconClock: React.FC<GameIconProps> = ({ className = "w-5 h-5", size }) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} style={style} aria-label="Clock">
      {/* Pocket Watch Crown */}
      <rect x="14" y="2" width="4" height="3" rx="1" fill="#ca8a04" stroke="#854d0e" strokeWidth="1" />
      {/* Dial Ring */}
      <circle cx="16" cy="18" r="11" fill="#fffdf6" stroke="#ca8a04" strokeWidth="2" />
      {/* Hour markers */}
      <circle cx="16" cy="10" r="1" fill="#854d0e" />
      <circle cx="24" cy="18" r="1" fill="#854d0e" />
      <circle cx="16" cy="26" r="1" fill="#854d0e" />
      <circle cx="8" cy="18" r="1" fill="#854d0e" />
      {/* Clock Hands pointing to 10:10 */}
      <line x1="16" y1="18" x2="12" y2="13" stroke="#3e2723" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="16" y1="18" x2="20" y2="13" stroke="#dc2626" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="16" cy="18" r="1.5" fill="#ca8a04" />
    </svg>
  );
};

// -----------------------------------------------------------------------------
// 12. RESIDENT CREST BADGES (For Dialogue Portraits & Resident Directory)
// -----------------------------------------------------------------------------
export interface GameIconResidentBadgeProps extends GameIconProps {
  role: "valen" | "mamat" | "tejo" | "ujang" | "rio" | "leo" | "alkemis" | "luna" | "milo" | "lexa" | "jax" | "kai" | string;
  fallbackEmoji?: string;
}

export const GameIconResidentBadge: React.FC<GameIconResidentBadgeProps> = ({
  role,
  fallbackEmoji,
  className = "w-8 h-8",
  size,
}) => {
  const style = size ? { width: size, height: size } : undefined;
  const normalizedRole = role.toLowerCase();

  switch (normalizedRole) {
    case "lexa":
      // Golden Nautical Explorer Compass / Astrolabe
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} style={style} aria-label="Lexa si Penjelajah">
          <circle cx="16" cy="16" r="14" fill="#fefce8" stroke="#ca8a04" strokeWidth="1.5" />
          <circle cx="16" cy="16" r="11" fill="#fffdf6" stroke="#ca8a04" strokeWidth="1" strokeDasharray="2 2" />
          {/* Compass Star Pointer */}
          <polygon points="16,6 18.5,14 26,16 18.5,18 16,26 13.5,18 6,16 13.5,14" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
          <polygon points="16,6 18.5,14 16,16 13.5,14" fill="#dc2626" />
          <circle cx="16" cy="16" r="2.2" fill="#fffdf6" stroke="#78350f" strokeWidth="1" />
        </svg>
      );

    case "jax":
      // Tactical Outpost Star & Parachute Wings
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} style={style} aria-label="Jax Prajurit Taktis">
          <circle cx="16" cy="16" r="14" fill="#f1f5f9" stroke="#475569" strokeWidth="1.5" />
          {/* Tactical Parachute Canopy */}
          <path d="M7 14C7 9 11 6 16 6C21 6 25 9 25 14H7Z" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.2" />
          <line x1="8" y1="14" x2="16" y2="24" stroke="#64748b" strokeWidth="1" />
          <line x1="13" y1="14" x2="16" y2="24" stroke="#64748b" strokeWidth="1" />
          <line x1="19" y1="14" x2="16" y2="24" stroke="#64748b" strokeWidth="1" />
          <line x1="24" y1="14" x2="16" y2="24" stroke="#64748b" strokeWidth="1" />
          <circle cx="16" cy="24" r="2" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
        </svg>
      );

    case "kai":
      // Hexagon Sandbox Bay Builder Masonry & Hammer
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} style={style} aria-label="Kai si Pembangun">
          <circle cx="16" cy="16" r="14" fill="#fafaf9" stroke="#78716c" strokeWidth="1.5" />
          {/* Hexagon Stone Tile */}
          <polygon points="16,7 23,11 23,19 16,23 9,19 9,11" fill="#e7e5e4" stroke="#57534e" strokeWidth="1.4" />
          {/* Builder Hammer */}
          <rect x="14.5" y="12" width="3" height="12" rx="1" fill="#92400e" stroke="#5c2005" strokeWidth="0.8" />
          <rect x="11.5" y="10" width="9" height="4.5" rx="1" fill="#78716c" stroke="#292524" strokeWidth="1" />
        </svg>
      );

    case "valen":
      // Crossed Blades of Ancient MOBA Valor
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} style={style} aria-label="Pendekar Bayu">
          <circle cx="16" cy="16" r="14" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.5" />
          <path d="M8 24L24 8M24 8H19M24 8V13" stroke="#2563eb" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M24 24L8 8M8 8H13M8 8V13" stroke="#dc2626" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="16" cy="16" r="2.8" fill="#facc15" stroke="#b45309" strokeWidth="1" />
        </svg>
      );

    case "mamat":
      // Golden Fishing Hook with Ocean Wave
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} style={style} aria-label="Pak Mamat">
          <circle cx="16" cy="16" r="14" fill="#ecfeff" stroke="#0891b2" strokeWidth="1.5" />
          <path d="M16 6V16C16 19.5 13.5 22 10 22C7.5 22 5.5 20.5 5.5 18C5.5 16.5 6.5 15.5 8 15.5C9.5 15.5 10.5 16.5 10.5 18C10.5 19.5 8.5 20 8.5 20" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          {/* Leaping silver fish */}
          <path d="M15 15C18 11 23 11 26 13C25 16 22 18 18 17Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
          <polygon points="26,13 28,10 28,16" fill="#0284c7" />
        </svg>
      );

    case "tejo":
    case "ujang":
      // Harvest Bounty / Fresh Fruit
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} style={style} aria-label="Pedagang Buah">
          <circle cx="16" cy="16" r="14" fill="#fef2f2" stroke="#dc2626" strokeWidth="1.5" />
          {/* Crisp Apple Body */}
          <path
            d="M16 11C13 8 9 9 8 13C7 19 11 25 16 25C21 25 25 19 24 13C23 9 19 8 16 11Z"
            fill="#ef4444"
            stroke="#991b1b"
            strokeWidth="1.2"
          />
          {/* Apple Leaf & Stem */}
          <path d="M16 11V7" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M16 8C19 6 22 7 22 8C22 10 19 10 16 8Z" fill="#22c55e" stroke="#15803d" strokeWidth="0.8" />
          <ellipse cx="12" cy="15" rx="1.5" ry="3" fill="#fecaca" opacity="0.6" />
        </svg>
      );

    case "rio":
    case "leo":
      // Blazing Football of Victory
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} style={style} aria-label="Striker Rio">
          <circle cx="16" cy="16" r="14" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1.5" />
          {/* Soccer Ball */}
          <circle cx="16" cy="16" r="9" fill="#ffffff" stroke="#1e293b" strokeWidth="1.4" />
          <polygon points="16,13 18.5,15 17.5,18 14.5,18 13.5,15" fill="#1e293b" />
          <line x1="16" y1="13" x2="16" y2="8" stroke="#1e293b" strokeWidth="1" />
          <line x1="18.5" y1="15" x2="23" y2="13" stroke="#1e293b" strokeWidth="1" />
          <line x1="17.5" y1="18" x2="21" y2="22" stroke="#1e293b" strokeWidth="1" />
          <line x1="14.5" y1="18" x2="11" y2="22" stroke="#1e293b" strokeWidth="1" />
          <line x1="13.5" y1="15" x2="9" y2="13" stroke="#1e293b" strokeWidth="1" />
          {/* Golden Flame Wings */}
          <path d="M6 8C9 10 11 12 12 12" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M26 8C23 10 21 12 20 12" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );

    case "alkemis":
    case "luna":
      // Mystical Flask with Violet Elixir & Stars
      return (
        <svg viewBox="0 0 32 32" fill="none" className={className} style={style} aria-label="Prof. Alkemis">
          <circle cx="16" cy="16" r="14" fill="#faf5ff" stroke="#9333ea" strokeWidth="1.5" />
          {/* Flask Neck & Rim */}
          <rect x="13.5" y="6" width="5" height="2" rx="0.5" fill="#c084fc" stroke="#6b21a8" strokeWidth="1" />
          <path d="M14 8V12L8 23C7 24.5 8 26 10 26H22C24 26 25 24.5 24 23L18 12V8" stroke="#6b21a8" strokeWidth="1.4" fill="none" />
          {/* Glowing Purple Liquid */}
          <path d="M10 24L12 20C14 21 18 19 20 20L22 24C22 25 21 25.5 20 25.5H12C11 25.5 10 25 10 24Z" fill="#a855f7" />
          {/* Magic Bubbles & Sparkles */}
          <circle cx="15" cy="22" r="1" fill="#fdf4ff" />
          <circle cx="18" cy="21" r="1.2" fill="#fdf4ff" />
          <path d="M19 10L20 8L21 10L23 11L21 12L20 14L19 12L17 11Z" fill="#facc15" />
        </svg>
      );

    case "milo":
      return <GameIconMilo className={className} size={size} />;

    default:
      if (fallbackEmoji) {
        return (
          <div
            className={`flex items-center justify-center select-none font-sans text-base ${className}`}
            style={style}
          >
            {fallbackEmoji}
          </div>
        );
      }
      return <GameIconMilo className={className} size={size} />;
  }
};
