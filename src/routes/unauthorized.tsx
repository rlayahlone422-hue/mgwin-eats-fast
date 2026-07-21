import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/unauthorized")({
  head: () => ({ meta: [{ title: "Unauthorized — Mg Win" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <ShieldAlert className="h-16 w-16 text-primary mx-auto" />
        <h1 className="mt-4 text-2xl font-semibold">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">You don't have permission to view this portal.</p>
        <Link to="/" className="mt-6 inline-block rounded-full bg-gradient-ember px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-ember">Back home</Link>
      </div>
    </div>
  ),
});
