"use client";
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Shared editor body for adding and editing tabs. Renders the whole <form> so
// it can wrap a server action; callers supply the action plus any hidden
// fields (songId/slug for create, tabId/revalidate for edit). A monospace,
// no-wrap textarea preserves ASCII-tab alignment, and a Write/Preview toggle
// shows readers' exact rendering before saving. The contributor license is now
// part of the site-wide Terms of Use (accepted on sign-up), so there's no
// per-upload checkbox — just a passive notice linking to the Terms.
export function TabEditor({
  action,
  hiddenFields = {},
  defaultType = "tab",
  defaultContent = "",
  submitLabel = "Save tab",
  onDone,
}: {
  action: (formData: FormData) => Promise<void> | void;
  hiddenFields?: Record<string, string>;
  defaultType?: string;
  defaultContent?: string;
  submitLabel?: string;
  onDone?: () => void;
}) {
  const [content, setContent] = React.useState(defaultContent);
  const [mode, setMode] = React.useState<"write" | "preview">("write");
  const [pending, setPending] = React.useState(false);

  async function handle(formData: FormData) {
    setPending(true);
    try {
      await action(formData);
      onDone?.();
    } finally {
      setPending(false);
    }
  }

  const canSave = content.trim().length > 0;

  return (
    <form action={handle} className="space-y-4">
      {Object.entries(hiddenFields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}

      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <select
          id="type"
          name="type"
          defaultValue={defaultType}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
        >
          <option value="tab">Tab</option>
          <option value="chords">Chords</option>
          <option value="vextab">VexTab</option>
        </select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="content">Content</Label>
          <div className="inline-flex rounded-md border p-0.5 text-xs">
            {(["write", "preview"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={cn(
                  "rounded px-2 py-1 capitalize transition-colors",
                  mode === m
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {mode === "write" ? (
          <Textarea
            id="content"
            name="content"
            required
            rows={14}
            wrap="off"
            spellCheck={false}
            className="overflow-x-auto font-mono text-sm"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste or type the tab here..."
          />
        ) : (
          <>
            {/* Keep the content in the form while previewing. */}
            <input type="hidden" name="content" value={content} />
            <div className="max-h-[45vh] min-h-[12rem] overflow-auto rounded-md border bg-card px-3 py-3 text-card-foreground">
              {content.trim() ? (
                <pre className="whitespace-pre font-mono text-sm leading-snug">
                  {content}
                </pre>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nothing to preview yet.
                </p>
              )}
            </div>
          </>
        )}
        <p className="text-xs text-muted-foreground">
          Alignment is preserved exactly. Use spaces (not tab characters) so the
          tab renders the same for everyone.
        </p>
      </div>

      <p className="text-xs text-muted-foreground">
        By submitting, you confirm this is your own original transcription and
        agree to Phishub&apos;s{" "}
        <Link
          href="/terms"
          target="_blank"
          className="underline hover:text-foreground"
        >
          Terms of Use
        </Link>{" "}
        and{" "}
        <Link
          href="/content-policy"
          target="_blank"
          className="underline hover:text-foreground"
        >
          Content &amp; Copyright Policy
        </Link>
        .
      </p>

      <div className="flex justify-end">
        <Button type="submit" disabled={!canSave || pending}>
          {pending ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
