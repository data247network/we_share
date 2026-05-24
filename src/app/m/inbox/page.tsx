"use client";

import { useEffect, useState } from "react";
import { WS } from "@/components/brand/tokens";
import { Card } from "@/components/brand";
import { Pill } from "@/components/brand/Pill";
import { MobileScreen, TopBar, TabBar } from "@/components/buyer-mobile/MobileShell";
import { createClient } from "@/lib/supabase/client";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  read: boolean;
  created_at: string;
  data: Record<string, string> | null;
}

const typeIcon: Record<string, string> = {
  pool_filled: "🎉",
  pool_shipped: "🚚",
  pool_delivered: "✅",
  pool_invite: "👥",
  pool_joined: "👋",
  payment_held: "🔒",
  payment_captured: "💳",
  default: "🔔",
};

export default function Inbox() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      setIsLoggedIn(true);

      supabase
        .from("notifications")
        .select("id, type, title, body, read, created_at, data")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50)
        .then(({ data }) => {
          setNotifications((data as Notification[]) || []);
          setLoading(false);
          // Mark unread as read
          const unread = (data ?? []).filter((n: Notification) => !n.read).map((n: Notification) => n.id);
          if (unread.length > 0) {
            supabase.from("notifications").update({ read: true }).in("id", unread).then(() => {});
          }
        });
    });
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isLoggedIn && !loading) {
    return (
      <MobileScreen footer={<TabBar active="inbox" />}>
        <TopBar title="Inbox" />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16, textAlign: "center" }}>
          <div style={{ fontSize: 48 }}>🔔</div>
          <div style={{ fontFamily: WS.serif, fontSize: 20, fontWeight: 600 }}>Sign in to see your inbox</div>
          <button onClick={() => window.location.href = "/auth/login?redirect=/m/inbox"}
            style={{ background: WS.terra, color: "#fff", border: "none", borderRadius: 12, padding: "12px 24px", fontFamily: WS.sans, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
            Sign in
          </button>
        </div>
      </MobileScreen>
    );
  }

  return (
    <MobileScreen footer={<TabBar active="inbox" />}>
      <TopBar
        title="Inbox"
        right={unreadCount > 0 ? <Pill tone="terra" size="xs">{unreadCount} new</Pill> : undefined}
      />

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} p={14} style={{ opacity: 0.4 }}>
              <div style={{ background: WS.line, height: 13, borderRadius: 4, width: "70%", marginBottom: 8 }} />
              <div style={{ background: WS.line2, height: 10, borderRadius: 4, width: "50%" }} />
            </Card>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 12, textAlign: "center" }}>
          <div style={{ fontSize: 48 }}>🔔</div>
          <div style={{ fontFamily: WS.serif, fontSize: 20, fontWeight: 600 }}>All quiet</div>
          <div style={{ fontSize: 13, color: WS.ink2 }}>Notifications about your pools will appear here.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {notifications.map((n) => (
            <Card key={n.id} p={14} style={{ background: n.read ? "#fff" : WS.terraLt, border: n.read ? `1px solid ${WS.line}` : `1px solid ${WS.terra}` }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ fontSize: 22, flexShrink: 0 }}>{typeIcon[n.type] ?? typeIcon.default}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: WS.serif, fontSize: 14.5, fontWeight: 600, color: WS.ink, lineHeight: 1.2 }}>{n.title}</div>
                  {n.body && <div style={{ fontSize: 12.5, color: WS.ink2, marginTop: 4, lineHeight: 1.4 }}>{n.body}</div>}
                  <div style={{ fontSize: 11, color: WS.mute, marginTop: 6 }}>
                    {new Date(n.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: WS.terra, flexShrink: 0, marginTop: 4 }} />}
              </div>
            </Card>
          ))}
        </div>
      )}
    </MobileScreen>
  );
}
