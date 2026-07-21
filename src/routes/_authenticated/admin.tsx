import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Shield, LogOut, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async ({ context }: any) => {
    const uid = context.user?.id;
    if (!uid) throw redirect({ to: "/admin/login" });
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
    const roles = (data ?? []).map((r: any) => r.role);
    if (!roles.includes("admin")) throw redirect({ to: "/unauthorized" });
  },
  component: AdminHome,
});

function AdminHome() {
  const { signOut } = useAuth();
  const [disputes, setDisputes] = useState<any[]>([]);
  const [stats, setStats] = useState({ orders: 0, users: 0, disputes: 0 });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [{ data: d }, { count: oc }, { count: uc }, { count: dc }] = await Promise.all([
      supabase.from("disputes").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("disputes").select("*", { count: "exact", head: true }).eq("status", "open"),
    ]);
    setDisputes(d ?? []);
    setStats({ orders: oc ?? 0, users: uc ?? 0, disputes: dc ?? 0 });
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const resolve = async (id: string, status: "resolved" | "rejected") => {
    const { error } = await supabase.from("disputes").update({ resolution: status, status: status as any }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    load();
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-gradient-ember p-2 shadow-ember"><Shield className="h-5 w-5 text-primary-foreground" /></div>
            <div>
              <div className="font-display text-lg text-gradient-ember leading-none">Mg Win</div>
              <div className="text-[10px] tracking-widest text-muted-foreground">ADMIN</div>
            </div>
          </div>
          <button onClick={() => signOut().then(() => (window.location.href = "/admin/login"))}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Orders" value={stats.orders} />
          <Stat label="Users" value={stats.users} />
          <Stat label="Open disputes" value={stats.disputes} accent />
        </div>

        <section>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">Disputes & refunds</h2>
          </div>
          <div className="space-y-2">
            {disputes.length === 0 && <div className="rounded-xl bg-card/50 border border-border p-8 text-center text-sm text-muted-foreground">No disputes yet</div>}
            {disputes.map((d) => (
              <div key={d.id} className="rounded-xl bg-card/60 border border-border p-4">
                <div className="flex justify-between items-start">
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground">Order #{d.order_id?.slice(0, 8) ?? "—"}</div>
                    <div className="font-medium text-sm mt-1">{d.type}</div>
                    <p className="text-xs text-muted-foreground mt-1">{d.resolution ?? ""}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${d.status === "open" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{d.status}</span>
                </div>
                {d.status === "open" && (
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => resolve(d.id, "resolved")} className="flex-1 rounded-lg bg-gradient-ember py-2 text-xs font-medium text-primary-foreground flex items-center justify-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Resolve
                    </button>
                    <button onClick={() => resolve(d.id, "rejected")} className="flex-1 rounded-lg border border-border py-2 text-xs">
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 ${accent ? "bg-primary/10 border-primary/30" : "bg-card/60 border-border"}`}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`mt-1 text-2xl font-semibold ${accent ? "text-primary" : ""}`}>{value}</div>
    </div>
  );
}
