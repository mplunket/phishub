// Minimal ambient types for the `vextab` package, which ships no declarations.
// We only describe the small slice of the API we use to render notation from a
// VexTab source string (see components/vextab-renderer.tsx).
declare module "vextab" {
  /** Options accepted by the Artist constructor (subset). */
  export interface ArtistOptions {
    scale: number;
    font_face: string;
    font_size: number;
  }

  export class Artist {
    /** Suppress the "Powered by VexFlow" logo when true. */
    static NOLOGO: boolean;
    static DEBUG: boolean;
    constructor(
      x: number,
      y: number,
      width: number,
      options?: Partial<ArtistOptions>
    );
    render(renderer: unknown): void;
    isRendered(): boolean;
  }

  export class VexTab {
    constructor(artist: Artist);
    parse(source: string): void;
  }

  // VexFlow namespace re-exported by vextab. Typed loosely on purpose; we only
  // touch the SVG renderer backend.
  export const Vex: {
    Flow: {
      Renderer: {
        new (element: HTMLElement | string, backend: number): unknown;
        Backends: { CANVAS: number; SVG: number };
      };
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };

  export const Div: unknown;
  export const Player: unknown;
}
