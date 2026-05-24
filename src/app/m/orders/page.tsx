"use client";

import { useEffect, useState } from "react";
import { WS } from "@/components/brand/tokens";
import { Card, ImgSlot } from "@/components/brand";
import { Pill } from "@/components/brand/Pill";
import { MobileScreen, TopBar, TabBar } from "@/components/buyer-mobile/MobileShell";
import { createClient } from "@/lib/supabase/client";

interface Order {
  id: string;
  order_ref: string;
  total_gbp: number;
  status: string;
  created_at: string;
  pool_members: {
    portions: number;
    pools: {
      pool_ref: string;
      total_portions: number;
      items: { name: string; image_urls: string[] } | null;
      shops: { name: string } | null;
    } | null;
  } | null;
}

const statusStyle: Record<string, { tone: "sage" | "butter" | "terra" | "line" | "rose"; label: string }> = {
  pending: { tone: "butter", label: "Pending" },
  confirmed: { tone: "butter", label: "Confirmed" },
  packing: { tone: "butter", label: "Packing" },
  in_transit: { tone: "terra", label: "On the way" },
  delivered: { tone: "sage", label: "Delivered" },
  cancelled: { tone: "rose", label: "Cancelled" },
  refunded: { tone: "rose", label: "Refunded" },
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      setIsLoggedIn(true);
      supabase
        .from("orders")
        .select(`
          id, order_ref, total_gbp, status, created_at,
          pool_members:pool_member_id (
            portions,
            pools:pool_id (
              pool_ref, total_portions,
              items:item_id (name, image_urls),
              shops:shop_id (name)
            )
          )
        `)
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          setOrders((data as unknown as Order[]) || []);
          setLoading(false);
        });
    });
  }, []);

  if (!isLoggedIn && !loading) {
    return (
      <MobileScreen footer={<TabBar active="orders" />}>
        <TopBar title="Orders" />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16, textAlign: "center" }}>
          <div style={{ fontSize: 48 }}>📦</div>
          <div style={{ fontFamily: WS.serif, fontSize: 20, fontWeight: 600 }}>Sign in to see your orders</div>
          <button onClick={() => window.location.href = "/auth/login?redirect=/m/orders"}
            style={{ background: WS.terra, color: "#fff", border: "none", borderRadius: 12, padding: "12px 24px", fontFamily: WS.sans, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
            Sign in
          </button>
        </div>
      </MobileScreen>
    );
  }

  return (
    <MobileScreen footer={<TabBar active="orders" />}>
      <TopBar title="Orders" />

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} p={14} style={{ opacity: 0.4 }}>
              <div style={{ background: WS.line, height: 14, borderRadius: 4, width: "60%", marginBottom: 8 }} />
              <div style={{ background: WS.line2, height: 10, borderRadius: 4, width: "40%" }} />
            </Card>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 12, textAlign: "center" }}>
          <div style={{ fontSize: 48 }}>📦</div>
          <div style={{ fontFamily: WS.serif, fontSize: 20, fontWeight: 600 }}>No orders yet</div>
          <div style={{ fontSize: 13, color: WS.ink2 }}>Orders appear here once your pool fills and ships.</div>
          <button onClick={() => window.location.href = "/m"}
            style={{ background: WS.terra, color: "#fff", border: "none", borderRadius: 12, padding: "12px 24px", fontFamily: WS.sans, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
            Browse pools →
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {orders.map((o) => {
            const pool = o.pool_members?.pools;
            const img = pool?.items?.image_urls?.[0];
            const st = statusStyle[o.status] ?? { tone: "line" as const, label: o.status };
            return (
              <Card key={o.id} p={0} style={{ overflow: "hidden" }}>
                <div style={{ display: "flex" }}>
                  <div style={{ width: 72, flexShrink: 0 }}>
                    {img
                      ? <img src={img} alt="" style={{ width: 72, height: 72, objectFit: "cover", display: "block" }} />
                      : <ImgSlot label="" tone="meat" h={72} r={0} style={{ width: 72 }} />
                    }
                  </div>
                  <div style={{ flex: 1, padding: "10px 14px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                      <div style={{ fontFamily: WS.serif, fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>
                        {pool?.items?.name ?? "Order"}
                      </div>
                      <Pill tone={st.tone} size="xs">{st.label}</Pill>
                    </div>
                    <div style={{ fontSize: 11, color: WS.ink2, marginTop: 3 }}>
                      {o.order_ref} · {pool?.shops?.name}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                      <span style={{ fontFamily: WS.serif, fontWeight: 700, fontSize: 15, color: WS.ink }}>
                        £{(o.total_gbp / 100).toFixed(2)}
                      </span>
                      <span style={{ fontSize: 11, color: WS.mute }}>
                        {new Date(o.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      </span>
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
