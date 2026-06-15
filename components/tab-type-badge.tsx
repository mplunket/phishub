import * as React from "react";
import { cn } from "@/lib/utils";
import type { TabType } from "@/types";

// Color-coded styles per tab type (light + dark mode).
const TAB_TYPE_STYLES: Record<TabType, string> = {
  tab: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  chords:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  vextab:
    "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
};

const TAB_TYPE_LABELS: Record<TabType, string> = {
  tab: "Tab",
  chords: "Chords",
  vextab: "VexTab",
};

function isTabType(value: string): value is TabType {
  return value === "tab" || value === "chords" || value === "vextab";
}

export function TabTypeBadge({
  type,
  className,
}: {
  type: string;
  className?: string;
}) {
  const style = isTabType(type)
    ? TAB_TYPE_STYLES[type]
    : "bg-secondary text-secondary-foreground";
  const label = isTabType(type) ? TAB_TYPE_LABELS[type] : type;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border border-transparent px-2 py-0.5 text-xs font-semibold",
        style,
        className,
      )}
    >
      {label}
    </span>
  );
}
