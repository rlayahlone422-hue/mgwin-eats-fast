import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "get_restaurant_menu",
  title: "Get restaurant menu",
  description:
    "Get the menu of one restaurant: dish names (English and Burmese), category, description, availability and price in MMK.",
  inputSchema: {
    restaurantId: z.string().describe("Restaurant id from list_restaurants."),
    availableOnly: z.boolean().optional().describe("Only include items currently available."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ restaurantId, availableOnly }) => {
    const supabase = supabaseAnon();
    const [{ data: restaurant, error: rErr }, menu] = await Promise.all([
      supabase.from("restaurants").select("id, name_en, name_mm, is_open").eq("id", restaurantId).maybeSingle(),
      (availableOnly
        ? supabase.from("menu_items").select("*").eq("restaurant_id", restaurantId).eq("available", true)
        : supabase.from("menu_items").select("*").eq("restaurant_id", restaurantId)
      ).order("category_en", { ascending: true }),
    ]);

    if (rErr) return { content: [{ type: "text", text: rErr.message }], isError: true };
    if (!restaurant) return { content: [{ type: "text", text: "Restaurant not found" }], isError: true };
    if (menu.error) return { content: [{ type: "text", text: menu.error.message }], isError: true };

    const payload = { restaurant, items: menu.data ?? [] };
    return {
      content: [{ type: "text", text: JSON.stringify(payload) }],
      structuredContent: payload,
    };
  },
});
