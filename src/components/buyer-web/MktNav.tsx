"use client";

import { useEffect, useRef, useState } from "react";
import { WS } from "@/components/brand/tokens";
import { Logo } from "@/components/brand/Logo";
import { Btn } from "@/components/brand/Btn";
import { Icons } from "@/components/brand/Icons";
import { createClient } from "@/lib/supabase/client";

const navLinks = [
  { label: "Browse",       action: "scroll:pools" },
  { label: "Open pools",   action: "scroll:pools" },
  { label: "How it works", action: "scroll:how-it-works" },
  { label: "For shops",    action: "href:/shop/onboard" },
];

function handleNavAction(action: string) {
  if (action.startsWith("href:")) {
    window.location.href = action.slice(5);
  } else if (action.startsWith("scroll:")) {
    const id = action.slice(7);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.href = `/#${id}`;
    }
  }
}

interface UserInfo {
  email: string;
  name: string | null;
  avatarUrl: string | null;
}

export function MktNav({ active = "Browse" }: { active?: string }) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase.from("profiles").select("full_name, email, avatar_url").eq("id", user.id).single();
      setUserInfo({
        email: data?.email ?? user.email ?? "",
        name: data?.full_name ?? null,
        avatarUrl: data?.avatar_url ?? null,
      });
    });
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  }

  function openMenu() {
    if (menuTimeout.current) clearTimeout(menuTimeout.current);
    setShowMenu(true);
  }

  function closeMenu() {
    menuTimeout.current = setTimeout(() => setShowMenu(false), 150);
  }

  const initials = userInfo?.name
    ? userInfo.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : userInfo?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 18, padding: "14px 36px",
      borderBottom: `1px solid ${WS.line}`,
      background: "rgba(251,245,236,0.92)", backdropFilter: "blur(20px)",
      position: "sticky", top: 0, zIndex: 100,
    }}>
      <span style={{ cursor: "pointer" }} onClick={() => window.location.href = "/"}>
        <Logo size={20} />
      </span>

      <nav style={{ display: "flex", gap: 18, marginLeft: 20 }}>
        {navLinks.map((n) => (
          <span
            key={n.label}
            onClick={() => handleNavAction(n.action)}
            style={{
              fontSize: 13.5, fontWeight: 600,
              color: n.label === active ? WS.ink : WS.ink2,
              borderBottom: n.label === active ? `2px solid ${WS.terra}` : "2px solid transparent",
              paddingBottom: 2, cursor: "pointer",
            }}>{n.label}</span>
        ))}
      </nav>

      <div style={{ flex: 1 }} />

      {/* Search */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: `1px solid ${WS.line}`, borderRadius: 10, padding: "7px 12px", width: 280 }}>
        {Icons.search(WS.mute, 14)}
        <span style={{ fontSize: 12.5, color: WS.mute }}>Search wholesale deals…</span>
      </div>

      {/* Location */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: WS.ink2 }}>
        {Icons.pin(WS.terra, 14)} Newcastle
      </div>

      {/* Auth area */}
      {userInfo ? (
        <div
          style={{ position: "relative" }}
          onMouseEnter={openMenu}
          onMouseLeave={closeMenu}>
          {/* Avatar */}
          <div style={{
            width: 34, height: 34, borderRadius: "50%", overflow: "hidden",
            cursor: "pointer", border: `2px solid ${WS.terra}`, flexShrink: 0,
            background: WS.terraLt, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {userInfo.avatarUrl
              ? <img src={userInfo.avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <span style={{ fontFamily: WS.serif, fontSize: 13, fontWeight: 700, color: WS.terraDk }}>{initials}</span>
            }
          </div>

          {/* Dropdown */}
          {showMenu && (
            <div
              onMouseEnter={openMenu}
              onMouseLeave={closeMenu}
              style={{
                position: "absolute", top: "calc(100% + 10px)", right: 0,
                background: "#fff", border: `1px solid ${WS.line}`,
                borderRadius: 14, padding: 6, minWidth: 200,
                boxShadow: "0 12px 32px rgba(42,31,27,0.14)",
                zIndex: 200,
              }}>
              {/* User info header */}
              <div style={{ padding: "10px 14px 10px", borderBottom: `1px solid ${WS.line2}`, marginBottom: 4 }}>
                <div style={{ fontFamily: WS.serif, fontWeight: 600, fontSize: 14, color: WS.ink }}>
                  {userInfo.name ?? "My account"}
                </div>
                <div style={{ fontSize: 11.5, color: WS.mute, marginTop: 2 }}>{userInfo.email}</div>
              </div>

              {/* Menu items */}
              {[
                { label: "Edit profile", icon: "👤", href: "/m/profile" },
                { label: "My pools",     icon: "🛒", href: "/m/pools" },
                { label: "Settings",     icon: "⚙️", href: "/m/profile" },
              ].map(item => (
                <MenuItem key={item.label} label={item.label} icon={item.icon} onClick={() => window.location.href = item.href} />
              ))}

              <div style={{ height: 1, background: WS.line2, margin: "4px 0" }} />

              <MenuItem
                label="Sign out"
                icon="→"
                onClick={handleSignOut}
                danger
              />
            </div>
          )}
        </div>
      ) : (
        <>
          <Btn tone="ghost" size="sm" onClick={() => window.location.href = "/auth/login"}>Sign in</Btn>
          <Btn tone="primary" size="sm" onClick={() => window.location.href = "/auth/signup"}>Sign up</Btn>
        </>
      )}
    </div>
  );
}

function MenuItem({ label, icon, onClick, danger = false }: { label: string; icon: string; onClick: () => void; danger?: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "9px 14px", borderRadius: 10, cursor: "pointer",
        background: hovered ? WS.cream : "transparent",
        color: danger ? "#C0392B" : WS.ink,
        fontSize: 13.5, fontWeight: 500,
      }}>
      <span style={{ fontSize: 15, width: 20, textAlign: "center" }}>{icon}</span>
      {label}
    </div>
  );
}
