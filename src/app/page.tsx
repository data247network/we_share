"use client";

import { WS } from "@/components/brand/tokens";
import { Card, ImgSlot, Bar } from "@/components/brand";
import { Pill } from "@/components/brand/Pill";
import { Btn } from "@/components/brand/Btn";
import { AvatarStack, Avatar } from "@/components/brand/Avatar";
import { FractionBadge } from "@/components/brand/FractionBadge";
import { Icons } from "@/components/brand/Icons";
import { MktNav } from "@/components/buyer-web/MktNav";

const categories = ["All", "Meat & poultry", "Drinks", "Pantry staples", "Produce", "Frozen", "HORECA"];

const pools = [
  { t: "Premium Ribeye · 4 kg", shop: "Tunde's Butchery", img: "meat" as const, f: 3, n: 4, h: 6, p: "30.50", save: "27%" },
  { t: "Stout · 24-pack", shop: "Hopline Drinks", img: "drink" as const, f: 2, n: 4, h: 14, p: "18.00", save: "18%" },
  { t: "Chicken thighs · 5 kg", shop: "Farmly Lagos", img: "meat" as const, f: 4, n: 4, h: 0, p: "14.40", save: "32%", ready: true },
  { t: "Craft IPA · 12-pack", shop: "Hopline Drinks", img: "drink" as const, f: 1, n: 2, h: 22, p: "11.00", save: "21%" },
  { t: "Whole goat · halved", shop: "Tunde's Butchery", img: "meat" as const, f: 1, n: 2, h: 18, p: "34.00", save: "25%" },
  { t: "Beef shank · 3 kg", shop: "Tunde's Butchery", img: "meat" as const, f: 2, n: 3, h: 9, p: "22.00", save: "22%" },
  { t: "Cider · 12-pack", shop: "Hopline Drinks", img: "drink" as const, f: 3, n: 4, h: 5, p: "9.80", save: "18%" },
  { t: "Lamb chops · 4 kg", shop: "Farmly Lagos", img: "meat" as const, f: 2, n: 4, h: 12, p: "27.00", save: "24%" },
];

const howItWorks = [
  { n: 1, t: "Shops list a case", s: "Meat, drinks, pantry — at true wholesale.", tone: WS.terraLt, fg: WS.terraDk },
  { n: 2, t: "Neighbours pool up", s: "Claim a 1/2, 1/4 or 1/8 portion. Invite friends.", tone: WS.sageLt, fg: "#33623A" },
  { n: 3, t: "Pool fills, case ships", s: "Only charged once the case is full.", tone: WS.butterLt, fg: "#8A6914" },
  { n: 4, t: "Rider drops your share", s: "Each member receives their portion.", tone: WS.rose, fg: WS.plum },
];

export default function BuyerWebHome() {
  return (
    <div style={{ background: WS.cream, fontFamily: WS.sans, color: WS.ink, minHeight: "100dvh" }}>
      <MktNav />

      {/* Hero */}
      <div style={{ padding: "40px 36px 32px", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 32, alignItems: "center" }}>
        <div>
          <Pill tone="terra" size="lg" style={{ marginBottom: 14 }}>NEW · WHOLESALE SHARES</Pill>
          <div style={{ fontFamily: WS.serif, fontSize: 56, fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1, color: WS.ink }}>
            Buy in bulk.<br />
            <span style={{ fontStyle: "italic", color: WS.terra }}>Share</span> with neighbours.
          </div>
          <div style={{ fontSize: 15, color: WS.ink2, marginTop: 16, maxWidth: 480, lineHeight: 1.55 }}>
            Local shops list wholesale cases of meat, drinks and pantry goods. Pool with 1–7 others, save 20–35%, and we deliver each share.
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <Btn tone="primary" size="lg">Browse open pools</Btn>
            <Btn tone="ghost" size="lg">How it works →</Btn>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 22, fontSize: 12, color: WS.ink2 }}>
            <AvatarStack names={["Ada A", "Joy M", "Bola K", "Sam O", "Tina O"]} more={2842} size={22} />
            <span>2,847 neighbours pooling this week</span>
          </div>
        </div>

        {/* Illustrated card stack */}
        <div style={{ position: "relative", paddingTop: 40, paddingBottom: 40 }}>
          <Card p={0} style={{ overflow: "hidden", transform: "rotate(-3deg)", boxShadow: "0 20px 50px rgba(42,31,27,0.12)" }}>
            <ImgSlot label="ribeye · 4kg case" tone="meat" h={220} r={0} />
            <div style={{ padding: 16 }}>
              <Pill tone="solid" size="xs" style={{ marginBottom: 6 }}>3 / 4 IN POOL</Pill>
              <div style={{ fontFamily: WS.serif, fontSize: 18, fontWeight: 600 }}>Premium Ribeye, dry-aged</div>
              <div style={{ fontSize: 12, color: WS.ink2, marginTop: 2 }}>Tunde's Butchery · 1.2 km</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                <FractionBadge filled={3} total={4} size={34} />
                <span style={{ fontFamily: WS.serif, fontSize: 22, fontWeight: 700, color: WS.terraDk }}>£30.50</span>
              </div>
            </div>
          </Card>
          <Card p={12} style={{ position: "absolute", right: -10, top: 10, width: 200, transform: "rotate(5deg)", background: WS.butterLt, border: "none", boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}>
            <div style={{ fontFamily: WS.serif, fontSize: 14, fontWeight: 600, color: "#8A6914" }}>You saved £11.50</div>
            <div style={{ fontSize: 11, color: "#8A6914", opacity: 0.8 }}>vs retail · this share</div>
          </Card>
          <Card p={12} style={{ position: "absolute", left: -20, bottom: 10, width: 170, transform: "rotate(-6deg)", background: WS.sageLt, border: "none", boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar name="Joy M" size={26} />
              <div style={{ fontSize: 11, color: "#33623A", lineHeight: 1.3 }}><b>Joy</b> joined your pool</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Category strip */}
      <div style={{ padding: "12px 36px 0" }}>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6 }}>
          {categories.map((c, i) => (
            <Pill key={i} tone={i === 0 ? "solid" : "line"} size="lg">{c}</Pill>
          ))}
        </div>
      </div>

      {/* Pools grid */}
      <div style={{ padding: "24px 36px 40px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ fontFamily: WS.serif, fontSize: 24, fontWeight: 600, letterSpacing: "-0.015em" }}>Pools open near you</div>
          <div style={{ fontSize: 12, color: WS.ink2 }}>Sorted by: <b style={{ color: WS.ink }}>Time to fill ↑</b></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {pools.map((p, i) => (
            <Card key={i} p={0} style={{ overflow: "hidden", display: "flex", flexDirection: "column", cursor: "pointer" }}>
              <div style={{ position: "relative" }}>
                <ImgSlot label="" tone={p.img} h={130} r={0} />
                <div style={{ position: "absolute", top: 8, left: 8, display: "flex", gap: 5 }}>
                  {p.ready
                    ? <Pill tone="sage" size="xs">✓ Ready to ship</Pill>
                    : <Pill tone="solid" size="xs">⏱ {p.h}h left</Pill>}
                </div>
                <div style={{ position: "absolute", top: 8, right: 8 }}>
                  <Pill tone="butter" size="xs">−{p.save}</Pill>
                </div>
              </div>
              <div style={{ padding: "12px 14px 14px", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ fontFamily: WS.serif, fontSize: 14.5, fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.005em" }}>{p.t}</div>
                <div style={{ fontSize: 11.5, color: WS.ink2, marginTop: 3 }}>{p.shop}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                  <FractionBadge filled={p.f} total={p.n} size={22} ring={false} />
                  <Bar value={(p.f / p.n) * 100} h={5} style={{ flex: 1 }} />
                </div>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: `1px solid ${WS.line2}` }}>
                  <div>
                    <span style={{ fontFamily: WS.mono, fontSize: 10, color: WS.mute }}>1/{p.n} SHARE</span>
                    <div style={{ fontFamily: WS.serif, fontWeight: 700, fontSize: 18, color: WS.ink }}>£{p.p}</div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: WS.terraDk }}>Join →</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ background: "#fff", padding: "40px 36px", borderTop: `1px solid ${WS.line}`, borderBottom: `1px solid ${WS.line}` }}>
        <div style={{ fontFamily: WS.serif, fontSize: 24, fontWeight: 600, letterSpacing: "-0.015em", marginBottom: 24 }}>How WeShare works</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
          {howItWorks.map((s) => (
            <div key={s.n}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: s.tone, color: s.fg, fontFamily: WS.serif, fontSize: 22, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{s.n}</div>
              <div style={{ fontFamily: WS.serif, fontSize: 17, fontWeight: 600, marginTop: 12, letterSpacing: "-0.01em" }}>{s.t}</div>
              <div style={{ fontSize: 12.5, color: WS.ink2, marginTop: 4, lineHeight: 1.5 }}>{s.s}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
