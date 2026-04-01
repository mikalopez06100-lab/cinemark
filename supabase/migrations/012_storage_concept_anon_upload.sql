-- Upload one-shot avec clé anon pour concept/cosy-kombucha-tournage.png (puis exécuter 013).

DROP POLICY IF EXISTS "Anon insert concept image" ON storage.objects;
CREATE POLICY "Anon insert concept image"
  ON storage.objects FOR INSERT TO anon
  WITH CHECK (bucket_id = 'site-assets' AND name = 'concept/cosy-kombucha-tournage.png');

DROP POLICY IF EXISTS "Anon update concept image" ON storage.objects;
CREATE POLICY "Anon update concept image"
  ON storage.objects FOR UPDATE TO anon
  USING (bucket_id = 'site-assets' AND name = 'concept/cosy-kombucha-tournage.png')
  WITH CHECK (bucket_id = 'site-assets' AND name = 'concept/cosy-kombucha-tournage.png');
