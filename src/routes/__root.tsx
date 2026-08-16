import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display text-gradient-ember">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-gradient-ember px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-ember transition-transform hover:scale-105"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-gradient-ember px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-ember"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Mg Win — Food Delivery in Namsang, Shan State" },
      { name: "description", content: "Mg Win is the local food delivery service for Namsang, southern Shan State: order from town kitchens, tea shops and market stalls with motorbike delivery and cash, KBZPay or Wave Pay." },
      { property: "og:site_name", content: "Mg Win" },
      { property: "og:title", content: "Mg Win — Food Delivery in Namsang, Shan State" },
      { property: "og:description", content: "Order from Namsang's kitchens, tea shops and market stalls. Motorbike delivery, prices in Kyat, pay by cash, KBZPay or Wave Pay." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Mg Win — Food Delivery in Namsang, Shan State" },
      { name: "twitter:description", content: "Order from Namsang's kitchens, tea shops and market stalls. Motorbike delivery, prices in Kyat, pay by cash, KBZPay or Wave Pay." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/86214a57-0976-462f-ad65-19e86f65fd48/id-preview-da4f4f24--2c79d312-abed-4882-8b78-a4c2b7501f05.lovable.app-1784437500632.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/86214a57-0976-462f-ad65-19e86f65fd48/id-preview-da4f4f24--2c79d312-abed-4882-8b78-a4c2b7501f05.lovable.app-1784437500632.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=Noto+Sans+Myanmar:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="my">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { AppProvider } from "@/lib/mgwin-store";
import { AuthProvider } from "@/lib/auth-context";

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppProvider>
          <Outlet />
        </AppProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

