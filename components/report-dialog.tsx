"use client";
import * as React from "react";
import { createReport } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Flag } from "lucide-react";

const REASONS = [
  "Copyright infringement",
  "Spam or advertising",
  "Inappropriate or offensive",
  "Inaccurate or low quality",
  "Other",
];

// Flags a tab or comment for moderator review. Exactly one of tabId/commentId
// should be provided. Renders a compact icon button by default; pass a custom
// `label` to show text alongside it.
export function ReportDialog({
  tabId,
  commentId,
  label,
}: {
  tabId?: string;
  commentId?: string;
  label?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function action(formData: FormData) {
    setPending(true);
    setError(null);
    try {
      await createReport(formData);
      setDone(true);
      setOpen(false);
    } catch (e: any) {
      setError(e?.message ?? "Could not submit report");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <Flag className="h-3.5 w-3.5" /> Reported
      </span>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size={label ? "sm" : "icon"}
          className={label ? "h-8 text-muted-foreground" : "h-8 w-8 text-muted-foreground"}
          aria-label="Report"
        >
          <Flag className="h-4 w-4" />
          {label && <span className="ml-1">{label}</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report content</DialogTitle>
          <DialogDescription>
            Let us know what&apos;s wrong and a moderator will review it.
          </DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-4">
          {tabId && <input type="hidden" name="tabId" value={tabId} />}
          {commentId && (
            <input type="hidden" name="commentId" value={commentId} />
          )}

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <select
              id="reason"
              name="reason"
              required
              defaultValue=""
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            >
              <option value="" disabled>
                Choose a reason…
              </option>
              {REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Details (optional)</Label>
            <Textarea
              id="details"
              name="details"
              rows={3}
              maxLength={1000}
              placeholder="Anything that helps us understand the issue."
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Submitting…" : "Submit report"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
