"use client";
import * as React from "react";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Minus,
  Plus,
  RotateCcw,
  Gauge,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { transposeChordSheet, formatSemitones } from "@/lib/chords";

// Approximate width of a monospace character relative to font size. Used to
// auto-size the font so the widest line fits the available width without
// wrapping (important for ASCII tabs whose alignment must be preserved).
const CHAR_WIDTH_RATIO = 0.62;
const MIN_FONT = 9;
const MAX_FONT = 34;
const SCROLL_SPEEDS = [12, 24, 40, 64, 100]; // px per second

export interface TabViewerProps {
  tab?: { content: string; type: string };
  title?: string;
  /** Render with its own full-height layout (used inside the setlist performer). */
  fill?: boolean;
}

export function TabViewer({ tab, title, fill = false }: TabViewerProps) {
  const [zoom, setZoom] = React.useState(1);
  // The font auto-fits the widest line to the available width, which on wide
  // desktop viewports makes 100% far too large for comfortable reading. Default
  // desktop to ~40% (mobile stays at 100%, which reads well). Reset returns to
  // this per-device default.
  const [defaultZoom, setDefaultZoom] = React.useState(1);
  const [semitones, setSemitones] = React.useState(0);
  const [fullscreen, setFullscreen] = React.useState(false);
  const [scrolling, setScrolling] = React.useState(false);
  const [speed, setSpeed] = React.useState(2); // index into SCROLL_SPEEDS
  const [availWidth, setAvailWidth] = React.useState(0);

  const measureRef = React.useRef<HTMLDivElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const isChords = tab?.type === "chords";

  // Pick the device-appropriate default zoom once on mount (window isn't
  // available during SSR).
  React.useEffect(() => {
    const d = window.matchMedia("(min-width: 768px)").matches ? 0.4 : 1;
    setDefaultZoom(d);
    setZoom(d);
  }, []);

  const content = React.useMemo(() => {
    if (!tab) return "";
    return isChords ? transposeChordSheet(tab.content, semitones) : tab.content;
  }, [tab, isChords, semitones]);

  const maxLineLength = React.useMemo(() => {
    let max = 1;
    for (const line of content.split("\n")) {
      if (line.length > max) max = line.length;
    }
    return max;
  }, [content]);

  // Measure the available text width and keep it in sync with viewport size
  // and orientation changes.
  React.useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const update = () => setAvailWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [fullscreen]);

  const fitFont = React.useMemo(() => {
    if (!availWidth) return 14;
    const raw = availWidth / (maxLineLength * CHAR_WIDTH_RATIO);
    return Math.max(MIN_FONT, Math.min(MAX_FONT, raw));
  }, [availWidth, maxLineLength]);

  const fontSize = Math.round(fitFont * zoom * 10) / 10;
  const lineHeight = Math.round(fontSize * 1.45 * 10) / 10;

  // Hands-free auto-scroll for performing. When the viewer has its own scroll
  // container (fullscreen / setlist fill mode) we scroll that; otherwise we
  // drive the page itself so the inline view never becomes a nested scroller.
  React.useEffect(() => {
    if (!scrolling) return;
    const el = scrollRef.current;
    const useEl = !!el && el.scrollHeight > el.clientHeight + 1;
    const pageEl = (document.scrollingElement ||
      document.documentElement) as HTMLElement;
    // Accumulate fractionally so slow speeds aren't lost to integer rounding.
    let pos = useEl ? el!.scrollTop : pageEl.scrollTop;
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      pos += SCROLL_SPEEDS[speed] * dt;
      const target = useEl ? el! : pageEl;
      target.scrollTop = pos;
      if (pos + target.clientHeight >= target.scrollHeight - 1) {
        setScrolling(false);
        return;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [scrolling, speed]);

  // Keep the screen awake while in full-screen performance mode.
  React.useEffect(() => {
    if (!fullscreen) return;
    let lock: { release: () => Promise<void> } | null = null;
    let released = false;
    const request = async () => {
      try {
        lock = (await navigator.wakeLock?.request("screen")) ?? null;
      } catch {
        // ignore (unsupported or denied)
      }
    };
    request();
    const onVisible = () => {
      if (document.visibilityState === "visible") request();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      released = true;
      document.removeEventListener("visibilitychange", onVisible);
      lock?.release().catch(() => {});
      void released;
    };
  }, [fullscreen]);

  // Exit fullscreen on Escape.
  React.useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen]);

  if (!tab) {
    return (
      <div className="text-muted-foreground py-8 text-center">
        No tab selected.
      </div>
    );
  }

  const controls = (
    <div className="flex flex-wrap items-center gap-1.5">
      <div className="flex items-center rounded-md border bg-background">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="Zoom out"
          onClick={() => setZoom((z) => Math.max(0.25, z - 0.1))}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <button
          type="button"
          onClick={() => setZoom(defaultZoom)}
          className="px-1 text-xs tabular-nums text-muted-foreground hover:text-foreground"
          aria-label="Reset zoom"
        >
          {Math.round(zoom * 100)}%
        </button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="Zoom in"
          onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      {isChords && (
        <div className="flex items-center rounded-md border bg-background">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label="Transpose down"
            onClick={() => setSemitones((s) => Math.max(-11, s - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <button
            type="button"
            onClick={() => setSemitones(0)}
            className="min-w-[2.75rem] px-1 text-xs tabular-nums text-muted-foreground hover:text-foreground"
            aria-label="Reset transpose"
          >
            {formatSemitones(semitones)} st
          </button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label="Transpose up"
            onClick={() => setSemitones((s) => Math.min(11, s + 1))}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Button
        type="button"
        variant={scrolling ? "default" : "outline"}
        size="sm"
        className="h-8"
        onClick={() => setScrolling((s) => !s)}
      >
        {scrolling ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
        <span className="ml-1 hidden sm:inline">
          {scrolling ? "Pause" : "Scroll"}
        </span>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8"
        aria-label="Scroll speed"
        onClick={() => setSpeed((s) => (s + 1) % SCROLL_SPEEDS.length)}
      >
        <Gauge className="h-4 w-4" />
        <span className="ml-1 tabular-nums">{speed + 1}x</span>
      </Button>

      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8"
        aria-label={fullscreen ? "Exit performance mode" : "Performance mode"}
        onClick={() => setFullscreen((f) => !f)}
      >
        {fullscreen ? (
          <Minimize2 className="h-4 w-4" />
        ) : (
          <Maximize2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );

  const pre = (
    <pre
      className="whitespace-pre font-mono leading-snug"
      style={{ fontSize: `${fontSize}px`, lineHeight: `${lineHeight}px` }}
    >
      {content}
    </pre>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-background">
        <div className="flex items-center justify-between gap-2 border-b px-3 py-2">
          <div className="min-w-0">
            {title && (
              <p className="truncate text-sm font-semibold">{title}</p>
            )}
            <p className="text-xs capitalize text-muted-foreground">
              {tab.type}
            </p>
          </div>
          {controls}
        </div>
        <div ref={scrollRef} className="flex-1 overflow-auto px-3 py-4">
          <div ref={measureRef} className="w-full">
            {pre}
          </div>
          <div className="h-[40vh]" aria-hidden />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-3", fill && "h-full")}>
      <div
        className={cn(
          "flex items-center justify-end",
          // Inline view scrolls with the page, so pin the controls while
          // reading down a long tab. They dock just below the auto-hiding
          // dashboard header (via --app-header-offset), so when the header
          // re-appears on scroll-up both bars stay visible instead of
          // overlapping; when it hides, the controls rise to the very top.
          !fill &&
            "sticky top-[var(--app-header-offset,0px)] z-20 -mx-3 border-b bg-background/90 px-3 py-2 backdrop-blur transition-[top] duration-200 sm:-mx-4 sm:px-4"
        )}
      >
        {controls}
      </div>
      <div
        ref={scrollRef}
        className={cn(
          "rounded-lg border bg-card text-card-foreground px-3 py-3",
          // Fill mode (setlist performer) keeps its own scroll area; the inline
          // song-page view flows with the page and only scrolls horizontally
          // as a last resort for ultra-wide tabs.
          fill ? "flex-1 overflow-auto" : "overflow-x-auto"
        )}
      >
        <div ref={measureRef} className="w-full">
          {pre}
        </div>
      </div>
    </div>
  );
}
