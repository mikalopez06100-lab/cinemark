-- Bucket public pour logos et assets du site (URL stable pour Next.js)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-assets',
  'site-assets',
  true,
  5242880,
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Lecture publique des fichiers
DROP POLICY IF EXISTS "Public read site-assets" ON storage.objects;
CREATE POLICY "Public read site-assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-assets');

-- Gestion par utilisateurs authentifiés (back-office)
DROP POLICY IF EXISTS "Authenticated insert site-assets" ON storage.objects;
CREATE POLICY "Authenticated insert site-assets"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "Authenticated update site-assets" ON storage.objects;
CREATE POLICY "Authenticated update site-assets"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "Authenticated delete site-assets" ON storage.objects;
CREATE POLICY "Authenticated delete site-assets"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'site-assets');
