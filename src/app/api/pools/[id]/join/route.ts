import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  createPoolPaymentIntent,
  getOrCreateCustomer,
  calcServiceFee,
  calcDeliveryShare,
} from "@/lib/stripe";

export const runtime = 'edge';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { portions, delivery_address, delivery_lat, delivery_lng } = body;

  if (!portions || !delivery_address) {
    return Response.json({ error: "Missing required fields: portions, delivery_address" }, { status: 400 });
  }

  // Fetch the pool
  const { data: pool, error: poolError } = await supabase
    .from("pools")
    .select("*, item:items(*)")
    .eq("id", id)
    .single();

  if (poolError || !pool) {
    return Response.json({ error: "Pool not found" }, { status: 404 });
  }

  if (pool.status !== "open") {
    return Response.json({ error: "Pool is not open for joining" }, { status: 409 });
  }

  const spotsRemaining = pool.total_portions - pool.filled_portions;
  if (portions > spotsRemaining) {
    return Response.json({ error: `Only ${spotsRemaining} portions remaining` }, { status: 409 });
  }

  // Check buyer hasn't already joined
  const { data: existingMember } = await supabase
    .from("pool_members")
    .select("id")
    .eq("pool_id", id)
    .eq("buyer_id", user.id)
    .single();

  if (existingMember) {
    return Response.json({ error: "You have already joined this pool" }, { status: 409 });
  }

  // Fetch buyer profile for email
  const { data: profile } = await supabase
    .from("profiles")
    .select("email, full_name")
    .eq("id", user.id)
    .single();

  const buyerEmail = profile?.email ?? user.email ?? "";

  // Calculate pricing (price_per_portion_gbp is already in pence per schema)
  const pricePencePerPortion = pool.price_per_portion_gbp;
  const subtotalPence = pricePencePerPortion * portions;
  const servicePence = calcServiceFee(subtotalPence);
  const deliveryPence = calcDeliveryShare(pool.total_portions, portions, pool.total_portions);
  const totalPence = Math.round(subtotalPence + servicePence + deliveryPence);

  // Get or create Stripe customer
  const customerId = await getOrCreateCustomer(buyerEmail, profile?.full_name ?? undefined);

  // Create PaymentIntent with manual capture (held until pool fills)
  const paymentIntent = await createPoolPaymentIntent({
    amountPence: totalPence,
    poolRef: pool.pool_ref,
    buyerEmail,
    customerId,
  });

  // Generate verification code
  const verification_code = String(Math.floor(1000 + Math.random() * 9000));

  // Create pool member record
  const { data: member, error: memberError } = await supabase
    .from("pool_members")
    .insert({
      pool_id: id,
      buyer_id: user.id,
      portions,
      price_paid_gbp: totalPence,
      delivery_address,
      delivery_lat: delivery_lat ?? null,
      delivery_lng: delivery_lng ?? null,
      stripe_payment_intent_id: paymentIntent.id,
      payment_status: "pending",
      verification_code,
    })
    .select()
    .single();

  if (memberError) {
    // Cancel the payment intent to avoid orphaned charges
    await import("@/lib/stripe").then(({ stripe }) =>
      stripe.paymentIntents.cancel(paymentIntent.id).catch(() => {})
    );
    return Response.json({ error: memberError.message }, { status: 500 });
  }

  // Update filled_portions
  await supabase
    .from("pools")
    .update({ filled_portions: pool.filled_portions + portions })
    .eq("id", id);

  return Response.json({
    member_id: member.id,
    client_secret: paymentIntent.client_secret,
    amount_pence: totalPence,
    breakdown: {
      subtotal_pence: subtotalPence,
      service_fee_pence: servicePence,
      delivery_fee_pence: deliveryPence,
    },
  }, { status: 201 });
}
