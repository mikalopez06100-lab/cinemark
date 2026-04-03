-- Légendes par image (même ordre que les tableaux d’URLs) + crédits photographes globaux
ALTER TABLE films
  ADD COLUMN IF NOT EXISTS gallery_captions text[],
  ADD COLUMN IF NOT EXISTS gallery_stills_captions text[],
  ADD COLUMN IF NOT EXISTS gallery_bts_captions text[],
  ADD COLUMN IF NOT EXISTS gallery_promo_captions text[],
  ADD COLUMN IF NOT EXISTS photographer_credits text;
