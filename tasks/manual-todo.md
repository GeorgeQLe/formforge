# Manual Tasks — FormForge

> Updated: 2026-04-14
> Source of truth for Stripe config: `stripe-registry.yaml` in lexcorp-war-room

## Phase 7: Portfolio Billing Operating Model (LexCorp)

### Completed (code migration)
- [x] Migrated `STRIPE_PRO_PRICE_ID` env var to `formforge.pro.monthly` lookup key
- [x] Migrated `STRIPE_BUSINESS_PRICE_ID` env var to `formforge.business.monthly` lookup key
- [x] Added metadata contract to checkout sessions: `project`, `environment`, `entityType`, `entityId`, `plan`, `appUrl`, `priceLookupKey`
- [x] Added `metadata.project: "formforge"` to Customer creation
- [x] Standardized metadata key from `customerId` to `userId`

### Remaining — Stripe Dashboard
- [ ] Create "FormForge Pro" product in Stripe Dashboard
  - [ ] Add price with lookup key `formforge.pro.monthly` ($10.00/mo)
  - [ ] Add price with lookup key `formforge.pro.yearly` ($96.00/yr)
- [ ] Create "FormForge Business" product in Stripe Dashboard
  - [ ] Add price with lookup key `formforge.business.monthly` ($30.00/mo)
  - [ ] Add price with lookup key `formforge.business.yearly` ($288.00/yr)
- [ ] Configure webhook endpoint: `https://formforge.dev/api/webhooks/stripe`
  - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
  - Payload: snapshot, API version: `2025-03-31.basil`
- [ ] Pin Stripe API version to `2025-03-31.basil`
- [ ] Remove `STRIPE_PRO_PRICE_ID` and `STRIPE_BUSINESS_PRICE_ID` from env config (replaced by lookup keys)
