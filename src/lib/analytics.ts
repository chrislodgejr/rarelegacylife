type TrackPayload = Record<string, string | number | boolean | null | undefined>;

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

/**
 * Sends a conversion/funnel event to whichever analytics is loaded.
 * GTM reads plain dataLayer objects; GA4-only setups need gtag('event').
 * Never pass names, emails, phone numbers, or health details here.
 */
export function trackEvent(event: string, payload: TrackPayload = {}) {
  if (typeof window === "undefined") return;
  const w = window as AnalyticsWindow;

  if (typeof w.gtag === "function") {
    w.gtag("event", event, payload);
    return;
  }

  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ event, ...payload });
}
