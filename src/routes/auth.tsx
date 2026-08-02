import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { useApp } from "@/lib/mgwin-store";
import { Loader2, ChefHat, Bike, User } from "lucide-react";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({
    next:
      typeof s.next === "string" && s.next.startsWith("/") && !s.next.startsWith("//")
        ? s.next
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — Mg Win" },
      { name: "description", content: "Sign in to order, manage your restaurant, or start delivering with Mg Win." },
      { property: "og:title", content: "Sign in — Mg Win" },
      { property: "og:description", content: "Sign in to order, manage your restaurant, or deliver with Mg Win." },
    ],
  }),
  component: AuthPage,
});

const T = {
  title: { mm: "Mg Win သို့ ဝင်ရောက်ပါ", en: "Sign in to Mg Win" },
  subtitle: { mm: "မှာယူ • ဆိုင်စီမံ • ပို့ဆောင်", en: "Order • Manage • Deliver" },
  email: { mm: "အီးမေးလ်", en: "Email" },
  password: { mm: "စကားဝှက်", en: "Password" },
  signin: { mm: "ဝင်ရောက်မည်", en: "Sign in" },
  signup: { mm: "အကောင့်ဖွင့်မည်", en: "Create account" },
  google: { mm: "Google ဖြင့် ဝင်ရောက်မည်", en: "Continue with Google" },
  toggle_up: { mm: "အကောင့်မရှိသေးဘူးလား? ဖွင့်မည်", en: "No account? Sign up" },
  toggle_in: { mm: "အကောင့်ရှိပြီးလား? ဝင်မည်", en: "Already have an account? Sign in" },
  role: { mm: "အခန်းကဏ္ဍ", en: "I am a" },
  customer: { mm: "ဖောက်သည်", en: "Customer" },
  owner: { mm: "ဆိုင်ရှင်", en: "Restaurant" },
  rider: { mm: "ဆိုင်ကယ်သမား", en: "Rider" },
};

export default function AuthPage() {
  const navigate = useNavigate();
  const { next } = Route.useSearch();
  const { lang } = useApp();
  const t = (k: keyof typeof T) => T[k][lang];
  const [mode, setMode] = useState<"in" | "up">("in");
  const [role, setRole] = useState<"customer" | "owner" | "rider">("customer");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) return;
      await routeByRole(data.session.user.id);
    });
  }, []);

  const routeByRole = async (uid: string) => {
    if (next) { window.location.href = next; return; }
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
    const roles = (data ?? []).map((r: any) => r.role);
    if (roles.includes("admin")) return navigate({ to: "/admin" });
    if (roles.includes("owner")) return navigate({ to: "/owner" });
    if (roles.includes("rider")) return navigate({ to: "/rider" });
    navigate({ to: "/restaurants" });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "up") {
        const { data, error } = await supabase.auth.signUp({
          email, password: pw,
          options: { emailRedirectTo: window.location.origin + (next ? `/auth?next=${encodeURIComponent(next)}` : "") },
        });
        if (error) throw error;
        if (data.user && role !== "customer") {
          await supabase.from("user_roles").insert({ user_id: data.user.id, role });
        }
        toast.success(lang === "mm" ? "အကောင့်ဖွင့်ပြီး!" : "Account created");
        if (data.session) await routeByRole(data.session.user.id);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: pw });
        if (error) throw error;
        await routeByRole(data.user.id);
      }
    } catch (err: any) {
      toast.error(err.message ?? "Auth failed");
    } finally { setBusy(false); }
  };

  const google = async () => {
    setBusy(true);
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" + (next ? `?next=${encodeURIComponent(next)}` : "") });
    if (res.error) { toast.error(String(res.error)); setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center mb-6">
          <div className="text-3xl font-display text-gradient-ember">Mg Win</div>
          <div className="text-xs text-muted-foreground tracking-widest">NAMSANG FOODIE</div>
        </Link>
        <div className="rounded-3xl bg-card/60 backdrop-blur-xl border border-border p-6 shadow-ember">
          <h1 className="text-2xl font-semibold text-center">{t("title")}</h1>
          <p className="text-sm text-muted-foreground text-center mt-1">{t("subtitle")}</p>

          {mode === "up" && (
            <div className="mt-5">
              <div className="text-xs font-medium mb-2 text-muted-foreground">{t("role")}</div>
              <div className="grid grid-cols-3 gap-2">
                {([
                  ["customer", User],
                  ["owner", ChefHat],
                  ["rider", Bike],
                ] as const).map(([r, Icon]) => (
                  <button key={r} type="button" onClick={() => setRole(r)}
                    className={`rounded-xl border p-3 text-xs flex flex-col items-center gap-1 transition ${role === r ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>
                    <Icon className="h-4 w-4" />
                    {t(r)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={submit} className="mt-5 space-y-3">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder={t("email")} className="w-full rounded-xl bg-input border border-border px-4 py-3 text-sm outline-none focus:border-primary" />
            <input type="password" required minLength={6} value={pw} onChange={(e) => setPw(e.target.value)}
              placeholder={t("password")} className="w-full rounded-xl bg-input border border-border px-4 py-3 text-sm outline-none focus:border-primary" />
            <button disabled={busy} className="w-full rounded-xl bg-gradient-ember py-3 text-sm font-medium text-primary-foreground shadow-ember disabled:opacity-50 flex items-center justify-center gap-2">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "up" ? t("signup") : t("signin")}
            </button>
          </form>

          <div className="my-4 flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-border" /> or <div className="flex-1 h-px bg-border" />
          </div>

          <button onClick={google} disabled={busy} className="w-full rounded-xl bg-secondary border border-border py-3 text-sm font-medium hover:bg-secondary/80 disabled:opacity-50">
            {t("google")}
          </button>

          <button onClick={() => setMode(mode === "in" ? "up" : "in")}
            className="w-full mt-4 text-xs text-muted-foreground hover:text-foreground">
            {mode === "in" ? t("toggle_up") : t("toggle_in")}
          </button>
        </div>
      </div>
    </div>
  );
}
