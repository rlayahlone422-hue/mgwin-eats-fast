import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Phone, MapPin, Wallet, Check, ArrowLeft, Pin, Bike, Clock } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { MapPicker, type PickedLocation } from "@/components/MapPicker";
import { useApp } from "@/lib/mgwin-store";
import {
  formatKs,
  getMenuItem,
  getRestaurant,
  computeDeliveryFee,
  haversineKm,
  estimateEta,
  pinLabel,
  NAMSANG_CENTER,
  type PaymentMethod,
  PAYMENT_LABELS,
} from "@/lib/mgwin";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({ meta: [{ title: "Checkout — Mg Win" }] }),
});

function CheckoutPage() {
  const { lang, L, cart, cartSubtotal, placeOrder, lastPin } = useApp();
  const navigate = useNavigate();
  const restaurant = cart.restaurantId ? getRestaurant(cart.restaurantId) : null;

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pin, setPin] = useState<PickedLocation | null>(lastPin ?? null);
  const [addressAutoFilled, setAddressAutoFilled] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [payment, setPayment] = useState<PaymentMethod>("cash");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; address?: string }>({});
  const [prefilledFromLast, setPrefilledFromLast] = useState(false);

  // Hydrate from lastPin after localStorage load (initial useState runs before hydration effect)
  useEffect(() => {
    if (pin || !lastPin) return;
    setPin(lastPin);
    const lbl = pinLabel(lastPin, lang);
    if (lbl && !address.trim()) {
      setAddress(lbl);
      setAddressAutoFilled(true);
    }
    setPrefilledFromLast(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastPin]);

  const { distanceKm, deliveryFee } = useMemo(() => {
    if (!restaurant) return { distanceKm: null as number | null, deliveryFee: 0 };
    if (!pin) return { distanceKm: null, deliveryFee: restaurant.deliveryFee };
    const d = haversineKm(NAMSANG_CENTER, pin);
    return { distanceKm: d, deliveryFee: computeDeliveryFee(d) };
  }, [pin, restaurant]);

  const eta = useMemo(() => estimateEta(distanceKm), [distanceKm]);

  const total = cartSubtotal + deliveryFee;

  if (!restaurant || cart.lines.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <p className="text-muted-foreground">{lang === "mm" ? "စျေးခြင်း ဗလာဖြစ်နေသည်။" : "Your cart is empty."}</p>
          <Link to="/restaurants" className="mt-4 inline-block text-primary underline">
            {lang === "mm" ? "ဆိုင်များ" : "Browse restaurants"}
          </Link>
        </div>
      </div>
    );
  }

  const validate = () => {
    const e: typeof errors = {};
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 7 || cleanPhone.length > 15) e.phone = lang === "mm" ? "ဖုန်းနံပါတ် မှန်ကန်စွာ ရိုက်ထည့်ပါ" : "Enter a valid phone number";
    if (address.trim().length < 5) e.address = lang === "mm" ? "လိပ်စာ အနည်းဆုံး ၅ လုံး လိုအပ်သည်" : "Address must be at least 5 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    setSubmitting(true);
    const parts = [address.trim()];
    if (landmark.trim()) parts.push(landmark.trim());
    if (pin) {
      const displayLbl = pinLabel(pin, lang);
      const tail = displayLbl
        ? `📍 ${displayLbl} (${pin.lat.toFixed(5)}, ${pin.lng.toFixed(5)})`
        : `📍 ${pin.lat.toFixed(5)}, ${pin.lng.toFixed(5)}`;
      parts.push(tail);
    }
    const fullAddress = parts.join(" · ");
    const order = placeOrder({
      phone: phone.trim(),
      address: fullAddress,
      paymentMethod: payment,
      pin: pin
        ? {
            lat: pin.lat,
            lng: pin.lng,
            label: pin.label ?? pin.label_en ?? pin.label_mm ?? null,
            label_mm: pin.label_mm ?? null,
            label_en: pin.label_en ?? null,
          }
        : null,
      distanceKm,
      deliveryFee,
    });
    if (order) {
      setTimeout(() => navigate({ to: "/orders/$id", params: { id: order.id } }), 400);
    } else {
      setSubmitting(false);
    }
  };

  const paymentOptions: { id: PaymentMethod; color: string; desc_mm: string; desc_en: string }[] = [
    { id: "cash", color: "oklch(0.82 0.15 85)", desc_mm: "ဆိုင်ကယ်သမားကို လက်ဆင့်ကမ်း ပေးရန်", desc_en: "Pay the rider in cash on arrival" },
    { id: "kbzpay", color: "oklch(0.65 0.22 25)", desc_mm: "KBZPay app ဖြင့် ပေးချေရန်", desc_en: "Pay via KBZPay wallet" },
    { id: "wavepay", color: "oklch(0.60 0.20 280)", desc_mm: "Wave Pay ဖြင့် ပေးချေရန်", desc_en: "Pay via Wave Pay wallet" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      <AppHeader />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        <Link to="/cart" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> {lang === "mm" ? "စျေးခြင်းသို့ ပြန်သွား" : "Back to cart"}
        </Link>
        <div className="mb-8">
          <div className="text-xs uppercase tracking-widest text-accent mb-2">Checkout</div>
          <h1 className={`font-display text-4xl md:text-5xl ${lang === "mm" ? "font-mm" : ""}`}>{L({ mm: "ငွေရှင်းရန်", en: "Checkout" })}</h1>
        </div>

        <div className="grid md:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
            <section className="rounded-2xl bg-card border border-border p-6">
              <h2 className={`font-semibold text-lg mb-4 flex items-center gap-2 ${lang === "mm" ? "font-mm" : ""}`}>
                <MapPin className="w-4 h-4 text-primary" /> {L({ mm: "ပို့ဆောင်ရမည့်နေရာ", en: "Delivery details" })}
              </h2>

              <label className={`block text-sm font-medium mb-1.5 ${lang === "mm" ? "font-mm" : ""}`}>
                {L({ mm: "ဖုန်းနံပါတ်", en: "Phone number" })}
              </label>
              <div className="relative mb-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09 xxx xxx xxx"
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-background border border-border focus:border-primary outline-none transition-colors"
                />
              </div>
              {errors.phone && <p className={`text-xs text-destructive mt-1 ${lang === "mm" ? "font-mm" : ""}`}>{errors.phone}</p>}
              <p className={`text-xs text-muted-foreground mt-1 mb-4 ${lang === "mm" ? "font-mm" : ""}`}>
                {L({ mm: "ဆိုင်ကယ်သမား ခေါ်ဆိုနိုင်ရန်", en: "Rider will call this number" })}
              </p>

              <label className={`block text-sm font-medium mb-1.5 ${lang === "mm" ? "font-mm" : ""}`}>
                {L({ mm: "လိပ်စာ / မှတ်သားချက်", en: "Delivery address" })}
              </label>
              <textarea
                value={address}
                onChange={(e) => { setAddress(e.target.value); setAddressAutoFilled(false); }}
                placeholder={lang === "mm" ? "ဥပမာ: မြို့မလမ်း, အိမ်အနီ, ဗိုလ်ချုပ်ကျောင်း ဘေးမှာ" : "e.g. Myoma Rd, red house next to school"}
                rows={3}
                className={`w-full px-3 py-2.5 rounded-xl bg-background border ${addressAutoFilled ? "border-primary/50" : "border-border"} focus:border-primary outline-none resize-none transition-colors ${lang === "mm" ? "font-mm" : ""}`}
              />
              {addressAutoFilled && (
                <p className={`text-xs text-primary mt-1 ${lang === "mm" ? "font-mm" : ""}`}>
                  {L({ mm: "မြေပုံမှ အလိုအလျောက် ဖြည့်ပြီး — လိုအပ်လျှင် ပြင်ဆင်ပါ", en: "Auto-filled from map pin — edit if needed" })}
                </p>
              )}
              {errors.address && <p className={`text-xs text-destructive mt-1 ${lang === "mm" ? "font-mm" : ""}`}>{errors.address}</p>}

              <label className={`block text-sm font-medium mb-1.5 mt-4 ${lang === "mm" ? "font-mm" : ""}`}>
                {L({ mm: "အနီးအနားက အထင်ကရ (ရွေးချယ်ရန်)", en: "Landmark (optional)" })}
              </label>
              <input
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder={lang === "mm" ? "ဥပမာ: ဘုရားရှေ့" : "e.g. across from the pagoda"}
                className={`w-full h-11 px-3 rounded-xl bg-background border border-border focus:border-primary outline-none transition-colors ${lang === "mm" ? "font-mm" : ""}`}
              />

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setMapOpen(true)}
                  className={`w-full flex items-center gap-3 rounded-xl border-2 border-dashed ${pin ? "border-primary/60 bg-primary/5" : "border-border hover:border-primary/40"} p-3 text-left transition-all ${lang === "mm" ? "font-mm" : ""}`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-ember flex items-center justify-center shrink-0">
                    <Pin className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">
                      {pin
                        ? pinLabel(pin, lang) ?? L({ mm: "မြေပုံပေါ်တွင် သတ်မှတ်ပြီး", en: "Location pinned on map" })
                        : L({ mm: "မြေပုံဖြင့် နေရာသတ်မှတ်ရန်", en: "Pin exact location on map" })}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono truncate">
                      {pin
                        ? `${pin.lat.toFixed(5)}, ${pin.lng.toFixed(5)}${distanceKm != null ? ` · ${distanceKm.toFixed(1)} km` : ""}`
                        : L({ mm: "ဆိုင်ကယ်သမား ရှာဖွေရ လွယ်ကူစေရန်", en: "Helps the rider find you faster" })}
                    </div>
                  </div>
                  <span className="text-xs text-primary font-semibold shrink-0">
                    {pin ? L({ mm: "ပြင်ရန်", en: "Edit" }) : L({ mm: "ဖွင့်ရန်", en: "Open" })}
                  </span>
                </button>
                {prefilledFromLast && pin && (
                  <p className={`text-xs text-accent mt-2 ${lang === "mm" ? "font-mm" : ""}`}>
                    {L({ mm: "ယခင်နေရာမှ အလိုအလျောက် ဖြည့်ပြီး", en: "Prefilled from your last delivery location" })}
                  </p>
                )}
                {pin && (
                  <button
                    type="button"
                    onClick={() => { setPin(null); setAddressAutoFilled(false); setPrefilledFromLast(false); }}
                    className="mt-2 text-xs text-muted-foreground hover:text-destructive transition-colors"
                  >
                    {L({ mm: "မြေပုံအမှတ် ဖျက်ရန်", en: "Remove pin" })}
                  </button>
                )}
              </div>
            </section>

            <section className="rounded-2xl bg-card border border-border p-6">
              <h2 className={`font-semibold text-lg mb-4 flex items-center gap-2 ${lang === "mm" ? "font-mm" : ""}`}>
                <Wallet className="w-4 h-4 text-primary" /> {L({ mm: "ငွေပေးချေမှုနည်းလမ်း", en: "Payment method" })}
              </h2>
              <div className="space-y-2">
                {paymentOptions.map((p) => {
                  const selected = payment === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPayment(p.id)}
                      className={`w-full flex items-center gap-3 rounded-xl border-2 p-3.5 text-left transition-all ${
                        selected ? "border-primary bg-primary/5" : "border-border hover:border-border/80 bg-background"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold ${lang === "mm" ? "font-mm" : ""}`}>{L(PAYMENT_LABELS[p.id])}</div>
                        <div className={`text-xs text-muted-foreground ${lang === "mm" ? "font-mm" : ""}`}>{L({ mm: p.desc_mm, en: p.desc_en })}</div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selected ? "border-primary bg-primary" : "border-border"}`}>
                        {selected && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="md:sticky md:top-24 self-start">
            <div className="rounded-2xl bg-card border border-border p-5">
              <h3 className={`font-semibold mb-3 ${lang === "mm" ? "font-mm" : ""}`}>{L({ mm: "အော်ဒါ အကျဉ်း", en: "Order summary" })}</h3>
              <div className="space-y-2 text-sm max-h-64 overflow-auto pr-1">
                {cart.lines.map((l) => {
                  const m = getMenuItem(l.menuItemId);
                  if (!m) return null;
                  return (
                    <div key={l.menuItemId} className="flex justify-between gap-3">
                      <span className={`min-w-0 truncate ${lang === "mm" ? "font-mm" : ""}`}>{l.qty}× {L({ mm: m.name_mm, en: m.name_en })}</span>
                      <span className="text-muted-foreground shrink-0">{formatKs(m.price * l.qty)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="h-px bg-border my-4" />
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground"><span>{L({ mm: "အခြေခံ", en: "Subtotal" })}</span><span className="text-foreground">{formatKs(cartSubtotal)}</span></div>
                <div className="flex justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Bike className="w-3.5 h-3.5" />
                    {L({ mm: "ပို့ဆောင်ခ", en: "Delivery" })}
                    {distanceKm != null && (
                      <span className="text-[10px] text-accent">({distanceKm.toFixed(1)} km)</span>
                    )}
                  </span>
                  <span className="text-foreground">{formatKs(deliveryFee)}</span>
                </div>
                {!pin && (
                  <div className={`text-[11px] text-accent/80 ${lang === "mm" ? "font-mm" : ""}`}>
                    {L({ mm: "မြေပုံ သတ်မှတ်ပါက အကွာအဝေးအလိုက် တွက်ချက်ပါမည်", en: "Pin the map to calculate by distance" })}
                  </div>
                )}
              </div>
              <div className="h-px bg-border my-3" />
              <div className="rounded-xl bg-primary/5 border border-primary/20 p-3 mb-3">
                <div className={`flex items-center gap-2 text-sm font-semibold ${lang === "mm" ? "font-mm" : ""}`}>
                  <Clock className="w-4 h-4 text-primary" />
                  {L({ mm: "ခန့်မှန်း ရောက်ချိန်", en: "Estimated arrival" })}
                  <span className="ml-auto text-gradient-ember">
                    ~{eta.totalMin} {lang === "mm" ? "မိနစ်" : "min"}
                  </span>
                </div>
                <div className={`mt-1.5 text-[11px] text-muted-foreground grid grid-cols-2 gap-1 ${lang === "mm" ? "font-mm" : ""}`}>
                  <span>🍳 {L({ mm: "ချက်ချိန်", en: "Prep" })}: ~{eta.prepMin} {lang === "mm" ? "မိနစ်" : "min"}</span>
                  <span>🛵 {L({ mm: "လမ်းချိန်", en: "Ride" })}: ~{eta.rideMin} {lang === "mm" ? "မိနစ်" : "min"}</span>
                </div>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="font-bold">{L({ mm: "စုစုပေါင်း", en: "Total" })}</span>
                <span className="text-gradient-ember font-display text-2xl">{formatKs(total)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-md">
        <button
          onClick={submit}
          disabled={submitting}
          className="w-full flex items-center justify-between gap-4 rounded-full bg-gradient-ember px-5 py-3.5 shadow-ember text-primary-foreground font-semibold hover:scale-[1.02] transition-transform disabled:opacity-70 disabled:scale-100"
        >
          <span>{submitting ? (lang === "mm" ? "မှာယူနေသည်..." : "Placing order...") : L({ mm: "အော်ဒါတင်မည်", en: "Place order" })}</span>
          <span>{formatKs(total)}</span>
        </button>
      </div>

      <MapPicker
        open={mapOpen}
        initial={pin}
        lang={lang}
        onClose={() => setMapOpen(false)}
        onConfirm={(loc) => {
          setPin(loc);
          setMapOpen(false);
          if (loc.label && (!address.trim() || addressAutoFilled)) {
            setAddress(loc.label);
            setAddressAutoFilled(true);
          }
        }}
      />
    </div>
  );
}
