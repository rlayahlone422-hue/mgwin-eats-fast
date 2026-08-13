import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { DISH_PAGES, RESTAURANT_PAGES } from "@/lib/seo-pages";

const BASE_URL = "https://mgwin-eats-fast.lovable.app";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/restaurants", changefreq: "daily", priority: "0.9" },
          { path: "/dishes", changefreq: "weekly", priority: "0.9" },
          { path: "/guide", changefreq: "monthly", priority: "0.8" },
          ...DISH_PAGES.map((d) => ({
            path: `/dishes/${d.slug}`,
            changefreq: "weekly" as const,
            priority: "0.8",
          })),
          ...RESTAURANT_PAGES.map((r) => ({
            path: `/eat/${r.slug}`,
            changefreq: "weekly" as const,
            priority: "0.8",
          })),
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
