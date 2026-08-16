import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bike, Store, Wallet, Flame, Star, ShoppingBag, Clock, MapPin, Phone,
  ChevronRight, Sparkles,
} from "lucide-react";

import heroFood from "@/assets/hero-food.jpg";
import dishShan from "@/assets/dish-shan.jpg";
import dishMohinga from "@/assets/dish-mohinga.jpg";
import dishLahpet from "@/assets/dish-lahpet.jpg";
import { AppHeader } from "@/components/AppHeader";
import { useApp } from "@/lib/mgwin-store";

const HOME_TITLE = "Mg Win — Food Delivery in Namsang, Southern Shan State";
const HOME_DESCRIPTION =
  "Order Shan noodles, mohinga, tea-leaf salad and more from Namsang's best kitchens and market stalls. Motorbike delivery in about 20 minutes, prices in Kyat, pay by cash, KBZPay or Wave Pay.";
const HOME_URL = "https://mgwin-eats-fast.lovable.app/";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: HOME_TITLE },
      { name: "description", content: HOME_DESCRIPTION },
      { property: "og:title", content: HOME_TITLE },
      { property: "og:description", content: HOME_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: HOME_URL },
      { name: "twitter:title", content: HOME_TITLE },
      { name: "twitter:description", content: HOME_DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: HOME_URL }],
  }),
});

const t = {
  hero: {
    tag: { mm: "နမ့်စန်မြို့ ၏ ကိုယ်ပိုင် အစားအသောက်", en: "Made in Namsang, southern Shan State" },
    title_mm: "ပူပူနွေးနွေး ထမင်းတစ်ပွဲ", title_mm2: "အိမ်တိုင်ရာရောက်",
    title_en: "Hot food from the market,", title_en2: "on your doorstep.",
    sub: { mm: "နမ့်စန်ရဲ့ အကောင်းဆုံး ဆိုင်တွေက အစားအသောက်တွေကို ငွေသား၊ KBZPay နဲ့ Wave Pay ဖြင့် မှာယူပါ။", en: "The best kitchens in Namsang, delivered by motorbike. Pay by cash, KBZPay or Wave Pay." },
    order: { mm: "ယခုပဲ မှာယူမည်", en: "Order now" },
    partner: { mm: "ဆိုင်ရှင်အဖြစ် ပါဝင်ရန်", en: "Become a partner" },
  },
  stats: [
    { v: "50+", l: { mm: "ဆိုင်နှင့် စျေးဆိုင်", en: "Kitchens & stalls" } },
    { v: "20 မိနစ်", l: { mm: "ပျမ်းမျှ ပို့ဆောင်ချိန်", en: "Avg delivery time" } },
    { v: "1,500 Ks", l: { mm: "စတင် ပို့ဆောင်ခ", en: "Delivery from" } },
    { v: "4.9 ★", l: { mm: "ဖောက်သည် အဆင့်သတ်မှတ်ချက်", en: "Customer rating" } },
  ],
  featured: { mm: "ယနေ့ ရနိုင်သော အစားအစာများ", en: "Featured today" },
  dishes: [
    { img: dishShan, name_mm: "ရှမ်းခေါက်ဆွဲ", name_en: "Shan noodles", price: "2,500 Ks", stall: "မယ်ဒေါ်မိန်း" },
    { img: dishMohinga, name_mm: "မုန့်ဟင်းခါး", name_en: "Mohinga", price: "1,800 Ks", stall: "ရွှေမြန်မာ" },
    { img: dishLahpet, name_mm: "လက်ဖက်သုပ်", name_en: "Tea leaf salad", price: "2,000 Ks", stall: "ဒေါ်ခင်" },
  ],
  how: { mm: "ဘယ်လိုအလုပ်လုပ်လဲ", en: "How it works" },
  steps: [
    { i: Store, mm: "ဆိုင်ရွေးပါ", en: "Pick a stall", d_mm: "ဒေသခံဆိုင်တွေရဲ့ မီနူးကို ကြည့်ပါ။", d_en: "Browse menus from local kitchens near you." },
    { i: ShoppingBag, mm: "မှာယူပါ", en: "Place order", d_mm: "မှတ်ချက်ရေးပါ — 'အစပ်နည်းနည်း' လိုမျိုး။", d_en: "Add notes like 'not spicy' or 'extra chili'." },
    { i: Wallet, mm: "ငွေပေးချေပါ", en: "Pay easy", d_mm: "ငွေသား၊ KBZPay သို့မဟုတ် Wave Pay ဖြင့်။", d_en: "Cash on delivery, KBZPay, or Wave Pay." },
    { i: Bike, mm: "ရရှိပါ", en: "Get it hot", d_mm: "ဆိုင်ကယ်သမား ၂၀ မိနစ်အတွင်း ပို့ဆောင်ပါလိမ့်မည်။", d_en: "Motorbike rider brings it in ~20 minutes." },
  ],
  pay: { mm: "လွယ်ကူသော ငွေပေးချေမှုနည်းလမ်းများ", en: "Pay the way Namsang pays" },
  payDesc: { mm: "အပြည်ပြည်ဆိုင်ရာ ဘဏ်ကတ်တွေ မလိုပါ။ သင်လက်ရှိသုံးနေတဲ့ နည်းလမ်းတွေအားလုံး လက်ခံပါတယ်။", en: "No international cards required. Every payment method your neighbours already use." },
  cta_title: { mm: "အစပြုရန် အသင့်ဖြစ်ပြီလား", en: "Hungry yet?" },
  cta_sub: { mm: "Mg Win နဲ့ ပထမဆုံး မှာယူမှုအတွက် ၂၀% လျှော့စျေးရယူပါ။", en: "Get 20% off your first order when you sign up today." },
  cta_btn: { mm: "ဆိုင်များကို ကြည့်မည်", en: "Browse restaurants" },
  cta_btn2: { mm: "ဆိုင်ရှင်လား? ဒီမှာ", en: "Own a stall? Join here" },
  foot: { mm: "နမ့်စန်, တောင်ပိုင်းရှမ်းပြည်နယ်", en: "Namsang, southern Shan State" },
} as const;

function Landing() {
  const { lang, L } = useApp();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <AppHeader />

      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-24 md:pt-24 md:pb-32 grid md:grid-cols-2 gap-12 items-center relative">
          <div className="animate-float-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-3 py-1 text-xs text-accent mb-6">
              <Sparkles className="w-3 h-3" />
              {L(t.hero.tag)}
            </div>

            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-[1.05] tracking-tight">
              {lang === "mm" ? (
                <span className="font-mm">
                  {t.hero.title_mm}<br />
                  <span className="text-gradient-ember italic">{t.hero.title_mm2}</span>
                </span>
              ) : (
                <>
                  {t.hero.title_en}<br />
                  <span className="text-gradient-ember italic">{t.hero.title_en2}</span>
                </>
              )}
            </h1>

            <p className={`mt-6 max-w-lg text-base sm:text-lg text-muted-foreground ${lang === "mm" ? "font-mm" : ""}`}>
              {L(t.hero.sub)}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/restaurants" className="group inline-flex items-center gap-2 rounded-full bg-gradient-ember px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-ember hover:scale-105 transition-transform">
                {L(t.hero.order)}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#partner" className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-7 py-3.5 text-sm font-semibold hover:bg-card transition-colors">
                <Store className="w-4 h-4" />
                {L(t.hero.partner)}
              </a>
            </div>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl">
              {t.stats.map((s, i) => (
                <div key={i} className="animate-float-up" style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
                  <div className="font-display text-2xl text-gradient-ember">{s.v}</div>
                  <div className={`text-xs text-muted-foreground mt-1 ${lang === "mm" ? "font-mm" : ""}`}>{L(s.l)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-float-up" style={{ animationDelay: "0.2s" }}>
            <div className="absolute -inset-8 bg-gradient-ember opacity-20 blur-3xl rounded-full animate-ember-pulse" />
            <div className="relative rounded-3xl overflow-hidden shadow-soft ring-1 ring-border/50">
              <img src={heroFood} alt="Burmese street food at dusk" width={1600} height={1200} className="w-full h-[420px] md:h-[560px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-72 rounded-2xl bg-background/85 backdrop-blur-xl border border-border p-4 shadow-ember animate-float-up" style={{ animationDelay: "0.6s" }}>
                <div className="flex items-center gap-3">
                  <img src={dishShan} alt="" width={48} height={48} loading="lazy" className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{lang === "mm" ? "ရှမ်းခေါက်ဆွဲ ×၂" : "Shan noodles ×2"}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {lang === "mm" ? "၁၈ မိနစ်ကြာလိမ့်မည်" : "Arriving in 18 min"}</div>
                  </div>
                  <div className="text-sm font-semibold text-accent">5,000 Ks</div>
                </div>
                <div className="mt-3 h-1 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-gradient-ember rounded-full" />
                </div>
              </div>

              <div className="absolute top-6 right-6 rounded-full bg-background/85 backdrop-blur-xl border border-border px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-accent text-accent" /> 4.9
              </div>
            </div>
          </div>
        </div>

        <div className="border-y border-border/50 bg-card/30 overflow-hidden py-4">
          <div className="flex whitespace-nowrap animate-marquee">
            {Array.from({ length: 2 }).map((_, k) => (
              <div key={k} className="flex items-center gap-12 px-6 text-muted-foreground text-sm shrink-0">
                {["ရှမ်းခေါက်ဆွဲ", "မုန့်ဟင်းခါး", "လက်ဖက်သုပ်", "အုန်းနို့ခေါက်ဆွဲ", "ကြက်သားထမင်း", "အာလူးကြော်", "ကြာဇံကြော်", "မုန့်တီ", "ကြက်ဥသုပ်"].map((n, i) => (
                  <span key={i} className="font-mm flex items-center gap-3">
                    <Flame className="w-3.5 h-3.5 text-primary" />
                    {n}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-xs uppercase tracking-widest text-accent mb-2">Featured</div>
            <h2 className={`font-display text-4xl md:text-5xl ${lang === "mm" ? "font-mm" : ""}`}>{L(t.featured)}</h2>
          </div>
          <Link to="/restaurants" className="hidden sm:inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            {lang === "mm" ? "အားလုံးကြည့်ရန်" : "View all"} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {t.dishes.map((d, i) => (
            <Link to="/restaurants" key={i}
              className="group relative rounded-3xl overflow-hidden bg-card border border-border/60 hover:border-primary/60 transition-all hover:-translate-y-1 hover:shadow-ember"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={d.img} alt={d.name_en} width={800} height={600} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                <div className="absolute top-4 left-4 rounded-full bg-background/80 backdrop-blur-xl px-2.5 py-1 text-xs flex items-center gap-1">
                  <Star className="w-3 h-3 fill-accent text-accent" /> 4.{8 + i % 2}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-baseline justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className={`font-semibold text-lg truncate ${lang === "mm" ? "font-mm" : ""}`}>
                      {lang === "mm" ? d.name_mm : d.name_en}
                    </h3>
                    <p className={`text-xs text-muted-foreground mt-0.5 ${lang === "mm" ? "font-mm" : ""}`}>{d.stall}</p>
                  </div>
                  <div className="font-display text-lg text-gradient-ember shrink-0">{d.price}</div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> 15–20 min</span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> 1.2 km</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW */}
      <section className="relative py-24 bg-card/30 border-y border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs uppercase tracking-widest text-accent mb-2">Simple</div>
            <h2 className={`font-display text-4xl md:text-5xl ${lang === "mm" ? "font-mm" : ""}`}>{L(t.how)}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.steps.map((s, i) => {
              const Icon = s.i;
              return (
                <div key={i} className="relative rounded-3xl bg-background border border-border/60 p-6 hover:border-primary/60 transition-colors">
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-ember text-primary-foreground text-xs font-bold flex items-center justify-center shadow-ember">
                    {i + 1}
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className={`font-semibold text-lg ${lang === "mm" ? "font-mm" : ""}`}>{lang === "mm" ? s.mm : s.en}</h3>
                  <p className={`text-sm text-muted-foreground mt-2 ${lang === "mm" ? "font-mm" : ""}`}>{lang === "mm" ? s.d_mm : s.d_en}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PAYMENTS + RIDER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-24 grid md:grid-cols-2 gap-8">
        <div className="rounded-3xl bg-gradient-to-br from-card to-background border border-border p-8 md:p-10 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          <div className="relative">
            <Wallet className="w-8 h-8 text-primary mb-4" />
            <h3 className={`font-display text-3xl mb-3 ${lang === "mm" ? "font-mm" : ""}`}>{L(t.pay)}</h3>
            <p className={`text-muted-foreground mb-6 ${lang === "mm" ? "font-mm" : ""}`}>{L(t.payDesc)}</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { n: "Cash", c: "oklch(0.82 0.15 85)" },
                { n: "KBZPay", c: "oklch(0.65 0.22 25)" },
                { n: "Wave Pay", c: "oklch(0.60 0.20 280)" },
              ].map((p) => (
                <div key={p.n} className="rounded-2xl border border-border bg-background/60 p-4 text-center">
                  <div className="w-8 h-8 rounded-full mx-auto mb-2" style={{ backgroundColor: p.c }} />
                  <div className="text-xs font-semibold">{p.n}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/30 p-8 md:p-10 relative overflow-hidden">
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
          <div className="relative">
            <Bike className="w-8 h-8 text-accent mb-4" />
            <h3 className={`font-display text-3xl mb-3 ${lang === "mm" ? "font-mm" : ""}`}>
              {lang === "mm" ? "ဒေသခံ ဆိုင်ကယ်သမားများ" : "Local motorbike riders"}
            </h3>
            <p className={`text-muted-foreground mb-6 ${lang === "mm" ? "font-mm" : ""}`}>
              {lang === "mm"
                ? "နမ့်စန်ကို ကောင်းစွာသိတဲ့ ဒေသခံ ဆိုင်ကယ်သမားများ။ လမ်းအမည်မလိုပါ — မှတ်ချက်နဲ့ ဖုန်းနံပါတ်ပဲ လုံလောက်ပါတယ်။"
                : "Riders who know every alley in Namsang. No formal address needed — a landmark note and phone number is enough."}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-ember ring-2 ring-background flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {["ကို", "မ", "ဦ", "ဒေါ်"][i - 1]}
                  </div>
                ))}
              </div>
              <div>
                <div className="text-sm font-semibold">
                  {lang === "mm" ? "၁၂ ဦး လက်ရှိ အွန်လိုင်း" : "12 riders online now"}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3" /> {lang === "mm" ? "ရိုးရှင်းသော ဖုန်းခေါ်ဆိုမှု" : "Simple phone call to coordinate"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-24">
        <div className="relative rounded-[2rem] overflow-hidden bg-gradient-ember p-10 md:p-16 text-center shadow-ember">
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: "radial-gradient(circle at 20% 30%, oklch(1 0 0 / 0.3), transparent 40%), radial-gradient(circle at 80% 70%, oklch(0 0 0 / 0.3), transparent 40%)",
          }} />
          <div className="relative">
            <Flame className="w-10 h-10 mx-auto text-primary-foreground mb-4" />
            <h2 className={`font-display text-4xl md:text-6xl text-primary-foreground ${lang === "mm" ? "font-mm" : ""}`}>{L(t.cta_title)}</h2>
            <p className={`mt-4 text-primary-foreground/80 max-w-xl mx-auto ${lang === "mm" ? "font-mm" : ""}`}>{L(t.cta_sub)}</p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link to="/restaurants" className="rounded-full bg-background text-foreground px-7 py-3.5 text-sm font-semibold hover:scale-105 transition-transform">{L(t.cta_btn)}</Link>
              <a id="partner" href="#" className="rounded-full border-2 border-primary-foreground/30 text-primary-foreground px-7 py-3.5 text-sm font-semibold hover:bg-primary-foreground/10 transition-colors">{L(t.cta_btn2)}</a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/50 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-ember flex items-center justify-center"><Flame className="w-4 h-4 text-primary-foreground" /></div>
            <span className="font-display text-base text-foreground">Mg Win</span>
            <span className="hidden sm:inline">·</span>
            <span className={`hidden sm:inline ${lang === "mm" ? "font-mm" : ""}`}>{L(t.foot)}</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <span>© 2026 Mg Win</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
