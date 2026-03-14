

## Plan: Add Recyclable Product Field and Eco-Friendly Seller Badges

### 1. Database Migration
Add `is_recyclable` boolean column to the `products` table (default `false`).

```sql
ALTER TABLE public.products ADD COLUMN is_recyclable boolean NOT NULL DEFAULT false;
```

### 2. Product Form (`src/pages/seller/ProductForm.tsx`)
- Add `isRecyclable` to the form state (default `false`)
- Add a Switch/Checkbox toggle in the form UI asking "Is this product recyclable?"
- Include `is_recyclable` in the product insert/update data
- On edit, load the existing value

### 3. Seller Profile Page (`src/pages/SellerProfile.tsx`)
- After fetching products, calculate the recyclable percentage: `recyclableCount / totalProducts * 100`
- Display the appropriate eco-friendly badge next to the seller name:
  - **>=75%**: Green badge with `Leaf` icon — "Tier 1 Eco-Friendly"
  - **50-74%**: Yellow badge with `RefreshCw` icon — "Tier 2 Eco-Friendly"
  - **<50%**: Gray badge with `RefreshCw` icon — "Tier 3 Eco-Friendly"
- Only show badge if seller has at least 1 product

### 4. Translations (`src/i18n/translations.ts`)
Add keys: `isRecyclable`, `tier1EcoFriendly`, `tier2EcoFriendly`, `tier3EcoFriendly` in English and Arabic.

### Technical Notes
- The `is_recyclable` field uses the products table which already has proper RLS policies for sellers to insert/update their own products.
- The eco badge is computed client-side from the already-fetched products list — no extra queries needed.
- Icons used: `Leaf` (tier 1), `RefreshCw` (tier 2 & 3) from lucide-react.

