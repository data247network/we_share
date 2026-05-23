"use client";

import { WS } from "@/components/brand/tokens";
import { Card, ImgSlot } from "@/components/brand";
import { Pill } from "@/components/brand/Pill";
import { Btn } from "@/components/brand/Btn";
import { FractionBadge } from "@/components/brand/FractionBadge";
import { Icons } from "@/components/brand/Icons";
import { MobileScreen, TopBar } from "@/components/buyer-mobile/MobileShell";

const paymentMethods = [
  { t: "WeShare Wallet", s: "Balance · £102.40", sel: true, badge: "Instant", tone: WS.sage, label: "WS" },
  { t: "Visa · 4242", s: "Expires 09/27", sel: false, tone: "#1A1F71", label: "VISA" },
];

const summary = [
  ["Your share (1/2 · 2.0 kg)", "£58.00"],
  ["Delivery (split 4 ways)", "£1.80"],
  ["Service", "£0.80"],
];

export default function Checkout() {
  return (
    <MobileScreen>
      <TopBar title="Checkout" left={Icons.back(WS.ink, 20)} />

      <Card style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <ImgSlot label="ribeye" tone="meat" h={64} r={12} style={{ width: 64, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: WS.serif, fontWeight: 600, fontSize: 15, letterSpacing: "-0.01em" }}>Premium Ribeye</div>
          <div style={{ fontSize: 12, color: WS.ink2, marginTop: 2 }}>Your portion: <b style={{ color: WS.ink }}>1/2 · 2.0 kg</b></div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
            <FractionBadge filled={3} total={4} size={20} label={false} />
            <span style={{ fontSize: 11, color: WS.ink2 }}>Pool ships when full</span>
          </div>
        </div>
      </Card>

      <div style={{ fontFamily: WS.mono, fontSize: 10.5, color: WS.mute, textTransform: "uppercase", letterSpacing: ".06em", margin: "8px 0 8px" }}>Deliver to</div>
      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          {Icons.pin(WS.terra, 20)}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>Home · Yaba</div>
            <div style={{ fontSize: 12.5, color: WS.ink2, marginTop: 2 }}>14B Herbert Macaulay Way, Yaba, Lagos</div>
          </div>
          <span style={{ fontSize: 12, color: WS.terraDk, fontWeight: 600 }}>Change</span>
        </div>
      </Card>

      <div style={{ fontFamily: WS.mono, fontSize: 10.5, color: WS.mute, textTransform: "uppercase", letterSpacing: ".06em", margin: "4px 0 8px" }}>Payment</div>
      <Card p={0} style={{ marginBottom: 14, overflow: "hidden" }}>
        {paymentMethods.map((m, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px", borderBottom: i === 0 ? `1px solid ${WS.line2}` : "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: m.tone, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: WS.mono, fontWeight: 700, fontSize: 11 }}>{m.label}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{m.t}</div>
              <div style={{ fontSize: 12, color: WS.ink2 }}>{m.s}</div>
            </div>
            {m.badge && <Pill tone="sage" size="xs">{m.badge}</Pill>}
            <div style={{ width: 22, height: 22, borderRadius: "50%", border: `1.5px solid ${m.sel ? WS.terra : WS.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {m.sel && <div style={{ width: 10, height: 10, borderRadius: "50%", background: WS.terra }} />}
            </div>
          </div>
        ))}
      </Card>

      <div style={{ fontFamily: WS.mono, fontSize: 10.5, color: WS.mute, textTransform: "uppercase", letterSpacing: ".06em", margin: "4px 0 8px" }}>Summary</div>
      <Card style={{ marginBottom: 14 }}>
        {summary.map(([k, v], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13.5, color: WS.ink2 }}>
            <span>{k}</span>
            <span style={{ color: WS.ink, fontWeight: 600 }}>{v}</span>
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${WS.line2}`, marginTop: 8, paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontFamily: WS.serif, fontSize: 17, fontWeight: 600 }}>Total</span>
          <span style={{ fontFamily: WS.serif, fontSize: 20, fontWeight: 700, color: WS.ink }}>£60.60</span>
        </div>
      </Card>

      <Btn tone="primary" size="lg" block style={{ marginTop: 6 }}>Place order · pay £60.60</Btn>
      <div style={{ textAlign: "center", fontSize: 11.5, color: WS.mute, marginTop: 10 }}>You'll only be charged when the pool fills.</div>
    </MobileScreen>
  );
}
