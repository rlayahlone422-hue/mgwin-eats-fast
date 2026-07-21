import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Shield, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin — Mg Win" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pw });
      if (error) throw error;
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
      if (!roles?.some((r: any) => r.role === "admin")) {
        await supabase.auth.signOut();
        throw new Error("Not authorized as admin");
      }
      navigate({ to: "/admin" });
    } catch (err: any) {
      toast.error(err.message ?? "Login failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="rounded-3xl bg-card/60 backdrop-blur-xl border border-border p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="rounded-2xl bg-primary/10 p-4 border border-primary/30">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-xl font-semibold text-center">Admin Console</h1>
          <p className="text-xs text-muted-foreground text-center mt-1">Authorized personnel only</p>
          <form onSubmit={submit} className="mt-6 space-y-3">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin email" className="w-full rounded-xl bg-input border border-border px-4 py-3 text-sm outline-none focus:border-primary" />
            <input type="password" required value={pw} onChange={(e) => setPw(e.target.value)}
              placeholder="Password" className="w-full rounded-xl bg-input border border-border px-4 py-3 text-sm outline-none focus:border-primary" />
            <button disabled={busy} className="w-full rounded-xl bg-gradient-ember py-3 text-sm font-medium text-primary-foreground shadow-ember disabled:opacity-50 flex items-center justify-center gap-2">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              Access console
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
