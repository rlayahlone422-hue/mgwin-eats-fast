# Namsang Bites

Build a local food delivery app called "Mg Win" for a small-town market in Namsang, southern Shan State, Myanmar. Keep it lightweight, premium graphic designs animations and practical for a town with unlimited restaurant counts, motorbike delivery, and mostly cash/mobile-wallet payments. Language: Support both Burmese (မြန်မာ) and English, with a language toggle. Default to Burmese. Currency: Myanmar Kyat (MMK / Ks). Customer Features:

Simple phone-number-based signup/login (many users won't have email) Browse a list of local restaurants/food stalls with huge marketplace. Menu items with photos, name (Burmese + English), price in Kyat Simple cart — add items, adjust quantity, add notes (e.g., "not spicy") Checkout with:

Delivery address as a simple text field or pin-on-map (since formal addresses may be inconsistent in a small town) plus a phone number for the rider to call Payment options: Cash on Delivery, KBZPay, Wave Pay (Myanmar's dominant mobile wallets — skip international card processors, they won't work here)

Order status tracking: Order Placed → Restaurant Confirmed → Preparing → Rider Picked Up → Delivered Order history and simple reorder button Basic star rating for restaurant + rider after delivery

Restaurant Owner Dashboard:

Login for restaurant/food stall owners Add/edit menu items (name in Burmese and English, price, photo, availability toggle) Simple order queue: incoming orders with accept/reject Mark order status: Confirmed → Preparing → Ready for Pickup Toggle "Open Now" / "Closed" Basic daily order count and revenue total (in Kyat)

Delivery Rider (Motorbike) App:

Simple login for riders Online/offline toggle See nearby delivery requests: pickup location (restaurant), drop-off (customer pin/description), payment type (cash to collect or already paid via wallet) Update status: Picked Up → Delivered Daily earnings summary (delivery fee per trip) Note: assume riders may have basic Android phones and limited data — keep the UI lightweight, minimal images, works on slow connections, it will be better for let them download the google map and use it offline to update their location. Let them create a calculation panel to calculate the distance between the clients with MMK. Make the raider easy to connect each other and see who is available and who is on the way to pick up. 

Admin Panel (for you, the operator):

Add new restaurants to the platform (since this is a small town, onboarding will likely be manual/curated at first) View all orders across the platform Manage delivery fee per zone/distance (flat fee is simplest for a small town) View total orders, revenue, active restaurants, active riders Approve new rider signups and saprate a main page for admin to control everything to set, allow to add new restaurants, new markets, new personal business. 

Data Models:

Users (role: customer/restaurant/rider/admin, phone number, name, address_note) Restaurants (name_mm, name_en, address_note, phone, is_open, delivery_fee_zone) MenuItems (restaurant_id, name_mm, name_en, price_mmk, photo, available) Orders (customer_id, restaurant_id, rider_id, items, total_mmk, delivery_fee, payment_method, status, timestamps) Reviews (order_id, restaurant_rating, rider_rating, comment) but It will be better to update all the locations and business info by their owner but if they are already on google map just use the information of google map instead. 

Design: Premium design color, animations dynamic effects, video live wallpaper background, 24 hour live animation dark theme and day theme with customizable, Simple, high-contrast UI that works well on low-end Android phones IOS, depstop MacBook and slower mobile data — large tappable buttons, clear Burmese typography. Warm, appetizing color palette but keep the interface lightweight over flashy. Priority build order: 1) Customer ordering flow with cash/mobile-wallet checkout, 2) Restaurant order dashboard, 3) Rider app, 4) 

Build a full-stack Food Service application for Local with an app like a food panda myanmar. Include authentication, a clean dashboard layout with sidebar navigation, full CRUD flows for the core resources, and persistent data storage. Use a modern, polished UI states, loading states, optimistic updates, and responsive dynamic animation design, and seed it with realistic demo data so the app feels alive on first load. Use real time google map data and allow to sign up with different social platforms.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2c79d312-abed-4882-8b78-a4c2b7501f05).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
