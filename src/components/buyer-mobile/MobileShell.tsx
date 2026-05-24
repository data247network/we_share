"use client";

import { ReactNode } from "react";
import { WS } from "@/components/brand/tokens";
import { Icons } from "@/components/brand/Icons";

export function MobileScreen({
  children,
  bg = WS.cream,
  pad = true,
  footer,
}: {
  children: ReactNode;
  bg?: string;
  pad?: boolean;
  footer?: ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: bg, fontFamily: WS.sans, color: WS.ink, overflow: "hidden" }}>
      <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch", padding: pad ? "0 16px 24px" : "0" }}>
        {children}
      </div>
      {footer}
    </div>
  );
}

export function TopBar({ title, left, right }: { title: ReactNode; left?: ReactNode; right?: ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0 14px" }}>
      <div style={{ width: 40 }}>{left}</div>
      <div style={{ fontFamily: WS.serif, fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>{title}</div>
      <div style={{ width: 40, display: "flex", justifyContent: "flex-end" }}>{right}</div>
    </div>
  );
}

const tabs = [
  { id: "home", label: "Home", icon: Icons.home },
  { id: "pools", label: "Pools", icon: Icons.pool },
  { id: "orders", label: "Orders", icon: Icons.pkg },
  { id: "inbox", label: "Inbox", icon: Icons.inbox },
  { id: "profile", label: "Profile", icon: Icons.user },
];

const tabRoutes: Record<string, string> = {
  home: "/m",
  pools: "/m/pools",
  orders: "/m/orders",
  inbox: "/m/inbox",
  profile: "/m/profile",
};

export function TabBar({ active = "home" }: { active?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-around", padding: "10px 8px 22px", background: "rgba(251,245,236,0.92)", backdropFilter: "blur(20px)", borderTop: `1px solid ${WS.line}`, flexShrink: 0 }}>
      {tabs.map((t) => {
        const isActive = t.id === active;
        return (
          <div key={t.id}
            onClick={() => !isActive && (window.location.href = tabRoutes[t.id])}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, color: isActive ? WS.terra : WS.mute, cursor: isActive ? "default" : "pointer", padding: "4px 10px" }}>
            {t.icon(isActive ? WS.terra : WS.mute, 22)}
            <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: ".01em" }}>{t.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function SearchInput({ placeholder = "Search wholesale items, shops…" }: { placeholder?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", border: `1px solid ${WS.line}`, borderRadius: 14, padding: "11px 14px" }}>
      {Icons.search(WS.mute, 17)}
      <span style={{ fontSize: 14, color: WS.mute }}>{placeholder}</span>
    </div>
  );
}
