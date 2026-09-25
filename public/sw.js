// No CRM records or authenticated responses are cached on this device.
self.addEventListener("push", (event) => {
  const payload = event.data ? event.data.json() : {};
  event.waitUntil(self.registration.showNotification(payload.title || "Rare Legacy CRM", {
    body: payload.body || "You have a new update. Open the CRM to view it.",
    icon: "/icon.png",
    badge: "/icon.png",
    tag: payload.tag || "crm-update",
    data: { url: typeof payload.url === "string" && payload.url.startsWith("/admin/") ? payload.url : "/admin/dashboard" },
  }));
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.url || "/admin/dashboard", self.location.origin);
  if (url.origin !== self.location.origin) return;
  event.waitUntil(clients.openWindow(url.href));
});
