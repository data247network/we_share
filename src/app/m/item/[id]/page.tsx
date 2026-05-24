"use client";

export const runtime = "edge";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { WS } from "@/components/brand/tokens";
import { Card, ImgSlot, SectionTitle } from "@/components/brand";
import { Pill } from "@/components/brand/Pill";
import { Btn } from "@/components/brand/Btn";
import { Bar } from "@/components/brand";
import { FractionBadge } from "@/components/brand/FractionBadge";
import { Icons } from "@/components/brand/Icons";
import { CountdownTimer } from "@/components/shared/CountdownTimer";
import { createClient } from "@/lib/supabase/client";

interface PoolDetail {
  id: string;
  pool_ref: string;
  total_portions: number;
  filled_portions: number;
  price_per_portion_gbp: number;
  expires_at: string;
  status: string;
  items: {
    name: string;
    description: string;
    image_urls: string[];
    retail_price_gbp: number;
    category: string;
    case_weight_g: number;
    split_options: number[];
    default_split: number;
  } | null;
  shops: {
    name: string;
    slug: string;
    logo_url: string;
    address: string;
    rating_avg: number;
  } | null;
}

type Step = "view" | "address" | "joining" | "joined" | "error";

export default function ItemDetail() {
  const params = useParams();
  const id = params.id as string;

  const [pool, setPool] = useState<PoolDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPortions, setSelectedPortions] = useState(1);
  const [step, setStep] = useState<Step>("view");
  const [address, setAddress] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joinResult, setJoinResult] = useState<{ member_id: string; amount_pence: number } | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => setIsLoggedIn(!!user));

    supabase
      .from("pools")
      .select(`
        id, pool_ref, total_portions, filled_portions, price_per_portion_gbp, expires_at, status,
        items:item_id (name, description, image_urls, retail_price_gbp, category, case_weight_g, split_options, default_split),
        shops:shop_id (name, slug, logo_url, address, rating_avg)
      `)
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) {
          const p = data as unknown as PoolDetail;
          setPool(p);
          setSelectedPortions(1);
        }
        setLoading(false);
      });
  }, [id]);

  async function handleJoin() {
    if (!isLoggedIn) {
      window.location.href = `/auth/login?redirect=/m/item/${id}`;
      return;
    }
    if (!address.trim()) {
      setStep("address");
      return;
    }
    await submitJoin();
  }

  async function submitJoin() {
    setStep("joining");
    setJoinError("");
    try {
      const res = await fetch(`/api/pools/${id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portions: selectedPortions, delivery_address: address }),
      });
      const json = await res.json();
      if (!res.ok) {
        setJoinError(json.error ?? "Something went wrong.");
        setStep("error");
        return;
      }
      setJoinResult(json);
      setStep("joined");
    } catch {
      setJoinError("Network error. Please try again.");
      setStep("error");
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: WS.cream, alignItems: "center", justifyContent: "center", color: WS.ink2 }}>
        Loading…
      </div>
    );
  }

  if (!pool) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: WS.cream, alignItems: "center", justifyContent: "center", gap: 12 }}>
        <div style={{ fontFamily: WS.serif, fontSize: 20, fontWeight: 600 }}>Pool not found</div>
        <Btn tone="ghost" size="sm" onClick={() => window.history.back()}>Go back</Btn>
      </div>
    );
  }

  const item = pool.items;
  const shop = pool.shops;
  const pricePerPortionGBP = pool.price_per_portion_gbp / 100;
  const totalForSelection = pricePerPortionGBP * selectedPortions;
  const spotsLeft = pool.total_portions - pool.filled_portions;
  const caseWeightKg = item ? (item.case_weight_g / 1000) : 0;
  const portionWeightKg = item ? (caseWeightKg / pool.total_portions) * selectedPortions : 0;
  const savePercent = item ? Math.round((1 - (pool.price_per_portion_gbp * pool.total_portions) / item.retail_price_gbp) * 100) : 0;

  // "Joined!" confirmation screen
  if (step === "joined" && joinResult) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: WS.cream, color: WS.ink, fontFamily: WS.sans }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center", gap: 16 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: WS.sageLt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>✓</div>
          <div style={{ fontFamily: WS.serif, fontSize: 26, fontWeight: 600 }}>You're in the pool!</div>
          <div style={{ fontSize: 14, color: WS.ink2, maxWidth: 280, lineHeight: 1.6 }}>
            Your {selectedPortions}/{pool.total_portions} portion of <b>{item?.name}</b> is reserved. You'll only be charged when the pool fills.
          </div>
          <div style={{ background: "#fff", border: `1px solid ${WS.line}`, borderRadius: 16, padding: 20, width: "100%", maxWidth: 320 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: WS.ink2, marginBottom: 8 }}>
              <span>Your share</span>
              <span style={{ color: WS.ink, fontWeight: 600 }}>£{totalForSelection.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: WS.ink2 }}>
              <span>Pool ref</span>
              <span style={{ fontFamily: WS.mono, color: WS.ink }}>{pool.pool_ref}</span>
            </div>
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${WS.line2}` }}>
              <Bar value={(pool.filled_portions / pool.total_portions) * 100} />
              <div style={{ fontSize: 11.5, color: WS.ink2, marginTop: 6 }}>{pool.filled_portions + selectedPortions} of {pool.total_portions} portions filled</div>
            </div>
          </div>
          <Pill tone="terra" size="sm">Payment held until pool fills</Pill>
        </div>
        <div style={{ padding: "12px 16px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
          <Btn tone="primary" size="lg" block onClick={() => window.location.href = "/m"}>Back to home</Btn>
          <Btn tone="ghost" size="lg" block onClick={() => window.location.href = "/m"}>View my pools →</Btn>
        </div>
      </div>
    );
  }

  // Address collection screen
  if (step === "address") {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: WS.cream, color: WS.ink, fontFamily: WS.sans }}>
        <div style={{ padding: "16px 16px 0", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setStep("view")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>{Icons.back(WS.ink, 20)}</button>
          <div style={{ fontFamily: WS.serif, fontSize: 18, fontWeight: 600 }}>Delivery address</div>
        </div>
        <div style={{ flex: 1, padding: "20px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 13, color: WS.ink2, lineHeight: 1.5 }}>
            Where should we deliver your <b>{selectedPortions}/{pool.total_portions}</b> portion of <b>{item?.name}</b>?
          </div>
          <Card style={{ padding: 0 }}>
            <textarea
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Your full delivery address…&#10;e.g. 14 Shields Road, Byker, Newcastle NE6 1BX"
              rows={4}
              style={{
                width: "100%", padding: "14px", border: "none", background: "transparent",
                fontFamily: WS.sans, fontSize: 14, color: WS.ink, resize: "none", outline: "none",
                boxSizing: "border-box", borderRadius: 16,
              }}
            />
          </Card>
          <div style={{ background: WS.butterLt, borderRadius: 12, padding: "10px 14px", fontSize: 12.5, color: "#8A6914", lineHeight: 1.5 }}>
            Your payment is <b>held</b> until the pool fills — you won't be charged until all portions are claimed.
          </div>
        </div>
        <div style={{ padding: "12px 16px 24px" }}>
          <Btn
            tone="primary" size="lg" block
            onClick={submitJoin}
            disabled={!address.trim()}
          >
            Confirm and join pool — £{totalForSelection.toFixed(2)}
          </Btn>
        </div>
      </div>
    );
  }

  // Joining spinner
  if (step === "joining") {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: WS.cream, alignItems: "center", justifyContent: "center", gap: 14, color: WS.ink2 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", border: `3px solid ${WS.line}`, borderTopColor: WS.terra, animation: "spin 0.8s linear infinite" }} />
        <div style={{ fontSize: 14 }}>Joining pool…</div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // Error screen
  if (step === "error") {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: WS.cream, color: WS.ink, fontFamily: WS.sans, alignItems: "center", justifyContent: "center", padding: 32, gap: 16, textAlign: "center" }}>
        <div style={{ fontSize: 40 }}>⚠️</div>
        <div style={{ fontFamily: WS.serif, fontSize: 20, fontWeight: 600 }}>Couldn't join pool</div>
        <div style={{ fontSize: 13, color: WS.ink2 }}>{joinError}</div>
        <Btn tone="primary" size="sm" onClick={() => setStep("view")}>Try again</Btn>
      </div>
    );
  }

  // Main view
  const portionOptions = (() => {
    const opts = [];
    for (let i = 1; i <= pool.total_portions; i++) {
      if (pool.total_portions % i === 0) {
        opts.push(i);
      }
    }
    return opts;
  })();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: WS.cream, color: WS.ink, fontFamily: WS.sans, overflow: "hidden" }}>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Hero image */}
        <div style={{ position: "relative" }}>
          {item?.image_urls?.[0]
            ? <img src={item.image_urls[0]} alt={item.name} style={{ width: "100%", height: 260, objectFit: "cover", display: "block" }} />
            : <ImgSlot label={item?.name ?? ""} tone="meat" h={260} r={0} />
          }
          <button
            onClick={() => window.history.back()}
            style={{ position: "absolute", top: 14, left: 14, width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.92)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {Icons.back(WS.ink, 18)}
          </button>
          {savePercent > 0 && (
            <div style={{ position: "absolute", top: 14, right: 14 }}>
              <Pill tone="butter" size="sm">−{savePercent}% vs retail</Pill>
            </div>
          )}
        </div>

        <div style={{ padding: "18px 18px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Pill tone="terra" size="xs">{pool.pool_ref}</Pill>
            {pool.expires_at && <CountdownTimer expiresAt={pool.expires_at} />}
          </div>
          <div style={{ fontFamily: WS.serif, fontSize: 24, fontWeight: 600, letterSpacing: "-0.015em", lineHeight: 1.15 }}>
            {item?.name ?? "Loading…"}
          </div>
          {item?.description && (
            <div style={{ fontSize: 13, color: WS.ink2, marginTop: 6, lineHeight: 1.5 }}>{item.description}</div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, color: WS.ink2, fontSize: 13 }}>
            <span style={{ fontWeight: 600, color: WS.ink }}>{shop?.name}</span>
            {shop?.rating_avg ? <><span>·</span><span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>{Icons.star(WS.butter, 12)} {shop.rating_avg}</span></> : null}
          </div>

          {/* Pool status card */}
          <Card style={{ marginTop: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <FractionBadge filled={pool.filled_portions} total={pool.total_portions} size={64} label={false} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: WS.serif, fontSize: 17, fontWeight: 600, lineHeight: 1.2 }}>
                  {pool.filled_portions} of {pool.total_portions} portions claimed
                </div>
                <div style={{ fontSize: 12.5, color: WS.ink2, marginTop: 4 }}>
                  {spotsLeft > 0 ? <><b style={{ color: WS.terra }}>{spotsLeft} spot{spotsLeft > 1 ? "s" : ""} left</b> · Ships when full</> : "Pool full · ships soon"}
                </div>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <Bar value={(pool.filled_portions / pool.total_portions) * 100} />
            </div>
          </Card>

          {/* Portion selector */}
          {spotsLeft > 0 && (
            <div style={{ marginTop: 22 }}>
              <SectionTitle>Choose your portion</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${portionOptions.length}, 1fr)`, gap: 8 }}>
                {portionOptions.map((n) => {
                  const active = selectedPortions === n;
                  const label = n === pool.total_portions ? "Full" : `${n}/${pool.total_portions}`;
                  const kg = caseWeightKg > 0 ? ((caseWeightKg / pool.total_portions) * n).toFixed(1) + " kg" : "";
                  const price = (pricePerPortionGBP * n).toFixed(2);
                  const available = n <= spotsLeft;
                  return (
                    <button
                      key={n}
                      disabled={!available}
                      onClick={() => setSelectedPortions(n)}
                      style={{
                        padding: "12px 10px", borderRadius: 14, cursor: available ? "pointer" : "not-allowed",
                        border: `1.5px solid ${active ? WS.terra : WS.line}`,
                        background: active ? WS.terraLt : available ? "#fff" : WS.cream,
                        textAlign: "center", opacity: available ? 1 : 0.4,
                      }}
                    >
                      <div style={{ fontFamily: WS.serif, fontSize: 20, fontWeight: 600, color: active ? WS.terraDk : WS.ink }}>{label}</div>
                      {kg && <div style={{ fontFamily: WS.mono, fontSize: 10.5, color: WS.mute, marginTop: 2 }}>{kg}</div>}
                      <div style={{ fontFamily: WS.sans, fontWeight: 700, fontSize: 13.5, marginTop: 6, color: active ? WS.terraDk : WS.ink }}>£{price}</div>
                    </button>
                  );
                })}
              </div>
              <div style={{ marginTop: 10, fontSize: 12, color: WS.ink2, textAlign: "center" }}>
                Your {selectedPortions}/{pool.total_portions} portion = {portionWeightKg.toFixed(1)} kg · £{totalForSelection.toFixed(2)}
              </div>
            </div>
          )}

          {/* How sharing works */}
          <div style={{ marginTop: 22 }}>
            <SectionTitle>How sharing works</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12.5, color: WS.ink2 }}>
              <div>① The shop only sells the full case at <b style={{ color: WS.ink }}>wholesale price</b> — saving you up to {savePercent}% vs retail.</div>
              <div>② Neighbours join the pool and each claims a portion. No charge until full.</div>
              <div>③ When full, the case ships and a rider delivers each share to your door.</div>
            </div>
          </div>

          {/* Shop info */}
          {shop && (
            <div style={{ marginTop: 18 }}>
              <SectionTitle>From the shop</SectionTitle>
              <Card>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: WS.cream, border: `1px solid ${WS.line}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                    <img src={shop.logo_url} alt={shop.name} style={{ height: 26, width: 40, objectFit: "contain" }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: WS.serif, fontWeight: 600, fontSize: 15 }}>{shop.name}</div>
                    <div style={{ fontSize: 12, color: WS.ink2, marginTop: 2 }}>{shop.address}</div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          <div style={{ height: 100 }} />
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ padding: "12px 16px 24px", background: "rgba(251,245,236,0.95)", backdropFilter: "blur(20px)", borderTop: `1px solid ${WS.line}`, display: "flex", gap: 8, flexShrink: 0 }}>
        <Btn tone="ghost" size="lg" style={{ flexShrink: 0 }} onClick={() => {
          if (navigator.share) navigator.share({ title: item?.name, url: window.location.href });
        }}>
          {Icons.share(WS.ink, 16)} Share
        </Btn>
        {spotsLeft > 0
          ? <Btn tone="primary" size="lg" block style={{ flex: 1 }} onClick={handleJoin}>
              Join pool — £{totalForSelection.toFixed(2)}
            </Btn>
          : <Btn tone="ghost" size="lg" block style={{ flex: 1 }} disabled>Pool is full</Btn>
        }
      </div>
    </div>
  );
}
