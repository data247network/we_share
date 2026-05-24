"use client";

import { useEffect, useState } from "react";
import { WS } from "@/components/brand/tokens";
import { Card, SectionTitle } from "@/components/brand";
import { Pill } from "@/components/brand/Pill";
import { Btn } from "@/components/brand/Btn";
import { FractionBadge } from "@/components/brand/FractionBadge";
import { Icons } from "@/components/brand/Icons";
import { createClient } from "@/lib/supabase/client";

const categories = [
  { value: "meat_poultry", label: "Meat & poultry" },
  { value: "drinks",       label: "Drinks" },
  { value: "pantry",       label: "Pantry" },
  { value: "produce",      label: "Produce" },
  { value: "frozen",       label: "Frozen" },
  { value: "other",        label: "Other" },
];

const splitOptions = [
  { n: 2, label: "HALVES" },
  { n: 3, label: "THIRDS" },
  { n: 4, label: "QUARTERS" },
  { n: 8, label: "EIGHTHS" },
];

interface Form {
  name: string;
  category: string;
  description: string;
  weightKg: string;
  wholesalePricePounds: string;
  retailPricePounds: string;
  imageUrl: string;
  portions: number;
  shipWhen: "full" | "half";
}

const blankForm: Form = {
  name: "", category: "meat_poultry", description: "",
  weightKg: "", wholesalePricePounds: "", retailPricePounds: "",
  imageUrl: "", portions: 4, shipWhen: "full",
};

export default function ShopListItem() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<Form>(blankForm);
  const [shopId, setShopId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase.from("shops").select("id").eq("owner_id", user.id).single();
      if (data) setShopId(data.id);
    });
  }, []);

  function set(k: keyof Form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));
  }

  const wholesalePence = Math.round(parseFloat(form.wholesalePricePounds || "0") * 100);
  const retailPence    = Math.round(parseFloat(form.retailPricePounds    || "0") * 100);
  const perPortionPence   = form.portions > 0 ? Math.round(wholesalePence / form.portions) : 0;
  const platformFeePence  = Math.round(perPortionPence * 0.08);
  const earningsPence     = perPortionPence - platformFeePence;

  async function handlePublish() {
    if (!shopId) { setError("No shop found for your account. Contact support."); return; }
    setSubmitting(true);
    setError(null);
    const supabase = createClient();
    try {
      const { data: item, error: itemErr } = await supabase
        .from("items")
        .insert({
          shop_id: shopId,
          name: form.name,
          description: form.description || null,
          category: form.category,
          image_urls: form.imageUrl ? [form.imageUrl] : [],
          wholesale_price_gbp: wholesalePence,
          retail_price_gbp: retailPence || null,
          case_weight_g: form.weightKg ? Math.round(parseFloat(form.weightKg) * 1000) : null,
          default_split: form.portions,
          min_fill_portions: form.shipWhen === "half" ? Math.ceil(form.portions / 2) : form.portions,
        })
        .select("id")
        .single();

      if (itemErr || !item) throw itemErr ?? new Error("Failed to create item");

      const poolRef = `WS-${Math.floor(Math.random() * 9000 + 1000)}`;
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      const { error: poolErr } = await supabase.from("pools").insert({
        pool_ref: poolRef,
        item_id: item.id,
        shop_id: shopId,
        total_portions: form.portions,
        filled_portions: 0,
        price_per_portion_gbp: perPortionPence,
        status: "open",
        expires_at: expiresAt,
      });

      if (poolErr) throw poolErr;
      setDone(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to publish listing.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 12px", borderRadius: 10,
    border: `1.5px solid ${WS.line}`, background: "#fff",
    fontFamily: WS.sans, fontSize: 14, color: WS.ink, outline: "none",
    boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: WS.mono, fontSize: 10.5, color: WS.mute,
    textTransform: "uppercase", letterSpacing: ".06em",
    display: "block", marginBottom: 5,
  };

  if (done) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: WS.cream, fontFamily: WS.sans, color: WS.ink, alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
        <div style={{ fontFamily: WS.serif, fontSize: 26, fontWeight: 600, marginBottom: 8 }}>Pool published!</div>
        <div style={{ fontSize: 14, color: WS.ink2, marginBottom: 28 }}>Your listing is live. Buyers can now join the pool.</div>
        <Btn tone="primary" size="lg" onClick={() => window.location.href = "/shop/m/pools"}>View my pools →</Btn>
        <Btn tone="ghost" size="lg" style={{ marginTop: 10 }}
          onClick={() => { setDone(false); setStep(1); setForm(blankForm); }}>
          List another item
        </Btn>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: WS.cream, color: WS.ink, fontFamily: WS.sans, overflow: "hidden" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 16px" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0" }}>
          <button
            onClick={() => step > 1 ? setStep(s => s - 1) : window.location.href = "/shop/dashboard"}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}>
            {Icons.back(WS.ink, 20)}
          </button>
          <div style={{ fontFamily: WS.serif, fontSize: 18, fontWeight: 600 }}>New item</div>
          <span style={{ fontFamily: WS.mono, fontSize: 13, fontWeight: 600, color: WS.mute }}>{step} / 3</span>
        </div>

        {/* ── STEP 1: Item details ── */}
        {step === 1 && (
          <>
            <div style={{ fontFamily: WS.serif, fontSize: 22, fontWeight: 600, letterSpacing: "-0.015em", lineHeight: 1.15, marginBottom: 4 }}>
              What are you<br /><span style={{ color: WS.terra, fontStyle: "italic" }}>listing?</span>
            </div>
            <div style={{ fontSize: 13, color: WS.ink2, marginBottom: 18 }}>Tell buyers what's in the case.</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={labelStyle}>Item name *</label>
                <input value={form.name} onChange={set("name")} placeholder="e.g. Premium Ribeye, 4 kg case" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Category *</label>
                <select value={form.category} onChange={set("category")} style={inputStyle}>
                  {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Description</label>
                <textarea value={form.description} onChange={set("description")}
                  placeholder="Cut, grade, origin, any details buyers should know…" rows={3}
                  style={{ ...inputStyle, resize: "none" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={labelStyle}>Case weight (kg)</label>
                  <input type="number" value={form.weightKg} onChange={set("weightKg")} placeholder="4.0" min="0" step="0.1" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Wholesale price (£) *</label>
                  <input type="number" value={form.wholesalePricePounds} onChange={set("wholesalePricePounds")} placeholder="120.00" min="0" step="0.01" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Retail price (£) — for savings display</label>
                <input type="number" value={form.retailPricePounds} onChange={set("retailPricePounds")} placeholder="180.00" min="0" step="0.01" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Image URL (optional)</label>
                <input value={form.imageUrl} onChange={set("imageUrl")} placeholder="https://…" style={inputStyle} />
              </div>
            </div>
          </>
        )}

        {/* ── STEP 2: Split & pricing ── */}
        {step === 2 && (
          <>
            <div style={{ fontFamily: WS.serif, fontSize: 22, fontWeight: 600, letterSpacing: "-0.015em", lineHeight: 1.15, marginBottom: 4 }}>
              How should this be<br /><span style={{ color: WS.terra, fontStyle: "italic" }}>shared?</span>
            </div>
            <div style={{ fontSize: 13, color: WS.ink2, marginBottom: 18 }}>Buyers will claim portions until full, then we ship.</div>

            <Card style={{ marginBottom: 16, padding: "18px 14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "6px 0 12px" }}>
                <FractionBadge filled={form.portions} total={form.portions} size={140} label={false} />
              </div>
              <div style={{ fontFamily: WS.serif, fontSize: 18, fontWeight: 600, textAlign: "center" }}>
                Split into {form.portions} portions
              </div>
              <div style={{ textAlign: "center", fontSize: 12.5, color: WS.ink2, marginTop: 2 }}>
                {form.weightKg ? `~${(parseFloat(form.weightKg) / form.portions).toFixed(1)} kg per share · ` : ""}
                {perPortionPence > 0 ? `£${(perPortionPence / 100).toFixed(2)} each` : "Set wholesale price in step 1"}
              </div>
            </Card>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 18 }}>
              {splitOptions.map(o => {
                const active = o.n === form.portions;
                return (
                  <div key={o.n} onClick={() => setForm(f => ({ ...f, portions: o.n }))}
                    style={{ padding: "12px 6px", borderRadius: 12, border: `1.5px solid ${active ? WS.terra : WS.line}`, background: active ? WS.terraLt : "#fff", textAlign: "center", cursor: "pointer" }}>
                    <div style={{ margin: "0 auto", width: 36, height: 36 }}>
                      <FractionBadge filled={o.n} total={o.n} size={36} ring={false} label={false} />
                    </div>
                    <div style={{ fontFamily: WS.serif, fontSize: 15, fontWeight: 600, marginTop: 6, color: active ? WS.terraDk : WS.ink }}>{o.n}</div>
                    <div style={{ fontFamily: WS.mono, fontSize: 9.5, color: WS.mute, textTransform: "uppercase" }}>{o.label}</div>
                  </div>
                );
              })}
            </div>

            <SectionTitle>Pricing breakdown</SectionTitle>
            <Card style={{ marginBottom: 14 }}>
              {([
                ["Wholesale (full case)", `£${(wholesalePence / 100).toFixed(2)}`],
                ["Per portion (auto)",    `£${(perPortionPence  / 100).toFixed(2)}`],
                ["Platform fee (8%)",     `−£${(platformFeePence / 100).toFixed(2)}`],
                ["You earn / portion",    `£${(earningsPence    / 100).toFixed(2)}`, true],
              ] as [string, string, boolean?][]).map(([k, v, bold], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13.5, borderTop: i > 0 ? `1px solid ${WS.line2}` : "none" }}>
                  <span style={{ color: WS.ink2 }}>{k}</span>
                  <span style={{ color: WS.ink, fontWeight: bold ? 700 : 600, fontFamily: bold ? WS.serif : WS.sans, fontSize: bold ? 16 : 13.5 }}>{v}</span>
                </div>
              ))}
            </Card>

            <SectionTitle>Ship when</SectionTitle>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              {(["full", "half"] as const).map(opt => {
                const active = form.shipWhen === opt;
                return (
                  <div key={opt} onClick={() => setForm(f => ({ ...f, shipWhen: opt }))}
                    style={{ flex: 1, padding: 12, borderRadius: 12, border: `1.5px solid ${active ? WS.terra : WS.line}`, background: active ? WS.terraLt : "#fff", textAlign: "center", cursor: "pointer" }}>
                    <div style={{ fontFamily: WS.serif, fontWeight: 700, fontSize: 15, color: active ? WS.terraDk : WS.ink }}>
                      {opt === "full" ? `${form.portions} / ${form.portions}` : `${Math.ceil(form.portions / 2)} / ${form.portions} min`}
                    </div>
                    <div style={{ fontSize: 11, color: active ? WS.terraDk : WS.ink2 }}>
                      {opt === "full" ? "Pool fully claimed" : "Half-full minimum"}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── STEP 3: Review ── */}
        {step === 3 && (
          <>
            <div style={{ fontFamily: WS.serif, fontSize: 22, fontWeight: 600, letterSpacing: "-0.015em", lineHeight: 1.15, marginBottom: 4 }}>
              Review your<br /><span style={{ color: WS.terra, fontStyle: "italic" }}>listing</span>
            </div>
            <div style={{ fontSize: 13, color: WS.ink2, marginBottom: 18 }}>Once published, buyers can start joining.</div>

            {form.imageUrl && (
              <div style={{ marginBottom: 14, borderRadius: 14, overflow: "hidden", height: 160 }}>
                <img src={form.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}

            <Card style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: WS.serif, fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{form.name}</div>
              {form.description && <div style={{ fontSize: 12.5, color: WS.ink2, marginBottom: 10 }}>{form.description}</div>}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <Pill tone="line" size="xs">{categories.find(c => c.value === form.category)?.label}</Pill>
                {form.weightKg && <Pill tone="line" size="xs">{form.weightKg} kg case</Pill>}
                <Pill tone="terra" size="xs">{form.portions} portions</Pill>
              </div>
            </Card>

            <Card style={{ marginBottom: 12 }}>
              {([
                ["Per portion price",  `£${(perPortionPence / 100).toFixed(2)}`],
                ["You earn / portion", `£${(earningsPence   / 100).toFixed(2)}`],
                ["Ship when", form.shipWhen === "full" ? "Pool fully claimed" : `${Math.ceil(form.portions / 2)} / ${form.portions} minimum`],
                ["Expires", "7 days from now"],
              ] as [string, string][]).map(([k, v], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13.5, borderTop: i > 0 ? `1px solid ${WS.line2}` : "none" }}>
                  <span style={{ color: WS.ink2 }}>{k}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </Card>

            {error && (
              <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#DC2626" }}>
                {error}
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom bar */}
      <div style={{ padding: "12px 16px 22px", background: "rgba(251,245,236,0.95)", backdropFilter: "blur(20px)", borderTop: `1px solid ${WS.line}`, display: "flex", gap: 8, flexShrink: 0 }}>
        <Btn tone="ghost" size="lg" style={{ flex: 1 }}
          onClick={() => step > 1 ? setStep(s => s - 1) : window.location.href = "/shop/dashboard"}>
          Back
        </Btn>
        {step < 3 ? (
          <Btn tone="primary" size="lg" style={{ flex: 2 }}
            disabled={step === 1 && (!form.name.trim() || !form.wholesalePricePounds)}
            onClick={() => setStep(s => s + 1)}>
            Continue →
          </Btn>
        ) : (
          <Btn tone="primary" size="lg" style={{ flex: 2 }} disabled={submitting} onClick={handlePublish}>
            {submitting ? "Publishing…" : "Publish pool →"}
          </Btn>
        )}
      </div>
    </div>
  );
}
