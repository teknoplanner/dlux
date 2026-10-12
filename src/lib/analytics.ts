/**
 * Google Analytics (GA4) Custom Event Tracking Utility
 * Safely dispatches events to window.gtag if initialized
 */

export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== "undefined") {
    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("event", eventName, params);
    } else {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push(["event", eventName, params]);
    }
  }
}

export function trackAmazonClick(productId: string, productName: string, source: string) {
  trackEvent("amazon_click", {
    product_id: productId,
    product_name: productName,
    source,
    page_path: typeof window !== "undefined" ? window.location.pathname : "",
  });
}

export function trackShopeeClick(productId: string, productName: string, source: string) {
  trackEvent("shopee_click", {
    product_id: productId,
    product_name: productName,
    source,
    page_path: typeof window !== "undefined" ? window.location.pathname : "",
  });
}

export function trackPlayStoreClick(appSlug: string, appName: string, source: string) {
  trackEvent("playstore_click", {
    app_slug: appSlug,
    app_name: appName,
    source,
    page_path: typeof window !== "undefined" ? window.location.pathname : "",
  });
}
