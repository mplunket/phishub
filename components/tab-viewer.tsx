"use client";
import * as React from "react";

export function TabViewer({
  tab,
}: {
  tab?: { content: string; type: string };
}) {
  if (!tab)
    return <div className="text-muted-foreground">No tab selected.</div>;
  // You can add more logic here for different tab types (e.g., vextab rendering)
  return (
    <div className="border rounded p-4 bg-white">
      <pre className="whitespace-pre-wrap font-mono text-sm">{tab.content}</pre>
    </div>
  );
}
