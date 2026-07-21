import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";

export const Route = createFileRoute("/_authenticated/owner/menu")({
  component: OwnerMenu,
});

type Item = { id: string; name_en: string; name_mm: string; price_ks: number; available: boolean; image: string | null; restaurant_id: string };
type Rest = { id: string; name_en: string };

function OwnerMenu() {
  const [items, setItems] = useState<Item[]>([]);
  const [rest, setRest] = useState<Rest | null>(null);
  const [loading, setLoading] = useState(true);
  const [name_en, setNameEn] = useState("");
  const [name_mm, setNameMm] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data: rs } = await supabase.from("restaurants").select("id, name_en").limit(1);
    if (!rs?.[0]) { setLoading(false); return; }
    setRest(rs[0] as Rest);
    const { data: mi } = await supabase.from("menu_items").select("*").eq("restaurant_id", rs[0].id).order("created_at", { ascending: false });
    setItems((mi ?? []) as any);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rest) return toast.error("No restaurant linked to your account yet");
    setBusy(true);
    try {
      let image: string | null = null;
      if (file) {
        const path = `${rest.id}/${crypto.randomUUID()}-${file.name}`;
        const up = await supabase.storage.from("menu-images").upload(path, file);
        if (up.error) throw up.error;
        image = up.data.path;
      }
      const { error } = await supabase.from("menu_items").insert({
        restaurant_id: rest.id, name_en, name_mm, price: Number(price), available: true, image,
      });
      if (error) throw error;
      setNameEn(""); setNameMm(""); setPrice(""); setFile(null);
      toast.success("Item added"); load();
    } catch (err: any) { toast.error(err.message); } finally { setBusy(false); }
  };

  const toggle = async (i: Item) => {
    await supabase.from("menu_items").update({ available: !i.available }).eq("id", i.id);
    load();
  };
  const del = async (i: Item) => {
    if (!confirm("Delete this item?")) return;
    await supabase.from("menu_items").delete().eq("id", i.id);
    load();
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>;
  if (!rest) return <div className="text-center py-20 text-muted-foreground text-sm">No restaurant linked to your account. Ask admin to link one.</div>;

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <form onSubmit={addItem} className="md:col-span-1 rounded-2xl bg-card/50 border border-border p-4 space-y-3">
        <h2 className="font-semibold flex items-center gap-2"><Plus className="h-4 w-4" /> New item</h2>
        <input required value={name_en} onChange={(e) => setNameEn(e.target.value)} placeholder="Name (English)" className="w-full rounded-lg bg-input border border-border px-3 py-2 text-sm" />
        <input required value={name_mm} onChange={(e) => setNameMm(e.target.value)} placeholder="အမည် (မြန်မာ)" className="w-full rounded-lg bg-input border border-border px-3 py-2 text-sm" />
        <input required type="number" min={100} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price (Ks)" className="w-full rounded-lg bg-input border border-border px-3 py-2 text-sm" />
        <label className="flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-sm cursor-pointer text-muted-foreground">
          <Upload className="h-4 w-4" /> {file ? file.name : "Upload photo"}
          <input type="file" accept="image/*" hidden onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </label>
        <button disabled={busy} className="w-full rounded-lg bg-gradient-ember py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">
          {busy ? "Adding…" : "Add item"}
        </button>
      </form>
      <div className="md:col-span-2 space-y-2">
        {items.map((i) => (
          <div key={i.id} className="rounded-xl bg-card/50 border border-border p-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{i.name_en}</div>
              <div className="text-xs text-muted-foreground truncate">{i.name_mm}</div>
              <div className="text-sm text-primary">{i.price.toLocaleString()} Ks</div>
            </div>
            <button onClick={() => toggle(i)} className={`text-xs rounded-full px-3 py-1 border ${i.available ? "border-primary/40 text-primary bg-primary/10" : "border-border text-muted-foreground"}`}>
              {i.available ? "Available" : "Hidden"}
            </button>
            <button onClick={() => del(i)} className="text-destructive hover:opacity-80"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
        {items.length === 0 && <div className="text-center text-sm text-muted-foreground py-10">No menu items yet</div>}
      </div>
    </div>
  );
}
