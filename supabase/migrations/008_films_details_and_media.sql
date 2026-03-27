ALTER TABLE films
  ADD COLUMN IF NOT EXISTS production_date date,
  ADD COLUMN IF NOT EXISTS synopsis text,
  ADD COLUMN IF NOT EXISTS poster_url text,
  ADD COLUMN IF NOT EXISTS gallery_urls text[];

-- Backfill pour préserver un tri chronologique cohérent
UPDATE films
SET production_date = make_date(year, 1, 1)
WHERE production_date IS NULL
  AND year IS NOT NULL
  AND year >= 1900
  AND year <= 2100;
