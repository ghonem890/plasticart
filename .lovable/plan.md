

## Fix: Product Slug Backfill

### Problem
The slug migration created the trigger correctly but the backfill failed. The trigger fires on `INSERT OR UPDATE OF title_en`, but the migration only updated the `slug` column — so the trigger never fired. All products currently have `slug: null`.

### Plan

**1. Database migration to backfill slugs**
Run a new migration that triggers the slug generation by touching `title_en`:
```sql
UPDATE public.products SET title_en = title_en;
```
This updates `title_en` to its own value, which fires the `set_product_slug` trigger and populates the `slug` column for all existing products.

**2. No code changes needed**
The frontend code (ProductCard, ProductDetail, Catalog, etc.) already handles slugs correctly with UUID fallback. Once slugs are populated, product links will automatically use readable URLs like `/product/disposable-plastic-cups-200ml`.

### Technical Details
- The existing `generate_product_slug()` function handles uniqueness by appending `-1`, `-2`, etc. for duplicate titles
- The `ProductDetail` page already detects UUID vs slug format and queries accordingly
- All components already pass `slug` prop through to `ProductCard`

