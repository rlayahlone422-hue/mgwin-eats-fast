import { createFileRoute, Link, Outlet, useLocation, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { ChefHat, LogOut, Utensils, ClipboardList } from "lucide-react";

export const Route = createFileRoute("/_authenticated/owner")({
  beforeLoad: async ({ context }: any) => {
    const uid = context.user?.id;
    if (!uid) throw redirect({ to: "/auth", search: { next: undefined } });
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
    const roles = (data ?? []).map((r: any) => r.role);
    if (!roles.includes("owner") && !roles.includes("admin")) throw redirect({ to: "/unauthorized" });
  },
  component: OwnerShell,
});

function OwnerShell() {
  const { signOut } = useAuth();
  const loc = useLocation();
  const tabs = [
    { to: "/owner", label: "Orders", icon: ClipboardList },
    { to: "/owner/menu", label: "Menu", icon: Utensils },
  ] as const;
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          <Link to="/owner" className="flex items-center gap-2">
            <div className="rounded-xl bg-gradient-ember p-2 shadow-ember"><ChefHat className="h-5 w-5 text-primary-foreground" /></div>
            <div>
              <div className="font-display text-lg text-gradient-ember leading-none">Mg Win</div>
              <div className="text-[10px] tracking-widest text-muted-foreground">RESTAURANT</div>
            </div>
          </Link>
          <button onClick={() => signOut().then(() => (window.location.href = "/auth"))}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
        <div className="max-w-6xl mx-auto flex gap-1 px-4">
          {tabs.map((t) => {
            const active = loc.pathname === t.to;
            return (
              <Link key={t.to} to={t.to} className={`flex items-center gap-2 px-4 py-2.5 text-sm border-b-2 transition ${active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                <t.icon className="h-4 w-4" />{t.label}
              </Link>
            );
          })}
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-4"><Outlet /></main>
    </div>
  );
}
