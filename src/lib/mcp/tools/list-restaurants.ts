import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "list_restaurants",
  title: "List restaurants",
  description:
    "List restaurants on Mg Win (Namsang, Shan State). Optionally filter by a name/cuisine search term or to only open restaurants.",
  inputSchema: {
    search: z.string().optional().describe("Match against restaurant name or cuisine."),
    openOnly: z.boolean().optional().describe("Only include restaurants currently open."),
    limit: z.number().int().optional().describe("Max rows to return (default 20, max 50)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ search, openOnly, limit }) => {
    const supabase = supabaseAnon();
    let query = supabase
      .from("restaurants")
      .select("id, name_en, name_mm, cuisine_en, cuisine_mm, address_en, is_open, rating, delivery_min, lat, lng")
      .order("rating", { ascending: false })
      .limit(Math.min(Math.max(limit ?? 20, 1), 50));

    if (openOnly) query = query.eq("is_open", true);
    if (search?.trim()) {
      const term = `%${search.trim()}%`;
      query = query.or(
        `name_en.ilike.${term},name_mm.ilike.${term},cuisine_en.ilike.${term},cuisine_mm.ilike.${term}`,
      );
    }

    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { restaurants: data ?? [] },
    };
  },
});
