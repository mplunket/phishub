"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

// Renders a VexTab source string as engraved music notation / tablature using
// the `vextab` library (which bundles VexFlow). The library is ~1MB and touches
// the DOM directly, so it's loaded lazily on the client (never during SSR) and
// draws into a plain <div> via VexFlow's SVG backend.
//
// Used by the tab editor's live preview and by the read-only TabViewer for tabs
// stored with `type === "vextab"`.

// Cache the dynamic import so multiple instances share one module load.
let vextabPromise: Promise<typeof import("vextab")> | null = null;
function loadVextab() {
  if (!vextabPromise) vextabPromise = import("vextab");
  return vextabPromise;
}

export function VextabRenderer({
  source,
  scale = 1,
  className,
}: {
  source: string;
  /** Zoom factor: enlarges the notation (and width) proportionally. */
  scale?: number;
  className?: string;
}) {
  // Outer element we measure for available width; inner element receives the SVG.
  const measureRef = React.useRef<HTMLDivElement>(null);
  const targetRef = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Track the available width so notation reflows on resize / orientation change.
  React.useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  React.useEffect(() => {
    const target = targetRef.current;
    if (!target || !width) return;

    let cancelled = false;
    const trimmed = source.trim();

    if (!trimmed) {
      target.innerHTML = "";
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    loadVextab()
      .then(({ VexTab, Artist, Vex }) => {
        if (cancelled) return;
        // Clear any previous render before drawing the new one.
        target.innerHTML = "";
        try {
          Artist.NOLOGO = true;
          const Renderer = Vex.Flow.Renderer;
          const renderer = new Renderer(target, Renderer.Backends.SVG);
          // Lay notation out across the measured width; `scale` enlarges the
          // whole drawing, so higher zoom overflows into the scroll container.
          const artist = new Artist(10, 10, Math.max(120, width), { scale });
          const vextab = new VexTab(artist);
          vextab.parse(trimmed);
          artist.render(renderer);
          setError(null);
        } catch (e) {
          target.innerHTML = "";
          const message =
            e instanceof Error && e.message
              ? e.message
              : "This doesn't look like valid VexTab yet.";
          setError(message);
        } finally {
          setLoading(false);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setError("Couldn't load the notation renderer.");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [source, scale, width]);

  return (
    <div ref={measureRef} className={cn("w-full", className)}>
      {/* White canvas so the black notation stays legible in dark mode. */}
      <div className="overflow-x-auto rounded-md bg-white p-2 text-black">
        <div ref={targetRef} className="vextab-output min-h-[2rem]" />
        {loading && !error && (
          <p className="px-1 py-2 text-sm text-neutral-500">
            Rendering notation…
          </p>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-destructive">
          <span className="font-medium">VexTab error:</span> {error}
        </p>
      )}
    </div>
  );
}
