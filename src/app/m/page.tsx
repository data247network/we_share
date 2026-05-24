"use client";

import { useEffect, useState } from "react";
import { WS } from "@/components/brand/tokens";
import { SectionTitle, Card, ImgSlot, Bar } from "@/components/brand";
import { Logo } from "@/components/brand/Logo";
import { Pill } from "@/components/brand/Pill";
import { Icons } from "@/components/brand/Icons";
import { FractionBadge } from "@/components/brand/FractionBadge";
import { MobileScreen, TopBar, TabBar } from "@/components/buyer-mobile/MobileShell";
import { CountdownTimer } from "@/components/shared/CountdownTimer";
import { createClient } from "@/lib/supabase/client";

const NE_AREAS = ["Newcastle", "Gateshead", "Sunderland", "Middlesbrough", "Durham"];
const chips = ["All", "Meat & poultry", "Drinks", "Pantry", "Produce", "Frozen"];

interface Pool {
  id: string;
  pool_ref: string;
  total_portions: number;
  filled_portions: number;
  price_per_portion_gbp: number;
  expires_at: string;
  items: { name: string; image_urls: string[]; retail_price_gbp: number; category: string } | null;
  shops: { name: string; slug: string; logo_url: string } | null;
}

const categoryMap: Record<string, string> = {
  "Meat & poultry": "meat_poultry",
  "Drinks": "drinks",
  "Pantry": "pantry",
  "Produce": "produce",
  "Frozen": "frozen",
};

function savePercent(pool: Pool): number {
  if (!pool.items) return 0;
  const wholesale = pool.price_per_portion_gbp * pool.total_portions;
  return Math.round((1 - wholesale / pool.items.retail_price_gbp) * 100);
}

function isWeekendDeal(pool: Pool): boolean {
  const d = new Date(pool.expires_at);
  const day = d.getDay();
  const ms = d.getTime() - Date.now();
  return (day === 5 || day === 6) && ms > 0 && ms < 7 * 86400000;
}

function CompactPoolCard({ pool }: { pool: Pool }) {
  const img = pool.items?.image_urls?.[0];
  const save = savePercent(pool);
  return (
    <div
      style={{ borderRadius: 14, overflow: "hidden", background: "#fff", border: `1px solid ${WS.line}`, cursor: "pointer" }}
      onClick={() => window.location.href = `/m/item/${pool.id}`}>
      <div style={{ position: "relative", height: 90 }}>
        {img
          ? <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          : <ImgSlot label="" tone="meat" h={90} r={0} />
        }
        {save > 0 && (
          <div style={{ position: "absolute", top: 4, right: 4 }}>
            <Pill tone="butter" size="xs">-{save}%</Pill>
          </div>
        )}
      </div>
      <div style={{ padding: "8px 8px 10px" }}>
        <div style={{
          fontFamily: WS.serif, fontSize: 11.5, fontWeight: 600, lineHeight: 1.3, marginBottom: 3,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        } as React.CSSProperties}>
          {pool.items?.name}
        </div>
        <div style={{ fontSize: 10, color: WS.mute, marginBottom: 5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {pool.shops?.name}
        </div>
        <Bar value={(pool.filled_portions / pool.total_portions) * 100} h={3} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 5 }}>
          <div style={{ fontFamily: WS.serif, fontWeight: 700, fontSize: 13, color: WS.terraDk }}>
            £{(pool.price_per_portion_gbp / 100).toFixed(2)}
          </div>
          <FractionBadge filled={pool.filled_portions} total={pool.total_portions} size={18} ring={false} />
        </div>
      </div>
    </div>
  );
}

export default function BuyerHome() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [area, setArea] = useState("Newcastle");
  const [activeChip, setActiveChip] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState("there");

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from("profiles").select("full_name").eq("id", user.id).single()
          .then(({ data }) => { if (data?.full_name) setUserName(data.full_name.split(" ")[0]); });
      }
    });

    supabase
      .from("pools")
      .select(`
        id, pool_ref, total_portions, filled_portions, price_per_portion_gbp, expires_at,
        items:item_id (name, image_urls, retail_price_gbp, category),
        shops:shop_id (name, slug, logo_url)
      `)
      .eq("status", "open")
      .order("expires_at", { ascending: true })
      .then(({ data }) => {
        setPools((data as unknown as Pool[]) || []);
        setLoading(false);
      });
  }, []);

  const categoryFiltered = activeChip === "All"
    ? pools
    : pools.filter(p => p.items?.category === categoryMap[activeChip]);

  const filtered = categoryFiltered.filter(p =>
    !searchQuery ||
    p.items?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.shops?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const weekendDeals = pools.filter(isWeekendDeal);

  return (
    <MobileScreen footer={<TabBar active="home" />}>
      <TopBar
        title={
          <span style={{ cursor: "pointer" }} onClick={() => window.location.href = "/m"}>
            <Logo size={18} />
          </span>
        }
        left={
          <div style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 12, color: WS.ink2, padding: "8px 0" }}>
            {Icons.pin(WS.terra, 14)}
            <select
              value={area}
              onChange={e => setArea(e.target.value)}
              style={{ fontWeight: 600, fontSize: 12, color: WS.ink, border: "none", background: "transparent", outline: "none", cursor: "pointer" }}>
              {NE_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        }
        right={
          <div style={{ position: "relative" }}>
            {Icons.bell(WS.ink, 20)}
            <span style={{ position: "absolute", top: -2, right: -2, width: 7, height: 7, borderRadius: "50%", background: WS.terra, boxShadow: `0 0 0 2px ${WS.cream}` }} />
          </div>
        }
      />

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontFamily: WS.serif, fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
          Hi {userName} —{" "}
          <span style={{ color: WS.terra, fontStyle: "italic" }}>buy together,</span>
          <br />save together.
        </div>
        <div style={{ fontSize: 12, color: WS.ink2, marginTop: 6 }}>
          Wholesale splits across the North East
        </div>
      </div>

      {/* Flash deals banner */}
      <div style={{
        background: `linear-gradient(135deg, ${WS.terra} 0%, ${WS.terraDk} 100%)`,
        borderRadius: 14, padding: "12px 14px", marginBottom: 14,
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{ fontSize: 22, flexShrink: 0 }}>⚡</div>
        <div>
          <div style={{ fontFamily: WS.serif, fontWeight: 700, fontSize: 13.5, color: "#fff", letterSpacing: "-0.01em" }}>
            Every Friday &amp; Saturday — big sales happen here!
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>
            Flash deals · limited portions · wholesale prices
          </div>
        </div>
      </div>

      {/* Functional search bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", border: `1px solid ${WS.line}`, borderRadius: 14, padding: "11px 14px", marginBottom: 14 }}>
        {Icons.search(WS.mute, 17)}
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search items, shops…"
          style={{ flex: 1, border: "none", outline: "none", fontFamily: WS.sans, fontSize: 14, color: WS.ink, background: "transparent" }}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: WS.mute, fontSize: 18, lineHeight: 1, padding: 0 }}>×</button>
        )}
      </div>

      {/* Category chips */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 6, marginBottom: 14, marginLeft: -2 }}>
        {chips.map((c) => (
          <Pill key={c} tone={c === activeChip ? "solid" : "line"} size="lg"
            style={{ cursor: "pointer", flexShrink: 0 }}
            onClick={() => setActiveChip(c)}>{c}</Pill>
        ))}
      </div>

      {/* Weekend Flash Deals — only shown when not searching */}
      {weekendDeals.length > 0 && !searchQuery && activeChip === "All" && (
        <>
          <SectionTitle action="See all →">Weekend Flash Deals</SectionTitle>
          <div style={{ display: "flex", gap: 12, overflowX: "auto", marginBottom: 18, marginLeft: -2, paddingBottom: 4 }}>
            {weekendDeals.map(p => (
              <Card key={p.id} p={0} r={16} style={{ overflow: "hidden", minWidth: 180, flexShrink: 0, border: `1.5px solid ${WS.terraLt}`, cursor: "pointer" }}
                onClick={() => window.location.href = `/m/item/${p.id}`}>
                {p.items?.image_urls?.[0]
                  ? <img src={p.items.image_urls[0]} alt="" style={{ width: "100%", height: 100, objectFit: "cover", display: "block" }} />
                  : <ImgSlot label="" tone="meat" h={100} r={0} />
                }
                <div style={{ padding: "10px" }}>
                  <Pill tone="terra" size="xs" style={{ marginBottom: 6 }}>FLASH DEAL</Pill>
                  <div style={{ fontFamily: WS.serif, fontSize: 13, fontWeight: 600, lineHeight: 1.2, marginBottom: 4 }}>{p.items?.name}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div style={{ fontFamily: WS.serif, fontSize: 15, fontWeight: 700, color: WS.ink }}>
                      £{(p.price_per_portion_gbp / 100).toFixed(2)}
                    </div>
                    <CountdownTimer expiresAt={p.expires_at} style={{ fontSize: 10 }} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Open pools — 3 per row compact grid */}
      <SectionTitle action="See all →">Open pools near you</SectionTitle>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 18 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ borderRadius: 14, overflow: "hidden", background: "#fff", border: `1px solid ${WS.line}`, opacity: 0.4 }}>
              <div style={{ height: 90, background: WS.line }} />
              <div style={{ padding: "8px 8px 10px" }}>
                <div style={{ height: 10, background: WS.line2, borderRadius: 4, marginBottom: 6 }} />
                <div style={{ height: 8, background: WS.line2, borderRadius: 4, width: "60%" }} />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px 16px 24px", color: WS.ink2, fontSize: 13 }}>
          {searchQuery
            ? `No pools matching "${searchQuery}"`
            : `No ${activeChip.toLowerCase()} pools open right now`}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 18 }}>
          {filtered.slice(0, 9).map(p => <CompactPoolCard key={p.id} pool={p} />)}
        </div>
      )}

      {/* Shops section */}
      <SectionTitle action="Browse →">NE England shops</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
        {[
          { name: "Tesco Metro Newcastle", domain: "tesco.com", color: "#EE1C25", initials: "T", rating: 4.8, pools: 3 },
          { name: "Aldi Gateshead", domain: "aldi.co.uk", color: "#003087", initials: "A", rating: 4.7, pools: 2 },
          { name: "Hutchinson's International Foods", domain: "hutchinsons.co.uk", color: "#8B4513", initials: "H", rating: 4.9, pools: 2 },
        ].map(s => (
          <Card key={s.name} p={14} style={{ cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: s.color, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                <img src={`https://www.google.com/s2/favicons?domain=${s.domain}&sz=64`} alt={s.name}
                  style={{ width: 30, height: 30, objectFit: "contain" }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    const el = (e.target as HTMLElement).parentElement;
                    if (el) el.innerHTML = `<span style="color:#fff;font-family:serif;font-size:20px;font-weight:700">${s.initials}</span>`;
                  }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: WS.serif, fontWeight: 600, fontSize: 15 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: WS.ink2, display: "flex", gap: 6, alignItems: "center" }}>
                  {Icons.star(WS.butter, 12)} {s.rating} · {s.pools} active pools
                </div>
              </div>
              {Icons.chev(WS.mute, 16)}
            </div>
          </Card>
        ))}
      </div>

      <div style={{ height: 24 }} />
    </MobileScreen>
  );
}
