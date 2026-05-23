"use client";

import { useState } from "react";
import { WS } from "@/components/brand/tokens";
import { Logo } from "@/components/brand/Logo";
import { Btn } from "@/components/brand/Btn";
import { Pill } from "@/components/brand/Pill";
import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/types";

const roles: { id: UserRole; label: string; desc: string; emoji: string }[] = [
  { id: "buyer", label: "I want to buy", desc: "Join pools, split wholesale cases", emoji: "🛒" },
  { id: "shop", label: "I run a shop", desc: "List wholesale items for pooling", emoji: "🏪" },
  { id: "rider", label: "I deliver", desc: "Pick up and deliver pool orders", emoji: "🛵" },
];

export default function SignupPage() {
  const [step, setStep] = useState<"role" | "details">("role");
  const [role, setRole] = useState<UserRole>("buyer");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, role },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (signupError) {
      setError(signupError.message);
    } else if (data.user) {
      // Insert profile with role
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email,
        full_name: name,
        role,
      });
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

  if (success) {
    return (
      <div style={{ minHeight: "100dvh", background: WS.cream, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <div style={{ fontFamily: WS.serif, fontSize: 28, fontWeight: 600 }}>You're in!</div>
          <div style={{ fontSize: 14, color: WS.ink2, marginTop: 8 }}>Check your email to confirm your account, then start pooling.</div>
          <div style={{ marginTop: 24 }}>
            <Btn tone="primary" size="lg" onClick={() => window.location.href = "/"}>Go to WeShare →</Btn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100dvh", background: WS.cream, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <Logo size={28} />
          <div style={{ fontFamily: WS.serif, fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 16 }}>
            {step === "role" ? "What brings you here?" : "Create your account"}
          </div>
        </div>

        {step === "role" ? (
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {roles.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: "#fff", border: `2px solid ${role === r.id ? WS.terra : WS.line}`, borderRadius: 16, cursor: "pointer", transition: "border-color 0.15s" }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: role === r.id ? WS.terraLt : WS.cream, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{r.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{r.label}</div>
                    <div style={{ fontSize: 12.5, color: WS.ink2, marginTop: 2 }}>{r.desc}</div>
                  </div>
                  {role === r.id && <Pill tone="terra" size="xs">Selected</Pill>}
                </div>
              ))}
            </div>
            <Btn tone="primary" size="lg" block onClick={() => setStep("details")}>Continue →</Btn>
            <div style={{ textAlign: "center", marginTop: 14, fontSize: 13, color: WS.ink2 }}>
              Already have an account? <a href="/auth/login" style={{ color: WS.terraDk, fontWeight: 600 }}>Sign in</a>
            </div>
          </div>
        ) : (
          <div style={{ background: "#fff", border: `1px solid ${WS.line}`, borderRadius: 20, padding: 28 }}>
            {error && (
              <div style={{ background: WS.rose, border: `1px solid ${WS.plum}`, borderRadius: 10, padding: "10px 14px", marginBottom: 18, fontSize: 13, color: WS.plum }}>
                {error}
              </div>
            )}
            <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontFamily: WS.mono, fontSize: 10.5, color: WS.mute, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>Full name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Adekunle" required style={inputStyle} />
              </div>
              <div>
                <label style={{ fontFamily: WS.mono, fontSize: 10.5, color: WS.mute, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required style={inputStyle} />
              </div>
              <div>
                <label style={{ fontFamily: WS.mono, fontSize: 10.5, color: WS.mute, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8+ characters" required minLength={8} style={inputStyle} />
              </div>
              <Btn tone="primary" size="lg" block type="submit" style={{ marginTop: 8 }} disabled={loading}>
                {loading ? "Creating account…" : "Create account"}
              </Btn>
            </form>
            <button onClick={() => setStep("role")} style={{ background: "none", border: "none", color: WS.ink2, fontSize: 13, marginTop: 14, cursor: "pointer", display: "block", margin: "14px auto 0" }}>← Back</button>
          </div>
        )}
      </div>
    </div>
  );
}
