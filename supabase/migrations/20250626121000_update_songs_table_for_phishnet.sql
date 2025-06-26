-- Remove old fields and add 'song' field to songs table
ALTER TABLE songs DROP COLUMN IF EXISTS title;
ALTER TABLE songs DROP COLUMN IF EXISTS composer;
ALTER TABLE songs DROP COLUMN IF EXISTS debut_date;
ALTER TABLE songs DROP COLUMN IF EXISTS history;
ALTER TABLE songs ADD COLUMN IF NOT EXISTS song TEXT;
