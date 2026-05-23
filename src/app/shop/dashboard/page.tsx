"use client";

import { WS } from "@/components/brand/tokens";
import { Card } from "@/components/brand";
import { Pill } from "@/components/brand/Pill";
import { AvatarStack } from "@/components/brand/Avatar";
import { FractionBadge } from "@/components/brand/FractionBadge";
import { WebShell } from "@/components/shop-web/WebShell";

const kpis = [
  { l: "Revenue", v: "£1,284", s: "+18% vs Mon", tone: WS.terra, bg: WS.terraLt },
  { l: "Pools filled", v: "7", s: "avg 4.3h fill", tone: WS.sage, bg: WS.sageLt },
  { l: "New buyers", v: "12", s: "4 returning", tone: "#8A6914", bg: WS.butterLt },
  { l: "Payout pending", v: "£840", s: "arrives Wed", tone: WS.plum, bg: WS.rose },
];

const topItems = [
  { n: "Premium Ribeye", p: 14, r: "£540" },
  { n: "Chicken thighs", p: 9, r: "£315" },
  { n: "Whole goat", p: 5, r: "£210" },
  { n: "Beef shank", p: 4, r: "£140" },
];

const poolRows = [
  { i: "Premium Ribeye · 4 kg", f: 3, n: 4, b: ["Joy", "Bola", "Sam"], t: "6h", r: "£115.50", s: "Filling" },
  { i: "Whole goat · halved", f: 1, n: 2, b: ["Femi"], t: "18h", r: "£42.00", s: "Slow" },
  { i: "Chicken thighs · 5 kg", f: 5, n: 5, b: ["Joy", "Bola", "Sam", "Tina", "Ada"], t: "—", r: "£176.40", s: "Ready", ready: true },
  { i: "Beef shank · 3 kg", f: 2, n: 3, b: ["Ada", "Chika"], t: "9h", r: "£84.00", s: "Filling" },
  { i: "Liver · 2 kg case", f: 2, n: 2, b: ["Tina", "Femi"], t: "—", r: "£56.00", s: "Ready", ready: true },
];

const chartDays = ["M", "T", "W", "T", "F", "S", "S"];
const filled = [80, 110, 60, 140, 100, 140, 90];
const filling = [20, 30, 15, 30, 20, 40, 25];

export default function SellerDashboard() {
  return (
    <WebShell active="overview" breadcrumbs={["Overview", "Today"]}>
      <div style={{ padding: "26px 32px 40px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 22 }}>
          <div>
            <div style={{ fontFamily: WS.serif, fontSize: 32, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.05 }}>
              Hello, <span style={{ fontStyle: "italic", color: WS.terra }}>Tunde</span>
            </div>
            <div style={{ fontSize: 13, color: WS.ink2, marginTop: 4 }}>Tuesday · 3 pools filling now</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <Pill tone="line" size="lg">Last 7 days</Pill>
            <Pill tone="solid" size="lg">Today</Pill>
          </div>
        </div>

        {/* KPI cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 22 }}>
          {kpis.map((k, i) => (
            <Card key={i} style={{ background: k.bg, border: "none" }}>
              <div style={{ fontFamily: WS.mono, fontSize: 10, color: k.tone, textTransform: "uppercase", letterSpacing: ".06em", opacity: 0.85 }}>{k.l}</div>
              <div style={{ fontFamily: WS.serif, fontSize: 32, fontWeight: 700, color: k.tone, letterSpacing: "-0.02em", marginTop: 4 }}>{k.v}</div>
              <div style={{ fontSize: 11.5, color: k.tone, opacity: 0.85 }}>{k.s}</div>
            </Card>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14, marginBottom: 14 }}>
          {/* Bar chart */}
          <Card style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontFamily: WS.serif, fontSize: 18, fontWeight: 600 }}>Pool fills · this week</div>
              <div style={{ display: "flex", gap: 14, fontSize: 11.5 }}>
                <span style={{ color: WS.ink2 }}>● Filled</span>
                <span style={{ color: WS.mute }}>● Filling</span>
              </div>
            </div>
            <svg viewBox="0 0 600 180" style={{ width: "100%", height: 180 }}>
              {[0, 1, 2, 3].map((g) => (
                <line key={g} x1="0" x2="600" y1={20 + g * 40} y2={20 + g * 40} stroke={WS.line2} />
              ))}
              {chartDays.map((d, i) => {
                const x = 30 + i * 86;
                const h1 = filled[i];
                const h2 = filling[i];
                return (
                  <g key={i}>
                    <rect x={x - 18} y={160 - h1} width={36} height={h1} rx={6} fill={WS.terra} />
                    <rect x={x - 18} y={160 - h1 - h2 - 2} width={36} height={h2} rx={6} fill={WS.terraLt} />
                    <text x={x} y={176} textAnchor="middle" fontFamily={WS.mono} fontSize="10" fill={WS.mute}>{d}</text>
                  </g>
                );
              })}
            </svg>
          </Card>

          {/* Top items */}
          <Card style={{ padding: 20 }}>
            <div style={{ fontFamily: WS.serif, fontSize: 18, fontWeight: 600, marginBottom: 14 }}>Top items</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {topItems.map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: [WS.terra, WS.sage, WS.butter, WS.plum][i] }} />
                  <div style={{ flex: 1, fontSize: 13 }}>{t.n}</div>
                  <span style={{ fontFamily: WS.mono, fontSize: 11, color: WS.mute }}>{t.p} pools</span>
                  <span style={{ fontFamily: WS.serif, fontWeight: 600, fontSize: 13.5, minWidth: 50, textAlign: "right" }}>{t.r}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Pools table */}
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", display: "flex", alignItems: "baseline", justifyContent: "space-between", borderBottom: `1px solid ${WS.line2}` }}>
            <div style={{ fontFamily: WS.serif, fontSize: 18, fontWeight: 600 }}>Active pools</div>
            <div style={{ display: "flex", gap: 6 }}>
              <Pill tone="solid" size="xs">All · 5</Pill>
              <Pill tone="line" size="xs">Filling · 3</Pill>
              <Pill tone="sage" size="xs">Ready · 2</Pill>
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: WS.cream }}>
                {["Item", "Pool", "Buyers", "Time left", "Revenue", "Status", ""].map((h, i) => (
                  <th key={i} style={{ textAlign: "left", padding: "10px 16px", fontFamily: WS.mono, fontSize: 10, color: WS.mute, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {poolRows.map((r, i) => (
                <tr key={i} style={{ borderTop: `1px solid ${WS.line2}` }}>
                  <td style={{ padding: "12px 16px", fontWeight: 600 }}>{r.i}</td>
                  <td style={{ padding: "12px 16px" }}><FractionBadge filled={r.f} total={r.n} size={26} /></td>
                  <td style={{ padding: "12px 16px" }}><AvatarStack names={r.b} size={22} /></td>
                  <td style={{ padding: "12px 16px", fontFamily: WS.mono, color: WS.ink2 }}>{r.t}</td>
                  <td style={{ padding: "12px 16px", fontFamily: WS.serif, fontWeight: 600 }}>{r.r}</td>
                  <td style={{ padding: "12px 16px" }}><Pill tone={r.ready ? "sage" : "line"} size="xs">{r.s}</Pill></td>
                  <td style={{ padding: "12px 16px" }}><span style={{ color: WS.terraDk, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>{r.ready ? "Pack →" : "Manage"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </WebShell>
  );
}
