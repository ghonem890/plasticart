

## Add "Intended Products" Field to Seller Onboarding

### Overview
Add a new step in the seller onboarding flow where sellers list the products they intend to sell, each with a name and an image. Store this data in a new database table. Display these intended products in the admin seller review dialog.

### Plan

**1. Database migration -- new `seller_intended_products` table**

```sql
CREATE TABLE public.seller_intended_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_profile_id uuid NOT NULL,
  product_name text NOT NULL,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.seller_intended_products ENABLE ROW LEVEL SECURITY;

-- Sellers can insert during onboarding
CREATE POLICY "Sellers insert intended products" ON public.seller_intended_products
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM seller_profiles WHERE id = seller_profile_id AND user_id = auth.uid()
  ));

-- Public read (admins and seller profile viewers)
CREATE POLICY "Intended products viewable" ON public.seller_intended_products
  FOR SELECT TO public USING (true);

-- Admins can manage
CREATE POLICY "Admins manage intended products" ON public.seller_intended_products
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
```

Images will be uploaded to the existing `seller-documents` bucket under `{user_id}/intended-products/`.

**2. Update onboarding form (`src/pages/seller/Onboarding.tsx`)**

- Change progress bar from 3 steps to 4 steps.
- Insert a new **Step 2: "Products You Want to Sell"** between business info and contract upload (shifting contract to step 3, ID photo to step 4).
- Step 2 UI: a dynamic list where each entry has a product name input and an image upload button. Sellers can add/remove entries. Show image thumbnails after selection.
- On final submit (`handleComplete`): after inserting `seller_profiles`, upload each intended product image to storage, then batch-insert rows into `seller_intended_products`.

**3. Update admin review dialog (`src/components/admin/SellerDetailDialog.tsx`)**

- On dialog open, fetch `seller_intended_products` where `seller_profile_id = seller.id`.
- Generate signed URLs for each product image.
- Display a new "Intended Products" section after the documents section, showing a grid of cards with product name and image thumbnail.

**4. Add translations (`src/i18n/translations.ts`)**

Add EN/AR keys: `intendedProducts`, `addProduct`, `removeProduct`, `productName`, `productImage`, `noIntendedProducts`.

### Files Changed
- `supabase/migrations/` -- new migration file
- `src/pages/seller/Onboarding.tsx` -- add step 2 with product list
- `src/components/admin/SellerDetailDialog.tsx` -- fetch and display intended products
- `src/i18n/translations.ts` -- new translation keys

