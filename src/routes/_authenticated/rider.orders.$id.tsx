import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Camera, CheckCircle2, Loader2, MapPin, Navigation, Phone } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/_authenticated/rider/orders/$id")({
  component: RiderActive,
});

function RiderActive() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.from("orders").select("*").eq("id", id).maybeSingle().then(({ data }) => setOrder(data));
  }, [id]);

  if (!order) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>;

  const pin = order.pin_lat && order.pin_lng ? { lat: order.pin_lat, lng: order.pin_lng } : null;

  const complete = async () => {
    if (!file) return toast.error("Snap a proof photo first");
    if (!user) return;
    setBusy(true);
    try {
      const path = `${order.id}/${crypto.randomUUID()}.jpg`;
      const up = await supabase.storage.from("delivery-proofs").upload(path, file);
      if (up.error) throw up.error;
      const { error } = await supabase.from("orders").update({ status: "delivered", proof_path: up.data.path }).eq("id", order.id);
      if (error) throw error;
      toast.success("Delivered!");
      navigate({ to: "/rider" });
    } catch (err: any) { toast.error(err.message); } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto flex items-center gap-3 p-4">
          <Link to="/rider" className="text-muted-foreground"><ArrowLeft className="h-5 w-5" /></Link>
          <div>
            <div className="font-semibold text-sm">Delivery #{order.id.slice(0, 6)}</div>
            <div className="text-xs text-muted-foreground">Status: {order.status}</div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="rounded-2xl bg-card/60 border border-border p-4">
          <div className="text-xs text-muted-foreground">Drop-off</div>
          <div className="mt-1 flex items-start gap-2"><MapPin className="h-4 w-4 text-primary mt-0.5" /> <div className="text-sm">{order.address}</div></div>
          {pin && (
            <a href={`https://www.google.com/maps/dir/?api=1&destination=${pin.lat},${pin.lng}`} target="_blank" rel="noreferrer"
              className="mt-3 flex items-center justify-center gap-2 w-full rounded-lg bg-gradient-ember py-2.5 text-sm font-medium text-primary-foreground">
              <Navigation className="h-4 w-4" /> Open directions
            </a>
          )}
          <a href={`tel:${order.phone}`} className="mt-2 flex items-center justify-center gap-2 w-full rounded-lg bg-secondary border border-border py-2.5 text-sm">
            <Phone className="h-4 w-4" /> Call customer
          </a>
        </div>

        <div className="rounded-2xl bg-card/60 border border-border p-4">
          <div className="text-xs text-muted-foreground">Order</div>
          <div className="mt-1 text-lg font-semibold">{order.total_ks.toLocaleString()} Ks</div>
          <div className="text-xs text-muted-foreground mt-1">Payment: {order.payment_method}</div>
        </div>

        <div className="rounded-2xl bg-card/60 border border-border p-4 space-y-3">
          <h2 className="font-semibold text-sm">Proof of delivery</h2>
          <label className="flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-6 text-sm cursor-pointer text-muted-foreground justify-center">
            <Camera className="h-5 w-5" /> {file ? file.name : "Take proof photo"}
            <input type="file" accept="image/*" capture="environment" hidden onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </label>
          <button onClick={complete} disabled={busy || !file}
            className="w-full rounded-lg bg-gradient-ember py-3 text-sm font-medium text-primary-foreground disabled:opacity-50 flex items-center justify-center gap-2">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            Complete delivery
          </button>
        </div>
      </main>
    </div>
  );
}
