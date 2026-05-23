import Stripe from "stripe";

export const PLATFORM_FEE_PERCENT = 8;
export const DELIVERY_FEE_PENCE = 250; // £2.50 total, split among members

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-04-22.dahlia",
      typescript: true,
    });
  }
  return _stripe;
}

// Convenience export — use getStripe() in API routes to avoid build-time init
export const stripe = {
  get paymentIntents() { return getStripe().paymentIntents; },
  get customers() { return getStripe().customers; },
  get webhooks() { return getStripe().webhooks; },
};

export function calcServiceFee(subtotalPence: number): number {
  return Math.round(subtotalPence * (PLATFORM_FEE_PERCENT / 100));
}

export function calcDeliveryShare(
  _totalMembers: number,
  buyerPortions: number,
  totalPortions: number
): number {
  const buyerShare = buyerPortions / totalPortions;
  return Math.round(DELIVERY_FEE_PENCE * buyerShare);
}

export async function createPoolPaymentIntent({
  amountPence,
  currency = "gbp",
  poolRef,
  buyerEmail,
  customerId,
}: {
  amountPence: number;
  currency?: string;
  poolRef: string;
  buyerEmail: string;
  customerId?: string;
}) {
  return getStripe().paymentIntents.create({
    amount: amountPence,
    currency,
    capture_method: "manual",
    customer: customerId,
    receipt_email: buyerEmail,
    metadata: { pool_ref: poolRef },
    automatic_payment_methods: { enabled: true },
  });
}

export async function capturePayment(paymentIntentId: string) {
  return getStripe().paymentIntents.capture(paymentIntentId);
}

export async function cancelPayment(paymentIntentId: string) {
  return getStripe().paymentIntents.cancel(paymentIntentId);
}

export async function getOrCreateCustomer(email: string, name?: string): Promise<string> {
  const s = getStripe();
  const existing = await s.customers.list({ email, limit: 1 });
  if (existing.data.length > 0) return existing.data[0].id;
  const customer = await s.customers.create({ email, name });
  return customer.id;
}
