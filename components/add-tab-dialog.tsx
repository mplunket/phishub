"use client";
import * as React from "react";
import { createTab } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TabEditor } from "@/components/tab-editor";
import { Plus } from "lucide-react";

export function AddTabDialog({
  songId,
  slug,
  variant = "default",
}: {
  songId: string;
  slug: string;
  variant?: "default" | "outline";
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={variant}>
          <Plus className="h-4 w-4 mr-1" /> Add tab
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add a tab</DialogTitle>
        </DialogHeader>
        <TabEditor
          action={createTab}
          hiddenFields={{ songId, slug }}
          submitLabel="Save tab"
          onDone={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
