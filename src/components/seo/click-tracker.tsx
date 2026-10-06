"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/** Sends an analytics event for any click on an element with data-track="event_name". */
export function ClickTracker() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-track]");
      if (!target) return;
      trackEvent(target.dataset.track ?? "click", { page_path: window.location.pathname });
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
