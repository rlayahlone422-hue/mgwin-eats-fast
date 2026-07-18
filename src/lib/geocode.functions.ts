import { createServerFn } from "@tanstack/react-start";

type GeocodeJson = {
  results?: Array<{
    formatted_address?: string;
    address_components?: Array<{ long_name: string; short_name: string; types: string[] }>;
  }>;
};

function compactShort(json: GeocodeJson): string | null {
  const first = json.results?.[0];
  if (!first) return null;
  if (first.address_components) {
    const pick = (t: string) =>
      first.address_components?.find((c) => c.types.includes(t))?.long_name;
    const parts = [
      pick("route") ?? pick("neighborhood") ?? pick("sublocality"),
      pick("locality") ?? pick("administrative_area_level_2"),
    ].filter(Boolean);
    if (parts.length) return parts.join(", ");
  }
  return first.formatted_address ?? null;
}

async function fetchOne(
  lat: number,
  lng: number,
  lang: string,
  lovableKey: string,
  gmapsKey: string,
): Promise<{ label: string | null; short: string | null }> {
  const url = `https://connector-gateway.lovable.dev/google_maps/maps/api/geocode/json?latlng=${lat},${lng}&language=${lang}`;
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
    const json = (await res.json()) as GeocodeJson;
    const label = json.results?.[0]?.formatted_address ?? null;
    const short = compactShort(json) ?? label;
    return { label, short };
  } catch (err) {
    console.error("reverseGeocode failed", err);
    return { label: null, short: null };
  }
}

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
    const empty = {
      label: null as string | null,
      short: null as string | null,
      label_en: null as string | null,
      short_en: null as string | null,
      label_mm: null as string | null,
      short_mm: null as string | null,
    };
    if (!lovableKey || !gmapsKey) return empty;
    const [en, mm] = await Promise.all([
      fetchOne(data.lat, data.lng, "en", lovableKey, gmapsKey),
      fetchOne(data.lat, data.lng, "my", lovableKey, gmapsKey),
    ]);
    return {
      // Backwards-compat aliases (default to English)
      label: en.label,
      short: en.short,
      label_en: en.label,
      short_en: en.short,
      label_mm: mm.label,
      short_mm: mm.short,
    };
  });
