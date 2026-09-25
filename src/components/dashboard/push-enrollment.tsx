"use client";

import { useEffect, useState } from "react";

function decodeKey(value: string): Uint8Array<ArrayBuffer> {
  const padded = value.padEnd(Math.ceil(value.length / 4) * 4, "=").replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(padded), c => c.charCodeAt(0));
}

export function PushEnrollment() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<{ configured: boolean; subscribedDevices: number } | null>(null);
  const [deviceStatus, setDeviceStatus] = useState<"checking" | "available" | "enabled" | "denied">("checking");
  const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  useEffect(() => {
    if (!key) return;
    fetch("/api/crm/push").then(response => response.ok ? response.json() : null)
      .then(data => { if (data) setStatus(data); })
      .catch(() => setMessage("Could not check notification status."));
    async function checkDevice() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
        setDeviceStatus("available");
        return;
      }
      if (Notification.permission === "denied") {
        setDeviceStatus("denied");
        return;
      }
      try {
        const registration = await navigator.serviceWorker.getRegistration("/");
        const subscription = await registration?.pushManager.getSubscription();
        setDeviceStatus(Notification.permission === "granted" && subscription ? "enabled" : "available");
      } catch {
        setDeviceStatus("available");
      }
    }
    void checkDevice();
  }, [key]);
  if (!key) return <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">Push is not configured yet. Your CRM administrator must configure the web-push signing keys and redeploy before devices can opt in.</p>;
  if (status && !status.configured) return <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">Push delivery is not configured yet. Ask your CRM administrator to complete the server-side signing keys.</p>;
  async function enable() {
    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) throw new Error("Push notifications are unavailable on this device.");
      if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.matchMedia("(display-mode: standalone)").matches) throw new Error("On iPhone, add this CRM to your Home Screen, open the installed app, then enable push here.");
      const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      const permission = Notification.permission === "default" ? await Notification.requestPermission() : Notification.permission;
      if (permission === "denied") setDeviceStatus("denied");
      if (permission !== "granted") throw new Error("Allow notifications in your device settings to receive CRM alerts.");
      const subscription = await registration.pushManager.getSubscription() ?? await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: decodeKey(key!) });
      const response = await fetch("/api/crm/push", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(subscription.toJSON()) });
      if (!response.ok) throw new Error((await response.json().catch(() => null))?.error ?? "Could not save your notification preference.");
      setStatus(previous => previous ? { ...previous, subscribedDevices: Math.max(1, previous.subscribedDevices) } : previous);
      setDeviceStatus("enabled");
      setMessage("Notifications enabled on this device.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not enable notifications."); }
  }
  return <div className="space-y-2"><div className="flex flex-wrap items-center gap-2">{deviceStatus === "available" && <button type="button" onClick={enable} className="rounded-xl border border-neutral-300 px-3 py-2 text-sm font-semibold">Enable push on this device</button>}{deviceStatus === "enabled" && <span role="status" className="text-sm font-semibold text-emerald-700">Push is enabled on this device.</span>}{deviceStatus === "denied" && <span role="status" className="text-sm text-amber-950">Notifications are blocked on this device. Enable them in device settings to receive lead alerts.</span>}{message && <span role="status" className="text-xs text-neutral-600">{message}</span>}</div>{status && <p className="text-xs text-neutral-500">{status.subscribedDevices} device{status.subscribedDevices === 1 ? "" : "s"} subscribed to your CRM account.</p>}</div>;
}
