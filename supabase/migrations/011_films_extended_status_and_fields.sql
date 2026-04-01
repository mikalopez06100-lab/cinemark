ALTER TABLE films
  ADD COLUMN IF NOT EXISTS casting text,
  ADD COLUMN IF NOT EXISTS diffusion text,
  ADD COLUMN IF NOT EXISTS awards text,
  ADD COLUMN IF NOT EXISTS external_url text,
  ADD COLUMN IF NOT EXISTS gallery_stills_urls text[],
  ADD COLUMN IF NOT EXISTS gallery_bts_urls text[],
  ADD COLUMN IF NOT EXISTS gallery_promo_urls text[];

ALTER TABLE films DROP CONSTRAINT IF EXISTS films_status_check;

UPDATE films
SET status = 'finalized'
WHERE status = 'done';

ALTER TABLE films
  ADD CONSTRAINT films_status_check
  CHECK (status IN ('finalized', 'postprod', 'ongoing', 'upcoming', 'seeking_partners'));
