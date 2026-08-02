import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "search_dishes",
  title: "Search dishes",
  description:
    "Search dishes across every Mg Win restaurant by name, in English or Burmese. Returns price in MMK and the owning restaurant id.",
  inputSchema: {
    query: z.string().describe("Dish name fragment, e.g. 'shan noodle' or 'မုန့်တီ'."),
    maxPrice: z.number().optional().describe("Only dishes at or below this price in MMK."),
    limit: z.number().int().optional().describe("Max rows to return (default 20, max 50)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, maxPrice, limit }) => {
    const supabase = supabaseAnon();
    const term = `%${query.trim()}%`;
    let q = supabase
      .from("menu_items")
      .select("id, restaurant_id, name_en, name_mm, desc_en, price, available, category_en")
      .or(`name_en.ilike.${term},name_mm.ilike.${term},desc_en.ilike.${term}`)
      .order("price", { ascending: true })
      .limit(Math.min(Math.max(limit ?? 20, 1), 50));

    if (typeof maxPrice === "number") q = q.lte("price", maxPrice);

    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { items: data ?? [] },
    };
  },
});
