"use client";

export const runtime = "edge";

import { WS } from "@/components/brand/tokens";
import { Card, ImgSlot } from "@/components/brand";
import { Pill } from "@/components/brand/Pill";
import { Btn } from "@/components/brand/Btn";
import { Avatar } from "@/components/brand/Avatar";
import { FractionBadge } from "@/components/brand/FractionBadge";
import { Icons } from "@/components/brand/Icons";
import { MktNav } from "@/components/buyer-web/MktNav";

const portions = [
  { f: "1/4", kg: "1 kg", p: "30.50" },
  { f: "1/2", kg: "2 kg", p: "58.00", active: true },
  { f: "Full", kg: "4 kg", p: "112.00" },
];

const members = [
  { n: "Joy Mensah", p: "1/4", t: "1.0 kg" },
  { n: "Bola Kareem", p: "1/4", t: "1.0 kg" },
  { n: "Sam Okonkwo", p: "1/4", t: "1.0 kg" },
  { n: "You?", p: "1/4", t: "1.0 kg", open: true },
];

const productAttrs = [
  ["Cut", "Ribeye, centre"],
  ["Aging", "21 days dry"],
  ["Weight", "4 kg case"],
  ["Source", "Local farm co-op"],
];

const tabs = ["Description", "Pool members", "Shop info", "Reviews · 38"];

export default function BuyerWebItem() {
  return (
    <div style={{ background: WS.cream, fontFamily: WS.sans, color: WS.ink, minHeight: "100dvh" }}>
      <MktNav />

      <div style={{ padding: "14px 36px 8px", fontFamily: WS.mono, fontSize: 11, color: WS.mute }}>
        Browse / Meat & poultry / <b style={{ color: WS.ink }}>Premium Ribeye, dry-aged</b>
      </div>

      <div style={{ padding: "12px 36px 32px", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32 }}>
        {/* Gallery + description */}
        <div>
          <ImgSlot label="ribeye · 4kg case" tone="meat" h={420} r={18} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginTop: 10 }}>
            {["close-up", "case", "sliced", "rider drop"].map((l, i) => (
              <ImgSlot key={i} label={l} tone={i % 2 ? "butter" : "meat"} h={80} r={12} />
            ))}
          </div>

          <div style={{ marginTop: 32 }}>
            <div style={{ display: "flex", gap: 24, borderBottom: `1px solid ${WS.line}`, marginBottom: 18 }}>
              {tabs.map((t, i) => (
                <span key={i} style={{ paddingBottom: 10, fontWeight: 600, fontSize: 13.5, color: i === 0 ? WS.ink : WS.ink2, borderBottom: i === 0 ? `2px solid ${WS.terra}` : "2px solid transparent", cursor: "pointer" }}>{t}</span>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
              <div>
                <div style={{ fontSize: 14, color: WS.ink2, lineHeight: 1.65 }}>
                  Centre-cut ribeye from grass-finished cattle, dry-aged 21 days. Each 4 kg case yields four 1 kg portions, vacuum-sealed for pickup. Shop guarantees same-day butchery once the pool fills.
                </div>
                <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {productAttrs.map(([k, v], i) => (
                    <div key={i} style={{ paddingBottom: 10, borderBottom: `1px solid ${WS.line2}` }}>
                      <div style={{ fontFamily: WS.mono, fontSize: 10, color: WS.mute, textTransform: "uppercase" }}>{k}</div>
                      <div style={{ color: WS.ink, fontWeight: 600, marginTop: 2 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
              <Card style={{ background: WS.butterLt, border: "none" }}>
                <div style={{ fontFamily: WS.serif, fontWeight: 600, fontSize: 15, color: "#8A6914" }}>Why share?</div>
                <div style={{ fontSize: 12.5, color: "#8A6914", marginTop: 6, lineHeight: 1.5 }}>Buying one 4 kg case alone is wasteful. Pooling lets four neighbours each grab a 1 kg portion at <b>27% less</b> than retail.</div>
              </Card>
            </div>
          </div>
        </div>

        {/* Buy column */}
        <div>
          <Pill tone="terra" size="lg">WHOLESALE · 4 kg case</Pill>
          <div style={{ fontFamily: WS.serif, fontSize: 36, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.05, marginTop: 10 }}>Premium Ribeye,<br />dry-aged.</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8, color: WS.ink2, fontSize: 13 }}>
            <span style={{ fontWeight: 700, color: WS.ink }}>Tunde's Butchery</span> · {Icons.star(WS.butter, 12)} 4.9 (412) · 1.2 km · Yaba
          </div>

          <Card style={{ marginTop: 18, padding: 18, background: WS.paper }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <FractionBadge filled={3} total={4} size={64} label={false} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: WS.serif, fontSize: 17, fontWeight: 600 }}>3 of 4 portions claimed</div>
                <div style={{ fontSize: 12.5, color: WS.ink2 }}>Ships when full — about <b style={{ color: WS.ink }}>6h left</b></div>
              </div>
            </div>
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${WS.line2}`, display: "flex", flexDirection: "column", gap: 8 }}>
              {members.map((m, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {m.open
                    ? <div style={{ width: 28, height: 28, borderRadius: "50%", border: `1.5px dashed ${WS.terra}`, display: "flex", alignItems: "center", justifyContent: "center", color: WS.terra }}>{Icons.plus(WS.terra, 16)}</div>
                    : <Avatar name={m.n} size={28} />}
                  <span style={{ flex: 1, fontSize: 13.5, fontWeight: m.open ? 700 : 500, color: m.open ? WS.terra : WS.ink }}>{m.n}</span>
                  <Pill tone={m.open ? "terra" : "line"} size="xs">{m.p}</Pill>
                  <span style={{ fontFamily: WS.mono, fontSize: 11, color: WS.mute, minWidth: 50, textAlign: "right" }}>{m.t}</span>
                </div>
              ))}
            </div>
          </Card>

          <div style={{ marginTop: 18, fontFamily: WS.mono, fontSize: 10.5, color: WS.mute, textTransform: "uppercase" }}>Pick your portion</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 8 }}>
            {portions.map((o, i) => (
              <div key={i} style={{ padding: "14px 10px", borderRadius: 14, border: `1.5px solid ${o.active ? WS.terra : WS.line}`, background: o.active ? WS.terraLt : "#fff", textAlign: "center", cursor: "pointer" }}>
                <div style={{ fontFamily: WS.serif, fontSize: 20, fontWeight: 700, color: o.active ? WS.terraDk : WS.ink }}>{o.f}</div>
                <div style={{ fontFamily: WS.mono, fontSize: 10.5, color: WS.mute }}>{o.kg}</div>
                <div style={{ fontFamily: WS.sans, fontWeight: 700, fontSize: 14, marginTop: 4, color: o.active ? WS.terraDk : WS.ink }}>£{o.p}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
            <Btn tone="primary" size="lg" style={{ flex: 2 }}>Join pool · £58.00</Btn>
            <Btn tone="ghost" size="lg" style={{ flex: 1 }}>{Icons.share(WS.ink, 16)} Invite</Btn>
          </div>
          <div style={{ textAlign: "center", fontSize: 11.5, color: WS.mute, marginTop: 8 }}>You won't be charged until the pool fills.</div>
        </div>
      </div>
    </div>
  );
}
