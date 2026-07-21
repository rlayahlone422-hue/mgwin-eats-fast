# Phase 2 — Cloud, Auth, and Four Role Portals

This is a large multi-portal build. I'll ship it in ordered sub-phases so each layer is verifiable before the next. Approve and I'll start at 2A.

## 2A · Foundation (Cloud + Schema + Auth Guards)

1. Enable Lovable Cloud.
2. Migrations:
   - `app_role` enum: `customer | owner | rider | admin`
   - `profiles(id, full_name, phone, lang, created_at)` — FK to `auth.users`, autocreate trigger
   - `user_roles(user_id, role)` + `has_role()` security-definer fn
   - `restaurants` (owner_id, name_mm/en, cuisine, image, is_open, address, lat, lng)
   - `menu_items` (restaurant_id, name_mm/en, desc, price, image, available, category)
   - `orders` (customer_id, restaurant_id, rider_id, status, subtotal, delivery_fee, total, phone, address, pin jsonb, payment_method, created_at)
   - `order_items` (order_id, menu_item_id, name_mm/en, price, qty, notes)
   - `order_events` (order_id, status, at, actor_id) — realtime feed
   - `rider_shifts` (rider_id, online, last_lat, last_lng, updated_at)
   - `disputes` (order_id, opened_by, type, status, resolution, notes, refund_amount, created_at)
   - `dispute_messages` (dispute_id, sender_id, body, created_at)
   - Storage buckets: `menu-images` (public), `delivery-proofs` (private)
   - RLS + GRANTs on every table, all policies via `has_role()`
3. Auth pages (all public, top-level):
   - `/auth` — customer email+password + Google
   - `/owner/auth` — restaurant owner login (email+password)
   - `/rider/auth` — rider login
   - `/admin/auth` — hidden admin login (unlinked, email+password only)
4. Route gates via `_authenticated/` layout + nested `_owner/`, `_rider/`, `_admin/` pathless layouts each checking `has_role()`; unauthorized → `/unauthorized`.
5. Wire existing customer flow to live DB (replace mock arrays in `mgwin.ts` gradually).

## 2B · Rider Portal (`/rider/*`)

- `/rider` dashboard: big online/offline toggle (writes `rider_shifts.online`), earnings-today card, available orders queue (realtime).
- `/rider/orders/$id` active delivery: step-by-step actions
  - Accept → Arrived at restaurant → Picked up → Arrived at customer → Delivered
  - Each step writes to `order_events` and updates `orders.status`
  - "Open in Google Maps" (restaurant → customer)
  - **Proof of delivery**: camera/photo upload to `delivery-proofs` bucket, required before final Delivered step
- Live GPS heartbeat (optional, every 20s) updating `rider_shifts.last_lat/lng`.

## 2C · Restaurant Owner Portal (`/owner/*`)

- `/owner` dashboard: today's revenue, active count, avg prep time.
- `/owner/orders` **Kanban board** with realtime subscription:
  - Columns: New → Confirmed → Preparing → Ready for pickup
  - Drag between columns writes new status + `order_events` row
  - Cards show items, notes, customer phone, timer since placed
- `/owner/menu` CRUD:
  - Grid of menu items with inline availability toggle (optimistic)
  - Create/edit modal: bilingual name/desc, price, category, image upload to `menu-images`
  - Delete with confirm
- `/owner/settings`: restaurant profile, hours, is_open master switch.

## 2D · Admin Portal (`/admin/*`)

- `/admin` overview: orders today, GMV, active riders, open disputes.
- `/admin/disputes` ticket list (filters: open/resolved, type)
- `/admin/disputes/$id` ticket detail:
  - Order snapshot + timeline (`order_events`)
  - Message thread (`dispute_messages`) between admin and reporter
  - Resolution actions: refund (full/partial), reassign rider, cancel order, mark resolved
  - Audit log auto-written on every action
- `/admin/users` view users + role assignment
- `/admin/orders` global orders table with search

## 2E · Polish

- Realtime everywhere via Supabase channels (orders, kanban, dispute messages, rider queue)
- Animations: kanban card drag, status step morph, toast confirmations
- Bilingual throughout
- Loading skeletons + empty states per portal

---

**Est. size**: 40–60 files, 6–8 migrations. I recommend approving and I'll ship 2A end-to-end first, then check in before 2B. Say "go" or tell me which sub-phase to start with.