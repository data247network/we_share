"use client";

import { WS } from "@/components/brand/tokens";
import { SectionTitle, Card, ImgSlot } from "@/components/brand";
import { Logo } from "@/components/brand/Logo";
import { Pill } from "@/components/brand/Pill";
import { Icons } from "@/components/brand/Icons";
import { AvatarStack } from "@/components/brand/Avatar";
import { MobileScreen, TopBar, TabBar, SearchInput } from "@/components/buyer-mobile/MobileShell";
import { PoolCard } from "@/components/buyer-mobile/PoolCard";

const chips = ["All", "Meat & poultry", "Drinks", "Pantry", "Produce"];

export default function BuyerHome() {
  return (
    <MobileScreen footer={<TabBar active="home" />}>
      <TopBar
        title={<Logo size={18} />}
        left={
          <div style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 12, color: WS.ink2, padding: "8px 0" }}>
            {Icons.pin(WS.terra, 14)}
            <span style={{ fontWeight: 600 }}>Yaba</span>
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
          Hi Ada —{" "}
          <span style={{ color: WS.terra, fontStyle: "italic" }}>buy together,</span>
          <br />save together.
        </div>
      </div>

      <div style={{ marginBottom: 14 }}><SearchInput /></div>

      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 6, marginBottom: 14, marginLeft: -2 }}>
        {chips.map((c, i) => (
          <Pill key={i} tone={i === 0 ? "solid" : "line"} size="lg">{c}</Pill>
        ))}
      </div>

      <SectionTitle action="See all →">Open pools near you</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 18 }}>
        <PoolCard
          item="Premium Ribeye · 4 kg case"
          shop="Tunde's Butchery"
          priceGBP="30.50"
          members={["Ada A", "Joy M", "Bola"]}
          filledPortions={3}
          totalPortions={4}
          hoursLeft={6}
          portion="1/4"
          img="meat"
        />
        <PoolCard
          item="Craft IPA · 24-pack"
          shop="Hopline Drinks"
          priceGBP="18.00"
          members={["Sam", "Tina"]}
          filledPortions={2}
          totalPortions={4}
          hoursLeft={14}
          portion="1/4"
          img="drink"
        />
      </div>

      <SectionTitle action="Browse →">Wholesale unlocked</SectionTitle>
      <Card p={14}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ImgSlot label="shop" tone="butter" h={56} r={12} style={{ width: 56, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: WS.serif, fontWeight: 600, fontSize: 15 }}>Lagos Fresh Co.</div>
            <div style={{ fontSize: 12, color: WS.ink2, display: "flex", gap: 6, alignItems: "center" }}>
              {Icons.star(WS.butter, 12)} 4.9 · 38 active pools
            </div>
          </div>
          {Icons.chev(WS.mute, 16)}
        </div>
      </Card>

      <div style={{ height: 24 }} />

      <SectionTitle>Your circle</SectionTitle>
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <AvatarStack names={["Joy M", "Bola K", "Sam", "Tina O"]} more={2} size={28} />
          <div style={{ flex: 1, fontSize: 12.5, color: WS.ink2 }}>6 friends bought together this week</div>
          {Icons.chev(WS.mute, 16)}
        </div>
      </Card>
    </MobileScreen>
  );
}
