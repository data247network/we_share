"use client";

import { WS } from "@/components/brand/tokens";
import { Card, ImgSlot, Bar } from "@/components/brand";
import { Pill } from "@/components/brand/Pill";
import { Btn } from "@/components/brand/Btn";
import { AvatarStack } from "@/components/brand/Avatar";
import { FractionBadge } from "@/components/brand/FractionBadge";
import { CountdownTimer } from "@/components/shared/CountdownTimer";

interface PoolCardProps {
  item: string;
  shop: string;
  priceGBP: string;
  members?: string[];
  totalPortions: number;
  filledPortions: number;
  hoursLeft?: number;
  expiresAt?: string;
  img?: "meat" | "drink" | "butter" | "sage" | "produce" | "pantry";
  imageUrl?: string;
  portion?: string;
  savePercent?: number;
  poolId?: string;
}

export function PoolCard({
  item, shop, priceGBP, members = [], totalPortions, filledPortions,
  expiresAt, img = "meat", imageUrl, portion = "1/4", savePercent, poolId
}: PoolCardProps) {
  const tone = img === "drink" ? "drink" : img === "produce" ? "sage" : img === "pantry" ? "butter" : "meat";

  return (
    <Card p={0} r={20} style={{ overflow: "hidden" }}>
      <div style={{ position: "relative" }}>
        {imageUrl
          ? <img src={imageUrl} alt={item} style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }} />
          : <ImgSlot label={item} tone={tone as any} h={140} r={0} />
        }
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 6 }}>
          <Pill tone="solid" size="xs">{shop}</Pill>
        </div>
        {savePercent && (
          <div style={{ position: "absolute", top: 10, right: 10 }}>
            <Pill tone="butter" size="xs">−{savePercent}%</Pill>
          </div>
        )}
        <div style={{ position: "absolute", bottom: -22, right: 14, background: "#fff", borderRadius: "50%", padding: 6, boxShadow: "0 6px 18px rgba(0,0,0,0.10)" }}>
          <FractionBadge filled={filledPortions} total={totalPortions} size={44} label={false} />
        </div>
      </div>
      <div style={{ padding: "18px 14px 14px" }}>
        <div style={{ fontFamily: WS.serif, fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 4 }}>{item}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, fontSize: 12.5, color: WS.ink2 }}>
          {members.length > 0 && <AvatarStack names={members} size={20} />}
          <span>{filledPortions} of {totalPortions} portions claimed</span>
          {expiresAt && <CountdownTimer expiresAt={expiresAt} />}
        </div>
        <Bar value={(filledPortions / totalPortions) * 100} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
          <div>
            <div style={{ fontFamily: WS.mono, fontSize: 11, color: WS.mute }}>{portion} share</div>
            <div style={{ fontFamily: WS.serif, fontSize: 20, fontWeight: 600, color: WS.ink }}>£{priceGBP}</div>
          </div>
          <Btn tone="primary" size="sm" onClick={() => poolId && (window.location.href = `/m/item/${poolId}`)}>Join pool →</Btn>
        </div>
      </div>
    </Card>
  );
}
