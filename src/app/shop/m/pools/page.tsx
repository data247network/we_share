"use client";

import { WS } from "@/components/brand/tokens";
import { Card, SectionTitle } from "@/components/brand";
import { Pill } from "@/components/brand/Pill";
import { Btn } from "@/components/brand/Btn";
import { AvatarStack } from "@/components/brand/Avatar";
import { FractionBadge } from "@/components/brand/FractionBadge";
import { Icons } from "@/components/brand/Icons";

const ready = [
  { item: "Chicken thighs · 5 kg", members: ["Joy M", "Bola K", "Sam O", "Tina", "Ada A"], n: 5, payout: "£176.40" },
  { item: "Whole goat · halved", members: ["Femi", "Chika"], n: 2, payout: "£84.00" },
];

const filling = [
  { item: "Premium Ribeye · 4 kg", f: 3, n: 4, hLeft: "6h" },
  { item: "Stout · 24-pack", f: 1, n: 4, hLeft: "18h" },
  { item: "Beef shank · 3 kg", f: 2, n: 3, hLeft: "9h" },
];

export default function ShopOrders() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: WS.cream, color: WS.ink, fontFamily: WS.sans, overflow: "hidden" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0 14px" }}>
          <div style={{ width: 40 }} />
          <div style={{ fontFamily: WS.serif, fontSize: 18, fontWeight: 600 }}>Pools</div>
          <div>{Icons.search(WS.ink, 20)}</div>
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
          <Pill tone="solid" size="lg">Filling · 3</Pill>
          <Pill tone="line" size="lg">Ready · 2</Pill>
          <Pill tone="line" size="lg">Shipped · 8</Pill>
        </div>

        <div style={{ fontFamily: WS.mono, fontSize: 10.5, color: WS.mute, textTransform: "uppercase", letterSpacing: ".06em", margin: "6px 0 8px" }}>Ready to pack · 2</div>
        {ready.map((o, i) => (
          <Card key={i} style={{ marginBottom: 10, background: "#fff", borderLeft: `3px solid ${WS.sage}` }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <div style={{ fontFamily: WS.serif, fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>{o.item}</div>
              <Pill tone="sage" size="xs">✓ Full</Pill>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
              <AvatarStack names={o.members} size={26} />
              <span style={{ fontSize: 12, color: WS.ink2 }}>{o.n} buyers</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: `1px solid ${WS.line2}` }}>
              <div>
                <div style={{ fontFamily: WS.mono, fontSize: 10.5, color: WS.mute }}>YOUR PAYOUT</div>
                <div style={{ fontFamily: WS.serif, fontSize: 18, fontWeight: 700 }}>{o.payout}</div>
              </div>
              <Btn tone="primary" size="sm">Pack & hand off →</Btn>
            </div>
          </Card>
        ))}

        <div style={{ fontFamily: WS.mono, fontSize: 10.5, color: WS.mute, textTransform: "uppercase", letterSpacing: ".06em", margin: "16px 0 8px" }}>Still filling · 3</div>
        {filling.map((o, i) => (
          <Card key={i} style={{ marginBottom: 10, background: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <FractionBadge filled={o.f} total={o.n} size={36} label={false} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: WS.serif, fontSize: 14, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.item}</div>
                <div style={{ fontSize: 12, color: WS.ink2, marginTop: 2 }}><span style={{ fontFamily: WS.mono }}>{o.f}/{o.n}</span> · {o.hLeft} left</div>
              </div>
              {Icons.chev(WS.mute, 16)}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
