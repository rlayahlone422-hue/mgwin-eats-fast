import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin, Clock, Flame, ChefHat, Utensils, ShoppingBag,
  ChevronRight, Star, Info,
} from "lucide-react";

import dishShan from "@/assets/dish-shan.jpg";
import dishMohinga from "@/assets/dish-mohinga.jpg";
import dishLahpet from "@/assets/dish-lahpet.jpg";
import { AppHeader } from "@/components/AppHeader";
import { useApp } from "@/lib/mgwin-store";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: "Burmese & Shan Food Guide: Namsang Street Food Dishes | Mg Win" },
      { name: "description", content: "Discover the best Burmese and Shan food in Namsang, southern Shan State. From Shan noodles and mohinga to tea leaf salad, find authentic street food history and where to eat it in Namsang." },
      { property: "og:title", content: "Burmese & Shan Food Guide: Namsang Street Food Dishes" },
      { property: "og:description", content: "Discover the best Burmese and Shan food in Namsang. From Shan noodles and mohinga to tea leaf salad, find authentic street food history and where to eat it." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://mgwin-eats-fast.lovable.app/guide" },
      { property: "og:image", content: "https://mgwin-eats-fast.lovable.app/guide-hero.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Burmese & Shan Food Guide: Namsang Street Food Dishes" },
      { name: "twitter:description", content: "Discover the best Burmese and Shan food in Namsang. From Shan noodles and mohinga to tea leaf salad, find authentic street food history and where to eat it." },
      { name: "twitter:image", content: "https://mgwin-eats-fast.lovable.app/guide-hero.jpg" },
    ],
    links: [
      { rel: "canonical", href: "https://mgwin-eats-fast.lovable.app/guide" },
    ],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Burmese & Shan Food Guide: Namsang Street Food Dishes",
        description: "A local guide to the best Burmese and Shan food in Namsang, southern Shan State, Myanmar.",
        image: "https://mgwin-eats-fast.lovable.app/guide-hero.jpg",
        author: { "@type": "Organization", name: "Mg Win" },
        publisher: { "@type": "Organization", name: "Mg Win" },
        mainEntityOfPage: { "@type": "WebPage", "@id": "https://mgwin-eats-fast.lovable.app/guide" },
      }),
    }],
  }),
  component: GuidePage,
});

const t = {
  eyebrow: { mm: "အစားအသောက်လမ်းညွှန်", en: "Food guide" },
  title_mm: "နမ့်စန်မြို့ရဲ့ အကောင်းဆုံး ရှမ်းနှင့် မြန်မာအစားအစာများ",
  title_en: "The Best Burmese & Shan Food in Namsang",
  sub_mm: "တောင်ပိုင်းရှမ်းပြည်နယ် နမ့်စန်မြို့ရဲ့ ရိုးရာဈေးလမ်းအစားအစာများကို သိရှိပြီး ဘယ်ဆိုင်မှာ ရနိုင်လဲ ဆိုတာ ရှာပါ။",
  sub_en: "Explore the traditional street food of Namsang, southern Shan State, and learn where to find each dish from the kitchens that make it best.",
  cta: { mm: "ဆိုင်များကို ကြည့်မည်", en: "Browse restaurants" },
  intro: {
    h2: { mm: "နမ့်စန်အစားအစာဟာ ဘာလွဲပြားလဲ", en: "What makes Namsang food different" },
    p: {
      mm: "တောင်ပိုင်းရှမ်းပြည်နယ်၏ နံရံတောင်ခြေတွင် တည်ရှိသော နမ့်စန်မြို့သည် ရှမ်းတိုင်းရင်းသားနှင့် မြန်မာတိုင်းရင်းသားတို့၏ စားသောက်မှုယဉ်ကျေးမှုများ ပေါင်းစပ်နေသော နေရာဖြစ်သည်။ ဤမြို့တွင် ရှမ်းခေါက်ဆွဲ၊ မုန့်ဟင်းခါး၊ လက်ဖက်သုပ်၊ အုန်းနို့ခေါက်ဆွဲ၊ ပလာတာနှင့် ကြက်သားထမင်း အစရှိသော အရသာရှိသော အစားအစာများကို လမ်းဘေးဈေးဆိုင်များနှင့် အိမ်တွင်းခေါက်ဆွဲဆိုင်များတွင် ရှာဖွေနိုင်သည်။",
      en: "Namsang, a small town in the southern foothills of Shan State, is where Shan and Burmese food traditions overlap. Here, street-side stalls and home kitchens serve Shan noodles, mohinga, tea leaf salad, coconut noodles, palata, and chicken rice — dishes that are simple, filling, and deeply rooted in the region's history.",
    },
  },
  dishes: {
    h2: { mm: "ထိပ်တိုက်ရ.stockရမည့် အစားအစာများ", en: "Top Namsang street food dishes" },
    list: [
      {
        id: "shan-noodles",
        img: dishShan,
        name_mm: "ရှမ်းခေါက်ဆွဲ",
        name_en: "Shan noodles",
        tagline_mm: "ရှမ်းရိုးရာစားသောက်မှု၏ နှလုံးသား",
        tagline_en: "The heart of Shan cuisine",
        history: {
          mm: "ရှမ်းခေါက်ဆွဲသည် ရှမ်းပြည်နယ်မှ အကျော်ကြားဆုံး အစားအစာဖြစ်ပြီး အရိုးရငွေ့သော ငှက်ပျောသီးမှ လက်တီခေါက်ဆွဲ၊ ကြက်သားချော၊ ငရုတ်ဆီ၊ ဟင်းနုနွယ်ရွက်နှင့် ဆီတို့ဖြင့် ပြုလုပ်သည်။ မနက်အစာအဖြစ် စားတတ်ပြီး နံနက်လည်နဲ့ ညဘက်တွင်လည်း နွေးထွေးစွာ ချက်ပြုတ်ပေးသည်။",
          en: "Shan noodles are the most famous dish to come out of Shan State. They are made with rice noodles, minced chicken, fragrant chili oil, garlic, and scallions, often finished with a spoon of savory broth. Locals eat them for breakfast, but stalls keep them warm well into the evening.",
        },
        find: {
          mm: "မယ်ဒေါ်မိန်း ရှမ်းခေါက်ဆွဲ (မြို့မလမ်း) တွင် ကြက်သားချောနှင့်အတူ ၂,၅၀၀ ကျပ်ဖြင့် ရရှိနိုင်သည်။",
          en: "Find them at May Daw Mein Shan Noodles on Myoma Road, served with chicken mince for 2,500 Ks.",
        },
      },
      {
        id: "mohinga",
        img: dishMohinga,
        name_mm: "မုန့်ဟင်းခါး",
        name_en: "Mohinga",
        tagline_mm: "မြန်မာ့ အမျိုးသားအစားအစာ",
        tagline_en: "Myanmar's national dish",
        history: {
          mm: "မုန့်ဟင်းခါးသည် မြန်မာနိုင်ငံတွင် နံနက်အစာအဖြစ် အကျော်ကြားဆုံး ဟင်းနင်းခါးဖြစ်သည်။ ငါးနှင့်ကြက်သားဖြင့် ချက်သော ဟင်းရည်တွင် ထန်းသီးနှစ်၊ ငရုတ်သီးနှင့် အာလူးကြော်တို့ထည့်သွင်းသည်။ နမ့်စန်တွင် ဘုရားလမ်းနှင့် ဈေးလမ်းအနီးရှိဆိုင်များတွင် နံနက် ၅ နာရီမှ ၁၀ နာရီအထိ ရရှိနိုင်သည်။",
          en: "Mohinga is Myanmar's most famous breakfast — a fish-and-chicken noodle soup thickened with banana-tree stem, spiced with chili, and served with crisp fritters. In Namsang, it is available from around 5 a.m. until mid-morning near the market and Pagoda Road.",
        },
        find: {
          mm: "ရွှေမြန်မာ မုန့်ဟင်းခါး (ဗိုလ်ချုပ်လမ်း) တွင် ၁,၈၀၀ ကျပ်ဖြင့် စဉ်းစားလောက်စရာ အရသာရှိသော ဟင်းခါးကို ရရှိနိုင်သည်။",
          en: "Shwe Myanmar Mohinga on Bogyoke Street serves a classic bowl for 1,800 Ks.",
        },
      },
      {
        id: "tea-leaf-salad",
        img: dishLahpet,
        name_mm: "လက်ဖက်သုပ်",
        name_en: "Tea leaf salad",
        tagline_mm: "ရိုးရာဧည့်ခံပွဲ၏ အဓိကအစိတ်",
        tagline_en: "A centerpiece of Burmese hospitality",
        history: {
          mm: "လက်ဖက်သုပ်သည် အရက်သုပ်ထားသော လက်ဖက်ရွက်ကို မြေပဲ၊ ငါးပိ၊ ကြက်သွန်ကြော်၊ သံပုရာသီး၊ ဟင်းနုနွယ်ရွက် နှင့် နှမ်းဆီတို့နှင့် ရောစပ်ထားခြင်း ဖြစ်သည်။ ရှမ်းနှင့် မြန်မာနှစ်မျိုးလုံးတွင် ချစ်ခင်ရာလာရာ ဧည့်ခံသောက်စရာ အဖြစ် အသုံးပြုပြီး နမ့်စန်ရှိ လက်ဖက်ရည်ဆိုင်များတွင် အရောင်းရဆုံး ဖြစ်သည်။",
          en: "Tea leaf salad is made from fermented tea leaves mixed with peanuts, dried fish, fried garlic, sesame seeds, lime, and scallions. It is a shared dish of welcome in both Shan and Burmese homes, and it is the best-selling snack in Namsang's tea shops.",
        },
        find: {
          mm: "ဒေါ်ခင် လက်ဖက်သုပ် (ဈေးလမ်း) တွင် ၂,၀၀၀ ကျပ်ဖြင့် မြေပဲနှင့် ကြက်သွန်ကြော်အပြည့်အဝ ပါဝင်သည်။",
          en: "Daw Khin Tea Leaf Salad on Market Lane serves a generous bowl for 2,000 Ks.",
        },
      },
      {
        id: "coconut-noodles",
        img: dishShan,
        name_mm: "အုန်းနို့ခေါက်ဆွဲ",
        name_en: "Coconut noodles",
        tagline_mm: "ချိုမြိန်သော နံရံတောင်ရဟန်း",
        tagline_en: "A creamy southern Shan classic",
        history: {
          mm: "အုန်းနို့ခေါက်ဆွဲသည် ရှမ်းခေါက်ဆွဲနှင့် ဆင်ဆင်တူသော်လည်း အုန်းနို့ဖြင့် ထမင်းရည်ကို ပြောင်းလဲခြင်းဖြင့် ပိုမိုချိုမြိန်သည်။ ကြက်သားကို ငရုတ်ဆီနှင့် ကြော်ပြီး အုန်းနို့ထမင်းရည်အပေါ်တွင် ထည့်သည်။",
          en: "Coconut noodles are a close cousin to Shan noodles, but the broth is made creamy with coconut milk. The chicken is often fried in chili oil and placed on top, giving each bite a mix of richness and heat.",
        },
        find: {
          mm: "မယ်ဒေါ်မိန်း ရှမ်းခေါက်ဆွဲ တွင် ၃,၀၀၀ ကျပ်ဖြင့် ရရှိနိုင်သည်။",
          en: "Also available at May Daw Mein Shan Noodles for 3,000 Ks.",
        },
      },
      {
        id: "palata",
        img: dishMohinga,
        name_mm: "ပလာတာ",
        name_en: "Palata",
        tagline_mm: "လက်ဖက်ရည်အတွက် ပါးပါးလေး",
        tagline_en: "Flaky flatbread for tea time",
        history: {
          mm: "ပလာတာသည် အိန္ဒိယတောင်းပြန်ချက်မှ ဖြစ်ပေါ်လာသော ဂျုံမုန့်လိပ်ဖြစ်ပြီး မြန်မာ့လက်ဖက်ရည်ဆိုင်များတွင် အတူတွဲစားရသော မုန့်ဖြစ်သည်။ ထ.layer.layer.layer ပေါင်းစပ်ထားသော မုန့်ကို ဆီနှင့် ကြော်ပြီး ကုလားပဲသော်အရည်နှင့် သုပ်စားကြသည်။",
          en: "Palata is a flaky, layered flatbread influenced by Indian paratha. It is fried in oil and served with a small bowl of chickpea curry — a classic pairing for late-afternoon tea.",
        },
        find: {
          mm: "မြို့မတီးဆိုင် (ဘုရားလမ်း) တွင် ၈၀၀ ကျပ်ဖြင့် ရရှိနိုင်ပြီး လက်ဖက်ရည်နှင့် အတူတွဲစားရသည်။",
          en: "Myoma Tea House on Pagoda Road serves palata for 800 Ks, best with strong milk tea.",
        },
      },
      {
        id: "chicken-rice",
        img: dishLahpet,
        name_mm: "ကြက်သားထမင်း",
        name_en: "Chicken rice",
        tagline_mm: "အာရှတစ်ဝှမ်းမှာ ခရီးသွားသူတို့အကြိုက်နီး",
        tagline_en: "A comfort dish loved across Southeast Asia",
        history: {
          mm: "နမ့်စန်တွင် ကြက်သားထမင်း၏ မြန်မာဗားရှင်းကို ကြက်သားပြုတ်၊ ချဉ်ရည်နှင့်ဟင်းခတ် ဟင်းရည်ဖြင့် တွဲဖက်စားသုံးသည်။ ဒေသခံကြက်သားထမင်း ဆိုင်များသည် နံနက်စာနှင့် ညစာအတွက် အထူးကျွမ်းကျင်သည်။",
          en: "Namsang's version of chicken rice features poached chicken, fragrant rice, and a small bowl of chicken soup on the side. Local stalls specialize in both breakfast and dinner service, often selling out before 8 p.m.",
        },
        find: {
          mm: "နမ့်စန်ကြက်သားထမင်း (စျေးရှေ့လမ်း) တွင် ၃,၅၀၀ ကျပ်ဖြင့် ရရှိနိုင်သည်။",
          en: "Try Namsang Chicken Rice on Front Market Road for 3,500 Ks.",
        },
      },
    ],
  },
  where: {
    h2: { mm: "နမ့်စန်တွင် အစားအစာကို ဘယ်မှာရမလဲ", en: "Where to find them in Namsang" },
    p: {
      mm: "အကောင်းဆုံးအရသာများကို မြို့မလမ်း၊ ဈေးလမ်း၊ ဗိုလ်ချုပ်လမ်း၊ ဘုရားလမ်း၊ စျေးရှေ့လမ်း၊ ကျောင်းလမ်းများရှိ အရပ်ဘေးဈေးဆိုင်များနှင့် အိမ်သာခေါက်ဆွဲဆိုင်များတွင် ရှာဖွေနိုင်သည်။ Mg Win သည် ထိုဆိုင်များထံမှ အစားအစာများကို မက်ဆင်အပ်ပ်လခြေဖြင့် အိမ်တိုင်ရာရောက် ပို့ဆောင်ပေးသည်။",
      en: "The best flavors are scattered along Myoma Road, Market Lane, Bogyoke Street, Pagoda Road, Front Market Road, and School Road. Mg Win partners with the stalls on these streets and delivers their food to your door by motorbike.",
    },
    cta: { mm: "ဆိုင်များစာရင်း ကြည့်ရန်", en: "See the full list of stalls" },
  },
  how: {
    h2: { mm: "Mg Win ဖြင့် ဘယ်လိုမှာယူမလဲ", en: "How to order with Mg Win" },
    steps: [
      { mm: "ဆိုင်တစ်ဆိုင်ကို ရွေးပါ", en: "Pick a stall" },
      { mm: "အစားအစာနှင့် မှတ်ချက်ထည့်ပါ", en: "Add dishes and notes" },
      { mm: "ငွေသား၊ KBZPay သို့မဟုတ် Wave Pay ဖြင့် ပေးချေပါ", en: "Pay with cash, KBZPay, or Wave Pay" },
      { mm: "၂၀ မိနစ်ခန့်တွင် ရရှိပါလိမ့်မည်", en: "Receive it in about 20 minutes" },
    ],
  },
  faq: {
    h2: { mm: "အမြဲမေးသော မေးခွန်းများ", en: "Frequently asked questions" },
    items: [
      {
        q: { mm: "နမ့်စန်တွင် ဘယ်အစားအစာကို အရင်စားသင့်‌သလဲ", en: "What should I eat first in Namsang?" },
        a: { mm: "ရှမ်းခေါက်ဆွဲဖြင့် စတင်ပါ။ ထို့နောက် မုန့်ဟင်းခါးနှင့် လက်ဖက်သုပ် တို့ကို အနည်းငယ်ယူပါ။", en: "Start with Shan noodles, then add mohinga and tea leaf salad. That trio covers the essential flavors of the town." },
      },
      {
        q: { mm: "နမ့်စန်အစားအစာများကို ဘယ်လိုငွေပေးချေနိုင်လဲ", en: "How do I pay for food in Namsang?" },
        a: { mm: "ငွေသား၊ KBZPay၊ နှင့် Wave Pay တို့ဖြင့် ပေးချေနိုင်သည်။ Mg Win မှာယူမှုများတွင် သုံးနည်းသုံးဟန်စနစ်များအားလုံး ပါဝင်သည်။", en: "Cash, KBZPay, and Wave Pay are all accepted. Mg Win supports all three payment methods at checkout." },
      },
      {
        q: { mm: "Mg Win သည် နမ့်စန်အတွင်းဘယ်လောက်ဝေးလ_SAMPLERပို့ဆောင်လဲ", en: "How far does Mg Win deliver in Namsang?" },
        a: { mm: "Mg Win သည် ၁၀ ကီလိုမီတာအထိ ပို့ဆောင်ပြီး အပိုဆေးအဖြစ် ၁,၅၀၀ မှ ၄,၀၀၀ ကြားရှိသည်။", en: "Mg Win delivers up to 10 km from the town center, with delivery fees from 1,500 to 4,000 Ks depending on distance." },
      },
    ],
  },
} as const;

function GuidePage() {
  const { lang, L } = useApp();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <AppHeader />

      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-12 pb-20 md:pt-20 md:pb-28">
          <div className="animate-float-up text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-3 py-1 text-xs text-accent mb-5">
              <Utensils className="w-3 h-3" />
              {L(t.eyebrow)}
            </div>

            <h1 className={`font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight ${lang === "mm" ? "font-mm" : ""}`}>
              {lang === "mm" ? t.title_mm : t.title_en}
            </h1>

            <p className={`mt-6 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground ${lang === "mm" ? "font-mm" : ""}`}>
              {lang === "mm" ? t.sub_mm : t.sub_en}
            </p>

            <div className="mt-8 flex justify-center">
              <Link to="/restaurants" className="group inline-flex items-center gap-2 rounded-full bg-gradient-ember px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-ember hover:scale-105 transition-transform">
                {L(t.cta)}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="mt-14 relative rounded-3xl overflow-hidden shadow-soft ring-1 ring-border/50 animate-float-up" style={{ animationDelay: "0.2s" }}>
            <img
              src="/guide-hero.jpg"
              alt="Burmese and Shan street food dishes in Namsang, Myanmar"
              width={1440}
              height={960}
              className="w-full h-[360px] md:h-[520px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <div className="max-w-3xl">
                <div className="text-xs uppercase tracking-widest text-accent mb-2">Namsang, southern Shan State</div>
                <p className="text-sm md:text-base text-muted-foreground">
                  {lang === "mm"
                    ? "ရှမ်းခေါက်ဆွဲ၊ မုန့်ဟင်းခါး၊ လက်ဖက်သုပ်၊ ပလာတာ — အိမ်အနီးအနားမှ ဈေးဆိုင်များနှင့် အိမ်တွင်းချက်ပြုတ်သူများထံမှ လက်ရာစင်မြfonyသော အရသာများ"
                    : "Shan noodles, mohinga, tea leaf salad, palata — authentic flavors from nearby street stalls and home kitchens."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-xs uppercase tracking-widest text-accent mb-2">About</div>
          <h2 className={`font-display text-3xl md:text-4xl mb-5 ${lang === "mm" ? "font-mm" : ""}`}>
            {L(t.intro.h2)}
          </h2>
          <p className={`text-base md:text-lg text-muted-foreground leading-relaxed ${lang === "mm" ? "font-mm" : ""}`}>
            {L(t.intro.p)}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { v: "50+", l: { mm: "ဆိုင်နှင့် စျေးဆိုင်", en: "Kitchens & stalls" } },
            { v: "20 min", l: { mm: "ပျမ်းမျှ ပို့ဆောင်ချိန်", en: "Avg delivery" } },
            { v: "1,500 Ks", l: { mm: "ပို့ဆောင်ခ စတင်သည့်", en: "Delivery from" } },
            { v: "4.9 ★", l: { mm: "ဖောက်သည် အဆင့်သတ်မှတ်ချက်", en: "Customer rating" } },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl border border-border/60 bg-card/40 p-5 text-center">
              <div className="font-display text-2xl text-gradient-ember">{s.v}</div>
              <div className={`text-xs text-muted-foreground mt-1 ${lang === "mm" ? "font-mm" : ""}`}>{L(s.l)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DISHES */}
      <section className="bg-card/30 border-y border-border/50 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs uppercase tracking-widest text-accent mb-2">Must-try</div>
            <h2 className={`font-display text-4xl md:text-5xl ${lang === "mm" ? "font-mm" : ""}`}>
              {L(t.dishes.h2)}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {t.dishes.list.map((dish, i) => (
              <article key={dish.id} className="group rounded-3xl overflow-hidden bg-background border border-border/60 hover:border-primary/60 transition-all hover:-translate-y-1 hover:shadow-ember">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={dish.img}
                    alt={dish.name_en}
                    width={800}
                    height={500}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 rounded-full bg-background/80 backdrop-blur-xl px-2.5 py-1 text-xs flex items-center gap-1">
                    <Star className="w-3 h-3 fill-accent text-accent" /> 4.8
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className={`font-display text-2xl ${lang === "mm" ? "font-mm" : ""}`}>
                        {lang === "mm" ? dish.name_mm : dish.name_en}
                      </h3>
                      <p className="text-sm text-accent mt-1 italic">
                        {lang === "mm" ? dish.tagline_mm : dish.tagline_en}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <ChefHat className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <p className={`text-sm text-muted-foreground leading-relaxed mb-4 ${lang === "mm" ? "font-mm" : ""}`}>
                    {lang === "mm" ? dish.history.mm : dish.history.en}
                  </p>
                  <div className="flex items-start gap-3 rounded-2xl bg-secondary/40 p-4">
                    <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <p className={`text-sm ${lang === "mm" ? "font-mm" : ""}`}>
                      {lang === "mm" ? dish.find.mm : dish.find.en}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHERE TO FIND */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <div className="rounded-3xl bg-gradient-to-br from-card to-background border border-border p-8 md:p-12 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="text-xs uppercase tracking-widest text-accent mb-2">Locations</div>
              <h2 className={`font-display text-3xl md:text-4xl mb-4 ${lang === "mm" ? "font-mm" : ""}`}>
                {L(t.where.h2)}
              </h2>
              <p className={`text-muted-foreground mb-6 leading-relaxed ${lang === "mm" ? "font-mm" : ""}`}>
                {L(t.where.p)}
              </p>
              <Link to="/restaurants" className="group inline-flex items-center gap-2 rounded-full bg-gradient-ember px-6 py-3 text-sm font-semibold text-primary-foreground shadow-ember hover:scale-105 transition-transform">
                <ShoppingBag className="w-4 h-4" />
                {L(t.where.cta)}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { mm: "မြို့မလမ်း", en: "Myoma Road", d: "Shan noodles & chicken rice" },
                { mm: "ဈေးလမ်း", en: "Market Lane", d: "Tea leaf salad & snacks" },
                { mm: "ဗိုလ်ချုပ်လမ်း", en: "Bogyoke Street", d: "Mohinga & breakfast" },
                { mm: "ဘုရားလမ်း", en: "Pagoda Road", d: "Tea & palata" },
                { mm: "စျေးရှေ့လမ်း", en: "Front Market Road", d: "Chicken rice dinners" },
                { mm: "ကျောင်းလမ်း", en: "School Road", d: "Sweets & ice cream" },
              ].map((loc, i) => (
                <div key={i} className="rounded-2xl bg-background/60 border border-border/60 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span className="font-semibold text-sm">{lang === "mm" ? loc.mm : loc.en}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{loc.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW TO ORDER */}
      <section className="bg-card/30 border-y border-border/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs uppercase tracking-widest text-accent mb-2">Order</div>
            <h2 className={`font-display text-4xl md:text-5xl ${lang === "mm" ? "font-mm" : ""}`}>
              {L(t.how.h2)}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.how.steps.map((step, i) => {
              const icons = [StoreIcon, NoteIcon, WalletIcon, ClockIcon];
              const Icon = icons[i];
              return (
                <div key={i} className="relative rounded-3xl bg-background border border-border/60 p-6 hover:border-primary/60 transition-colors">
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-ember text-primary-foreground text-xs font-bold flex items-center justify-center shadow-ember">
                    {i + 1}
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className={`font-semibold text-lg ${lang === "mm" ? "font-mm" : ""}`}>
                    {lang === "mm" ? step.mm : step.en}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs uppercase tracking-widest text-accent mb-2">FAQ</div>
            <h2 className={`font-display text-4xl md:text-5xl ${lang === "mm" ? "font-mm" : ""}`}>
              {L(t.faq.h2)}
            </h2>
          </div>
          <div className="space-y-4">
            {t.faq.items.map((item, i) => (
              <div key={i} className="rounded-2xl border border-border/60 bg-card/30 p-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <h3 className={`font-semibold text-lg mb-2 ${lang === "mm" ? "font-mm" : ""}`}>
                      {lang === "mm" ? item.q.mm : item.q.en}
                    </h3>
                    <p className={`text-sm text-muted-foreground leading-relaxed ${lang === "mm" ? "font-mm" : ""}`}>
                      {lang === "mm" ? item.a.mm : item.a.en}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-24">
        <div className="rounded-3xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/30 p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
          <div className="relative">
            <Flame className="w-10 h-10 text-primary mx-auto mb-5" />
            <h2 className={`font-display text-3xl md:text-5xl mb-4 ${lang === "mm" ? "font-mm" : ""}`}>
              {lang === "mm" ? "ယခုပဲ ဟင်းလေးပြန်စားမယ်" : "Ready to taste Namsang?"}
            </h2>
            <p className={`text-muted-foreground max-w-2xl mx-auto mb-8 ${lang === "mm" ? "font-mm" : ""}`}>
              {lang === "mm"
                ? "Mg Win သည် နမ့်စန်ရှိ အကောင်းဆုံး ဆိုင်များထံမှ သင့်အိမ်သို့ တိုက်ရိုက်ပို့ဆောင်ပေးသည်။"
                : "Mg Win delivers the best stalls in Namsang straight to your door."}
            </p>
            <Link to="/restaurants" className="group inline-flex items-center gap-2 rounded-full bg-gradient-ember px-8 py-4 text-base font-semibold text-primary-foreground shadow-ember hover:scale-105 transition-transform">
              {L(t.cta)}
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-10 bg-card/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-primary" />
            <span className="font-display text-foreground">Mg Win</span>
            <span>— Namsang, southern Shan State</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/restaurants" className="hover:text-foreground transition-colors">Restaurants</Link>
            <Link to="/orders" className="hover:text-foreground transition-colors">My orders</Link>
            <Link to="/guide" className="text-foreground font-semibold">Food guide</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StoreIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M3 21h18" />
      <path d="M3 7v14" />
      <path d="M21 7v14" />
      <path d="M6 7l6-4 6 4" />
      <path d="M6 7h12" />
      <path d="M6 11a3 3 0 0 0 3 3" />
      <path d="M15 11a3 3 0 0 0 3 3" />
      <path d="M9 14h6" />
    </svg>
  );
}
function NoteIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}
function WalletIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
      <path d="M4 6v12a2 2 0 0 0 2 2h14v-4" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
    </svg>
  );
}
function ClockIcon(props: { className?: string }) {
  return <Clock {...props} />;
}
