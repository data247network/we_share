"use client";

import { WS } from "@/components/brand/tokens";
import { Card, Pill, Btn, Avatar, Logo, Icons } from "@/components/brand";

const nav = [
  { id: "overview",  label: "Overview",  icon: Icons.home },
  { id: "shops",     label: "Shops",     icon: Icons.pkg },
  { id: "pools",     label: "Pools",     icon: Icons.pool },
  { id: "users",     label: "Users",     icon: Icons.user },
  { id: "riders",    label: "Riders",    icon: Icons.share },
  { id: "disputes",  label: "Disputes",  icon: Icons.bell },
];

const kpis = [
  { l: "Pools filled",  v: "142",   s: "+12%",     tone: WS.terra,   bg: WS.terraLt },
  { l: "GMV",           v: "£28.4k", s: "+9%",      tone: WS.sage,    bg: WS.sageLt },
  { l: "Active shops",  v: "87",    s: "+3 today", tone: "#8A6914",  bg: WS.butterLt },
  { l: "Active buyers", v: "4,128", s: "+118",     tone: WS.plum,    bg: WS.rose },
  { l: "Avg fill time", v: "5.2h",  s: "-18min",   tone: WS.ink,     bg: "rgba(42,31,27,0.06)" },
];

const chartSeries = [
  { c: WS.terra,  data: [42, 58, 71, 49, 82, 93, 68], label: "Meat" },
  { c: WS.sage,   data: [18, 24, 21, 28, 32, 40, 29], label: "Drinks" },
  { c: WS.butter, data: [12, 14, 11, 18, 22, 26, 18], label: "Pantry" },
  { c: WS.plum,   data: [8,  11,  9, 12, 14, 18, 12], label: "Produce" },
];

const shopApprovals = [
  { n: "Tunde's Butchery", k: "Meat",      days: "2h ago" },
  { n: "Hopline Drinks",   k: "Drinks",    days: "8h ago" },
  { n: "Farmly Lagos",     k: "Meat",      days: "1d ago" },
  { n: "Pantry Plus",      k: "Dry goods", days: "2d ago" },
];

const disputes = [
  { p: "WS-3902", issue: "Portion underweight",    who: "Joy M. ↔ Tunde's", age: "4h", sev: "med" },
  { p: "WS-3884", issue: "Rider late · 90 min",    who: "Bola K. ↔ Kunle",  age: "1d", sev: "low" },
  { p: "WS-3851", issue: "Pool refund (no fill)",   who: "4 buyers",         age: "2d", sev: "high" },
];

const recentPools = [
  { id: "WS-3914", i: "Premium Ribeye",  s: "Tunde's", f: "3/4", g: "£115", st: "Filling",   stT: "line" as const },
  { id: "WS-3913", i: "Stout · 24pk",    s: "Hopline", f: "4/4", g: "£88",  st: "Shipped",   stT: "sage" as const },
  { id: "WS-3912", i: "Chicken thighs", s: "Farmly",  f: "5/5", g: "£176", st: "Ready",     stT: "butter" as const },
  { id: "WS-3911", i: "Whole goat",     s: "Tunde's", f: "2/2", g: "£84",  st: "Delivered", stT: "sage" as const },
  { id: "WS-3910", i: "Lamb chops",     s: "Farmly",  f: "1/4", g: "£34",  st: "Slow",      stT: "line" as const },
  { id: "WS-3909", i: "Beef shank",     s: "Tunde's", f: "3/3", g: "£84",  st: "Shipped",   stT: "sage" as const },
];

export default function AdminConsole() {
  return (
    <div style={{ display: "flex", height: "100dvh", background: "#FAF6EE", fontFamily: WS.sans, color: WS.ink, overflow: "hidden" }}>

      {/* Sidebar */}
      <div style={{ width: 230, background: WS.ink, color: "#fff", display: "flex", flexDirection: "column", padding: "18px 14px", flexShrink: 0 }}>
        <div style={{ padding: "0 6px 18px", display: "flex", alignItems: "center", gap: 6 }}>
          <Logo size={18} color="#fff" />
          <Pill tone="butter" size="xs">ADMIN</Pill>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {nav.map((n) => {
            const active = n.id === "overview";
            return (
              <div key={n.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 10px", borderRadius: 10, background: active ? "rgba(255,255,255,0.1)" : "transparent", color: active ? "#fff" : "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {n.icon(active ? "#fff" : "rgba(255,255,255,0.5)", 16)}
                  {n.label}
                </div>
                {n.id === "disputes" && (
                  <span style={{ fontFamily: WS.mono, fontSize: 10, background: WS.terra, color: "#fff", padding: "2px 6px", borderRadius: 5 }}>3</span>
                )}
                {n.id === "shops" && (
                  <span style={{ fontFamily: WS.mono, fontSize: 10, background: WS.butter, color: WS.ink, padding: "2px 6px", borderRadius: 5 }}>5</span>
                )}
              </div>
            );
          })}
        </nav>

        <div style={{ flex: 1 }} />

        <div style={{ padding: 10, background: "rgba(255,255,255,0.05)", borderRadius: 10, display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar name="Amaka O" size={28} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Amaka O.</div>
            <div style={{ fontFamily: WS.mono, fontSize: 10, color: "rgba(255,255,255,0.5)" }}>Ops · Lagos</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflow: "auto", minWidth: 0 }}>

        {/* Topbar */}
        <div style={{ padding: "18px 28px", borderBottom: `1px solid ${WS.line}`, display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.5)" }}>
          <div style={{ fontFamily: WS.mono, fontSize: 11, color: WS.mute }}>Overview / Tuesday May 14</div>
          <div style={{ flex: 1 }} />
          <Pill tone="line" size="lg">Region · Lagos</Pill>
          <Pill tone="solid" size="lg">Last 24h</Pill>
        </div>

        <div style={{ padding: "24px 28px 36px" }}>

          {/* KPI grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10, marginBottom: 22 }}>
            {kpis.map((k, i) => (
              <Card key={i} style={{ background: k.bg, border: "none" }}>
                <div style={{ fontFamily: WS.mono, fontSize: 10, color: k.tone, textTransform: "uppercase", letterSpacing: ".06em", opacity: 0.85 }}>{k.l}</div>
                <div style={{ fontFamily: WS.serif, fontSize: 26, fontWeight: 700, color: k.tone, letterSpacing: "-0.02em", marginTop: 4 }}>{k.v}</div>
                <div style={{ fontSize: 11.5, color: k.tone, opacity: 0.85 }}>{k.s}</div>
              </Card>
            ))}
          </div>

          {/* Chart + Shop approvals */}
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14, marginBottom: 14 }}>

            {/* Line chart */}
            <Card style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ fontFamily: WS.serif, fontSize: 18, fontWeight: 600 }}>Pools by category · 7d</div>
                <div style={{ fontFamily: WS.mono, fontSize: 11, color: WS.mute }}>Meat leads · 64%</div>
              </div>
              <svg viewBox="0 0 600 220" style={{ width: "100%", height: 220 }}>
                {[0, 1, 2, 3].map((g) => (
                  <line key={g} x1="40" x2="600" y1={20 + g * 50} y2={20 + g * 50} stroke={WS.line2} strokeWidth="1" />
                ))}
                {chartSeries.map((s, i) => {
                  const max = 100;
                  const pts = s.data.map((v, j) => `${50 + j * 82},${200 - (v / max) * 180}`).join(" ");
                  return <polyline key={i} points={pts} fill="none" stroke={s.c} strokeWidth="2.5" strokeLinejoin="round" />;
                })}
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                  <text key={i} x={50 + i * 82} y={215} textAnchor="middle" fontFamily={WS.mono} fontSize="10" fill={WS.mute}>{d}</text>
                ))}
              </svg>
              <div style={{ display: "flex", gap: 14, marginTop: 6, fontSize: 11.5 }}>
                {chartSeries.map(({ label, c }) => (
                  <span key={label} style={{ display: "inline-flex", alignItems: "center", gap: 5, color: WS.ink2 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
                    {label}
                  </span>
                ))}
              </div>
            </Card>

            {/* Shop approvals */}
            <Card style={{ padding: 20 }}>
              <div style={{ fontFamily: WS.serif, fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Shop approvals · 5 pending</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {shopApprovals.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, background: WS.cream }}>
                    <Avatar name={s.n} size={28} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 12.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.n}</div>
                      <div style={{ fontFamily: WS.mono, fontSize: 10, color: WS.mute }}>{s.k} · {s.days}</div>
                    </div>
                    <Btn tone="ghost" size="sm" style={{ height: 28, fontSize: 11, padding: "0 10px" }}>Skip</Btn>
                    <Btn tone="primary" size="sm" style={{ height: 28, fontSize: 11, padding: "0 10px" }}>Review</Btn>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Disputes + Recent pools */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 14 }}>

            {/* Open disputes */}
            <Card style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ fontFamily: WS.serif, fontSize: 18, fontWeight: 600 }}>Open disputes</div>
                <Pill tone="terra" size="xs">3 ACTIVE</Pill>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {disputes.map((d, i) => (
                  <div key={i} style={{ padding: "10px 12px", background: WS.cream, borderRadius: 10, borderLeft: `3px solid ${d.sev === "high" ? WS.terra : d.sev === "med" ? WS.butter : WS.line}` }}>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: 700, fontSize: 13 }}>{d.issue}</span>
                      <span style={{ fontFamily: WS.mono, fontSize: 10, color: WS.mute }}>{d.p}</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: WS.ink2, marginTop: 2 }}>{d.who} · {d.age}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent pools table */}
            <Card style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: `1px solid ${WS.line2}`, display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                <div style={{ fontFamily: WS.serif, fontSize: 18, fontWeight: 600 }}>Recent pools</div>
                <span style={{ fontFamily: WS.mono, fontSize: 11, color: WS.mute }}>last 24h</span>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                <thead>
                  <tr style={{ background: WS.cream }}>
                    {["Pool", "Item", "Shop", "Fill", "GMV", "Status"].map((h, i) => (
                      <th key={i} style={{ textAlign: "left", padding: "10px 16px", fontFamily: WS.mono, fontSize: 10, color: WS.mute, fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentPools.map((r, i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${WS.line2}` }}>
                      <td style={{ padding: "10px 16px", fontFamily: WS.mono, fontWeight: 600, fontSize: 11 }}>{r.id}</td>
                      <td style={{ padding: "10px 16px" }}>{r.i}</td>
                      <td style={{ padding: "10px 16px", color: WS.ink2 }}>{r.s}</td>
                      <td style={{ padding: "10px 16px", fontFamily: WS.mono }}>{r.f}</td>
                      <td style={{ padding: "10px 16px", fontFamily: WS.serif, fontWeight: 600 }}>{r.g}</td>
                      <td style={{ padding: "10px 16px" }}><Pill tone={r.stT} size="xs">{r.st}</Pill></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
