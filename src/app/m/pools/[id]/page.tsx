"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { WS } from "@/components/brand/tokens";
import { Card, Bar } from "@/components/brand";
import { Pill } from "@/components/brand/Pill";
import { Btn } from "@/components/brand/Btn";
import { FractionBadge } from "@/components/brand/FractionBadge";
import { Icons } from "@/components/brand/Icons";
import { MobileScreen, TopBar, TabBar } from "@/components/buyer-mobile/MobileShell";
import { CountdownTimer } from "@/components/shared/CountdownTimer";
import { createClient } from "@/lib/supabase/client";

interface MemberDetail {
  id: string;
  portions: number;
  price_paid_gbp: number;
  payment_status: string;
  delivery_address: string;
  verification_code: string | null;
  created_at: string;
  pools: {
    id: string;
    pool_ref: string;
    total_portions: number;
    filled_portions: number;
    status: string;
    expires_at: string;
    items: { name: string; image_urls: string[]; description: string } | null;
    shops: { name: string } | null;
  } | null;
}

const statusLabel: Record<string, { label: string; tone: "sage" | "butter" | "terra" | "line" | "rose" }> = {
  open:      { label: "Filling",         tone: "butter" },
  filled:    { label: "Full · packing",  tone: "sage" },
  packing:   { label: "Packing",         tone: "sage" },
  shipped:   { label: "On the way",      tone: "terra" },
  delivered: { label: "Delivered",       tone: "sage" },
  cancelled: { label: "Cancelled",       tone: "rose" },
  refunded:  { label: "Refunded",        tone: "rose" },
};

function Row({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 13.5, color: WS.ink2 }}>{label}</span>
      <span style={{ fontSize: 13.5, color: valueColor ?? WS.ink, fontWeight: 500 }}>{value}</span>
    </div>
  );
}

export default function MyPoolDetail() {
  const params = useParams();
  const id = params.id as string;
  const [member, setMember] = useState<MemberDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      const { data } = await supabase
        .from("pool_members")
        .select(`
          id, portions, price_paid_gbp, payment_status, delivery_address, verification_code, created_at,
          pools:pool_id (
            id, pool_ref, total_portions, filled_portions, status, expires_at,
            items:item_id (name, image_urls, description),
            shops:shop_id (name)
          )
        `)
        .eq("id", id)
        .eq("buyer_id", user.id)
        .single();
      setMember(data as unknown as MemberDetail);
      setLoading(false);
    });
  }, [id]);

  const backBtn = (
    <button
      onClick={() => window.location.href = "/m/pools"}
      style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}>
      {Icons.back(WS.ink, 18)}
    </button>
  );

  if (loading) {
    return (
      <MobileScreen footer={<TabBar active="pools" />}>
        <TopBar title="My Pool" left={backBtn} />
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 60, color: WS.ink2 }}>Loading…</div>
      </MobileScreen>
    );
  }

  if (!member || !member.pools) {
    return (
      <MobileScreen footer={<TabBar active="pools" />}>
        <TopBar title="My Pool" left={backBtn} />
        <div style={{ textAlign: "center", paddingTop: 60, color: WS.ink2 }}>Pool not found.</div>
      </MobileScreen>
    );
  }

  const pool = member.pools;
  const item = pool.items;
  const st = statusLabel[pool.status] ?? { label: pool.status, tone: "line" as const };
  const spotsLeft = pool.total_portions - pool.filled_portions;
  const img = item?.image_urls?.[0];

  return (
    <MobileScreen footer={<TabBar active="pools" />}>
      <TopBar title="My Pool" left={backBtn} />

      {/* Hero image */}
      {img && (
        <div style={{ marginLeft: -16, marginRight: -16, marginBottom: 16 }}>
          <img src={img} alt={item?.name} style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
        </div>
      )}

      {/* Item title + status */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <Pill tone={st.tone} size="xs">{st.label}</Pill>
          <Pill tone="line" size="xs">{pool.pool_ref}</Pill>
        </div>
        <div style={{ fontFamily: WS.serif, fontSize: 22, fontWeight: 600, letterSpacing: "-0.015em", lineHeight: 1.2 }}>
          {item?.name ?? "Pool"}
        </div>
        <div style={{ fontSize: 13, color: WS.ink2, marginTop: 4 }}>{pool.shops?.name}</div>
      </div>

      {/* Pool fill progress */}
      <Card p={14} style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <FractionBadge filled={pool.filled_portions} total={pool.total_portions} size={52} />
          <div>
            <div style={{ fontFamily: WS.serif, fontWeight: 600, fontSize: 15 }}>
              {pool.filled_portions} of {pool.total_portions} portions filled
            </div>
            {pool.status === "open" && spotsLeft > 0 && (
              <div style={{ fontSize: 12.5, color: WS.ink2, marginTop: 2 }}>
                <b style={{ color: WS.terra }}>{spotsLeft} spot{spotsLeft > 1 ? "s" : ""} left</b>
              </div>
            )}
          </div>
        </div>
        <Bar value={(pool.filled_portions / pool.total_portions) * 100} h={6} />
        {pool.status === "open" && (
          <CountdownTimer expiresAt={pool.expires_at} style={{ fontSize: 12, display: "block", marginTop: 8, color: WS.mute }} />
        )}
      </Card>

      {/* My membership */}
      <Card p={14} style={{ marginBottom: 12 }}>
        <div style={{ fontFamily: WS.mono, fontSize: 10.5, color: WS.mute, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 12 }}>
          Your membership
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Row
            label="Joined"
            value={new Date(member.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          />
          <div style={{ height: 1, background: WS.line2 }} />
          <Row
            label="Your portions"
            value={`${member.portions} / ${pool.total_portions} share`}
          />
          <div style={{ height: 1, background: WS.line2 }} />
          <Row
            label="Amount held"
            value={`£${(member.price_paid_gbp / 100).toFixed(2)}`}
            valueColor={WS.terraDk}
          />
          <div style={{ height: 1, background: WS.line2 }} />
          <Row
            label="Payment"
            value={member.payment_status === "pending" ? "Held — not charged yet" : member.payment_status}
          />
        </div>
      </Card>

      {/* Delivery address */}
      <Card p={14} style={{ marginBottom: 12 }}>
        <div style={{ fontFamily: WS.mono, fontSize: 10.5, color: WS.mute, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>
          Delivery address
        </div>
        <div style={{ fontSize: 13.5, color: WS.ink, lineHeight: 1.5 }}>{member.delivery_address}</div>
      </Card>

      {/* Verification code (delivered) */}
      {pool.status === "delivered" && member.verification_code && (
        <Card p={14} style={{ marginBottom: 12, background: WS.sageLt, border: `1px solid #7DBD84` }}>
          <div style={{ fontFamily: WS.mono, fontSize: 10.5, color: "#33623A", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>
            Delivery code — show to rider
          </div>
          <div style={{ fontFamily: WS.mono, fontSize: 32, fontWeight: 700, color: "#33623A", letterSpacing: "0.15em" }}>
            {member.verification_code}
          </div>
        </Card>
      )}

      {/* Add another portion */}
      {pool.status === "open" && spotsLeft > 0 && (
        <Btn
          tone="ghost" size="lg" block
          style={{ marginBottom: 12 }}
          onClick={() => window.location.href = `/m/item/${pool.id}`}>
          Add another portion →
        </Btn>
      )}

      <div style={{ height: 8 }} />
    </MobileScreen>
  );
}
