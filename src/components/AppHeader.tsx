import { Link } from "@tanstack/react-router";
import { Flame, Languages, ShoppingBag, Receipt } from "lucide-react";
import { useApp } from "@/lib/mgwin-store";

export function AppHeader() {
  const { lang, setLang, cartCount } = useApp();
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-ember flex items-center justify-center shadow-ember">
            <Flame className="w-5 h-5 text-primary-foreground" />
            <div className="absolute inset-0 rounded-xl bg-gradient-ember blur-lg opacity-60 animate-ember-pulse -z-10" />
          </div>
          <div className="leading-none">
            <div className="font-display text-xl tracking-tight">Mg Win</div>
            <div className="text-[10px] text-muted-foreground tracking-widest uppercase">NAMSANG FOODIE</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link to="/guide" className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground font-semibold" }}>
            {lang === "mm" ? "အစားအစာလမ်းညွှန်" : "Food guide"}
          </Link>
          <Link to="/restaurants" className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground font-semibold" }}>
            {lang === "mm" ? "ဆိုင်များ" : "Restaurants"}
          </Link>
          <Link to="/dishes" className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground font-semibold" }}>
            {lang === "mm" ? "အစားအစာများ" : "Dishes"}
          </Link>
          <Link to="/orders" className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground font-semibold" }}>
            {lang === "mm" ? "မှာယူမှတ်တမ်း" : "My orders"}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "mm" ? "en" : "mm")}
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary transition-colors"
          >
            <Languages className="w-3.5 h-3.5" />
            {lang === "mm" ? "EN" : "မြန်မာ"}
          </button>
          <Link to="/orders" className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-full border border-border hover:bg-secondary" aria-label="Orders">
            <Receipt className="w-4 h-4" />
          </Link>
          <Link
            to="/cart"
            className="relative inline-flex items-center gap-2 rounded-full bg-gradient-ember px-4 py-2 text-sm font-semibold text-primary-foreground shadow-ember hover:scale-105 transition-transform"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === "mm" ? "စျေးခြင်း" : "Cart"}</span>
            {cartCount > 0 && (
              <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-background text-foreground text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
