"use client";

import { WS } from "@/components/brand/tokens";
import { Card, ImgSlot, SectionTitle } from "@/components/brand";
import { Pill } from "@/components/brand/Pill";
import { Btn } from "@/components/brand/Btn";
import { Avatar } from "@/components/brand/Avatar";
import { FractionBadge } from "@/components/brand/FractionBadge";
import { Icons } from "@/components/brand/Icons";

const portions = [
  { f: "1/4", kg: "1.0 kg", price: "30.50" },
  { f: "1/2", kg: "2.0 kg", price: "58.00", active: true },
  { f: "Full", kg: "4.0 kg", price: "112.00" },
];

const members = [
  { n: "Joy M.", p: "1/4", t: "1kg" },
  { n: "Bola K.", p: "1/4", t: "1kg" },
  { n: "Sam O.", p: "1/4", t: "1kg" },
  { n: "Open", p: "1/4", t: "1kg", open: true },
];

export default function ItemDetail() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: WS.cream, color: WS.ink, fontFamily: WS.sans, overflow: "hidden" }}>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ position: "relative" }}>
          <ImgSlot label="ribeye · 4kg case" tone="meat" h={260} r={0} />
          <div style={{ position: "absolute", top: 14, left: 14, width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {Icons.back(WS.ink, 18)}
          </div>
          <div style={{ position: "absolute", top: 14, right: 14, width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {Icons.share(WS.ink, 16)}
          </div>
        </div>

        <div style={{ padding: "18px 18px 24px" }}>
          <Pill tone="terra" size="xs" style={{ marginBottom: 8 }}>WHOLESALE · 4 kg case</Pill>
          <div style={{ fontFamily: WS.serif, fontSize: 24, fontWeight: 600, letterSpacing: "-0.015em", lineHeight: 1.15 }}>Premium Ribeye, dry-aged</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6, color: WS.ink2, fontSize: 13 }}>
            <span style={{ fontWeight: 600, color: WS.ink }}>Tunde's Butchery</span>
            <span>·</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>{Icons.star(WS.butter, 12)} 4.9</span>
            <span>·</span>
            <span>1.2 km</span>
          </div>

          <Card style={{ marginTop: 18, background: WS.paper }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <FractionBadge filled={3} total={4} size={64} label={false} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: WS.serif, fontSize: 17, fontWeight: 600, lineHeight: 1.2 }}>3 of 4 portions claimed</div>
                <div style={{ fontSize: 12.5, color: WS.ink2, marginTop: 2 }}>Ships when full · approx. <b style={{ color: WS.ink }}>6h left</b></div>
              </div>
            </div>
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${WS.line2}`, display: "flex", flexDirection: "column", gap: 10 }}>
              {members.map((m, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {m.open
                    ? <div style={{ width: 28, height: 28, borderRadius: "50%", border: `1.5px dashed ${WS.terra}`, display: "flex", alignItems: "center", justifyContent: "center", color: WS.terra }}>{Icons.plus(WS.terra, 16)}</div>
                    : <Avatar name={m.n} size={28} />}
                  <span style={{ flex: 1, fontSize: 13.5, fontWeight: m.open ? 600 : 500, color: m.open ? WS.terra : WS.ink }}>{m.n}</span>
                  <Pill tone={m.open ? "terra" : "line"} size="xs">{m.p}</Pill>
                  <span style={{ fontFamily: WS.mono, fontSize: 11, color: WS.mute, minWidth: 36, textAlign: "right" }}>{m.t}</span>
                </div>
              ))}
            </div>
          </Card>

          <div style={{ marginTop: 22 }}>
            <SectionTitle>Choose your portion</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {portions.map((o, i) => (
                <div key={i} style={{ padding: "12px 10px", borderRadius: 14, border: `1.5px solid ${o.active ? WS.terra : WS.line}`, background: o.active ? WS.terraLt : "#fff", textAlign: "center" }}>
                  <div style={{ fontFamily: WS.serif, fontSize: 20, fontWeight: 600, color: o.active ? WS.terraDk : WS.ink }}>{o.f}</div>
                  <div style={{ fontFamily: WS.mono, fontSize: 10.5, color: WS.mute, marginTop: 2 }}>{o.kg}</div>
                  <div style={{ fontFamily: WS.sans, fontWeight: 700, fontSize: 13.5, marginTop: 6, color: o.active ? WS.terraDk : WS.ink }}>£{o.price}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <SectionTitle>How sharing works</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12.5, color: WS.ink2 }}>
              <div>① The shop only sells the full case at <b style={{ color: WS.ink }}>wholesale price</b>.</div>
              <div>② Neighbours join the pool and split portions.</div>
              <div>③ When full, the case ships and a rider drops each share.</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "12px 16px 18px", background: "rgba(251,245,236,0.95)", backdropFilter: "blur(20px)", borderTop: `1px solid ${WS.line}`, display: "flex", gap: 8, flexShrink: 0 }}>
        <Btn tone="ghost" size="lg" style={{ flex: "0 0 auto" }}>{Icons.share(WS.ink, 16)} Invite</Btn>
        <Btn tone="primary" size="lg" block style={{ flex: 1 }}>Join pool — £58.00</Btn>
      </div>
    </div>
  );
}
