"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/** Fires one analytics event when the page loads (e.g. the lead conversion on /thank-you). */
export function TrackOnMount({ event }: { event: string }) {
  useEffect(() => {
    trackEvent(event, { page_path: window.location.pathname });
  }, [event]);

  return null;
}
