import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  const { stripe } = await import("@/lib/stripe");
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return Response.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook signature verification failed";
    return Response.json({ error: message }, { status: 400 });
  }

  const supabase = await createAdminClient();

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;

      // Capture the manually-held payment
      try {
        await stripe.paymentIntents.capture(paymentIntent.id);
      } catch {
        // Already captured or not capturable — ignore
      }

      // Update pool_member payment status
      await supabase
        .from("pool_members")
        .update({ payment_status: "captured" })
        .eq("stripe_payment_intent_id", paymentIntent.id);

      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;

      // Mark member payment as failed
      const { data: member } = await supabase
        .from("pool_members")
        .update({ payment_status: "failed" })
        .eq("stripe_payment_intent_id", paymentIntent.id)
        .select("id, pool_id, portions")
        .single();

      // Roll back filled_portions on the pool
      if (member) {
        const { data: pool } = await supabase
          .from("pools")
          .select("filled_portions")
          .eq("id", member.pool_id)
          .single();

        if (pool) {
          await supabase
            .from("pools")
            .update({ filled_portions: Math.max(0, pool.filled_portions - member.portions) })
            .eq("id", member.pool_id);
        }
      }

      break;
    }

    case "payment_intent.canceled": {
      const paymentIntent = event.data.object;

      await supabase
        .from("pool_members")
        .update({ payment_status: "refunded" })
        .eq("stripe_payment_intent_id", paymentIntent.id);

      break;
    }

    default:
      // Unhandled event type — return 200 so Stripe doesn't retry
      break;
  }

  return Response.json({ received: true });
}
