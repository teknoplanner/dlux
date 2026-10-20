import React from "react";

// Animated product scenes. They replace the old dark stock images that carried
// unverifiable claims ("12°C", "10-foot drop survival"). No text lives in the art.
const Bg = () => (
  <>
    <rect width="400" height="250" fill="#ecfdf5" />
    <circle className="hv-blob" cx="200" cy="125" r="108" fill="#d1fae5" />
  </>
);

const scenes: Record<string, React.ReactNode> = {
  "phone-cooler": (
    <>
      {[170, 200, 230].map((x, i) => (
        <g key={x} transform={`translate(${x} 52)`}>
          <path className="gs-wave" style={{ animationDelay: `${i * 0.6}s` }} d="M0 0 q6 -7 0 -14 q-6 -7 0 -14" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
        </g>
      ))}
      <g className="hv-float">
        <rect x="140" y="58" width="120" height="176" rx="22" fill="#0f172a" />
        <rect x="152" y="70" width="34" height="34" rx="9" fill="#1e293b" />
        <circle cx="164" cy="82" r="5" fill="#475569" /><circle cx="164" cy="96" r="5" fill="#475569" />
        <circle cx="200" cy="150" r="42" fill="#1e293b" stroke="#34d399" strokeWidth="3" />
        <g className="hv-spin">
          {[0, 60, 120].map((a) => (
            <ellipse key={a} cx="200" cy="150" rx="9" ry="32" fill="#6ee7b7" transform={`rotate(${a} 200 150)`} />
          ))}
        </g>
        <circle cx="200" cy="150" r="8" fill="#fbbf24" />
      </g>
    </>
  ),
  "finger-sleeves": (
    <>
      <g className="hv-float">
        <rect x="70" y="50" width="260" height="150" rx="22" fill="#0f172a" />
        <rect x="80" y="60" width="240" height="130" rx="14" fill="#fff" />
        <circle cx="140" cy="125" r="34" fill="#d1fae5" stroke="#10b981" strokeWidth="2" />
        <circle cx="270" cy="105" r="14" fill="#047857" /><circle cx="296" cy="140" r="14" fill="#047857" />
        <circle className="gs-pulse" cx="270" cy="105" r="14" fill="none" stroke="#10b981" strokeWidth="2" />
        <g className="gs-swipe">
          <rect x="120" y="100" width="40" height="64" rx="20" fill="#fbbf24" />
          <g stroke="#d97706" strokeWidth="2.5" strokeLinecap="round"><line x1="130" y1="122" x2="150" y2="122" /><line x1="130" y1="132" x2="150" y2="132" /><line x1="130" y1="142" x2="150" y2="142" /></g>
        </g>
      </g>
    </>
  ),
  "mobile-controller": (
    <>
      <g className="hv-float">
        <rect x="44" y="80" width="86" height="96" rx="32" fill="#1e293b" />
        <rect x="270" y="80" width="86" height="96" rx="32" fill="#1e293b" />
        <rect x="110" y="64" width="180" height="116" rx="16" fill="#0f172a" />
        <rect x="118" y="72" width="164" height="100" rx="10" fill="#d1fae5" />
        <circle cx="200" cy="122" r="20" fill="#047857" />
        <rect x="62" y="116" width="40" height="12" rx="4" fill="#94a3b8" /><rect x="76" y="102" width="12" height="40" rx="4" fill="#94a3b8" />
        {[[318, 104, "#fbbf24", ""], [338, 124, "#10b981", "gs-p2"], [318, 144, "#fff", "gs-p3"], [298, 124, "#94a3b8", "gs-p4"]].map(([x, y, c, d]) => (
          <circle key={`${x}${y}`} className={`gs-press ${d}`} cx={x as number} cy={y as number} r="10" fill={c as string} />
        ))}
      </g>
    </>
  ),
  "gaming-tws": (
    <>
      <rect x="150" y="150" width="100" height="70" rx="30" fill="#0f172a" />
      <line x1="150" y1="178" x2="250" y2="178" stroke="#334155" strokeWidth="2" />
      <circle cx="200" cy="198" r="5" fill="#fbbf24" />
      {[110, 290].map((x, i) => (
        <g key={x}>
          <circle className="gs-pulse" style={{ animationDelay: `${i * 0.5}s` }} cx={x} cy="100" r="28" fill="none" stroke="#10b981" strokeWidth="3" />
          <g className="hv-float" style={{ animationDelay: `${-i * 2}s` }}>
            <rect x={x - 6} y="104" width="12" height="40" rx="6" fill="#fff" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx={x} cy="96" r="22" fill="#fff" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx={x} cy="96" r="8" fill="#047857" />
          </g>
        </g>
      ))}
    </>
  ),
  "kids-tablet": (
    <>
      <g className="hv-float">
        <rect x="60" y="40" width="280" height="170" rx="22" fill="#0f172a" />
        <rect x="72" y="52" width="256" height="146" rx="12" fill="#fff" />
        <g className="hv-float hv-d1"><circle cx="130" cy="130" r="24" fill="#fbbf24" /></g>
        <g className="hv-float hv-d2"><rect x="178" y="104" width="48" height="48" rx="10" fill="#047857" /></g>
        <g className="hv-float hv-d3"><path d="M268 156 l26 -50 l26 50 Z" fill="#0f172a" /></g>
      </g>
    </>
  ),
  "kids-stylus": (
    <>
      <g className="hv-float">
        <rect x="70" y="40" width="260" height="170" rx="16" fill="#fff" stroke="#cbd5e1" strokeWidth="2" />
        <path className="hv-sign" d="M110 150 c0 -46 60 -46 60 0 s60 46 60 0" pathLength="160" fill="none" stroke="#d97706" strokeWidth="7" strokeLinecap="round" strokeDasharray="160" />
        <g transform="translate(236 150) rotate(38)">
          <rect x="-10" y="-110" width="20" height="96" rx="10" fill="#047857" />
          <rect x="-10" y="-110" width="20" height="26" rx="10" fill="#0f172a" />
          <path d="M-10 -14 h20 l-10 16 Z" fill="#0f172a" />
        </g>
      </g>
    </>
  ),
  "kids-case": (
    <>
      <ellipse className="gs-shadow" cx="200" cy="228" rx="90" ry="9" fill="#064e3b" />
      <g className="gs-drop">
        <rect x="90" y="60" width="220" height="150" rx="30" fill="#047857" />
        <rect x="108" y="78" width="184" height="114" rx="14" fill="#0f172a" />
        <rect x="116" y="86" width="168" height="98" rx="8" fill="#ecfdf5" />
        <path d="M172 136 l20 20 l38 -42" fill="none" stroke="#047857" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </>
  ),
  "capacitive-stylus": (
    <>
      <g className="hv-float">
        <rect x="70" y="40" width="260" height="170" rx="18" fill="#0f172a" />
        <rect x="80" y="50" width="240" height="150" rx="10" fill="#fff" />
        <rect x="100" y="70" width="110" height="8" rx="4" fill="#cbd5e1" /><rect x="100" y="88" width="150" height="6" rx="3" fill="#e2e8f0" />
        <path className="hv-sign" d="M104 160 q10 -34 18 0 t18 0 t18 -14 t24 6" pathLength="160" fill="none" stroke="#d97706" strokeWidth="4" strokeLinecap="round" strokeDasharray="160" />
        <line x1="100" y1="172" x2="250" y2="172" stroke="#cbd5e1" strokeWidth="2" />
        <g transform="translate(184 156) rotate(40)">
          <rect x="-5" y="-110" width="10" height="98" rx="5" fill="#334155" />
          <rect x="-5" y="-110" width="10" height="20" rx="5" fill="#047857" />
          <path d="M-5 -12 h10 l-5 12 Z" fill="#0f172a" />
        </g>
      </g>
    </>
  ),
  "paper-screen-protector": (
    <>
      <defs><clipPath id="gs-screen"><rect x="158" y="36" width="84" height="176" rx="8" /></clipPath></defs>
      <g className="hv-float">
        <rect x="150" y="24" width="100" height="200" rx="18" fill="#0f172a" />
        <rect x="158" y="36" width="84" height="176" rx="8" fill="#fff" />
        <rect x="170" y="54" width="60" height="8" rx="4" fill="#cbd5e1" /><rect x="170" y="72" width="48" height="6" rx="3" fill="#e2e8f0" /><rect x="170" y="86" width="56" height="6" rx="3" fill="#e2e8f0" />
        <g clipPath="url(#gs-screen)"><rect className="gs-glare" x="190" y="20" width="22" height="210" fill="#fbbf24" opacity=".45" transform="skewX(-14)" /></g>
        <rect className="gs-slide" x="154" y="32" width="92" height="184" rx="10" fill="#a7f3d0" fillOpacity=".5" stroke="#10b981" strokeWidth="2" />
      </g>
    </>
  ),
};

export const hasGearScene = (id: string) => id in scenes;
export const gearSceneNodes = (id: string) => scenes[id];

export const GearScene: React.FC<{ id: string; label: string }> = ({ id, label }) => (
  <svg viewBox="0 0 400 250" role="img" aria-label={label} preserveAspectRatio="xMidYMid slice" className="hv w-full h-full">
    <Bg />
    {scenes[id]}
  </svg>
);
