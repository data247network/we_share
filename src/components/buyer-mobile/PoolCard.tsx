"use client";

import { WS } from "@/components/brand/tokens";
import { Card, ImgSlot, Bar } from "@/components/brand";
import { Pill } from "@/components/brand/Pill";
import { Btn } from "@/components/brand/Btn";
import { AvatarStack } from "@/components/brand/Avatar";
import { FractionBadge } from "@/components/brand/FractionBadge";

interface PoolCardProps {
  item: string;
  shop: string;
  priceGBP: string;
  members: string[];
  totalPortions: number;
  filledPortions: number;
  hoursLeft: number;
  img?: "meat" | "drink" | "butter" | "sage";
  portion?: string;
}

export function PoolCard({ item, shop, priceGBP, members, totalPortions, filledPortions, hoursLeft, img = "meat", portion = "1/4" }: PoolCardProps) {
  return (
    <Card p={0} r={20} style={{ overflow: "hidden" }}>
      <div style={{ position: "relative" }}>
        <ImgSlot label={img === "meat" ? "product · meat" : "product · drink"} tone={img} h={140} r={0} />
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 6 }}>
          <Pill tone="solid" size="xs">{shop}</Pill>
          {hoursLeft > 0 && <Pill tone="butter" size="xs">⏱ {hoursLeft}h left</Pill>}
        </div>
        <div style={{ position: "absolute", bottom: -22, right: 14, background: "#fff", borderRadius: "50%", padding: 6, boxShadow: "0 6px 18px rgba(0,0,0,0.10)" }}>
          <FractionBadge filled={filledPortions} total={totalPortions} size={44} label={false} />
        </div>
      </div>
      <div style={{ padding: "18px 14px 14px" }}>
        <div style={{ fontFamily: WS.serif, fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 4 }}>{item}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, fontSize: 12.5, color: WS.ink2 }}>
          <AvatarStack names={members} size={20} />
          <span>{filledPortions} of {totalPortions} portions claimed</span>
        </div>
        <Bar value={(filledPortions / totalPortions) * 100} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
          <div>
            <div style={{ fontFamily: WS.mono, fontSize: 11, color: WS.mute }}>{portion} share</div>
            <div style={{ fontFamily: WS.serif, fontSize: 20, fontWeight: 600, color: WS.ink }}>£{priceGBP}</div>
          </div>
          <Btn tone="primary" size="sm">Join pool →</Btn>
        </div>
      </div>
    </Card>
  );
}
