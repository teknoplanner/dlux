"use client";

import React, { useEffect, useRef, useState } from "react";

export function StickyLeftAd() {
  const insRef = useRef<HTMLModElement | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Only execute on desktop (viewport width >= 1280px)
    if (typeof window === "undefined" || window.innerWidth < 1280) {
      setIsCollapsed(true);
      return;
    }

    const ins = insRef.current;
    if (!ins) return;

    // Push ad request to Google AdSense
    try {
      // @ts-expect-error - Google AdSense global array
      const adsbygoogle = window.adsbygoogle || [];
      adsbygoogle.push({});
    } catch (err) {
      console.warn("AdSense push failed or blocked:", err);
      setIsCollapsed(true);
      return;
    }

    const checkStatus = () => {
      if (!ins) return;
      const status = ins.getAttribute("data-ad-status");
      const hasIframe = ins.querySelector("iframe") !== null;

      // If Google explicitly marks unfilled, collapse the space immediately
      if (status === "unfilled") {
        setIsCollapsed(true);
      } else if (status === "filled" || hasIframe) {
        setIsCollapsed(false);
      }
    };

    // MutationObserver to watch for AdSense iframe injection or unfilled status
    const observer = new MutationObserver(() => {
      checkStatus();
    });

    observer.observe(ins, {
      attributes: true,
      attributeFilter: ["data-ad-status", "data-adsbygoogle-status", "style"],
      childList: true,
      subtree: true,
    });

    // Timeout checks in case AdSense doesn't return an ad or script is blocked
    const t1 = setTimeout(checkStatus, 1500);
    const t2 = setTimeout(checkStatus, 3000);
    const t3 = setTimeout(() => {
      // After 4.5 seconds, if no iframe was rendered and height is 0, collapse
      if (!ins.querySelector("iframe") && ins.offsetHeight < 20) {
        setIsCollapsed(true);
      }
    }, 4500);

    return () => {
      observer.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (isCollapsed) {
    return null;
  }

  return (
    <aside
      className="hidden xl:block w-[160px] shrink-0"
      aria-label="Iklan Sponsor"
    >
      <div className="sticky top-28 w-[160px] overflow-hidden">
        <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-wider text-center mb-1">
          Sponsor
        </span>
        <div className="min-h-[250px] w-full flex justify-center">
          <ins
            ref={insRef}
            className="adsbygoogle"
            style={{ display: "block", width: "160px", minHeight: "250px" }}
            data-ad-client="ca-pub-3408198783704510"
            data-ad-slot="7901351292"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      </div>
    </aside>
  );
}
