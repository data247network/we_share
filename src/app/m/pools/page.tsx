"use client";

import { useEffect, useState } from "react";
import { WS } from "@/components/brand/tokens";
import { Card, ImgSlot, Bar } from "@/components/brand";
import { Pill } from "@/components/brand/Pill";
import { FractionBadge } from "@/components/brand/FractionBadge";
import { Icons } from "@/components/brand/Icons";
import { MobileScreen, TopBar, TabBar } from "@/components/buyer-mobile/MobileShell";
import { CountdownTimer } from "@/components/shared/CountdownTimer";
import { createClient } from "@/lib/supabase/client";

interface MyPool {
  id: string;
  portions: number;
  price_paid_gbp: number;
  payment_status: string;
  delivery_address: string;
  verification_code: string | null;
  pools: {
    id: string;
    pool_ref: string;
    total_portions: number;
    filled_portions: number;
    status: string;
    expires_at: string;
    items: { name: string; image_urls: string[]; category: string } | null;
    shops: { name: string } | null;
  } | null;
}

const statusLabel: Record<string, { label: string; tone: "sage" | "butter" | "terra" | "line" | "rose" }> = {
  open: { label: "Filling", tone: "butter" },
  filled: { label: "Full · packing", tone: "sage" },
  packing: { label: "Packing", tone: "sage" },
  shipped: { label: "On the way", tone: "terra" },
  delivered: { label: "Delivered", tone: "sage" },
  cancelled: { label: "Cancelled", tone: "rose" },
  refunded: { label: "Refunded", tone: "rose" },
};

export default function MyPools() {
  const [myPools, setMyPools] = useState<MyPool[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      setIsLoggedIn(true);
      supabase
        .from("pool_members")
        .select(`
          id, portions, price_paid_gbp, payment_status, delivery_address, verification_code,
          pools:pool_id (
            id, pool_ref, total_portions, filled_portions, status, expires_at,
            items:item_id (name, image_urls, category),
            shops:shop_id (name)
          )
        `)
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          setMyPools((data as unknown as MyPool[]) || []);
          setLoading(false);
        });
    });
  }, []);

  if (!isLoggedIn && !loading) {
    return (
      <MobileScreen footer={<TabBar active="pools" />}>
        <TopBar title="My Pools" />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16, textAlign: "center" }}>
          <div style={{ fontSize: 48 }}>🛒</div>
          <div style={{ fontFamily: WS.serif, fontSize: 20, fontWeight: 600 }}>Sign in to see your pools</div>
          <div style={{ fontSize: 13, color: WS.ink2 }}>Join a pool and it appears here.</div>
          <button onClick={() => window.location.href = "/auth/login?redirect=/m/pools"}
            style={{ background: WS.terra, color: "#fff", border: "none", borderRadius: 12, padding: "12px 24px", fontFamily: WS.sans, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
            Sign in
          </button>
        </div>
      </MobileScreen>
    );
  }

  return (
    <MobileScreen footer={<TabBar active="pools" />}>
      <TopBar title="My Pools" />

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} p={14} style={{ opacity: 0.4 }}>
              <div style={{ background: WS.line, height: 14, borderRadius: 4, width: "60%", marginBottom: 8 }} />
              <div style={{ background: WS.line2, height: 10, borderRadius: 4, width: "40%" }} />
            </Card>
          ))}
        </div>
      ) : myPools.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 12, textAlign: "center" }}>
          <div style={{ fontSize: 48 }}>🌱</div>
          <div style={{ fontFamily: WS.serif, fontSize: 20, fontWeight: 600 }}>No pools yet</div>
          <div style={{ fontSize: 13, color: WS.ink2 }}>Browse open pools and join one to get started.</div>
          <button onClick={() => window.location.href = "/m"}
            style={{ background: WS.terra, color: "#fff", border: "none", borderRadius: 12, padding: "12px 24px", fontFamily: WS.sans, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
            Browse pools →
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {myPools.map((m) => {
            const pool = m.pools;
            if (!pool) return null;
            const st = statusLabel[pool.status] ?? { label: pool.status, tone: "line" as const };
            const img = pool.items?.image_urls?.[0];
            return (
              <Card key={m.id} p={0} style={{ overflow: "hidden", cursor: "pointer" }}
                onClick={() => window.location.href = `/m/pools/${m.id}`}>
                <div style={{ display: "flex", gap: 0 }}>
                  <div style={{ width: 88, flexShrink: 0 }}>
                    {img
                      ? <img src={img} alt="" style={{ width: 88, height: 88, objectFit: "cover", display: "block" }} />
                      : <ImgSlot label="" tone="meat" h={88} r={0} style={{ width: 88 }} />
                    }
                  </div>
                  <div style={{ flex: 1, padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                      <div style={{ fontFamily: WS.serif, fontSize: 14.5, fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.005em" }}>
                        {pool.items?.name}
                      </div>
                      <Pill tone={st.tone} size="xs">{st.label}</Pill>
                    </div>
                    <div style={{ fontSize: 11.5, color: WS.ink2, marginTop: 3 }}>{pool.shops?.name} · {pool.pool_ref}</div>
                    <div style={{ marginTop: 8 }}>
                      <Bar value={(pool.filled_portions / pool.total_portions) * 100} h={4} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
                      <span style={{ fontFamily: WS.mono, fontSize: 11, color: WS.mute }}>
                        Your {m.portions}/{pool.total_portions} · £{(m.price_paid_gbp / 100).toFixed(2)}
                      </span>
                      {pool.status === "open" && <CountdownTimer expiresAt={pool.expires_at} style={{ fontSize: 10.5 }} />}
                      {pool.status === "delivered" && m.verification_code && (
                        <span style={{ fontFamily: WS.mono, fontSize: 11, color: WS.terraDk, fontWeight: 700 }}>Code: {m.verification_code}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </MobileScreen>
  );
}
