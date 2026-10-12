"use client";

import { useState, useEffect } from "react";

/**
 * Custom React Hook to detect whether the current visitor is located in Indonesia.
 * Uses a multi-tiered approach:
 * 1. Default fallback based on page language ('id' -> true, 'en' -> false).
 * 2. Instant client-side check via sessionStorage cache.
 * 3. Instant client-side check via device timezone (Asia/Jakarta, Asia/Makassar, Asia/Jayapura, Asia/Pontianak).
 * 4. Asynchronous IP Geolocation verification via lightweight Country API (https://api.country.is).
 */
export function useIsIndonesia(defaultLang?: "id" | "en"): boolean {
  const [isIndonesia, setIsIndonesia] = useState<boolean>(() => {
    return defaultLang ? defaultLang === "id" : true;
  });

  useEffect(() => {
    // 1. Check cached session storage
    try {
      const cached = sessionStorage.getItem("dluckyx_is_id");
      if (cached !== null) {
        setIsIndonesia(cached === "true");
        return;
      }
    } catch (_) {}

    // 2. Instant timezone detection
    let detectedFromTz = false;
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const isIdTz =
        tz === "Asia/Jakarta" ||
        tz === "Asia/Makassar" ||
        tz === "Asia/Jayapura" ||
        tz === "Asia/Pontianak";
      if (isIdTz) {
        setIsIndonesia(true);
        detectedFromTz = true;
      }
    } catch (_) {}

    // 3. IP Geolocation fetch from free fast country API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    fetch("https://api.country.is", { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        clearTimeout(timeoutId);
        const isId = data?.country === "ID";
        setIsIndonesia(isId);
        try {
          sessionStorage.setItem("dluckyx_is_id", isId ? "true" : "false");
        } catch (_) {}
      })
      .catch(() => {
        // Fallback: If network request fails or times out, save the timezone / defaultLang determination
        try {
          const finalVal = detectedFromTz || (defaultLang === "id");
          sessionStorage.setItem("dluckyx_is_id", finalVal ? "true" : "false");
        } catch (_) {}
      });

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [defaultLang]);

  return isIndonesia;
}
