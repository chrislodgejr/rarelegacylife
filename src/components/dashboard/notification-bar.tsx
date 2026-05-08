"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, CheckCheck, MessageSquare } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { CrmNotification } from "@/types/domain";

export function NotificationBar({
  portal,
  profileId,
  initialNotifications,
}: {
  portal: "admin" | "agent";
  profileId: string;
  initialNotifications: CrmNotification[];
}) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [open, setOpen] = useState(false);
  const supabase = useMemo(() => createClient(), []);
  const unread = notifications.filter((notification) => !notification.read_at);
  const messagesPath = portal === "agent" ? "/agent/messages" : "/admin/messages";
  const leadPath = (leadId: string) =>
    portal === "agent" ? `/agent/leads/${leadId}` : `/admin/leads/${leadId}`;

  useEffect(() => {
    const channel = supabase
      .channel(`crm_notifications:${profileId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "crm_notifications",
          filter: `profile_id=eq.${profileId}`,
        },
        (payload) => {
          setNotifications((current) => [payload.new as CrmNotification, ...current].slice(0, 20));
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [profileId, supabase]);

  async function markAllRead() {
    const unreadIds = unread.map((notification) => notification.id);

    if (!unreadIds.length) {
      return;
    }

    const readAt = new Date().toISOString();
    setNotifications((current) =>
      current.map((notification) =>
        unreadIds.includes(notification.id) ? { ...notification, read_at: readAt } : notification,
      ),
    );

    await supabase.from("crm_notifications").update({ read_at: readAt }).in("id", unreadIds);
  }

  return (
    <div className="relative flex items-center gap-2">
      <Link
        className="inline-flex h-10 items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 text-sm font-semibold text-[#050505] shadow-sm transition hover:border-[#C9A227]"
        href={messagesPath}
        title="Open internal group chat"
      >
        <MessageSquare className="h-4 w-4 text-[#C9A227]" />
        <span className="hidden sm:inline">Chat</span>
      </Link>

      <button
        className="inline-flex h-10 items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 text-sm font-semibold text-[#050505] shadow-sm transition hover:border-[#C9A227]"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Open CRM notifications"
      >
        <Bell className="h-4 w-4 text-[#C9A227]" />
        <span className="hidden sm:inline">Notifications</span>
        {unread.length ? (
          <span className="gold-gradient-subtle rounded-full px-2 py-0.5 text-xs font-bold text-black">
            {unread.length}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-12 z-50 w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-neutral-100 p-4">
            <div>
              <p className="text-sm font-semibold text-[#050505]">Notifications</p>
              <p className="text-xs text-neutral-500">Lead activity and internal chat alerts</p>
            </div>
            <button
              className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
              type="button"
              onClick={markAllRead}
            >
              <CheckCheck className="h-4 w-4" />
              Read
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => {
              const href = notification.lead_id ? leadPath(notification.lead_id) : messagesPath;
              return (
                <Link
                  key={notification.id}
                  className="block border-b border-neutral-100 p-4 transition hover:bg-neutral-50"
                  href={href}
                  onClick={() => setOpen(false)}
                >
                  <div className="flex gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#050505] text-[#F5E7A3]">
                      <MessageSquare className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-[#050505]">
                        {notification.title}
                      </span>
                      {notification.body ? (
                        <span className="mt-1 block text-xs leading-5 text-neutral-600">
                          {notification.body}
                        </span>
                      ) : null}
                      <span className="mt-2 block text-xs text-neutral-400">
                        {new Date(notification.created_at).toLocaleString()}
                      </span>
                    </span>
                  </div>
                </Link>
              );
            })}
            {!notifications.length ? (
              <div className="grid gap-3 p-6 text-sm text-neutral-500">
                <p>No notifications yet.</p>
                <Link className="font-semibold text-[#8A6A16] hover:underline" href={messagesPath}>
                  Open internal group chat
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
