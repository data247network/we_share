"use client";

import { ReactNode } from "react";
import { WS } from "@/components/brand/tokens";
import { Logo } from "@/components/brand/Logo";
import { Card } from "@/components/brand";
import { Btn } from "@/components/brand/Btn";
import { Avatar } from "@/components/brand/Avatar";
import { Icons } from "@/components/brand/Icons";
import { createClient } from "@/lib/supabase/client";

const WEB_SIDE = "#F4ECDC";

const navItems = [
  { id: "overview", label: "Overview", icon: Icons.home,  route: "/shop/dashboard" },
  { id: "items",    label: "Items",    icon: Icons.pkg,   route: "/shop/m/list" },
  { id: "pools",    label: "Pools",    icon: Icons.pool,  route: "/shop/m/pools" },
  { id: "orders",   label: "Orders",   icon: Icons.inbox, route: "/shop/m" },
  { id: "payouts",  label: "Payouts",  icon: Icons.share, route: "/shop/dashboard" },
  { id: "reviews",  label: "Reviews",  icon: Icons.star,  route: "/shop/dashboard" },
];

export function WebShell({ active = "overview", children, breadcrumbs = ["Dashboard"] }: { active?: string; children: ReactNode; breadcrumbs?: string[] }) {
  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  }

  return (
    <div style={{ display: "flex", height: "100dvh", background: WS.cream, fontFamily: WS.sans, color: WS.ink, overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{ width: 230, background: WEB_SIDE, borderRight: `1px solid ${WS.line}`, display: "flex", flexDirection: "column", padding: "18px 14px", flexShrink: 0 }}>
        <div style={{ padding: "0 6px 18px" }}>
          <span style={{ cursor: "pointer" }} onClick={() => window.location.href = "/shop/dashboard"}>
            <Logo size={19} />
          </span>
        </div>
        <div style={{ padding: "10px 8px 12px", display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.6)", borderRadius: 12, marginBottom: 14, border: `1px solid ${WS.line}` }}>
          <Avatar name="Tunde Butchery" size={32} bg={WS.ink} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 12.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Tunde's Butchery</div>
            <div style={{ fontFamily: WS.mono, fontSize: 10, color: WS.mute }}>WS-SHOP-014</div>
          </div>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map((n) => {
            const a = n.id === active;
            return (
              <div
                key={n.id}
                onClick={() => window.location.href = n.route}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 10, background: a ? WS.terra : "transparent", color: a ? "#fff" : WS.ink2, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                {n.icon(a ? "#fff" : WS.ink2, 16)} {n.label}
              </div>
            );
          })}
        </nav>
        <div style={{ flex: 1 }} />
        <Card p={12} style={{ background: WS.butterLt, border: "none", marginBottom: 8 }}>
          <div style={{ fontFamily: WS.serif, fontWeight: 600, fontSize: 13 }}>Verified shop</div>
          <div style={{ fontSize: 11, color: "#8A6914", marginTop: 2 }}>Wholesale price submitted</div>
        </Card>
        <button
          onClick={handleSignOut}
          style={{ width: "100%", background: "rgba(42,31,27,0.06)", border: `1px solid ${WS.line}`, borderRadius: 8, padding: "8px 10px", color: WS.ink2, fontSize: 12, fontWeight: 600, cursor: "pointer", textAlign: "left", fontFamily: WS.sans }}>
          Sign out →
        </button>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 26px", borderBottom: `1px solid ${WS.line}`, background: "rgba(255,255,255,0.5)", flexShrink: 0 }}>
          <div style={{ fontFamily: WS.mono, fontSize: 11, color: WS.mute }}>{breadcrumbs.join(" / ")}</div>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: `1px solid ${WS.line}`, borderRadius: 10, padding: "6px 12px", width: 280 }}>
            {Icons.search(WS.mute, 14)} <span style={{ fontSize: 12.5, color: WS.mute }}>Search items, pools, buyers…</span>
          </div>
          <Btn tone="primary" size="sm" onClick={() => window.location.href = "/shop/m/list"}>+ List item</Btn>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>{children}</div>
      </div>
    </div>
  );
}
