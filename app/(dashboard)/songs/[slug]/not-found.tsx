import Link from "next/link";
import { Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";

// Rendered when a slug doesn't match a song, so an unknown URL like
// /songs/yem shows a real 404 inside the dashboard shell instead of an error.
export default function SongNotFound() {
  return (
    <div className="container py-10">
      <EmptyState
        icon={Music}
        title="Song not found"
        description="We couldn't find a song at this address. It may have been renamed, or the link might be wrong."
      >
        <Button asChild>
          <Link href="/songs">Browse songs</Link>
        </Button>
      </EmptyState>
    </div>
  );
}
