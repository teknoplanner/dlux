import React from "react";
import type { CardArticle } from "@/components/blog/ArticleCard";
type ArticleItem = CardArticle;
import { apps } from "@/data/apps";
import { gearSceneNodes, hasGearScene } from "@/components/hardware/GearScene";

// Generated, animated cover. Everything is derived from the article's slug, so each article
// gets its own palette, layout and motion, and a queued article looks right the day it publishes.

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hexHue(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  if (!d) return 160;
  const h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return Math.round((h * 60 + 360) % 360);
}

type Topic = "sliders" | "build" | "rank" | "lock" | "bolt" | "fps" | "moba" | "zone" | "blocks" | "islands" | "pitch" | "gear" | "letters" | "docs" | "finance" | "phone";
function topicOf(a: ArticleItem): Topic {
  const t = `${a.slug} ${a.slugEn}`.toLowerCase();
  if (/sensitiv|sensi|dpi|aim|headshot|crosshair/.test(t)) return "sliders";
  if (/build|emblem|item|hero|skill|talent|loadout|senjata|weapon/.test(t)) return "build";
  if (/rank|tier|meta|push|mythic|glory|conqueror|ladder/.test(t)) return "rank";
  if (/password|sandi|kunci|lock|aman|privacy|vpn|secure/.test(t)) return "lock";
  if (/baterai|battery|charg|power-?bank|cas|panas|heat|cooler|suhu/.test(t)) return "bolt";
  if (/fps|lag|ping|grafis|graphic|smooth|performa|performance|ram|storage/.test(t)) return "fps";
  if (/mlbb|mobile-legends|moba/.test(t)) return "moba";
  if (/free-?fire|\bff\b|pubg|battle-?royale|farlight|call-of-duty|cod-?mobile/.test(t)) return "zone";
  if (/roblox|minecraft/.test(t)) return "blocks";
  if (/genshin|honkai|rpg/.test(t)) return "islands";
  if (/eafc|fc-mobile|efootball|fifa|sepak|penalty|stickman|football/.test(t)) return "pitch";
  if (a.affiliateProductIds?.[0] && hasGearScene(a.affiliateProductIds[0])) return "gear";
  if (a.category === "education") return "letters";
  if (a.category === "productivity") return "docs";
  if (a.category === "finance") return "finance";
  return "phone";
}

type C = { tint: string; mid: string; soft: string; strong: string; ink: string; amber: string };
type Rnd = () => number;

const delay = (r: Rnd) => ({ animationDelay: `${-(r() * 5).toFixed(2)}s` });

function cube(x: number, y: number, s: number, c: C, key: string, r: Rnd) {
  return (
    <g key={key} className="hv-float" style={delay(r)}>
      <polygon points={`${x},${y - s * 0.5} ${x + s},${y} ${x},${y + s * 0.5} ${x - s},${y}`} fill={c.soft} />
      <polygon points={`${x - s},${y} ${x},${y + s * 0.5} ${x},${y + s * 1.5} ${x - s},${y + s}`} fill={c.strong} />
      <polygon points={`${x},${y + s * 0.5} ${x + s},${y} ${x + s},${y + s} ${x},${y + s * 1.5}`} fill={c.mid} />
    </g>
  );
}

const motifs: Partial<Record<Topic, (r: Rnd, c: C, a: ArticleItem) => React.ReactNode>> = {
  pitch: (r, c) => {
    const dx = Math.round(r() * 120 - 60);
    return (
      <>
        <g fill="none" stroke={c.strong} strokeWidth="3" opacity=".55">
          <rect x="150" y="30" width="340" height="300" rx="6" />
          <rect x="250" y="30" width="140" height="64" />
          <line x1="150" y1="200" x2="490" y2="200" />
          <circle cx="320" cy="200" r="46" />
        </g>
        {Array.from({ length: 2 + Math.floor(r() * 3) }, (_, i) => (
          <g key={i} className="hv-float" style={delay(r)}>
            <circle cx={200 + r() * 240} cy={120 + r() * 100} r="13" fill={c.ink} />
          </g>
        ))}
        <circle className="cv-shot" style={{ ["--dx" as string]: `${dx}px` }} cx="320" cy="300" r="15" fill="#fff" stroke={c.ink} strokeWidth="3.5" />
      </>
    );
  },
  moba: (r, c) => {
    const lanes = [
      "M110 300 Q 200 280 320 180 T 530 60",
      `M100 ${180 + r() * 40} L 540 ${150 + r() * 40}`,
      "M120 70 Q 300 100 320 180 T 520 300",
    ];
    return (
      <>
        {lanes.map((d, i) => (
          <path key={i} d={d} fill="none" stroke={c.strong} strokeWidth="14" strokeLinecap="round" opacity=".28" />
        ))}
        {[[110, 300], [530, 60], [100, 200], [540, 190], [120, 70], [520, 300]].map(([x, y], i) => (
          <rect key={i} className="hv-float" style={delay(r)} x={x - 16} y={y - 16} width="32" height="32" rx="8" fill={i % 2 ? c.ink : c.strong} />
        ))}
        {[0, 1, 2].map((i) => (
          <circle key={i} className="cv-lane" style={{ ...delay(r), ["--dx" as string]: `${60 + r() * 120}px`, ["--dy" as string]: `${-40 - r() * 80}px` }} cx={190 + i * 110} cy={200 + (i % 2) * 40} r="16" fill={i === 1 ? "#fbbf24" : "#fff"} stroke={c.ink} strokeWidth="3.5" />
        ))}
      </>
    );
  },
  zone: (r, c) => {
    const cx = 260 + r() * 120, cy = 150 + r() * 60;
    return (
      <>
        <circle className="cv-zone" cx={cx} cy={cy} r="150" fill="none" stroke={c.strong} strokeWidth="5" strokeDasharray="14 12" />
        <circle cx={cx} cy={cy} r="150" fill={c.mid} opacity=".25" />
        {Array.from({ length: 6 }, (_, i) => (
          <circle key={i} className="hv-float" style={delay(r)} cx={cx - 90 + r() * 180} cy={cy - 80 + r() * 160} r="9" fill={i === 0 ? "#fbbf24" : c.ink} />
        ))}
        <g className="hv-float" stroke={c.ink} strokeWidth="4" strokeLinecap="round" fill="none">
          <circle cx={cx} cy={cy} r="22" />
          <line x1={cx - 36} y1={cy} x2={cx - 14} y2={cy} /><line x1={cx + 14} y1={cy} x2={cx + 36} y2={cy} />
          <line x1={cx} y1={cy - 36} x2={cx} y2={cy - 14} /><line x1={cx} y1={cy + 14} x2={cx} y2={cy + 36} />
        </g>
      </>
    );
  },
  blocks: (r, c) => {
    const out: React.ReactNode[] = [];
    const base = 230 + r() * 60;
    let k = 0;
    for (let row = 0; row < 3; row++)
      for (let col = 0; col <= row; col++) {
        const x = base + (col - row / 2) * 90 + 90, y = 130 + row * 50;
        out.push(cube(x, y, 45, c, `c${k++}`, r));
      }
    out.push(cube(base + 220 + r() * 40, 90 + r() * 30, 34, c, "top", r));
    return <>{out}</>;
  },
  islands: (r, c) => (
    <>
      <polygon points="60,300 200,150 280,230 380,110 520,300" fill={c.mid} opacity=".6" />
      {[0, 1, 2].map((i) => {
        const x = 150 + i * 160 + r() * 30, y = 90 + r() * 120, w = 60 + r() * 40;
        return (
          <g key={i} className="hv-float" style={delay(r)}>
            <ellipse cx={x} cy={y} rx={w} ry="16" fill={c.soft} />
            <polygon points={`${x - w},${y} ${x + w},${y} ${x},${y + w * 0.9}`} fill={c.strong} />
            <circle className="gs-pulse" style={delay(r)} cx={x} cy={y - 34} r="12" fill="#fbbf24" />
          </g>
        );
      })}
    </>
  ),
  gear: (r, c, a) => (
    <svg x="100" y="10" width="440" height="340" viewBox="0 0 400 250" overflow="visible">
      {gearSceneNodes(a.affiliateProductIds![0])}
    </svg>
  ),
  letters: (r, c, a) => {
    const letters = (a.title.match(/[A-Za-z0-9]+/g) || ["A", "B", "C"]).map((w) => w[0].toUpperCase()).slice(0, 4);
    return (
      <>
        {letters.map((l, i) => {
          const s = 82 + r() * 24, x = 90 + i * (400 / letters.length) + r() * 20, y = 90 + r() * 110;
          return (
            <g key={i} className="hv-float" style={delay(r)}>
              <rect x={x} y={y} width={s} height={s} rx="18" fill={[c.ink, c.strong, "#fbbf24", c.soft][i % 4]} />
              <text x={x + s / 2} y={y + s * 0.7} textAnchor="middle" fontSize={s * 0.6} fontWeight="700" fill={i % 4 === 2 ? c.ink : "#fff"}>{l}</text>
            </g>
          );
        })}
      </>
    );
  },
  docs: (r, c) => (
    <>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${200 + i * 70} ${50 + i * 14}) rotate(${(r() * 16 - 8).toFixed(1)})`}>
          <g className="hv-float" style={delay(r)}>
            <rect width="170" height="230" rx="12" fill="#fff" stroke={c.mid} strokeWidth="3" />
            <rect x="20" y="26" width="90" height="12" rx="6" fill={c.ink} />
            {[0, 1, 2, 3].map((j) => (
              <rect key={j} className={`hv-type hv-t${j + 2}`} x="20" y={60 + j * 22} width={110 - (j % 2) * 24} height="8" rx="4" fill={c.mid} />
            ))}
            {i === 2 && <path className="hv-sign" d="M22 190 q10 -34 18 0 t18 0 t18 -14 t24 6" pathLength="160" fill="none" stroke="#d97706" strokeWidth="5" strokeLinecap="round" strokeDasharray="160" />}
          </g>
        </g>
      ))}
    </>
  ),
  finance: (r, c) => (
    <>
      {Array.from({ length: 6 }, (_, i) => {
        const h = 60 + r() * 170;
        return <rect key={i} className="cv-grow" style={delay(r)} x={150 + i * 62} y={310 - h} width="40" height={h} rx="8" fill={i === 5 ? "#fbbf24" : [c.strong, c.soft][i % 2]} />;
      })}
      {Array.from({ length: 3 }, (_, i) => (
        <g key={i} className="hv-float" style={delay(r)}>
          <circle cx={120 + r() * 400} cy={50 + r() * 90} r="22" fill="#fbbf24" stroke={c.ink} strokeWidth="3.5" />
          <rect x="-5" y="-9" width="10" height="18" rx="3" fill={c.ink} transform="translate(0 0)" />
        </g>
      ))}
    </>
  ),
  phone: (r, c) => (
    <>
      <g className="hv-float">
        <rect x="250" y="30" width="140" height="300" rx="26" fill={c.ink} />
        <rect x="260" y="44" width="120" height="272" rx="18" fill="#fff" />
        {[0, 1, 2, 3].map((i) => <rect key={i} className={`hv-type hv-t${i + 2}`} x="276" y={70 + i * 28} width={88 - (i % 2) * 24} height="10" rx="5" fill={c.mid} />)}
      </g>
      {[[110, 100], [470, 160], [140, 240]].map(([x, y], i) => (
        <g key={i} className="hv-float" style={delay(r)}>
          <rect x={x} y={y} width={90 + r() * 30} height="44" rx="14" fill={[c.strong, "#fbbf24", c.soft][i]} />
        </g>
      ))}
    </>
  ),
};

const motifsExtra: Partial<Record<Topic, (r: Rnd, c: C, a: ArticleItem) => React.ReactNode>> = {
  sliders: (r, c) => (
    <>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="130" y={110 + i * 56} width="250" height="12" rx="6" fill={c.mid} />
          <circle className="cv-lane" style={{ ...delay(r), ["--dx" as string]: `${40 + r() * 120}px`, ["--dy" as string]: "0px" }} cx="150" cy={116 + i * 56} r="17" fill={i === 1 ? "#fbbf24" : c.ink} />
        </g>
      ))}
      <g className="hv-float" stroke={c.ink} strokeWidth="5" strokeLinecap="round" fill="none">
        <circle cx="470" cy="180" r="44" /><circle cx="470" cy="180" r="6" fill={c.ink} />
        <line x1="408" y1="180" x2="440" y2="180" /><line x1="500" y1="180" x2="532" y2="180" />
        <line x1="470" y1="118" x2="470" y2="150" /><line x1="470" y1="210" x2="470" y2="242" />
      </g>
    </>
  ),
  build: (r, c) => (
    <>
      {Array.from({ length: 6 }, (_, i) => {
        const x = 120 + (i % 3) * 110, y = 70 + Math.floor(i / 3) * 110;
        return (
          <g key={i} className="hv-float" style={delay(r)}>
            <rect x={x} y={y} width="90" height="90" rx="20" fill={i === 0 ? "#fbbf24" : [c.strong, c.soft, c.mid][i % 3]} />
            <circle cx={x + 45} cy={y + 45} r={14 + r() * 10} fill="#fff" opacity=".85" />
          </g>
        );
      })}
      <path className="hv-sign" d="M470 100 l20 40 44 6 -32 30 8 44 -40 -22 -40 22 8 -44 -32 -30 44 -6z" pathLength="160" fill="none" stroke={c.ink} strokeWidth="5" strokeLinejoin="round" strokeDasharray="160" />
    </>
  ),
  rank: (r, c) => (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} className="cv-grow" style={delay(r)} x={130 + i * 80} y={300 - (i + 1) * 46} width="62" height={(i + 1) * 46} rx="10" fill={i === 4 ? "#fbbf24" : [c.mid, c.soft, c.strong][i % 3]} />
      ))}
      <path className="hv-float" d="M492 60 l22 36 40 -22 -12 60 h-100 l-12 -60 40 22z" fill="#fbbf24" stroke={c.ink} strokeWidth="4" strokeLinejoin="round" />
    </>
  ),
  lock: (r, c) => (
    <g className="hv-float">
      <path d="M270 160 v-30 a50 50 0 0 1 100 0 v30" fill="none" stroke={c.ink} strokeWidth="14" strokeLinecap="round" />
      <rect x="236" y="160" width="168" height="130" rx="22" fill={c.strong} />
      <circle cx="320" cy="212" r="16" fill="#fbbf24" />
      <rect x="313" y="220" width="14" height="36" rx="6" fill="#fbbf24" />
      {[0, 1, 2, 3].map((i) => <circle key={i} className="gs-pulse" style={delay(r)} cx={190 + i * 86} cy="320" r="7" fill={c.ink} />)}
    </g>
  ),
  bolt: (r, c) => (
    <>
      <g className="hv-float">
        <rect x="240" y="40" width="160" height="280" rx="26" fill={c.ink} />
        <rect x="252" y="56" width="136" height="248" rx="16" fill="#fff" />
        <rect className="cv-grow" x="268" y="200" width="104" height="90" rx="10" fill={c.soft} />
        <path d="M330 90 l-40 70 h30 l-10 60 50 -76 h-32z" fill="#fbbf24" stroke={c.ink} strokeWidth="4" strokeLinejoin="round" />
      </g>
      {[0, 1, 2].map((i) => <circle key={i} className="hv-blob" style={delay(r)} cx={150 + i * 170} cy={90 + r() * 160} r="18" fill={c.mid} />)}
    </>
  ),
  fps: (r, c) => (
    <>
      <path className="hv-sign" d={`M90 280 ${Array.from({ length: 7 }, (_, i) => `L${90 + (i + 1) * 62} ${240 - r() * 150}`).join(" ")}`} pathLength="160" fill="none" stroke={c.ink} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="160" />
      <g fill="none" stroke={c.mid} strokeWidth="3"><line x1="90" y1="300" x2="540" y2="300" /><line x1="90" y1="60" x2="90" y2="300" /></g>
      {[0, 1, 2].map((i) => <rect key={i} className="hv-float" style={delay(r)} x={120 + i * 150} y={50 + r() * 40} width="90" height="40" rx="12" fill={[c.strong, "#fbbf24", c.soft][i]} />)}
    </>
  ),
};
Object.assign(motifs, motifsExtra);

export const ArticleCover: React.FC<{ article: ArticleItem; className?: string }> = ({ article, className = "" }) => {
  const seed = hash(article.slug);
  const r = mulberry(seed);
  const app = apps.find((a) => a.slug === article.targetAppSlug);
  const base = app ? hexHue(app.color) : (seed % 360);
  const h = (base + Math.round(r() * 28 - 14) + 360) % 360;
  const c: C = {
    tint: `hsl(${h} 70% 95%)`,
    mid: `hsl(${h} 55% 80%)`,
    soft: `hsl(${h} 55% 58%)`,
    strong: `hsl(${h} 65% 32%)`,
    ink: "#0f172a",
    amber: "#fbbf24",
  };
  const topic = topicOf(article);
  const id = `cv${seed.toString(36)}`;
  return (
    <svg viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className={`hv w-full h-full ${className}`}>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2={r() > 0.5 ? 1 : 0} y2="1">
          <stop offset="0" stopColor={c.tint} />
          <stop offset="1" stopColor={`hsl(${h} 60% 88%)`} />
        </linearGradient>
      </defs>
      <rect width="640" height="360" fill={`url(#${id}g)`} />
      {[0, 1, 2].map((i) => (
        <circle key={i} className="hv-blob" style={delay(r)} cx={r() * 640} cy={r() * 360} r={70 + r() * 110} fill={c.mid} opacity={0.35 + r() * 0.2} />
      ))}
      {(motifs[topic] || motifs.phone!)(r, c, article)}
    </svg>
  );
};
