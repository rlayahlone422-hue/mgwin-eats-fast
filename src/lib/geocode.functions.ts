import { createServerFn } from "@tanstack/react-start";

export const reverseGeocode = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const d = data as { lat?: number; lng?: number };
    if (typeof d?.lat !== "number" || typeof d?.lng !== "number") {
      throw new Error("lat and lng required");
    }
    if (Math.abs(d.lat) > 90 || Math.abs(d.lng) > 180) {
      throw new Error("invalid coordinates");
    }
    return { lat: d.lat, lng: d.lng };
  })
  .handler(async ({ data }) => {
    const lovableKey = process.env.LOVABLE_API_KEY;
    const gmapsKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!lovableKey || !gmapsKey) {
      return { label: null as string | null, short: null as string | null };
    }
    const url = `https://connector-gateway.lovable.dev/google_maps/maps/api/geocode/json?latlng=${data.lat},${data.lng}&language=en`;
    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "X-Connection-Api-Key": gmapsKey,
        },
      });
      if (!res.ok) {
        console.error("reverseGeocode gateway error", res.status, await res.text());
        return { label: null, short: null };
      }
      const json = (await res.json()) as {
        results?: Array<{
          formatted_address?: string;
          address_components?: Array<{ long_name: string; short_name: string; types: string[] }>;
        }>;
      };
      const first = json.results?.[0];
      const label = first?.formatted_address ?? null;
      // Prefer a compact "route/neighborhood, locality" label
      let short: string | null = null;
      if (first?.address_components) {
        const pick = (t: string) =>
          first.address_components?.find((c) => c.types.includes(t))?.long_name;
        const parts = [
          pick("route") ?? pick("neighborhood") ?? pick("sublocality"),
          pick("locality") ?? pick("administrative_area_level_2"),
        ].filter(Boolean);
        if (parts.length) short = parts.join(", ");
      }
      return { label, short: short ?? label };
    } catch (err) {
      console.error("reverseGeocode failed", err);
      return { label: null, short: null };
    }
  });
