// Lightweight chord-sheet transposition helpers.
//
// These operate on plain-text chord charts (the `chords` tab type): lines that
// contain only chord tokens are transposed; lyric lines are left untouched so a
// mixed chords-over-lyrics sheet keeps its words intact.

const SHARP_NOTES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];
const FLAT_NOTES = [
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "Gb",
  "G",
  "Ab",
  "A",
  "Bb",
  "B",
];

// A single chord token, e.g. "G", "Am7", "F#m7b5", "C/E", "Bsus4".
const CHORD_RE =
  /^[A-G](#|b)?(maj|min|m|M|sus|dim|aug|add|ø|°)?\d*(sus\d+)?(add\d+)?(b\d+|#\d+)?(\/[A-G](#|b)?)?$/;

function noteIndex(note: string): number | null {
  const sharp = SHARP_NOTES.indexOf(note);
  if (sharp !== -1) return sharp;
  const flat = FLAT_NOTES.indexOf(note);
  if (flat !== -1) return flat;
  return null;
}

function shiftNote(note: string, semitones: number, preferFlats: boolean) {
  const idx = noteIndex(note);
  if (idx === null) return note;
  const next = (((idx + semitones) % 12) + 12) % 12;
  return (preferFlats ? FLAT_NOTES : SHARP_NOTES)[next];
}

function transposeChord(
  chord: string,
  semitones: number,
  preferFlats: boolean
): string {
  const [main, bass] = chord.split("/");
  const m = main.match(/^([A-G](?:#|b)?)(.*)$/);
  if (!m) return chord;

  let out = shiftNote(m[1], semitones, preferFlats) + m[2];
  if (bass !== undefined) {
    const bm = bass.match(/^([A-G](?:#|b)?)(.*)$/);
    out +=
      "/" + (bm ? shiftNote(bm[1], semitones, preferFlats) + bm[2] : bass);
  }
  return out;
}

function isChordLine(line: string): boolean {
  const tokens = line.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return false;
  return tokens.every((t) => CHORD_RE.test(t));
}

/**
 * Transpose a chord chart by a number of semitones. Positive transposes up,
 * negative down. Lyric lines (anything that isn't all chord tokens) are
 * returned unchanged.
 */
export function transposeChordSheet(content: string, semitones: number): string {
  if (!semitones) return content;
  const preferFlats = semitones < 0;
  return content
    .split("\n")
    .map((line) =>
      isChordLine(line)
        ? line.replace(/\S+/g, (tok) =>
            transposeChord(tok, semitones, preferFlats)
          )
        : line
    )
    .join("\n");
}

export function formatSemitones(semitones: number): string {
  if (semitones === 0) return "0";
  return semitones > 0 ? `+${semitones}` : `${semitones}`;
}
