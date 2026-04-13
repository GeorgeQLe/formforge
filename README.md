# FormForge — Form Builder Platform

FormForge is a drag-and-drop form builder with analytics, conditional logic, and Stripe-powered subscription billing.

## Billing Model

| Tier | Lookup Key (target) |
|------|-------------|
| **Free** | — |
| **Pro** | `formforge.pro.monthly` |
| **Business** | `formforge.business.monthly` |

### Entity Model
- **Billing attaches to: User**
- `stripeCustomerId`, `stripeSubscriptionId` on users table
- Plan tier (free/pro/business) on user record
- `planFromPriceId()` maps price IDs to plan names in webhook handler

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router), TypeScript |
| Database | PostgreSQL (Neon), Drizzle ORM |
| Billing | Stripe (checkout, webhooks, billing portal) |

## Stripe Integration

- **Webhook endpoint:** `/api/webhooks/stripe`
- **Events:** `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- **Env vars:** `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_PRO_PRICE_ID`, `STRIPE_BUSINESS_PRICE_ID`

## Migration Status (LexCorp Phase 7)
- [ ] Migrate env var price IDs with fallback defaults to lookup keys
- [ ] Add registry-required metadata: `project`, `environment`, `entityType`, `appUrl`, `priceLookupKey`
- [ ] Standardize `customerId` metadata key to `userId`

## Development

```bash
npm install
cp .env.example .env.local
npm run db:push
npm run dev
```
