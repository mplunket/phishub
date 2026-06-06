"use client";
import * as React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteSetlist } from "@/app/actions";

export function DeleteSetlistButton({ setlistId }: { setlistId: string }) {
  const [pending, startTransition] = React.useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() => {
        if (!confirm("Delete this setlist?")) return;
        startTransition(async () => {
          await deleteSetlist(setlistId);
        });
      }}
    >
      <Trash2 className="h-4 w-4 mr-1" /> Delete
    </Button>
  );
}
