import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/owner/")({
  component: OwnerOrders,
});

type Order = {
  id: string;
  status: string;
  total_ks: number;
  phone: string;
  address: string;
  created_at: string;
  items: any;
};

const COLUMNS = [
  { key: "placed", label: "New", next: "confirmed" },
  { key: "confirmed", label: "Confirmed", next: "preparing" },
  { key: "preparing", label: "Preparing", next: "ready" },
  { key: "ready", label: "Ready", next: null },
] as const;

function OwnerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(100);
    setOrders((data ?? []) as any);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase.channel("owner-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const advance = async (o: Order, next: string) => {
    const { error } = await supabase.from("orders").update({ status: next }).eq("id", o.id);
    if (error) return toast.error(error.message);
    toast.success(`→ ${next}`);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {COLUMNS.map((col) => {
        const list = orders.filter((o) => o.status === col.key);
        return (
          <div key={col.key} className="rounded-2xl bg-card/50 border border-border p-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-sm">{col.label}</h2>
              <span className="text-xs rounded-full bg-primary/10 text-primary px-2 py-0.5">{list.length}</span>
            </div>
            <div className="space-y-2">
              {list.map((o) => (
                <div key={o.id} className="rounded-xl bg-background border border-border p-3 shadow-sm">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>#{o.id.slice(0, 6)}</span>
                    <span>{new Date(o.created_at).toLocaleTimeString()}</span>
                  </div>
                  <div className="mt-1 text-sm font-medium">{o.total_ks.toLocaleString()} Ks</div>
                  <div className="text-xs text-muted-foreground mt-1 truncate">{o.phone}</div>
                  <div className="text-xs text-muted-foreground truncate">{o.address}</div>
                  {col.next && (
                    <button onClick={() => advance(o, col.next!)}
                      className="w-full mt-2 rounded-lg bg-gradient-ember py-1.5 text-xs font-medium text-primary-foreground">
                      Mark {col.next}
                    </button>
                  )}
                </div>
              ))}
              {list.length === 0 && <div className="text-xs text-muted-foreground text-center py-6">No orders</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
