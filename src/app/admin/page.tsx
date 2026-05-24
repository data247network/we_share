"use client";

import { useEffect, useState } from "react";
import { WS } from "@/components/brand/tokens";
import { Card, Pill, Btn, Avatar, Logo, Icons } from "@/components/brand";
import { createClient } from "@/lib/supabase/client";

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
  { l: "GMV",           v: "£28.4k", s: "+9%",     tone: WS.sage,    bg: WS.sageLt },
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

const recentPools = [
  { id: "WS-3914", i: "Premium Ribeye",  s: "Tunde's", f: "3/4", g: "£115", st: "Filling",   stT: "line" as const },
  { id: "WS-3913", i: "Stout · 24pk",    s: "Hopline", f: "4/4", g: "£88",  st: "Shipped",   stT: "sage" as const },
  { id: "WS-3912", i: "Chicken thighs",  s: "Farmly",  f: "5/5", g: "£176", st: "Ready",     stT: "butter" as const },
  { id: "WS-3911", i: "Whole goat",      s: "Tunde's", f: "2/2", g: "£84",  st: "Delivered", stT: "sage" as const },
  { id: "WS-3910", i: "Lamb chops",      s: "Farmly",  f: "1/4", g: "£34",  st: "Slow",      stT: "line" as const },
];

const mockRiders = [
  { name: "Kunle A.", zone: "Newcastle Central", deliveries: 34, rating: 4.9, active: true },
  { name: "Femi D.",  zone: "Gateshead",         deliveries: 21, rating: 4.7, active: true },
  { name: "Adaeze O.",zone: "Sunderland",         deliveries: 15, rating: 5.0, active: false },
];

const mockDisputes = [
  { p: "WS-3902", issue: "Portion underweight",   who: "Joy M. ↔ Tunde's", age: "4h", sev: "med" },
  { p: "WS-3884", issue: "Rider late · 90 min",   who: "Bola K. ↔ Kunle",  age: "1d", sev: "low" },
  { p: "WS-3851", issue: "Pool refund (no fill)",  who: "4 buyers",         age: "2d", sev: "high" },
];

interface DbUser {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
}

interface DbShop {
  id: string;
  name: string;
  description: string | null;
  verified: boolean;
  active: boolean;
  categories: string[];
  created_at: string;
  owner_id: string;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: "100%", maxWidth: 440, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 60px rgba(0,0,0,0.18)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontFamily: WS.serif, fontSize: 20, fontWeight: 600 }}>{title}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 24, color: WS.mute, lineHeight: 1, padding: "0 4px" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px", borderRadius: 10,
  border: `1.5px solid ${WS.line}`, background: "#fff",
  fontFamily: "inherit", fontSize: 13.5, color: WS.ink, outline: "none",
  boxSizing: "border-box",
};
const labelStyle: React.CSSProperties = {
  fontFamily: "monospace", fontSize: 10, color: WS.mute,
  textTransform: "uppercase", letterSpacing: ".06em",
  display: "block", marginBottom: 4,
};

export default function AdminConsole() {
  const [activeSection, setActiveSection] = useState("overview");

  // Live data
  const [users, setUsers]   = useState<DbUser[]>([]);
  const [shops, setShops]   = useState<DbShop[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Modals
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [editUser, setEditUser]   = useState<DbUser | null>(null);
  const [editShop, setEditShop]   = useState<DbShop | null>(null);

  // Create user form
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "buyer" });
  const [saving, setSaving]   = useState(false);
  const [saveErr, setSaveErr] = useState<string | null>(null);

  useEffect(() => {
    if (activeSection === "users" && users.length === 0) loadUsers();
    if (activeSection === "shops" && shops.length === 0) loadShops();
  }, [activeSection]);

  async function loadUsers() {
    setDataLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    if (data) setUsers(data as DbUser[]);
    setDataLoading(false);
  }

  async function loadShops() {
    setDataLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("shops")
      .select("id, name, description, verified, active, categories, created_at, owner_id")
      .order("created_at", { ascending: false });
    if (data) setShops(data as DbShop[]);
    setDataLoading(false);
  }

  async function handleCreateUser() {
    if (!newUser.name || !newUser.email || !newUser.password) { setSaveErr("All fields required."); return; }
    setSaving(true); setSaveErr(null);
    try {
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setShowCreateUser(false);
      setNewUser({ name: "", email: "", password: "", role: "buyer" });
      await loadUsers();
    } catch (e: unknown) {
      setSaveErr(e instanceof Error ? e.message : "Failed to create user.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateUser() {
    if (!editUser) return;
    setSaving(true); setSaveErr(null);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: editUser.full_name, role: editUser.role })
      .eq("id", editUser.id);
    if (error) { setSaveErr(error.message); } else { setEditUser(null); await loadUsers(); }
    setSaving(false);
  }

  async function handleUpdateShop() {
    if (!editShop) return;
    setSaving(true); setSaveErr(null);
    const supabase = createClient();
    const { error } = await supabase
      .from("shops")
      .update({ verified: editShop.verified, active: editShop.active, name: editShop.name })
      .eq("id", editShop.id);
    if (error) { setSaveErr(error.message); } else { setEditShop(null); await loadShops(); }
    setSaving(false);
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  }

  function renderContent() {
    switch (activeSection) {
      case "overview":
        return (
          <div style={{ padding: "24px 28px 36px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10, marginBottom: 22 }}>
              {kpis.map((k, i) => (
                <Card key={i} style={{ background: k.bg, border: "none" }}>
                  <div style={{ fontFamily: WS.mono, fontSize: 10, color: k.tone, textTransform: "uppercase", letterSpacing: ".06em", opacity: 0.85 }}>{k.l}</div>
                  <div style={{ fontFamily: WS.serif, fontSize: 26, fontWeight: 700, color: k.tone, letterSpacing: "-0.02em", marginTop: 4 }}>{k.v}</div>
                  <div style={{ fontSize: 11.5, color: k.tone, opacity: 0.85 }}>{k.s}</div>
                </Card>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14, marginBottom: 14 }}>
              <Card style={{ padding: 20 }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ fontFamily: WS.serif, fontSize: 18, fontWeight: 600 }}>Pools by category · 7d</div>
                  <div style={{ fontFamily: WS.mono, fontSize: 11, color: WS.mute }}>Meat leads · 64%</div>
                </div>
                <svg viewBox="0 0 600 220" style={{ width: "100%", height: 220 }}>
                  {[0,1,2,3].map((g) => <line key={g} x1="40" x2="600" y1={20+g*50} y2={20+g*50} stroke={WS.line2} strokeWidth="1" />)}
                  {chartSeries.map((s, i) => {
                    const max = 100;
                    const pts = s.data.map((v, j) => `${50+j*82},${200-(v/max)*180}`).join(" ");
                    return <polyline key={i} points={pts} fill="none" stroke={s.c} strokeWidth="2.5" strokeLinejoin="round" />;
                  })}
                  {["M","T","W","T","F","S","S"].map((d, i) => (
                    <text key={i} x={50+i*82} y={215} textAnchor="middle" fontFamily={WS.mono} fontSize="10" fill={WS.mute}>{d}</text>
                  ))}
                </svg>
                <div style={{ display: "flex", gap: 14, marginTop: 6, fontSize: 11.5 }}>
                  {chartSeries.map(({ label, c }) => (
                    <span key={label} style={{ display: "inline-flex", alignItems: "center", gap: 5, color: WS.ink2 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />{label}
                    </span>
                  ))}
                </div>
              </Card>
              <Card style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: `1px solid ${WS.line2}`, display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                  <div style={{ fontFamily: WS.serif, fontSize: 18, fontWeight: 600 }}>Recent pools</div>
                  <span style={{ fontFamily: WS.mono, fontSize: 11, color: WS.mute }}>last 24h</span>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                  <thead><tr style={{ background: WS.cream }}>
                    {["Pool","Item","Shop","Fill","Status"].map((h, i) => (
                      <th key={i} style={{ textAlign: "left", padding: "8px 14px", fontFamily: WS.mono, fontSize: 10, color: WS.mute, fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {recentPools.map((r, i) => (
                      <tr key={i} style={{ borderTop: `1px solid ${WS.line2}` }}>
                        <td style={{ padding: "8px 14px", fontFamily: WS.mono, fontWeight: 600, fontSize: 11 }}>{r.id}</td>
                        <td style={{ padding: "8px 14px" }}>{r.i}</td>
                        <td style={{ padding: "8px 14px", color: WS.ink2 }}>{r.s}</td>
                        <td style={{ padding: "8px 14px", fontFamily: WS.mono }}>{r.f}</td>
                        <td style={{ padding: "8px 14px" }}><Pill tone={r.stT} size="xs">{r.st}</Pill></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          </div>
        );

      case "users":
        return (
          <div style={{ padding: "24px 28px 36px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ fontFamily: WS.serif, fontSize: 24, fontWeight: 600 }}>Users</div>
              <Btn tone="primary" size="sm" onClick={() => { setSaveErr(null); setShowCreateUser(true); }}>+ Create user</Btn>
            </div>
            <Card style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: `1px solid ${WS.line2}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontFamily: WS.serif, fontSize: 18, fontWeight: 600 }}>All users · {users.length}</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Pill tone="line" size="xs">Buyers · {users.filter(u => u.role === "buyer").length}</Pill>
                  <Pill tone="sage" size="xs">Shops · {users.filter(u => u.role === "shop").length}</Pill>
                  <Pill tone="terra" size="xs">Riders · {users.filter(u => u.role === "rider").length}</Pill>
                </div>
              </div>
              {dataLoading ? (
                <div style={{ padding: 40, textAlign: "center", color: WS.ink2 }}>Loading…</div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead><tr style={{ background: WS.cream }}>
                    {["Name","Email","Role","Joined","Actions"].map((h, i) => (
                      <th key={i} style={{ textAlign: "left", padding: "10px 16px", fontFamily: WS.mono, fontSize: 10, color: WS.mute, fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={i} style={{ borderTop: `1px solid ${WS.line2}` }}>
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Avatar name={u.full_name ?? u.email} size={26} />
                            <span style={{ fontWeight: 600 }}>{u.full_name ?? "—"}</span>
                          </div>
                        </td>
                        <td style={{ padding: "12px 16px", color: WS.ink2, fontSize: 12 }}>{u.email}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <Pill tone={u.role === "shop" ? "sage" : u.role === "rider" ? "terra" : u.role === "admin" ? "butter" : "line"} size="xs">{u.role}</Pill>
                        </td>
                        <td style={{ padding: "12px 16px", color: WS.ink2, fontSize: 12 }}>
                          {new Date(u.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <Btn tone="ghost" size="sm" style={{ height: 28, fontSize: 11 }}
                            onClick={() => { setSaveErr(null); setEditUser(u); }}>
                            Edit
                          </Btn>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Card>
          </div>
        );

      case "shops":
        return (
          <div style={{ padding: "24px 28px 36px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ fontFamily: WS.serif, fontSize: 24, fontWeight: 600 }}>Shop management</div>
              <Pill tone="butter" size="sm">{shops.filter(s => !s.verified).length} pending approval</Pill>
            </div>
            <Card style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: `1px solid ${WS.line2}` }}>
                <div style={{ fontFamily: WS.serif, fontSize: 18, fontWeight: 600 }}>All shops · {shops.length}</div>
              </div>
              {dataLoading ? (
                <div style={{ padding: 40, textAlign: "center", color: WS.ink2 }}>Loading…</div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead><tr style={{ background: WS.cream }}>
                    {["Shop","Status","Active","Created","Actions"].map((h, i) => (
                      <th key={i} style={{ textAlign: "left", padding: "10px 16px", fontFamily: WS.mono, fontSize: 10, color: WS.mute, fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {shops.map((s, i) => (
                      <tr key={i} style={{ borderTop: `1px solid ${WS.line2}` }}>
                        <td style={{ padding: "12px 16px", fontWeight: 600 }}>{s.name}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <Pill tone={s.verified ? "sage" : "butter"} size="xs">{s.verified ? "Verified" : "Pending"}</Pill>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <Pill tone={s.active ? "sage" : "line"} size="xs">{s.active ? "Active" : "Inactive"}</Pill>
                        </td>
                        <td style={{ padding: "12px 16px", color: WS.ink2, fontSize: 12 }}>
                          {new Date(s.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            {!s.verified && (
                              <Btn tone="primary" size="sm" style={{ height: 28, fontSize: 11 }}
                                onClick={async () => {
                                  const supabase = createClient();
                                  await supabase.from("shops").update({ verified: true }).eq("id", s.id);
                                  await loadShops();
                                }}>
                                Approve
                              </Btn>
                            )}
                            <Btn tone="ghost" size="sm" style={{ height: 28, fontSize: 11 }}
                              onClick={() => { setSaveErr(null); setEditShop(s); }}>
                              Edit
                            </Btn>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Card>
          </div>
        );

      case "pools":
        return (
          <div style={{ padding: "24px 28px 36px" }}>
            <div style={{ fontFamily: WS.serif, fontSize: 24, fontWeight: 600, marginBottom: 20 }}>All pools</div>
            <Card style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: `1px solid ${WS.line2}`, display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontFamily: WS.serif, fontSize: 18, fontWeight: 600 }}>Active pools</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Pill tone="terra" size="xs">Open · 13</Pill>
                  <Pill tone="sage" size="xs">Filled · 4</Pill>
                </div>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                <thead><tr style={{ background: WS.cream }}>
                  {["Pool","Item","Shop","Fill","Status",""].map((h, i) => (
                    <th key={i} style={{ textAlign: "left", padding: "10px 16px", fontFamily: WS.mono, fontSize: 10, color: WS.mute, fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {recentPools.map((r, i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${WS.line2}` }}>
                      <td style={{ padding: "10px 16px", fontFamily: WS.mono, fontWeight: 600, fontSize: 11 }}>{r.id}</td>
                      <td style={{ padding: "10px 16px" }}>{r.i}</td>
                      <td style={{ padding: "10px 16px", color: WS.ink2 }}>{r.s}</td>
                      <td style={{ padding: "10px 16px", fontFamily: WS.mono }}>{r.f}</td>
                      <td style={{ padding: "10px 16px" }}><Pill tone={r.stT} size="xs">{r.st}</Pill></td>
                      <td style={{ padding: "10px 16px" }}><span style={{ color: WS.terraDk, fontWeight: 600, fontSize: 11, cursor: "pointer" }}>View →</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        );

      case "riders":
        return (
          <div style={{ padding: "24px 28px 36px" }}>
            <div style={{ fontFamily: WS.serif, fontSize: 24, fontWeight: 600, marginBottom: 20 }}>Riders</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
              {mockRiders.map((r, i) => (
                <Card key={i}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <Avatar name={r.name} size={36} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{r.name}</div>
                      <div style={{ fontSize: 12, color: WS.ink2 }}>{r.zone}</div>
                    </div>
                    <div style={{ marginLeft: "auto" }}>
                      <Pill tone={r.active ? "sage" : "line"} size="xs">{r.active ? "Active" : "Offline"}</Pill>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 16, fontSize: 12.5 }}>
                    <div><div style={{ color: WS.mute, fontSize: 10, fontFamily: WS.mono }}>DELIVERIES</div><div style={{ fontWeight: 700 }}>{r.deliveries}</div></div>
                    <div><div style={{ color: WS.mute, fontSize: 10, fontFamily: WS.mono }}>RATING</div><div style={{ fontWeight: 700 }}>{r.rating} ⭐</div></div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case "disputes":
        return (
          <div style={{ padding: "24px 28px 36px" }}>
            <div style={{ fontFamily: WS.serif, fontSize: 24, fontWeight: 600, marginBottom: 20 }}>Disputes</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {mockDisputes.map((d, i) => (
                <Card key={i} style={{ borderLeft: `4px solid ${d.sev === "high" ? WS.terra : d.sev === "med" ? WS.butter : WS.line}` }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontFamily: WS.serif, fontWeight: 700, fontSize: 16 }}>{d.issue}</div>
                      <div style={{ fontSize: 12.5, color: WS.ink2, marginTop: 4 }}>{d.who} · {d.p} · {d.age} ago</div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Btn tone="ghost" size="sm">Investigate</Btn>
                      <Btn tone="primary" size="sm">Resolve</Btn>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      default: return null;
    }
  }

  return (
    <div style={{ display: "flex", height: "100dvh", background: "#FAF6EE", fontFamily: WS.sans, color: WS.ink, overflow: "hidden" }}>

      {/* Sidebar */}
      <div style={{ width: 230, background: WS.ink, color: "#fff", display: "flex", flexDirection: "column", padding: "18px 14px", flexShrink: 0 }}>
        <div style={{ padding: "0 6px 18px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}
          onClick={() => window.location.href = "/"}>
          <Logo size={18} color="#fff" />
          <Pill tone="butter" size="xs">ADMIN</Pill>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {nav.map((n) => {
            const active = n.id === activeSection;
            return (
              <div key={n.id} onClick={() => setActiveSection(n.id)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 10px", borderRadius: 10, background: active ? "rgba(255,255,255,0.1)" : "transparent", color: active ? "#fff" : "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {n.icon(active ? "#fff" : "rgba(255,255,255,0.5)", 16)}
                  {n.label}
                </div>
                {n.id === "disputes" && <span style={{ fontFamily: WS.mono, fontSize: 10, background: WS.terra, color: "#fff", padding: "2px 6px", borderRadius: 5 }}>3</span>}
                {n.id === "shops" && shops.filter(s => !s.verified).length > 0 && (
                  <span style={{ fontFamily: WS.mono, fontSize: 10, background: WS.butter, color: WS.ink, padding: "2px 6px", borderRadius: 5 }}>
                    {shops.filter(s => !s.verified).length}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        <div style={{ flex: 1 }} />
        <button onClick={handleSignOut}
          style={{ width: "100%", background: "rgba(255,255,255,0.07)", border: "none", borderRadius: 8, padding: "8px 10px", color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600, cursor: "pointer", textAlign: "left", fontFamily: WS.sans }}>
          Sign out →
        </button>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: "auto", minWidth: 0 }}>
        <div style={{ padding: "18px 28px", borderBottom: `1px solid ${WS.line}`, display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.5)" }}>
          <div style={{ fontFamily: WS.mono, fontSize: 11, color: WS.mute, textTransform: "capitalize" }}>{activeSection}</div>
          <div style={{ flex: 1 }} />
          <Pill tone="line" size="lg">Region · NE England</Pill>
        </div>
        {renderContent()}
      </div>

      {/* ── CREATE USER MODAL ── */}
      {showCreateUser && (
        <Modal title="Create user" onClose={() => setShowCreateUser(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {saveErr && <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#DC2626" }}>{saveErr}</div>}
            {[
              { label: "Full name", key: "name",     type: "text",     placeholder: "e.g. Joy Williams" },
              { label: "Email",     key: "email",    type: "email",    placeholder: "joy@example.com" },
              { label: "Password",  key: "password", type: "password", placeholder: "••••••••" },
            ].map(f => (
              <div key={f.key}>
                <label style={labelStyle}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder}
                  value={(newUser as Record<string, string>)[f.key]}
                  onChange={e => setNewUser(u => ({ ...u, [f.key]: e.target.value }))}
                  style={inputStyle} />
              </div>
            ))}
            <div>
              <label style={labelStyle}>Role</label>
              <select value={newUser.role} onChange={e => setNewUser(u => ({ ...u, role: e.target.value }))} style={inputStyle}>
                <option value="buyer">Buyer</option>
                <option value="shop">Shop owner</option>
                <option value="rider">Rider</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <Btn tone="ghost" size="lg" style={{ flex: 1 }} onClick={() => setShowCreateUser(false)}>Cancel</Btn>
              <Btn tone="primary" size="lg" style={{ flex: 2 }} disabled={saving} onClick={handleCreateUser}>
                {saving ? "Creating…" : "Create user"}
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* ── EDIT USER MODAL ── */}
      {editUser && (
        <Modal title="Edit user" onClose={() => setEditUser(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {saveErr && <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#DC2626" }}>{saveErr}</div>}
            <div>
              <label style={labelStyle}>Full name</label>
              <input value={editUser.full_name ?? ""} style={inputStyle}
                onChange={e => setEditUser(u => u ? { ...u, full_name: e.target.value } : u)} />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input value={editUser.email} style={{ ...inputStyle, background: WS.cream, color: WS.ink2 }} readOnly />
            </div>
            <div>
              <label style={labelStyle}>Role</label>
              <select value={editUser.role} style={inputStyle}
                onChange={e => setEditUser(u => u ? { ...u, role: e.target.value } : u)}>
                <option value="buyer">Buyer</option>
                <option value="shop">Shop owner</option>
                <option value="rider">Rider</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <Btn tone="ghost" size="lg" style={{ flex: 1 }} onClick={() => setEditUser(null)}>Cancel</Btn>
              <Btn tone="primary" size="lg" style={{ flex: 2 }} disabled={saving} onClick={handleUpdateUser}>
                {saving ? "Saving…" : "Save changes"}
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* ── EDIT SHOP MODAL ── */}
      {editShop && (
        <Modal title="Edit shop" onClose={() => setEditShop(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {saveErr && <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#DC2626" }}>{saveErr}</div>}
            <div>
              <label style={labelStyle}>Shop name</label>
              <input value={editShop.name} style={inputStyle}
                onChange={e => setEditShop(s => s ? { ...s, name: e.target.value } : s)} />
            </div>
            <div style={{ display: "flex", gap: 14 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13.5 }}>
                <input type="checkbox" checked={editShop.verified}
                  onChange={e => setEditShop(s => s ? { ...s, verified: e.target.checked } : s)}
                  style={{ width: 16, height: 16, cursor: "pointer" }} />
                Verified
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13.5 }}>
                <input type="checkbox" checked={editShop.active}
                  onChange={e => setEditShop(s => s ? { ...s, active: e.target.checked } : s)}
                  style={{ width: 16, height: 16, cursor: "pointer" }} />
                Active
              </label>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <Btn tone="ghost" size="lg" style={{ flex: 1 }} onClick={() => setEditShop(null)}>Cancel</Btn>
              <Btn tone="primary" size="lg" style={{ flex: 2 }} disabled={saving} onClick={handleUpdateShop}>
                {saving ? "Saving…" : "Save changes"}
              </Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
