-- Permet un premier envoi du logo avec la clé anon (script one-shot).
-- Après upload réussi, exécuter 004_storage_logo_lock_upload.sql pour retirer cette règle.

DROP POLICY IF EXISTS "Anon insert logo file only" ON storage.objects;
CREATE POLICY "Anon insert logo file only"
  ON storage.objects FOR INSERT TO anon
  WITH CHECK (
    bucket_id = 'site-assets'
    AND name = 'branding/cinemark-logo.png'
  );

DROP POLICY IF EXISTS "Anon update logo file only" ON storage.objects;
CREATE POLICY "Anon update logo file only"
  ON storage.objects FOR UPDATE TO anon
  USING (bucket_id = 'site-assets' AND name = 'branding/cinemark-logo.png')
  WITH CHECK (bucket_id = 'site-assets' AND name = 'branding/cinemark-logo.png');
