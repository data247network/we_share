"use client";

import { useEffect, useState } from "react";
import { WS } from "@/components/brand/tokens";
import { Card, ImgSlot, Bar } from "@/components/brand";
import { Pill } from "@/components/brand/Pill";
import { Btn } from "@/components/brand/Btn";
import { AvatarStack, Avatar } from "@/components/brand/Avatar";
import { FractionBadge } from "@/components/brand/FractionBadge";
import { Icons } from "@/components/brand/Icons";
import { MktNav } from "@/components/buyer-web/MktNav";
import { CountdownTimer } from "@/components/shared/CountdownTimer";
import { createClient } from "@/lib/supabase/client";

const categories = ["All", "Meat & poultry", "Drinks", "Pantry staples", "Produce", "Frozen"];

const howItWorks = [
  { n: 1, t: "Shop lists a case", s: "Tesco, Aldi, Morrisons and local shops post wholesale cases.", tone: WS.terraLt, fg: WS.terraDk },
  { n: 2, t: "Neighbours pool up", s: "Claim a 1/2 or 1/4 share. Invite friends in your street.", tone: WS.sageLt, fg: "#33623A" },
  { n: 3, t: "Pool fills, case ships", s: "Only charged once the case is full. No risk.", tone: WS.butterLt, fg: "#8A6914" },
  { n: 4, t: "Rider drops your share", s: "Each member receives their portion at home.", tone: WS.rose, fg: WS.plum },
];

const shopLogos = [
  { name: "Tesco", domain: "tesco.com", color: "#EE1C25", initials: "T" },
  { name: "Aldi", domain: "aldi.co.uk", color: "#003087", initials: "A" },
  { name: "Lidl", domain: "lidl.co.uk", color: "#0050AA", initials: "L" },
  { name: "Morrisons", domain: "morrisons.com", color: "#00A956", initials: "M" },
  { name: "Asda", domain: "asda.com", color: "#78BE20", initials: "A" },
  { name: "Hutchinson's", domain: "hutchinsons.co.uk", color: "#8B4513", initials: "H" },
  { name: "Iceland", domain: "iceland.co.uk", color: "#CC0000", initials: "I" },
  { name: "Co-op", domain: "coop.co.uk", color: "#00B1E7", initials: "C" },
];

interface Pool {
  id: string;
  pool_ref: string;
  total_portions: number;
  filled_portions: number;
  price_per_portion_gbp: number;
  expires_at: string;
  items: { name: string; image_urls: string[]; retail_price_gbp: number; category: string } | null;
  shops: { name: string; slug: string; logo_url: string; address: string } | null;
}

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

export default function BuyerWebHome() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("pools")
      .select(`
        id, pool_ref, total_portions, filled_portions, price_per_portion_gbp, expires_at,
        items:item_id (name, image_urls, retail_price_gbp, category),
        shops:shop_id (name, slug, logo_url, address)
      `)
      .eq("status", "open")
      .order("expires_at", { ascending: true })
      .then(({ data }) => {
        setPools((data as unknown as Pool[]) || []);
        setLoading(false);
      });
  }, []);

  const categoryMap: Record<string, string> = {
    "Meat & poultry": "meat_poultry",
    "Drinks": "drinks",
    "Pantry staples": "pantry",
    "Produce": "produce",
    "Frozen": "frozen",
  };

  const filtered = activeCategory === "All"
    ? pools
    : pools.filter(p => p.items?.category === categoryMap[activeCategory]);

  const weekendDeals = pools.filter(isWeekendDeal);

  return (
    <div style={{ background: WS.cream, fontFamily: WS.sans, color: WS.ink, minHeight: "100dvh" }}>
      <MktNav />

      {/* Hero */}
      <div style={{ padding: "40px 36px 32px", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 32, alignItems: "center" }}>
        <div>
          <Pill tone="terra" size="lg" style={{ marginBottom: 14 }}>NORTH EAST ENGLAND · WHOLESALE SHARES</Pill>
          <div style={{ fontFamily: WS.serif, fontSize: 52, fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1, color: WS.ink }}>
            Buy in bulk.<br />
            <span style={{ fontStyle: "italic", color: WS.terra }}>Share</span> with neighbours.
          </div>
          <div style={{ fontSize: 15, color: WS.ink2, marginTop: 16, maxWidth: 480, lineHeight: 1.55 }}>
            Newcastle, Gateshead, Sunderland and beyond. Local supermarkets list wholesale cases — pool with neighbours, save 20–40%, and get your share delivered.
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <Btn tone="primary" size="lg" onClick={() => window.location.href = "/auth/signup"}>Browse open pools</Btn>
            <Btn tone="ghost" size="lg" onClick={() => { const el = document.getElementById("how-it-works"); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); else window.location.href = "/#how-it-works"; }}>How it works →</Btn>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 22, fontSize: 12, color: WS.ink2 }}>
            <AvatarStack names={["Sam T", "Jade H", "Ravi K", "Mo A", "Chloe D"]} more={1240} size={22} />
            <span>1,245 neighbours pooling this week</span>
          </div>
        </div>

        {/* Hero card stack */}
        <div style={{ position: "relative", paddingTop: 40, paddingBottom: 40 }}>
          <Card p={0} style={{ overflow: "hidden", transform: "rotate(-3deg)", boxShadow: "0 20px 50px rgba(42,31,27,0.12)" }}>
            {pools[0]?.items?.image_urls?.[0]
              ? <img src={pools[0].items.image_urls[0]} alt="" style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }} />
              : <ImgSlot label="ribeye · 4kg case" tone="meat" h={220} r={0} />
            }
            <div style={{ padding: 16 }}>
              <Pill tone="solid" size="xs" style={{ marginBottom: 6 }}>
                {pools[0] ? `${pools[0].filled_portions} / ${pools[0].total_portions} IN POOL` : "3 / 4 IN POOL"}
              </Pill>
              <div style={{ fontFamily: WS.serif, fontSize: 18, fontWeight: 600 }}>
                {pools[0]?.items?.name || "British Ribeye, dry-aged"}
              </div>
              <div style={{ fontSize: 12, color: WS.ink2, marginTop: 2 }}>
                {pools[0]?.shops?.name || "Tesco Metro Newcastle"} · 1.2 km
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                <FractionBadge filled={pools[0]?.filled_portions ?? 3} total={pools[0]?.total_portions ?? 4} size={34} />
                <span style={{ fontFamily: WS.serif, fontSize: 22, fontWeight: 700, color: WS.terraDk }}>
                  £{pools[0] ? (pools[0].price_per_portion_gbp / 100).toFixed(2) : "18.00"}
                </span>
              </div>
            </div>
          </Card>
          <Card p={12} style={{ position: "absolute", right: -10, top: 10, width: 200, transform: "rotate(5deg)", background: WS.butterLt, border: "none", boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}>
            <div style={{ fontFamily: WS.serif, fontSize: 14, fontWeight: 600, color: "#8A6914" }}>
              {pools[0] ? `You saved £${((pools[0].items!.retail_price_gbp - pools[0].price_per_portion_gbp * pools[0].total_portions) / 100).toFixed(2)}` : "You saved £28.00"}
            </div>
            <div style={{ fontSize: 11, color: "#8A6914", opacity: 0.8 }}>vs retail · this case</div>
          </Card>
          <Card p={12} style={{ position: "absolute", left: -20, bottom: 10, width: 170, transform: "rotate(-6deg)", background: WS.sageLt, border: "none", boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar name="Jade H" size={26} />
              <div style={{ fontSize: 11, color: "#33623A", lineHeight: 1.3 }}><b>Jade</b> joined your pool</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Friday/Saturday banner */}
      <div style={{ margin: "0 36px 0", padding: "14px 20px", background: `linear-gradient(135deg, ${WS.terra} 0%, ${WS.terraDk} 100%)`, borderRadius: 16, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ fontSize: 28 }}>⚡</div>
        <div>
          <div style={{ fontFamily: WS.serif, fontWeight: 700, fontSize: 18, color: "#fff", letterSpacing: "-0.01em" }}>
            Every Friday &amp; Saturday, the big sales happen here!
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 3 }}>
            Flash deals · limited-time pools · wholesale prices for North East neighbours
          </div>
        </div>
        <Btn tone="ghost" size="sm" style={{ marginLeft: "auto", flexShrink: 0, background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }}
          onClick={() => window.location.href = "/auth/signup"}>
          See deals →
        </Btn>
      </div>

      {/* Shop logos carousel */}
      <style>{`
        @keyframes logoScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .logo-track { animation: logoScroll 22s linear infinite; }
        .logo-track:hover { animation-play-state: paused; }
      `}</style>
      <div style={{ background: "#fff", borderTop: `1px solid ${WS.line}`, borderBottom: `1px solid ${WS.line}`, padding: "16px 0" }}>
        <div style={{ fontSize: 11, fontFamily: WS.mono, color: WS.mute, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 14, paddingLeft: 36 }}>
          Wholesale from your local shops
        </div>
        <div style={{ overflow: "hidden", position: "relative" }}>
          <div className="logo-track" style={{ display: "flex", gap: 0, width: "max-content" }}>
            {[...shopLogos, ...shopLogos].map((s, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer", padding: "0 28px", flexShrink: 0 }}
                onClick={() => window.location.href = "/auth/signup"}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: s.color, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.10)", position: "relative", overflow: "hidden" }}>
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${s.domain}&sz=64`}
                    alt={s.name}
                    style={{ width: 40, height: 40, objectFit: "contain" }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                      const el = (e.target as HTMLElement).parentElement;
                      if (el) el.innerHTML = `<span style="color:#fff;font-family:serif;font-size:24px;font-weight:700">${s.initials}</span>`;
                    }}
                  />
                </div>
                <span style={{ fontSize: 11, color: WS.ink2, fontFamily: WS.mono, fontWeight: 600, whiteSpace: "nowrap" }}>{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekend Flash Deals */}
      {weekendDeals.length > 0 && (
        <div style={{ padding: "28px 36px 0" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <div style={{ fontFamily: WS.serif, fontSize: 22, fontWeight: 600, letterSpacing: "-0.015em" }}>
                Weekend Flash Deals
              </div>
              <div style={{ fontSize: 12, color: WS.ink2, marginTop: 3 }}>Friday &amp; Saturday wholesale drops — pools close when they fill</div>
            </div>
            <Pill tone="terra" size="sm">ENDS THIS WEEKEND</Pill>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {weekendDeals.map((p) => (
              <Card key={p.id} p={0} style={{ overflow: "hidden", cursor: "pointer", border: `2px solid ${WS.terraLt}` }}
                onClick={() => window.location.href = "/auth/signup"}>
                <div style={{ position: "relative" }}>
                  {p.items?.image_urls?.[0]
                    ? <img src={p.items.image_urls[0]} alt="" style={{ width: "100%", height: 130, objectFit: "cover", display: "block" }} />
                    : <ImgSlot label="" tone="meat" h={130} r={0} />
                  }
                  <div style={{ position: "absolute", top: 8, left: 8 }}>
                    <Pill tone="terra" size="xs">FLASH DEAL</Pill>
                  </div>
                  <div style={{ position: "absolute", top: 8, right: 8 }}>
                    <Pill tone="butter" size="xs">−{savePercent(p)}%</Pill>
                  </div>
                </div>
                <div style={{ padding: "12px 14px 14px" }}>
                  <div style={{ fontFamily: WS.serif, fontSize: 14.5, fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.005em" }}>
                    {p.items?.name}
                  </div>
                  <div style={{ fontSize: 11.5, color: WS.ink2, marginTop: 3, marginBottom: 8 }}>{p.shops?.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <FractionBadge filled={p.filled_portions} total={p.total_portions} size={22} ring={false} />
                    <Bar value={(p.filled_portions / p.total_portions) * 100} h={5} style={{ flex: 1 }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: `1px solid ${WS.line2}` }}>
                    <div>
                      <span style={{ fontFamily: WS.mono, fontSize: 10, color: WS.mute }}>1/{p.total_portions} SHARE</span>
                      <div style={{ fontFamily: WS.serif, fontWeight: 700, fontSize: 18, color: WS.ink }}>
                        £{(p.price_per_portion_gbp / 100).toFixed(2)}
                      </div>
                    </div>
                    <CountdownTimer expiresAt={p.expires_at} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Category strip */}
      <div style={{ padding: "24px 36px 0" }}>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6 }}>
          {categories.map((c, i) => (
            <Pill key={i} tone={c === activeCategory ? "solid" : "line"} size="lg"
              style={{ cursor: "pointer", flexShrink: 0 }}
              onClick={() => setActiveCategory(c)}>{c}</Pill>
          ))}
        </div>
      </div>

      {/* All pools grid */}
      <div id="pools" style={{ padding: "20px 36px 40px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ fontFamily: WS.serif, fontSize: 24, fontWeight: 600, letterSpacing: "-0.015em" }}>
            {loading ? "Loading pools…" : `${filtered.length} pools open near you`}
          </div>
          <div style={{ fontSize: 12, color: WS.ink2 }}>Sorted by: <b style={{ color: WS.ink }}>Closing soonest ↑</b></div>
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} p={0} style={{ overflow: "hidden", opacity: 0.4 }}>
                <ImgSlot label="" tone="meat" h={130} r={0} />
                <div style={{ padding: "12px 14px 14px" }}>
                  <div style={{ background: WS.line, height: 14, borderRadius: 4, width: "80%", marginBottom: 6 }} />
                  <div style={{ background: WS.line2, height: 10, borderRadius: 4, width: "50%" }} />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            {filtered.map((p) => {
              const save = savePercent(p);
              const isFresh = p.filled_portions === p.total_portions;
              return (
                <Card key={p.id} p={0} style={{ overflow: "hidden", display: "flex", flexDirection: "column", cursor: "pointer" }}
                  onClick={() => window.location.href = "/auth/signup"}>
                  <div style={{ position: "relative" }}>
                    {p.items?.image_urls?.[0]
                      ? <img src={p.items.image_urls[0]} alt="" style={{ width: "100%", height: 130, objectFit: "cover", display: "block" }} />
                      : <ImgSlot label="" tone="meat" h={130} r={0} />
                    }
                    <div style={{ position: "absolute", top: 8, left: 8, display: "flex", gap: 5 }}>
                      {isFresh
                        ? <Pill tone="sage" size="xs">Ready to ship</Pill>
                        : <CountdownTimer expiresAt={p.expires_at} style={{ background: "rgba(0,0,0,0.55)", color: "#fff", borderRadius: 20, padding: "2px 8px", fontSize: 10.5 }} />
                      }
                    </div>
                    {save > 0 && (
                      <div style={{ position: "absolute", top: 8, right: 8 }}>
                        <Pill tone="butter" size="xs">−{save}%</Pill>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "12px 14px 14px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ fontFamily: WS.serif, fontSize: 14.5, fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.005em" }}>
                      {p.items?.name}
                    </div>
                    <div style={{ fontSize: 11.5, color: WS.ink2, marginTop: 3 }}>{p.shops?.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                      <FractionBadge filled={p.filled_portions} total={p.total_portions} size={22} ring={false} />
                      <Bar value={(p.filled_portions / p.total_portions) * 100} h={5} style={{ flex: 1 }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: `1px solid ${WS.line2}` }}>
                      <div>
                        <span style={{ fontFamily: WS.mono, fontSize: 10, color: WS.mute }}>1/{p.total_portions} SHARE</span>
                        <div style={{ fontFamily: WS.serif, fontWeight: 700, fontSize: 18, color: WS.ink }}>
                          £{(p.price_per_portion_gbp / 100).toFixed(2)}
                        </div>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: WS.terraDk }}>Join →</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* How it works */}
      <div id="how-it-works" style={{ background: "#fff", padding: "40px 36px", borderTop: `1px solid ${WS.line}`, borderBottom: `1px solid ${WS.line}` }}>
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

      {/* Footer */}
      <div style={{ padding: "28px 36px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, color: WS.mute }}>
        <div style={{ fontFamily: WS.serif, fontWeight: 600, fontSize: 14, color: WS.ink }}>WeShare</div>
        <div>Serving Newcastle · Gateshead · Sunderland · Middlesbrough · Durham</div>
        <div style={{ display: "flex", gap: 16 }}>
          <span style={{ cursor: "pointer" }}>Terms</span>
          <span style={{ cursor: "pointer" }}>Privacy</span>
          <span style={{ cursor: "pointer" }}>Contact</span>
        </div>
      </div>
    </div>
  );
}
