"use client";

import React, { useEffect, useRef, useState } from "react";

export function InArticleAd() {
  const insRef = useRef<HTMLModElement | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pushedRef = useRef(false);

  useEffect(() => {
    const ins = insRef.current;
    if (!ins || pushedRef.current) return;

    try {
      // @ts-expect-error - Google AdSense global array
      const adsbygoogle = window.adsbygoogle || [];
      adsbygoogle.push({});
      pushedRef.current = true;
    } catch (err) {
      console.warn("AdSense in-article push failed or blocked:", err);
      setIsCollapsed(true);
      return;
    }

    const checkStatus = () => {
      if (!ins) return;
      const status = ins.getAttribute("data-ad-status");
      const hasIframe = ins.querySelector("iframe") !== null;

      // Collapse if Google explicitly marks unfilled
      if (status === "unfilled") {
        setIsCollapsed(true);
      } else if (status === "filled" || hasIframe) {
        setIsCollapsed(false);
      }
    };

    const observer = new MutationObserver(() => {
      checkStatus();
    });

    observer.observe(ins, {
      attributes: true,
      attributeFilter: ["data-ad-status", "data-adsbygoogle-status", "style"],
      childList: true,
      subtree: true,
    });

    // Check after intervals in case script is slow or ad is unfilled
    const t1 = setTimeout(checkStatus, 1500);
    const t2 = setTimeout(checkStatus, 3000);
    const t3 = setTimeout(() => {
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
    <div className="my-8 w-full overflow-hidden not-prose" aria-label="Iklan Sponsor">
      <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-wider text-center mb-1">
        Sponsor
      </span>
      <div className="w-full flex justify-center">
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: "block", textAlign: "center", width: "100%" }}
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client="ca-pub-3408198783704510"
          data-ad-slot="6494442840"
        />
      </div>
    </div>
  );
}
