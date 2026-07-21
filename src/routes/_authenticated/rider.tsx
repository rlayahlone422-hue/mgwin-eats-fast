import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Bike, LogOut, Loader2, Power, MapPin, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/rider")({
  beforeLoad: async ({ context }: any) => {
    const uid = context.user?.id;
    if (!uid) throw redirect({ to: "/auth" });
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
    const roles = (data ?? []).map((r: any) => r.role);
    if (!roles.includes("rider") && !roles.includes("admin")) throw redirect({ to: "/unauthorized" });
  },
  component: RiderHome,
});

function RiderHome() {
  const { user, signOut } = useAuth();
  const [online, setOnline] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [mine, setMine] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    const { data: shift } = await supabase.from("rider_shifts").select("online").eq("rider_id", user.id).maybeSingle();
    setOnline(shift?.online ?? false);
    const { data: open } = await supabase.from("orders").select("*").eq("status", "ready").is("rider_id", null).order("created_at").limit(20);
    setJobs(open ?? []);
    const { data: my } = await supabase.from("orders").select("*").eq("rider_id", user.id).in("status", ["picked_up"]).order("created_at");
    setMine(my ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase.channel("rider").on("postgres_changes", { event: "*", schema: "public", table: "orders" }, load).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user]);

  const toggleOnline = async () => {
    if (!user) return;
    const next = !online;
    await supabase.from("rider_shifts").upsert({ rider_id: user.id, online: next, updated_at: new Date().toISOString() });
    setOnline(next);
    toast.success(next ? "You're online" : "You're offline");
  };

  const accept = async (id: string) => {
    if (!user) return;
    const { error } = await supabase.from("orders").update({ rider_id: user.id, status: "picked_up" as any }).eq("id", id).is("rider_id", null);
    if (error) return toast.error(error.message);
    toast.success("Accepted — head to pickup");
    load();
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-gradient-ember p-2 shadow-ember"><Bike className="h-5 w-5 text-primary-foreground" /></div>
            <div>
              <div className="font-display text-lg text-gradient-ember leading-none">Mg Win</div>
              <div className="text-[10px] tracking-widest text-muted-foreground">RIDER</div>
            </div>
          </div>
          <button onClick={() => signOut().then(() => (window.location.href = "/auth"))}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 space-y-4">
        <button onClick={toggleOnline}
          className={`w-full rounded-2xl p-5 border transition flex items-center justify-between ${online ? "bg-primary/10 border-primary/40 text-primary" : "bg-card/60 border-border text-muted-foreground"}`}>
          <div className="flex items-center gap-3">
            <Power className={`h-6 w-6 ${online ? "animate-pulse" : ""}`} />
            <div className="text-left">
              <div className="font-semibold">{online ? "You're online" : "You're offline"}</div>
              <div className="text-xs opacity-80">{online ? "Receiving delivery jobs" : "Tap to start receiving jobs"}</div>
            </div>
          </div>
          <div className={`h-3 w-3 rounded-full ${online ? "bg-primary animate-ember-pulse" : "bg-muted"}`} />
        </button>

        {mine.length > 0 && (
          <section>
            <h2 className="font-semibold text-sm mb-2">Active deliveries</h2>
            <div className="space-y-2">
              {mine.map((o) => (
                <Link key={o.id} to="/rider/orders/$id" params={{ id: o.id }} className="block rounded-xl bg-card/60 border border-primary/30 p-4 hover:border-primary transition">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>#{o.id.slice(0, 6)}</span>
                    <span className="text-primary">In progress</span>
                  </div>
                  <div className="mt-1 text-sm font-medium flex items-center gap-1"><MapPin className="h-3 w-3" /> {o.address}</div>
                  <div className="mt-1 flex justify-between text-sm">
                    <span>{o.total.toLocaleString()} Ks</span>
                    <span className="flex items-center gap-1 text-primary">Open <ArrowRight className="h-3 w-3" /></span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="font-semibold text-sm mb-2">Available jobs</h2>
          {!online && <div className="rounded-xl bg-muted/30 border border-border p-4 text-xs text-muted-foreground">Go online to see and accept jobs.</div>}
          {online && jobs.length === 0 && <div className="rounded-xl bg-card/50 border border-border p-8 text-center text-sm text-muted-foreground">No jobs right now. Sit tight.</div>}
          {online && (
            <div className="space-y-2">
              {jobs.map((o) => (
                <div key={o.id} className="rounded-xl bg-card/60 border border-border p-4">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>#{o.id.slice(0, 6)}</span>
                    <span>{new Date(o.created_at).toLocaleTimeString()}</span>
                  </div>
                  <div className="mt-1 text-sm flex items-center gap-1"><MapPin className="h-3 w-3 text-primary" /> {o.address}</div>
                  <div className="mt-1 text-sm text-primary">{o.delivery_fee.toLocaleString()} Ks delivery</div>
                  <button onClick={() => accept(o.id)} className="mt-2 w-full rounded-lg bg-gradient-ember py-2 text-sm font-medium text-primary-foreground">
                    Accept
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
