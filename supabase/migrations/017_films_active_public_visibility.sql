-- Visibilité publique : seuls les projets actifs sont visibles pour les visiteurs (anon).
ALTER TABLE films
  ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true;

DROP POLICY IF EXISTS "Public can read films" ON films;
CREATE POLICY "Public can read active films" ON films
  FOR SELECT
  USING (active = true);
