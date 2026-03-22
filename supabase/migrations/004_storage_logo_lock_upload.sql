-- À lancer après le premier upload du logo (npm run storage:upload-logo).

DROP POLICY IF EXISTS "Anon insert logo file only" ON storage.objects;
DROP POLICY IF EXISTS "Anon update logo file only" ON storage.objects;
