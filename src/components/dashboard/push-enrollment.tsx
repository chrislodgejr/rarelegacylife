"use client";

import { useState } from "react";

function decodeKey(value: string): Uint8Array<ArrayBuffer> {
  const padded = value.padEnd(Math.ceil(value.length / 4) * 4, "=").replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(padded), c => c.charCodeAt(0));
}

export function PushEnrollment() {
  const [message, setMessage] = useState("");
  const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!key) return null;
  async function enable() {
    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) throw new Error("Push notifications are unavailable on this device.");
      const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      const permission = await Notification.requestPermission();
      if (permission !== "granted") throw new Error("Allow notifications in your device settings to receive CRM alerts.");
      const subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: decodeKey(key!) });
      const response = await fetch("/api/crm/push", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(subscription.toJSON()) });
      if (!response.ok) throw new Error("Could not save your notification preference.");
      setMessage("Notifications enabled on this device.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not enable notifications."); }
  }
  return <div className="flex flex-wrap items-center gap-2"><button type="button" onClick={enable} className="rounded-xl border border-neutral-300 px-3 py-2 text-sm font-semibold">Enable push</button>{message && <span role="status" className="text-xs text-neutral-600">{message}</span>}</div>;
}
