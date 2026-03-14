

# Plasticart — Online Packaging Marketplace

## Phase 1: Foundation & Authentication

### 1.1 Project Setup & Design System
- Clean, minimal design with white space and modern typography
- Bilingual support (English & Arabic) with RTL layout switching and language toggle
- EGP (ج.م) as the currency throughout
- Responsive layout for desktop and mobile

### 1.2 Database Schema (Supabase)
- **Users** table (via Supabase Auth) — email, phone, password, role reference
- **user_roles** table — admin, seller, buyer roles (separate from profiles for security)
- **profiles** table — display name, avatar, phone, preferred language
- **seller_profiles** — business name, description, contract document URL, ID photo URL, verification status (pending/approved/rejected), shipping preference
- **categories** — name (en/ar), slug, icon, parent category (for subcategories)
- **products** — title (en/ar), description, specs (JSONB), price, min order qty, stock, seller_id, category_id, tags, status (active/disabled)
- **product_images** — product_id, image URL, display order
- **orders** — buyer_id, status enum (pending → confirmed → shipped → completed → returned → refunded → cancelled), total, shipping info
- **order_items** — order_id, product_id, quantity, unit price
- **payments** — order_id, method (offline), status, amount
- **commissions** — category_id, seller_id, rate percentage
- **favorites** — user_id, product_id
- **reviews** — product_id, buyer_id, rating, comment
- **coupons** — code, discount type/amount, expiry, usage limits
- **notifications** — user_id, type, message, channel (email/whatsapp), status

### 1.3 Authentication
- Registration for buyers and sellers (email, password, phone)
- Email verification flow
- Password reset via email
- Login page with language toggle
- Role-based routing after login

## Phase 2: Seller Experience

### 2.1 Seller Onboarding
- Multi-step registration: business details → upload signed contract (PDF) → upload ID photo
- Document storage in Supabase Storage (private bucket)
- Pending verification status shown to seller
- Seller can choose shipping preference: self-managed or platform-provided

### 2.2 Seller Dashboard
- Overview: total products, orders, revenue summary
- **Product Management**: create/edit/disable/delete products with image uploads, category selection, specs, pricing, minimum order qty, stock levels, tags
- Net revenue calculator showing expected earnings after commission deduction
- Order management: view incoming orders, update status
- Profile and document management

## Phase 3: Buyer Experience

### 3.1 Homepage & Catalog
- Hero section with search bar and featured categories (bags, containers, rolls, cups, etc.)
- Category browsing with icons and Arabic/English labels
- Product grid with lazy-loaded images, pagination
- Search with keyword matching
- Filters: category, price range, seller, rating, availability

### 3.2 Product Pages
- Image gallery with zoom
- Full specs, pricing, min order qty, stock status
- Seller info card with link to seller profile
- Reviews section with star ratings
- "Add to Compare" and "Add to Favorites" buttons
- Add to cart with quantity selector

### 3.3 Product Comparison
- Compare tray (floating bar showing selected products)
- Side-by-side comparison page showing specs, price, seller, ratings in a table format
- Up to 4 products at a time

### 3.4 Favorites
- Heart icon on product cards and product pages
- Favorites page listing all saved products

### 3.5 Cart & Checkout
- Cart page with item list, quantity editing, item removal
- Coupon code input with validation
- Order summary with subtotals and totals in EGP
- Checkout: shipping address form, offline payment confirmation
- Order confirmation page

## Phase 4: Order Lifecycle & Notifications

### 4.1 Order Status Flow
- Status progression: Pending → Confirmed → Shipped → Completed
- Alternative flows: Returned, Refunded, Cancelled
- Buyers and sellers can view order status with timeline visualization
- Sellers update order status from their dashboard

### 4.2 Notifications (Edge Functions)
- Email notifications via Resend for: order placed, order confirmed, shipped, delivered, cancelled
- WhatsApp notifications via Twilio for key order events
- Notification preferences per user

## Phase 5: Admin Panel

### 5.1 Admin Dashboard
- Overview: total users, orders, revenue, pending verifications
- **Seller Verification**: review uploaded documents, approve/reject sellers with notes
- **User Management**: view all users, roles, disable accounts
- **Product Moderation**: review/flag/remove products
- **Category Management**: add/edit/reorder categories
- **Commission Management**: set commission rates per category and per seller
- **Order Oversight**: view all orders, intervene if needed
- **Coupon Management**: create, edit, deactivate coupons
- **Reports**: sales by category, top sellers, revenue charts (using Recharts)

## Phase 6: Polish & Extras
- Full RTL support with seamless language switching
- HTTPS, secure file storage, hashed passwords (handled by Supabase)
- Image optimization and lazy loading
- Mobile-responsive design across all pages
- Loading skeletons and error states

