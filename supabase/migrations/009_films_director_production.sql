ALTER TABLE films
  ADD COLUMN IF NOT EXISTS director text,
  ADD COLUMN IF NOT EXISTS production text;
