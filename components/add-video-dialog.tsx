"use client";
import * as React from "react";
import { createVideo } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

export function AddVideoDialog({
  songId,
  slug,
}: {
  songId: string;
  slug: string;
}) {
  const [open, setOpen] = React.useState(false);

  async function action(formData: FormData) {
    await createVideo(formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add video
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a video</DialogTitle>
        </DialogHeader>
        <form action={action} className="space-y-4">
          <input type="hidden" name="songId" value={songId} />
          <input type="hidden" name="slug" value={slug} />
          <div className="space-y-2">
            <Label htmlFor="url">YouTube or Vimeo URL</Label>
            <Input
              id="url"
              name="url"
              required
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Title</Label>
            <Input id="name" name="name" required placeholder="e.g. Solo lesson" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="video-type">Type</Label>
            <select
              id="video-type"
              name="type"
              defaultValue="lesson"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            >
              <option value="lesson">Lesson</option>
              <option value="performance">Performance</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea id="description" name="description" rows={3} />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Save video</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
