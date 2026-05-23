"use client";

import { WS } from "@/components/brand/tokens";
import { Card, ImgSlot, SectionTitle, Bar } from "@/components/brand";
import { Pill } from "@/components/brand/Pill";
import { Btn } from "@/components/brand/Btn";
import { Avatar } from "@/components/brand/Avatar";
import { FractionBadge } from "@/components/brand/FractionBadge";
import { Icons } from "@/components/brand/Icons";

function ShopTabBar({ active = "home" }: { active?: string }) {
  const tabs = [
    { id: "home", label: "Today", icon: Icons.home },
    { id: "pools", label: "Pools", icon: Icons.pool },
    { id: "items", label: "Items", icon: Icons.pkg },
    { id: "inbox", label: "Inbox", icon: Icons.inbox },
    { id: "me", label: "Shop", icon: Icons.user },
  ];
  return (
    <div style={{ display: "flex", justifyContent: "space-around", padding: "10px 8px 22px", background: "rgba(251,245,236,0.92)", backdropFilter: "blur(20px)", borderTop: `1px solid ${WS.line}`, flexShrink: 0 }}>
      {tabs.map((t) => {
        const isActive = t.id === active;
        return (
          <div key={t.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, color: isActive ? WS.terra : WS.mute }}>
            {t.icon(isActive ? WS.terra : WS.mute, 22)}
            <span style={{ fontSize: 10.5, fontWeight: 600 }}>{t.label}</span>
          </div>
        );
      })}
    </div>
  );
}

const kpis = [
  { l: "Pools filled", v: "7", s: "+2 vs Mon", tone: WS.terraLt, fg: WS.terraDk },
  { l: "Revenue today", v: "£1,284", s: "£420 pending", tone: WS.sageLt, fg: "#33623A" },
  { l: "New customers", v: "12", s: "across 4 pools", tone: WS.butterLt, fg: "#8A6914" },
  { l: "Avg fill time", v: "4.3h", s: "-22% this wk", tone: WS.rose, fg: WS.plum },
];

const activePools = [
  { t: "Premium Ribeye · 4 kg case", f: 3, n: 4, status: "Fills in 6h" },
  { t: "Whole goat · halved", f: 1, n: 2, status: "Slow" },
  { t: "Chicken thighs · 5 kg", f: 4, n: 4, status: "Ready to pack", ready: true },
];

export default function ShopDashboard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: WS.cream, color: WS.ink, fontFamily: WS.sans, overflow: "hidden" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 24px" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0 14px" }}>
          <Avatar name="Tunde Butchery" size={32} bg={WS.ink} />
          <div style={{ fontFamily: WS.serif, fontSize: 18, fontWeight: 600 }}>Today</div>
          <div>{Icons.bell(WS.ink, 20)}</div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: WS.serif, fontSize: 24, fontWeight: 600, letterSpacing: "-0.015em", lineHeight: 1.15 }}>
            Good morning, <span style={{ color: WS.terra, fontStyle: "italic" }}>Tunde</span>
          </div>
          <div style={{ fontSize: 13, color: WS.ink2, marginTop: 4 }}>3 pools filling · 2 ready to pack</div>
        </div>

        {/* KPI tiles */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
          {kpis.map((k, i) => (
            <div key={i} style={{ background: k.tone, borderRadius: 14, padding: "12px 14px" }}>
              <div style={{ fontFamily: WS.mono, fontSize: 10, color: k.fg, opacity: 0.7, textTransform: "uppercase", letterSpacing: ".06em" }}>{k.l}</div>
              <div style={{ fontFamily: WS.serif, fontSize: 22, fontWeight: 700, color: k.fg, marginTop: 2 }}>{k.v}</div>
              <div style={{ fontSize: 11, color: k.fg, opacity: 0.8 }}>{k.s}</div>
            </div>
          ))}
        </div>

        <SectionTitle action="View all →">Active pools</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
          {activePools.map((p, i) => (
            <Card key={i} p={12}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <ImgSlot label="" tone="meat" h={56} r={10} style={{ width: 56, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: WS.serif, fontSize: 14.5, fontWeight: 600, letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.t}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                    <Bar value={(p.f / p.n) * 100} h={5} style={{ flex: 1 }} />
                    <span style={{ fontFamily: WS.mono, fontSize: 11, fontWeight: 600, color: WS.ink2 }}>{p.f}/{p.n}</span>
                  </div>
                  <div style={{ marginTop: 6 }}><Pill tone={p.ready ? "sage" : "line"} size="xs">{p.ready ? "✓ " : ""}{p.status}</Pill></div>
                </div>
                {Icons.chev(WS.mute, 16)}
              </div>
            </Card>
          ))}
        </div>

        <SectionTitle>Quick actions</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <Btn tone="primary" block>+ List new item</Btn>
          <Btn tone="ghost" block>Payouts</Btn>
        </div>
      </div>
      <ShopTabBar active="home" />
    </div>
  );
}
