-- Reconcile the tabs.type CHECK constraint with the canonical TabType in
-- types/index.ts. The original constraint allowed ('tab','chord_chart',
-- 'sheet_music'), but the app uses ('tab','chords','vextab').

-- Migrate any existing rows that used the old labels.
UPDATE tabs SET type = 'chords' WHERE type = 'chord_chart';
UPDATE tabs SET type = 'vextab' WHERE type = 'sheet_music';

ALTER TABLE tabs DROP CONSTRAINT IF EXISTS tabs_type_check;
ALTER TABLE tabs
  ADD CONSTRAINT tabs_type_check CHECK (type IN ('tab', 'chords', 'vextab'));
