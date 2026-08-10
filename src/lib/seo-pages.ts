import { RESTAURANTS, MENU, type MenuItem, type Restaurant } from "./mgwin";

const SITE = "https://mgwin-eats-fast.lovable.app";

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const absoluteUrl = (path: string) => `${SITE}${path.startsWith("/") ? path : `/${path}`}`;

/* ---------------- Restaurants ---------------- */

export type RestaurantPage = Restaurant & { slug: string; items: MenuItem[] };

export const RESTAURANT_PAGES: RestaurantPage[] = RESTAURANTS.map((r) => ({
  ...r,
  slug: slugify(r.name_en),
  items: MENU.filter((m) => m.restaurantId === r.id),
}));

export const getRestaurantPage = (slug: string) => RESTAURANT_PAGES.find((r) => r.slug === slug);

/* ---------------- Dishes ---------------- */

export type DishOffer = { restaurant: Restaurant; item: MenuItem };
export type DishPage = {
  slug: string;
  name_en: string;
  name_mm: string;
  desc_en: string;
  desc_mm: string;
  image: string;
  category_en: string;
  category_mm: string;
  minPrice: number;
  maxPrice: number;
  offers: DishOffer[];
};

const dishMap = new Map<string, DishPage>();
for (const item of MENU) {
  const restaurant = RESTAURANTS.find((r) => r.id === item.restaurantId);
  if (!restaurant) continue;
  const slug = slugify(item.name_en);
  const existing = dishMap.get(slug);
  if (existing) {
    existing.offers.push({ restaurant, item });
    existing.minPrice = Math.min(existing.minPrice, item.price);
    existing.maxPrice = Math.max(existing.maxPrice, item.price);
  } else {
    dishMap.set(slug, {
      slug,
      name_en: item.name_en,
      name_mm: item.name_mm,
      desc_en: item.desc_en,
      desc_mm: item.desc_mm,
      image: item.image,
      category_en: item.category_en,
      category_mm: item.category_mm,
      minPrice: item.price,
      maxPrice: item.price,
      offers: [{ restaurant, item }],
    });
  }
}

export const DISH_PAGES: DishPage[] = [...dishMap.values()].sort(
  (a, b) => b.offers.length - a.offers.length || a.name_en.localeCompare(b.name_en),
);

export const getDishPage = (slug: string) => DISH_PAGES.find((d) => d.slug === slug);

/* ---------------- Editorial copy ---------------- */

export const DISH_NOTES: Record<string, { en: string; mm: string }> = {
  "shan-noodles": {
    en: "Shan noodles (shan khauk swe) are the signature dish of Shan State: rice noodles tossed or served in a light broth with marinated chicken or pork mince, chili oil, pickled mustard greens and crushed peanuts. In Namsang they are eaten for breakfast and late-night supper alike.",
    mm: "ရှမ်းခေါက်ဆွဲသည် ရှမ်းပြည်နယ်၏ အထင်ကရ အစားအစာဖြစ်ပြီး ကြက်သား/ဝက်သားချော၊ ငရုတ်ဆီ၊ မုန်ညင်းချဉ်နှင့် မြေပဲမွေးတို့ဖြင့် စားသုံးသည်။ နမ့်စန်တွင် မနက်စာအဖြစ်လည်း ညစာအဖြစ်လည်း လူကြိုက်များသည်။",
  },
  mohinga: {
    en: "Mohinga is Myanmar's national dish — a catfish and toasted-rice broth poured over thin rice noodles, finished with crispy fritters, coriander, lime and chili flakes. Namsang stalls cook a lighter, hill-town version.",
    mm: "မုန့်ဟင်းခါးသည် မြန်မာနိုင်ငံ၏ အမျိုးသားအစားအစာဖြစ်သည်။ ငါးခုနှင့် ဆန်လှော်မှုန့်ဟင်းရည်ကို ခေါက်ဆွဲပေါ်လောင်း၍ ကြော်၊ နံနံပင်၊ သံပုရာနှင့် ငရုတ်သီးမှုန့်ဖြင့် စားသုံးသည်။",
  },
  "tea-leaf-salad": {
    en: "Tea leaf salad (lahpet thoke) mixes fermented tea leaves with fried garlic, peanuts, sesame, tomato and a squeeze of lime — savoury, bitter, crunchy, and uniquely Burmese.",
    mm: "လက်ဖက်သုပ်သည် လက်ဖက်ချဉ်နှင့် ကြက်သွန်ကြော်၊ မြေပဲ၊ နှမ်း၊ ခရမ်းချဉ်သီးနှင့် သံပုရာရည်တို့ကို သုပ်ထားသည့် မြန်မာရိုးရာအသုပ်ဖြစ်သည်။",
  },
  "coconut-noodles": {
    en: "Coconut noodles (ohn no khauk swe) are a rich, comforting bowl of chicken simmered in coconut milk and chickpea flour, ladled over egg noodles.",
    mm: "အုန်းနို့ခေါက်ဆွဲသည် အုန်းနို့နှင့် ကုလားပဲမှုန့်ထည့်ချက်သော ကြက်သားဟင်းရည်ကို ခေါက်ဆွဲပေါ်လောင်းစားသည့် အရသာထူးသော အစားအစာဖြစ်သည်။",
  },
  palata: {
    en: "Palata is a flaky, hand-stretched flatbread griddled until golden — eaten with sugar, with curry gravy, or torn into hot milk tea.",
    mm: "ပလာတာသည် လက်ဖြင့်ဆွဲလိပ်၍ ကြော်ထားသော ဂျုံမုန့်ဖြစ်ပြီး သကြား၊ ဟင်းရည် သို့မဟုတ် လက်ဖက်ရည်နှင့် တွဲစားလေ့ရှိသည်။",
  },
  "chicken-rice": {
    en: "Namsang chicken rice pairs poached chicken with rice cooked in its stock, served with a clear soup and a fiery chili-garlic dip.",
    mm: "ကြက်သားထမင်းသည် ကြက်သားပြုတ်နှင့် ကြက်ဟင်းရည်ဖြင့် ချက်ထားသော ထမင်းကို ချဉ်ရည်နှင့် ငရုတ်သီးအာချက်ဖြင့် တွဲစားသည်။",
  },
  "strong-milk-tea": {
    en: "Burmese milk tea (lahpet ye) is brewed strong and sweetened with condensed milk — the fuel of every Namsang tea house morning.",
    mm: "လက်ဖက်ရည်ကြမ်းသည် နို့ဆီထည့်၍ ချိုအရသာဖြင့် သောက်သည့် မြန်မာရိုးရာယမကာဖြစ်သည်။",
  },
};
