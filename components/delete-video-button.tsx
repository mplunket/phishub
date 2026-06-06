"use client";
import * as React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteVideo } from "@/app/actions";

export function DeleteVideoButton({
  videoId,
  revalidate,
}: {
  videoId: string;
  revalidate?: string;
}) {
  const [pending, startTransition] = React.useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={() => {
        if (!confirm("Delete this video?")) return;
        startTransition(async () => {
          await deleteVideo(videoId, revalidate);
        });
      }}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
