# WeShare — Deployment Guide

## 1  Apply the database schema

Open the Supabase SQL editor at:
https://supabase.com/dashboard/project/rhfjqyweprtebkgfqvgk/sql/new

Paste and run the contents of `supabase/schema.sql`.

Or from a terminal on your machine:
```bash
PGPASSWORD='Joeweshare#$' psql \
  -h db.rhfjqyweprtebkgfqvgk.supabase.co \
  -p 5432 -U postgres -d postgres \
  -f supabase/schema.sql
```

## 2  Install dependencies

```bash
cd weshare
npm install
```

## 3  Add missing credentials to .env.local

The following keys still need real values — add them from your Stripe dashboard:
```
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

And add R2 keys once you create an R2 bucket in Cloudflare:
```
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
```

## 4  Deploy to Cloudflare Pages

```bash
export CLOUDFLARE_API_TOKEN=<your-cloudflare-api-token>
export CLOUDFLARE_ACCOUNT_ID=750e554e470d5bd33f195e572bbd81ae

npm run build
npx wrangler pages deploy .next --project-name weshare
```

If the project doesn't exist yet, create it first:
```bash
npx wrangler pages project create weshare
```

## 5  Set environment variables in Cloudflare Pages

Go to:
https://dash.cloudflare.com/750e554e470d5bd33f195e572bbd81ae/pages/view/weshare/settings/environment-variables

Add every key from `.env.local`.

## 6  Set Stripe webhook endpoint

In Stripe dashboard → Webhooks, add:
```
https://weshare.pages.dev/api/webhooks/stripe
```
Events to listen for:
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `payment_intent.canceled`

Copy the signing secret and set `STRIPE_WEBHOOK_SECRET` in Cloudflare.

## 7  Verify

```bash
npx wrangler pages deployment list --project-name weshare
```
