import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Guitar } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-orange-50 px-4 text-center">
      <Guitar className="h-12 w-12 text-purple-600" />
      <h1 className="mt-6 text-4xl font-bold">Page not found</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        We couldn&apos;t find that page. It may have moved, or the link might be
        broken.
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/songs">Browse songs</Link>
        </Button>
      </div>
    </div>
  );
}
