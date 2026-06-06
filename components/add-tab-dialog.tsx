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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

export function AddTabDialog({
  songId,
  slug,
}: {
  songId: string;
  slug: string;
}) {
  const [open, setOpen] = React.useState(false);

  async function action(formData: FormData) {
    await createTab(formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add tab
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a tab</DialogTitle>
        </DialogHeader>
        <form action={action} className="space-y-4">
          <input type="hidden" name="songId" value={songId} />
          <input type="hidden" name="slug" value={slug} />
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              name="type"
              defaultValue="tab"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            >
              <option value="tab">Tab</option>
              <option value="chords">Chords</option>
              <option value="vextab">VexTab</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              required
              rows={12}
              className="font-mono"
              placeholder="Paste or type the tab here..."
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Save tab</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
