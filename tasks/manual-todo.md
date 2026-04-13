# Manual Todo — FormForge

> Context: LexCorp Phase 7 — Portfolio Billing Operating Model

## Stripe Migration (Phase 7.7)

- [ ] Migrate `STRIPE_PRO_PRICE_ID` env var to `formforge.pro.monthly` lookup key
- [ ] Migrate `STRIPE_BUSINESS_PRICE_ID` env var to `formforge.business.monthly` lookup key
- [ ] Add metadata contract to checkout sessions: `project`, `environment`, `entityType`, `entityId`, `appUrl`, `priceLookupKey`
- [ ] Add `metadata.project: "formforge"` to Customer creation
- [ ] Standardize metadata key from `customerId` to `userId`

## Stripe Dashboard

- [ ] Create products with namespaced lookup keys per registry
- [ ] Configure webhook endpoint restricted to required events
