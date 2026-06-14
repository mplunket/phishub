"use client";
import * as React from "react";
import { updateTab } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TabEditor } from "@/components/tab-editor";
import { Pencil } from "lucide-react";

export function EditTabDialog({
  tab,
  revalidate,
}: {
  tab: { id: string; type: string; content: string };
  revalidate?: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          aria-label="Edit tab"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit tab</DialogTitle>
        </DialogHeader>
        <TabEditor
          action={updateTab}
          hiddenFields={{ tabId: tab.id, revalidate: revalidate ?? "" }}
          defaultType={tab.type}
          defaultContent={tab.content}
          submitLabel="Save changes"
          onDone={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
