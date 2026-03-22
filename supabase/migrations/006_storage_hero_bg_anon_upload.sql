-- Upload one-shot avec clé anon pour backgrounds/nice-paysage.png (puis exécuter 007).

DROP POLICY IF EXISTS "Anon insert hero bg" ON storage.objects;
CREATE POLICY "Anon insert hero bg"
  ON storage.objects FOR INSERT TO anon
  WITH CHECK (bucket_id = 'site-assets' AND name = 'backgrounds/nice-paysage.png');

DROP POLICY IF EXISTS "Anon update hero bg" ON storage.objects;
CREATE POLICY "Anon update hero bg"
  ON storage.objects FOR UPDATE TO anon
  USING (bucket_id = 'site-assets' AND name = 'backgrounds/nice-paysage.png')
  WITH CHECK (bucket_id = 'site-assets' AND name = 'backgrounds/nice-paysage.png');
