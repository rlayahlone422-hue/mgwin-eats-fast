import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Store, Bike, Wallet, CheckCircle2, Loader2, ChevronRight } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useApp } from "@/lib/mgwin-store";
import { supabase } from "@/integrations/supabase/client";
import { absoluteUrl } from "@/lib/seo-pages";

const TITLE = "Partner with Mg Win — List Your Namsang Restaurant or Stall";
const DESCRIPTION =
  "Join Mg Win, Namsang's local food delivery service. Add your restaurant, tea shop or market stall, take orders by phone or app, and get paid in cash, KBZPay or Wave Pay.";
const URL = absoluteUrl("/partner");

export const Route = createFileRoute("/partner")({
  component: PartnerPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
});

function PartnerPage() {
  const { lang, L } = useApp();
  const mm = lang === "mm";
  const [state, setState] = useState<"idle" | "saving" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    business_name: "",
    owner_name: "",
    phone: "",
    location: "",
    cuisine: "",
    message: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.business_name.trim() || !form.phone.trim()) return;
    setState("saving");
    setError(null);
    const { error: err } = await supabase.from("partner_leads").insert({
      business_name: form.business_name.trim(),
      owner_name: form.owner_name.trim() || null,
      phone: form.phone.trim(),
      location: form.location.trim() || null,
      cuisine: form.cuisine.trim() || null,
      message: form.message.trim() || null,
    });
    if (err) {
      setError(L({ mm: "ပေးပို့မှု မအောင်မြင်ပါ။ ထပ်စမ်းကြည့်ပါ။", en: "Could not send. Please try again." }));
      setState("idle");
      return;
    }
    setState("done");
  };

  const benefits = [
    {
      icon: Store,
      t: { mm: "သင့်ဆိုင်အတွက် သီးသန့်စာမျက်နှာ", en: "Your own shop page" },
      d: {
        mm: "မီနူး၊ ဓာတ်ပုံနှင့် ဆေးနှုန်းတွေကို နမ့်စန်တစ်မြို့လုံး ရှာတွေ့နိုင်ပါတယ်။",
        en: "Menu, photos and prices, findable by every customer searching for food in Namsang.",
      },
    },
    {
      icon: Bike,
      t: { mm: "မော်တော်ဆိုင်ကယ် ပို့ဆောင်ရေး", en: "Motorbike delivery included" },
      d: {
        mm: "ဒေသခံ ပို့ဆောင်သူများက လမ်းတိုင်းကို သိပါတယ်။ သင့်ဆိုင်က ချက်ပြုတ်ရုံပါ။",
        en: "Local riders who know every alley. You just cook — we handle the ride.",
      },
    },
    {
      icon: Wallet,
      t: { mm: "ငွေသား၊ KBZPay၊ Wave Pay", en: "Cash, KBZPay & Wave Pay" },
      d: {
        mm: "ဖောက်သည်ကြိုက်သည့် နည်းလမ်းဖြင့် ပေးချေနိုင်ပြီး သင်ထံ ရောက်ရှိပါမည်။",
        en: "Customers pay however they like; the money reaches you the same day.",
      },
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
        <div className="text-xs uppercase tracking-widest text-accent mb-2">Namsang, Shan State</div>
        <h1 className={`font-display text-4xl md:text-5xl ${mm ? "font-mm" : ""}`}>
          {L({ mm: "Mg Win တွင် ဆိုင်ရှင်အဖြစ် ပါဝင်ပါ", en: "Partner with Mg Win" })}
        </h1>
        <p className={`text-muted-foreground mt-3 max-w-2xl ${mm ? "font-mm" : ""}`}>
          {L({
            mm: "ဆိုင်၊ လက်ဖက်ရည်ဆိုင် သို့မဟုတ် စျေးဆိုင် ရှိပါက အောက်တွင် အချက်အလက် ဖြည့်ပေးပါ။ ကျွန်ုပ်တို့ဖုန်းဆက်၍ မီနူးတင်ပေးပါမည်။",
            en: "Run a kitchen, tea shop or market stall in Namsang? Send your details below and we will call you to set up your menu.",
          })}
        </p>

        <div className="mt-10 grid sm:grid-cols-3 gap-4">
          {benefits.map((b) => (
            <div key={b.t.en} className="rounded-2xl bg-card border border-border/60 p-5">
              <b.icon className="w-5 h-5 text-primary" />
              <h2 className={`font-semibold mt-3 ${mm ? "font-mm" : ""}`}>{L(b.t)}</h2>
              <p className={`text-sm text-muted-foreground mt-1 ${mm ? "font-mm" : ""}`}>{L(b.d)}</p>
            </div>
          ))}
        </div>

        <section id="apply" className="mt-12 rounded-3xl bg-card border border-border/60 p-6 sm:p-8">
          {state === "done" ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-10 h-10 mx-auto text-primary" />
              <h2 className={`font-display text-2xl mt-4 ${mm ? "font-mm" : ""}`}>
                {L({ mm: "ကျေးဇူးတင်ပါတယ်!", en: "Thank you!" })}
              </h2>
              <p className={`text-muted-foreground mt-2 ${mm ? "font-mm" : ""}`}>
                {L({
                  mm: "သင့်အချက်အလက်များ ရရှိပါပြီ။ မကြာမီ ဖုန်းဆက်ပါမည်။",
                  en: "We have your details and will call you shortly to get your shop online.",
                })}
              </p>
              <Link to="/restaurants" className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-ember px-6 py-3 text-sm font-semibold text-primary-foreground shadow-ember">
                {L({ mm: "ဆိုင်များ ကြည့်ရန်", en: "Browse restaurants" })}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
              <h2 className={`sm:col-span-2 font-display text-2xl ${mm ? "font-mm" : ""}`}>
                {L({ mm: "ဆိုင်အချက်အလက် ပေးပို့ရန်", en: "Tell us about your shop" })}
              </h2>
              <Field label={L({ mm: "ဆိုင်အမည် *", en: "Shop name *" })} value={form.business_name} onChange={set("business_name")} required />
              <Field label={L({ mm: "ဖုန်းနံပါတ် *", en: "Phone number *" })} value={form.phone} onChange={set("phone")} required type="tel" />
              <Field label={L({ mm: "ဆိုင်ရှင်အမည်", en: "Owner name" })} value={form.owner_name} onChange={set("owner_name")} />
              <Field label={L({ mm: "တည်ရာ / လမ်းညွှန်", en: "Location or landmark" })} value={form.location} onChange={set("location")} />
              <Field label={L({ mm: "အစားအစာအမျိုးအစား", en: "Food type" })} value={form.cuisine} onChange={set("cuisine")} className="sm:col-span-2" />
              <label className="sm:col-span-2 block">
                <span className={`text-xs text-muted-foreground ${mm ? "font-mm" : ""}`}>
                  {L({ mm: "အခြားမှတ်ချက်", en: "Anything else" })}
                </span>
                <textarea
                  value={form.message}
                  onChange={set("message")}
                  rows={3}
                  className="mt-1 w-full rounded-xl bg-background border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </label>
              {error && <p className="sm:col-span-2 text-sm text-destructive">{error}</p>}
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={state === "saving"}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-ember px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-ember hover:scale-105 transition-transform disabled:opacity-60"
                >
                  {state === "saving" && <Loader2 className="w-4 h-4 animate-spin" />}
                  {L({ mm: "ပေးပို့မည်", en: "Send my details" })}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}

function Field({
  label,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs text-muted-foreground">{label}</span>
      <input
        {...props}
        className="mt-1 w-full rounded-xl bg-background border border-border px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}
