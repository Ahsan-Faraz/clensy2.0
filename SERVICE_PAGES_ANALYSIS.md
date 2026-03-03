# Service Pages: Clensy-3-data vs Clensy2.0 – Deep Analysis & Solution

> **Implementation status:** Implemented with 8 templates, section components, and transformers. All 13 services route to the correct template. See `components/service-templates/`, `components/service-sections/`, and `lib/service-transformers/`.

## Executive Summary

| Category | Services | Clensy-3-data Approach | Clensy2.0 Current | Gap |
|----------|----------|-------------------------|-------------------|-----|
| **Standard** | Routine, Deep, Moving, Post-Construction, Airbnb, Office, Gym, Medical, Retail, School, Property | Single shared template with conditional sections | Same – `ServiceDetailContent` | Minor: some customData sections need wiring |
| **Extras** | extras | **Dedicated page** – unique layout with pricing cards | Uses standard template | **Major** – missing pricing, interactive extras selector |
| **Other Commercial** | other-commercial | **Dedicated page** – unique layout with pricing plans | Uses standard template | **Major** – missing pricing plans section |

---

## Section-by-Section Comparison (Clensy-3-data)

| Section | Routine | Deep | Moving | Post-Con | Airbnb | Commercial (6) | Extras | Other Com |
|---------|---------|------|--------|----------|--------|----------------|--------|-----------|
| Hero | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Trust Indicators** | ✓ hardcoded | ❌ | ❌ | ❌ | ❌ | ✓ from data | ✓ from data | ✓ from data |
| What's Included | ✓ 3 areas | ✓ 3 | ✓ 3 | ✓ 3 | ✓ 3 | ✓ 3 areas | — | ✓ 3 areas |
| Feature Section | ✓ | — | — | — | — | — | — | — |
| How It Works | ✓ 3 steps | — | — | — | — | — | ✓ How To Add | — |
| **4-step Process** | — | — | — | ✓ step1–4 | — | — | — | — |
| Benefits / Why Choose | ✓ 3 | — | ✓ 3 | — | ✓ 3 | ✓ feature1–3 | — | ✓ feature1–3 |
| Before & After | — | ✓ | ✓ | ✓ | ✓ | — | — | — |
| **When to Choose** | — | ✓ 3 cards | — | — | — | — | — | — |
| **Comparison** (Reg vs Deep) | — | ✓ | — | — | — | — | — | — |
| **Reduce Moving Stress** | — | — | ✓ hardcoded | — | — | — | — | — |
| **Safety Standards** | — | — | — | ✓ PPE + Hazmat | — | — | — | — |
| Testimonials | ✓ from data | ✓ from data | hardcoded | hardcoded | — | — | — | — |
| **Frequency Guide** | ✓ weekly/bi/mo | — | — | — | — | — | — | — |
| **Success Stories** | — | — | — | — | hardcoded* | — | — | — |
| **Service Features** | — | — | — | — | in CMS, not rendered* | — | — | — |
| **Premium Extra Services** | — | — | — | — | — | — | ✓ interactive | — |
| **Extras Pricing** | — | — | — | — | — | — | ✓ price cards | — |
| **Pricing Plans** | — | — | — | — | — | — | — | ✓ plans + CTA |
| FAQ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| CTA | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

*Airbnb: `successStories` and `serviceFeatures` exist in CMS but page uses hardcoded content / does not render them.

---

## 1. Standard Services (11 services)

### Shared sections (all)
- Hero
- Trust Stats (hardcoded or from data)
- Included / Cleaning Areas (`cleaningAreas[]`)
- Feature Section
- How It Works (step1/2/3)
- Benefits (3 benefits)
- FAQ
- CTA

### Service-specific sections

| Service | Unique Section | Data Source | Clensy2.0 Support |
|---------|----------------|-------------|-------------------|
| **Routine** | Frequency Guide (Weekly/Bi-Weekly/Monthly) | `frequencyOptions[]` | ✅ Yes |
| **Routine** | Trust Indicators | Hardcoded (12K+, 24/7, 4.9, 100%) | ✅ Uses fallback; no CMS |
| **Deep** | Testimonials | `clientReviews[]` | ✅ Yes |
| **Deep** | When to Choose (Moving/Seasonal/Special Occasions) | `movingTitle`, `seasonalTitle`, `specialOccasionsTitle` etc. | ❌ **Not rendered** |
| **Deep** | Comparison (Regular vs Deep) | `comparisonHeading`, `regularCleaning`, `deepCleaning` | ❌ **Not rendered** |
| **Deep** | Before & After (differenceHeading) | `deepCleaningDifference[]` | ✅ Yes (as beforeAfter) |
| **Deep** | Trust Indicators | ❌ None in Clensy-3-data | — |
| **Moving** | Reduce Moving Stress | **Hardcoded** (not from CMS) | ❌ Unique section – needs adding |
| **Moving** | Testimonials | **Hardcoded** (2 cards) | Uses hardcoded; no clientTestimonials |
| **Post-Construction** | 4-step Process | `step1Title`–`step4Title`, `processHeading` | ❌ **4 steps** – template has 3 |
| **Post-Construction** | Safety Standards (PPE + Hazmat) | `safetyHeading`, `ppeTitle`, `hazmatTitle`, etc. | ❌ **Not rendered** |
| **Post-Construction** | Testimonials | **Hardcoded** (3 cards) | Uses hardcoded |
| **Airbnb** | Service Features (4 cards) | `serviceFeatures[]` in CMS | ❌ **Not rendered** in Clensy-3-data |
| **Airbnb** | Success Stories | `successStories[]` in CMS | ❌ **Hardcoded** – not using data |
| **Airbnb** | Before/After | `airBNBCleaningDifference[]` | ✅ Yes |
| **Office, Gym, Medical, Retail, School, Property** | Trust Indicators | `trustIndicator1Number`–`4Text` | ✅ From data |

---

## 2. EXTRAS – Completely Different Page

### Clensy-3-data structure
- **Route:** `/services/extras`
- **API:** `/api/cms/extras-service`
- **Page:** Dedicated `app/services/extras/page.tsx` (not shared template)

### Sections (in order)
1. **Hero** – standard
2. **Trust Indicators** – 4 stats (8+ Extra Services, 100% Customizable, 5.0 Rating, 1000+ Completed)
3. **Premium Extra Services** – **Interactive selector**: 8 extras as cards, user clicks to see details. Each has: id, name, description, image, icon, features
4. **How To Add Extra Services** – 3 steps (Browse → Select → Confirm)
5. **Extras Pricing** – **Price cards**: Window $5/window, Fridge $35/service, Oven $35, etc.
6. **FAQ**

### Extras data structure (Clensy-3-data)
```json
{
  "premiumExtraServices": [
    { "id": "windows", "name": "Window Cleaning", "description": "...", "price": "$5", "priceUnit": "per window" },
    { "id": "fridge", "name": "Refrigerator Cleaning", "price": "$35", "priceUnit": "per service" },
    ...
  ]
}
```

### Clensy2.0 current
- Uses **same Service template** as all others
- Renders: Hero, Cleaning Areas (3: Window, Refrigerator, Oven), How It Works, FAQ, CTA
- **Missing:** Trust indicators as 4 stats, interactive extras selector, **pricing section**

---

## 3. OTHER COMMERCIAL – Completely Different Page

### Clensy-3-data structure
- **Route:** `/services/other-commercial`
- **API:** `/api/cms/other-commercial-cleaning`
- **Page:** Dedicated `app/services/other-commercial/page.tsx`

### Sections (in order)
1. **Hero**
2. **Trust Indicators** – 4 stats (600+ Commercial Clients, 24/7 Support, etc.)
3. **What's Included** – 3 areas: Restaurants, Warehouses, Places of Worship (can map to cleaningAreas)
4. **Why Choose Us** – 3 features (Industry Expertise, Custom Scheduling, Value-Focused)
5. **Tailored Cleaning Plans & Pricing** – **Pricing plans** with plan cards (e.g. "Basic Plan", "Standard", "Premium") + CTA buttons
6. **FAQ**

### Other Commercial data structure
```json
{
  "cleaningAreas": [ /* Restaurants, Warehouses, Worship – OK as is */ ],
  "pricingPlans": [
    { "planName": "...", "planPrice": "...", "planFeatures": [], "planButtonText": "...", "isPopular": true }
  ],
  "pricingCustomSectionHeading": "...",
  "pricingCustomButton1Text": "Get a Custom Quote",
  ...
}
```

### Clensy2.0 current
- Uses shared template
- cleaningAreas maps OK (Restaurants, Warehouses, Worship)
- **Missing:** Trust indicators as 4 stats, **pricing plans section** with plan cards and CTAs

---

## 4. Solution Options

### Option A: Extend single template (recommended for standard services)
- Add rendering for:
  - `customData.whenToChoose` (Deep Cleaning)
  - `customData.comparison` (Deep Cleaning)
  - `customData.trustIndicators` (commercial services)
- Add `premiumExtraServices` and `pricingPlans` support **inside** `ServiceDetailContent` with `serviceType` checks
- **Pros:** One template, Strapi stays simple
- **Cons:** `service-detail-content.tsx` gets more conditional logic

### Option B: Dedicated pages for Extras & Other Commercial (match Clensy-3-data exactly)
- Create `app/services/extras/page.tsx` and `app/services/other-commercial/page.tsx` (override `[slug]`)
- Use route priority: Next.js picks `/services/extras/page` over `/services/[slug]/page`
- Strapi: Add `extras` and `other-commercial` content types OR use `customData` + `serviceType` to branch
- **Pros:** Exact match to Clensy-3-data
- **Cons:** Two extra page components, separate API or data branching

### Option C: Hybrid
- **Standard services (11):** Keep single template, add missing customData sections
- **Extras:** Dedicated page when `slug === 'extras'`
- **Other Commercial:** Dedicated page when `slug === 'other-commercial'`

---

## 5. Recommended Approach

### Phase 1: Fix standard services (low effort)
1. **Deep:** Add `whenToChoose` and `comparison` section render
2. **Post-Construction:** Add 4-step Process (step1–step4) and Safety Standards (PPE + Hazmat)
3. **Moving:** Add "Reduce Moving Stress" section (or move to CMS)
4. **Airbnb:** Wire `serviceFeatures` and `successStories` from CMS (Clensy-3-data currently hardcodes)
5. **Trust Indicators:** Use `trustIndicator1–4` or `customData.trustIndicators` where available
6. Seed Strapi with full data from Clensy-3-data JSON files

### Phase 2: Extras (medium effort)
**Option 2a – Extend template:**
- In `ServiceDetailContent`, when `serviceType === 'extras'`:
  - Render trust indicators from `customData.trustIndicators`
  - Render **Premium Extra Services** interactive section from `customData.premiumExtraServices`
  - Render **Extras Pricing** from same data (price, priceUnit per extra)
- Strapi: Ensure `customData` has `premiumExtraServices` and `trustIndicators`

**Option 2b – Dedicated page:**
- Create `app/services/extras/page.tsx` (static route)
- Create `/api/cms/extras` or fetch from Strapi service slug=extras with full customData
- Copy layout from Clensy-3-data extras page

### Phase 3: Other Commercial (medium effort)
**Option 3a – Extend template:**
- When `serviceType === 'other-commercial'`:
  - Render trust indicators from `customData.trustIndicators`
  - Render **Pricing Plans** from `customData.pricingPlans`
- Strapi: Add `customData.pricingPlans` to schema (or keep in `customData` JSON)

**Option 3b – Dedicated page:**
- Create `app/services/other-commercial/page.tsx`
- Same as Extras approach

---

## 6. Data to Add to Strapi `customData`

### Extras
```json
{
  "trustIndicators": [{"number": "8+", "text": "Extra Services"}, ...],
  "premiumExtraServices": [
    {"id": "windows", "name": "Window Cleaning", "description": "...", "price": "$5", "priceUnit": "per window"},
    ...
  ]
}
```

### Other Commercial
```json
{
  "trustIndicators": [{"number": "600+", "text": "Commercial Clients"}, ...],
  "pricingPlans": [
    {"planName": "Basic", "planPrice": "Call", "planFeatures": [...], "planButtonText": "Get Quote", "isPopular": false}
  ]
}
```

### Deep Cleaning
```json
{
  "whenToChoose": {"heading": "...", "options": [...]},
  "comparison": {"heading": "...", "regularCleaning": {...}, "deepCleaning": {...}}
}
```

---

## 7. Summary Table

| Service | Unique Sections | Data Location | Action |
|---------|-----------------|---------------|--------|
| Routine | Frequency Guide, Trust (hardcoded) | `frequencyOptions` | ✅ Ensure seeded |
| Deep | When to Choose, Comparison, Before/After | Flat + customData | Add whenToChoose + comparison |
| Moving | **Reduce Moving Stress** | Hardcoded | Add section or move to CMS |
| Post-Construction | **4-step Process**, **Safety Standards** | `step1-4`, `ppeTitle`, `hazmatTitle` | Add 4-step + Safety Standards |
| Airbnb | Service Features, Success Stories | `serviceFeatures`, `successStories` | Clensy-3-data: **not using** – fix or add |
| Office, Gym, Medical, Retail, School, Property | Trust Indicators (from data) | `trustIndicator1-4` | ✅ From data; ensure in adapter |
| **Extras** | Premium Extra Services, How To Add, **Extras Pricing** | `premiumExtraServices`, `extrasPricing` | Add extras layout |
| **Other Commercial** | **Pricing Plans** | `pricingPlans` | Add pricing plans section |

---

## 8. All Unique Sections (Complete List)

Every section that appears on at least one service page in Clensy-3-data:

| Section | Services Using It | Notes |
|---------|-------------------|-------|
| Hero | All 13 | |
| Trust Indicators | Routine (hardcoded), Office/Gym/Medical/Retail/School/Property, Extras, Other Commercial | Routine/Deep/Moving/Post-Con/Airbnb: no trust section OR hardcoded |
| What's Included / Cleaning Areas | All except Extras | 3 areas each, different names |
| Feature Section | Routine only | "Exceptional Cleaning Results, Every Time" |
| How It Works (3 steps) | Routine only | |
| **4-step Process** | Post-Construction only | step1–step4 |
| How To Add Extra Services | Extras only | Different from standard How It Works |
| Benefits / Why Choose | Routine, Moving, Airbnb, Post-Con (as "Process"), Commercial, Other Commercial | 3 cards each |
| Before & After | Deep, Moving, Post-Construction, Airbnb | |
| **When to Choose** | Deep only | 3 cards: Moving, Seasonal, Special Occasions |
| **Comparison** (Regular vs Deep) | Deep only | Side-by-side columns |
| **Reduce Moving Stress** | Moving only | Image + 3 bullet points, hardcoded |
| **Safety Standards** | Post-Construction only | PPE + Hazmat cards |
| Testimonials | Routine, Deep, Moving, Post-Construction | Routine/Deep from CMS; Moving/Post-Con hardcoded |
| **Frequency Guide** | Routine only | Weekly/Bi-Weekly/Monthly |
| **Success Stories** | Airbnb only | In CMS but page uses hardcoded content |
| **Service Features** | Airbnb only | In CMS but **not rendered** |
| **Premium Extra Services** | Extras only | Interactive selector |
| **Extras Pricing** | Extras only | Price cards |
| **Pricing Plans** | Other Commercial only | Plan cards + CTA |
| FAQ | All 13 | |
| CTA | All 13 | |
