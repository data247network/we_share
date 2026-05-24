"use client";

import { useEffect, useRef, useState } from "react";
import { WS } from "@/components/brand/tokens";
import { Card } from "@/components/brand";
import { Pill } from "@/components/brand/Pill";
import { MobileScreen, TopBar, TabBar } from "@/components/buyer-mobile/MobileShell";
import { createClient } from "@/lib/supabase/client";

interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  role: string;
}

function Avatar({ profile, size = 80 }: { profile: Profile | null; size?: number }) {
  const initials = profile?.full_name
    ? profile.full_name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : profile?.email?.[0]?.toUpperCase() ?? "?";
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", flexShrink: 0, background: WS.terraLt, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {profile?.avatar_url
        ? <img src={profile.avatar_url} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        : <span style={{ fontFamily: WS.serif, fontSize: size * 0.35, fontWeight: 700, color: WS.terraDk }}>{initials}</span>
      }
    </div>
  );
}

const roleLabel: Record<string, string> = {
  buyer: "Buyer",
  shop: "Shop owner",
  rider: "Rider",
  admin: "Admin",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      const { data } = await supabase.from("profiles").select("id, full_name, email, phone, avatar_url, role").eq("id", user.id).single();
      if (data) {
        setProfile(data as Profile);
        setName(data.full_name ?? "");
        setPhone(data.phone ?? "");
        setAvatarUrl(data.avatar_url ?? "");
      }
      setLoading(false);
    });
  }, []);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploadingAvatar(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${profile.id}/avatar.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (!error) {
      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
      const url = pub.publicUrl + "?t=" + Date.now();
      setAvatarUrl(url);
      await supabase.from("profiles").update({ avatar_url: url }).eq("id", profile.id);
      setProfile(p => p ? { ...p, avatar_url: url } : p);
    }
    setUploadingAvatar(false);
  }

  async function handleSave() {
    if (!profile) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("profiles").update({
      full_name: name.trim() || null,
      phone: phone.trim() || null,
      avatar_url: avatarUrl.trim() || null,
    }).eq("id", profile.id);
    if (!error) {
      setProfile(p => p ? { ...p, full_name: name.trim() || null, phone: phone.trim() || null, avatar_url: avatarUrl.trim() || null } : p);
      setSaveMsg("Saved!");
      setTimeout(() => setSaveMsg(""), 2000);
      setEditing(false);
    }
    setSaving(false);
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  }

  if (loading) {
    return (
      <MobileScreen footer={<TabBar active="profile" />}>
        <TopBar title="Profile" />
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 60, color: WS.ink2 }}>Loading…</div>
      </MobileScreen>
    );
  }

  if (!profile) {
    return (
      <MobileScreen footer={<TabBar active="profile" />}>
        <TopBar title="Profile" />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16, textAlign: "center" }}>
          <div style={{ fontSize: 48 }}>👤</div>
          <div style={{ fontFamily: WS.serif, fontSize: 20, fontWeight: 600 }}>Sign in to view your profile</div>
          <button onClick={() => window.location.href = "/auth/login?redirect=/m/profile"}
            style={{ background: WS.terra, color: "#fff", border: "none", borderRadius: 12, padding: "12px 24px", fontFamily: WS.sans, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
            Sign in
          </button>
        </div>
      </MobileScreen>
    );
  }

  return (
    <MobileScreen footer={<TabBar active="profile" />}>
      <TopBar
        title="Profile"
        right={
          editing
            ? <button onClick={handleSave} disabled={saving} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: WS.sans, fontWeight: 700, fontSize: 14, color: WS.terra }}>{saving ? "…" : "Save"}</button>
            : <button onClick={() => setEditing(true)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: WS.sans, fontWeight: 600, fontSize: 14, color: WS.terra }}>Edit</button>
        }
      />

      {/* Avatar section */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, paddingTop: 8, paddingBottom: 24 }}>
        <div style={{ position: "relative" }}>
          <Avatar profile={{ ...profile, avatar_url: avatarUrl || profile.avatar_url }} size={90} />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploadingAvatar}
            style={{ position: "absolute", bottom: 0, right: 0, width: 28, height: 28, borderRadius: "50%", background: WS.terra, border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14 }}>
            {uploadingAvatar ? "⏳" : "📷"}
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarUpload} />
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: WS.serif, fontSize: 20, fontWeight: 600 }}>{profile.full_name || "No name set"}</div>
          <div style={{ fontSize: 13, color: WS.ink2, marginTop: 2 }}>{profile.email}</div>
          <div style={{ marginTop: 6 }}>
            <Pill tone={profile.role === "admin" ? "rose" : profile.role === "shop" ? "sage" : "terra"} size="xs">
              {roleLabel[profile.role] ?? profile.role}
            </Pill>
          </div>
        </div>
        {saveMsg && <Pill tone="sage" size="sm">{saveMsg}</Pill>}
      </div>

      {/* Edit form */}
      {editing ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontFamily: WS.mono, fontSize: 10.5, color: WS.mute, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>Full name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name"
              style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${WS.line}`, background: "#fff", fontFamily: WS.sans, fontSize: 14, color: WS.ink, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ fontFamily: WS.mono, fontSize: 10.5, color: WS.mute, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>Phone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+44 7700 900000" type="tel"
              style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${WS.line}`, background: "#fff", fontFamily: WS.sans, fontSize: 14, color: WS.ink, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ fontFamily: WS.mono, fontSize: 10.5, color: WS.mute, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>Avatar URL (or use camera above)</label>
            <input value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} placeholder="https://…"
              style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${WS.line}`, background: "#fff", fontFamily: WS.sans, fontSize: 14, color: WS.ink, outline: "none", boxSizing: "border-box" }} />
          </div>
          <button onClick={() => setEditing(false)}
            style={{ background: "none", border: `1.5px solid ${WS.line}`, borderRadius: 12, padding: "12px", fontFamily: WS.sans, fontSize: 14, color: WS.ink2, cursor: "pointer" }}>
            Cancel
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Card p={14}>
            <Row label="Name" value={profile.full_name || "—"} />
            <div style={{ height: 1, background: WS.line2, margin: "10px 0" }} />
            <Row label="Email" value={profile.email} />
            <div style={{ height: 1, background: WS.line2, margin: "10px 0" }} />
            <Row label="Phone" value={profile.phone || "—"} />
          </Card>

          <Card p={14}>
            <div style={{ fontFamily: WS.mono, fontSize: 10.5, color: WS.mute, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 12 }}>Account</div>
            <button
              onClick={() => window.location.href = "/auth/login"}
              style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 12 }}>
              <Row label="Change password" value="→" valueColor={WS.terraDk} />
            </button>
            <div style={{ height: 1, background: WS.line2, margin: "10px 0" }} />
            <button
              onClick={handleSignOut}
              style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              <Row label="Sign out" value="→" labelColor="#C0392B" valueColor="#C0392B" />
            </button>
          </Card>

          <Card p={14}>
            <div style={{ fontFamily: WS.mono, fontSize: 10.5, color: WS.mute, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 12 }}>Support</div>
            <Row label="Help & FAQ" value="→" />
            <div style={{ height: 1, background: WS.line2, margin: "10px 0" }} />
            <Row label="Contact us" value="→" />
            <div style={{ height: 1, background: WS.line2, margin: "10px 0" }} />
            <Row label="Privacy policy" value="→" />
          </Card>

          <div style={{ textAlign: "center", fontSize: 11, color: WS.mute, padding: "8px 0 16px" }}>WeShare v1.0 · Newcastle, NE</div>
        </div>
      )}
    </MobileScreen>
  );
}

function Row({ label, value, labelColor, valueColor }: { label: string; value: string; labelColor?: string; valueColor?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 14, color: labelColor ?? WS.ink }}>{label}</span>
      <span style={{ fontSize: 14, color: valueColor ?? WS.ink2, fontWeight: 500 }}>{value}</span>
    </div>
  );
}
