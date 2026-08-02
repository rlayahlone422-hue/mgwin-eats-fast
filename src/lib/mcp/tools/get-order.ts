import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_order",
  title: "Get order detail",
  description:
    "Get one Mg Win order the signed-in user can access: line items, delivery details and the full status timeline.",
  inputSchema: {
    orderId: z.string().describe("Order id from list_my_orders."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ orderId }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const [order, items, events] = await Promise.all([
      supabase.from("orders").select("*").eq("id", orderId).maybeSingle(),
      supabase.from("order_items").select("name_en, name_mm, qty, price, notes").eq("order_id", orderId),
      supabase.from("order_events").select("status, at, note").eq("order_id", orderId).order("at", { ascending: true }),
    ]);

    const failure = order.error ?? items.error ?? events.error;
    if (failure) return { content: [{ type: "text", text: failure.message }], isError: true };
    if (!order.data) {
      return { content: [{ type: "text", text: "Order not found or not visible to you" }], isError: true };
    }

    const payload = { order: order.data, items: items.data ?? [], timeline: events.data ?? [] };
    return {
      content: [{ type: "text", text: JSON.stringify(payload) }],
      structuredContent: payload,
    };
  },
});
