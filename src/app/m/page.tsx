"use client";

import { useEffect, useState } from "react";
import { WS } from "@/components/brand/tokens";
import { SectionTitle, Card, ImgSlot } from "@/components/brand";
import { Logo } from "@/components/brand/Logo";
import { Pill } from "@/components/brand/Pill";
import { Icons } from "@/components/brand/Icons";
import { MobileScreen, TopBar, TabBar, SearchInput } from "@/components/buyer-mobile/MobileShell";
import { PoolCard } from "@/components/buyer-mobile/PoolCard";
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

export default function BuyerHome() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [area, setArea] = useState("Newcastle");
  const [activeChip, setActiveChip] = useState("All");
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
        setPools((data as Pool[]) || []);
        setLoading(false);
      });
  }, []);

  const filtered = activeChip === "All"
    ? pools
    : pools.filter(p => p.items?.category === categoryMap[activeChip]);

  const weekendDeals = pools.filter(isWeekendDeal);

  return (
    <MobileScreen footer={<TabBar active="home" />}>
      <TopBar
        title={<Logo size={18} />}
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

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: WS.serif, fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
          Hi {userName} —{" "}
          <span style={{ color: WS.terra, fontStyle: "italic" }}>buy together,</span>
          <br />save together.
        </div>
        <div style={{ fontSize: 12, color: WS.ink2, marginTop: 6 }}>
          Wholesale splits across the North East
        </div>
      </div>

      <div style={{ marginBottom: 14 }}><SearchInput /></div>

      {/* Category chips */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 6, marginBottom: 14, marginLeft: -2 }}>
        {chips.map((c, i) => (
          <Pill key={i} tone={c === activeChip ? "solid" : "line"} size="lg"
            style={{ cursor: "pointer", flexShrink: 0 }}
            onClick={() => setActiveChip(c)}>{c}</Pill>
        ))}
      </div>

      {/* Weekend Flash Deals */}
      {weekendDeals.length > 0 && (
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
                <div style={{ padding: "10px 10px 10px" }}>
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

      {/* Open pools */}
      <SectionTitle action="See all →">Open pools near you</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 18 }}>
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} p={14} style={{ opacity: 0.4 }}>
                <div style={{ background: WS.line, height: 120, borderRadius: 12, marginBottom: 12 }} />
                <div style={{ background: WS.line, height: 14, borderRadius: 4, width: "70%", marginBottom: 8 }} />
                <div style={{ background: WS.line2, height: 10, borderRadius: 4, width: "40%" }} />
              </Card>
            ))
          : filtered.slice(0, 6).map(p => (
              <PoolCard
                key={p.id}
                poolId={p.id}
                item={p.items?.name ?? ""}
                shop={p.shops?.name ?? ""}
                priceGBP={(p.price_per_portion_gbp / 100).toFixed(2)}
                members={[]}
                filledPortions={p.filled_portions}
                totalPortions={p.total_portions}
                expiresAt={p.expires_at}
                imageUrl={p.items?.image_urls?.[0]}
                portion={`1/${p.total_portions}`}
                savePercent={savePercent(p)}
              />
            ))
        }
      </div>

      {/* Shops section */}
      <SectionTitle action="Browse →">NE England shops</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
        {[
          { name: "Tesco Metro Newcastle", logo: "https://logo.clearbit.com/tesco.com", rating: 4.8, pools: 3 },
          { name: "Aldi Gateshead", logo: "https://logo.clearbit.com/aldi.co.uk", rating: 4.7, pools: 2 },
          { name: "Hutchinson's International Foods", logo: "https://logo.clearbit.com/hutchinsons.co.uk", rating: 4.9, pools: 2 },
        ].map(s => (
          <Card key={s.name} p={14} style={{ cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: WS.cream, border: `1px solid ${WS.line}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                <img src={s.logo} alt={s.name} style={{ height: 28, width: 44, objectFit: "contain" }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
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
