"use client";

import { useState } from "react";
import { WS } from "@/components/brand/tokens";
import { Logo } from "@/components/brand/Logo";
import { Btn } from "@/components/brand/Btn";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else if (data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();
      const role = profile?.role ?? "buyer";
      const redirect = role === "shop" ? "/shop/dashboard" : role === "rider" ? "/rider/route" : role === "admin" ? "/admin" : "/m";
      window.location.href = redirect;
    }
    setLoading(false);
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` },
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: 12,
    border: `1.5px solid ${WS.line}`, background: "#fff",
    fontFamily: WS.sans, fontSize: 14, color: WS.ink, outline: "none",
    boxSizing: "border-box" as const,
  };

  return (
    <div style={{ minHeight: "100dvh", background: WS.cream, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Logo size={28} />
          <div style={{ fontFamily: WS.serif, fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 16 }}>Welcome back</div>
          <div style={{ fontSize: 14, color: WS.ink2, marginTop: 6 }}>Sign in to your WeShare account</div>
        </div>

        {success ? (
          <div style={{ background: WS.sageLt, border: `1px solid ${WS.sage}`, borderRadius: 14, padding: 20, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>✉️</div>
            <div style={{ fontFamily: WS.serif, fontSize: 18, fontWeight: 600, color: "#33623A" }}>Check your email</div>
            <div style={{ fontSize: 13, color: "#33623A", marginTop: 6 }}>We sent a magic link to <b>{email}</b></div>
          </div>
        ) : (
          <div style={{ background: "#fff", border: `1px solid ${WS.line}`, borderRadius: 20, padding: 28 }}>
            {error && (
              <div style={{ background: WS.rose, border: `1px solid ${WS.plum}`, borderRadius: 10, padding: "10px 14px", marginBottom: 18, fontSize: 13, color: WS.plum }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontFamily: WS.mono, fontSize: 10.5, color: WS.mute, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ fontFamily: WS.mono, fontSize: 10.5, color: WS.mute, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={inputStyle}
                />
              </div>
              <Btn tone="primary" size="lg" block type="submit" style={{ marginTop: 8 }} disabled={loading}>
                {loading ? "Signing in…" : "Sign in"}
              </Btn>
            </form>

            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0" }}>
              <div style={{ flex: 1, height: 1, background: WS.line }} />
              <span style={{ fontFamily: WS.mono, fontSize: 10.5, color: WS.mute }}>OR</span>
              <div style={{ flex: 1, height: 1, background: WS.line }} />
            </div>

            <Btn tone="ghost" size="lg" block onClick={handleMagicLink} disabled={loading || !email}>
              ✉️ Send magic link
            </Btn>

            <div style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: WS.ink2 }}>
              No account? <a href="/auth/signup" style={{ color: WS.terraDk, fontWeight: 600 }}>Sign up free</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
