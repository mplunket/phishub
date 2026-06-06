"use client";
import * as React from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleFavorite } from "@/app/actions";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  tabId,
  initialFavorited,
  initialCount,
  revalidate,
}: {
  tabId: string;
  initialFavorited: boolean;
  initialCount: number;
  revalidate?: string;
}) {
  const [favorited, setFavorited] = React.useState(initialFavorited);
  const [count, setCount] = React.useState(initialCount);
  const [pending, startTransition] = React.useTransition();

  // Keep in sync if the selected tab changes underneath us.
  React.useEffect(() => {
    setFavorited(initialFavorited);
    setCount(initialCount);
  }, [tabId, initialFavorited, initialCount]);

  function onClick() {
    const next = !favorited;
    setFavorited(next);
    setCount((c) => c + (next ? 1 : -1));
    startTransition(async () => {
      try {
        await toggleFavorite(tabId, revalidate);
      } catch {
        // Revert on failure.
        setFavorited(!next);
        setCount((c) => c + (next ? -1 : 1));
      }
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={pending}
      aria-pressed={favorited}
    >
      <Star
        className={cn(
          "h-4 w-4 mr-1",
          favorited && "fill-yellow-400 text-yellow-500"
        )}
      />
      {count}
    </Button>
  );
}
