-- Add slug column to songs table
ALTER TABLE songs ADD COLUMN slug TEXT UNIQUE;
CREATE UNIQUE INDEX IF NOT EXISTS songs_slug_idx ON songs(slug);
-- You may want to backfill slugs for existing songs here
-- UPDATE songs SET slug = lower(replace(title, ' ', '-')) WHERE slug IS NULL;
