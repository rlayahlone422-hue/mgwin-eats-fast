import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listRestaurants from "./tools/list-restaurants";
import getRestaurantMenu from "./tools/get-restaurant-menu";
import searchDishes from "./tools/search-dishes";
import listMyOrders from "./tools/list-my-orders";
import getOrder from "./tools/get-order";

// The OAuth issuer must be the direct Supabase host; the project ref is the only
// value that survives publish unchanged and Vite inlines it at build time.
const projectRef = import.meta.env['VITE_SUPABASE_PROJECT_ID'] ?? "project-ref-unset";

export default defineMcp({
  name: "mg-win",
  title: "Mg Win",
  version: "0.1.0",
  instructions:
    "Tools for Mg Win, a food delivery app in Namsang, southern Shan State, Myanmar. Prices are in Myanmar Kyat (MMK). Use `list_restaurants`, `get_restaurant_menu` and `search_dishes` to browse the public catalog, and `list_my_orders` / `get_order` for the signed-in user's own orders and delivery status.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listRestaurants, getRestaurantMenu, searchDishes, listMyOrders, getOrder],
});
