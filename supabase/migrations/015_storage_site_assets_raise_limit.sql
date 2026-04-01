-- Affiches et galeries films : limite 5 Mo trop serrée pour du JPEG HD.
-- Types MIME courants pour captures / exports (sans élargir à tout type binaire).
UPDATE storage.buckets
SET
  file_size_limit = 15728640,
  allowed_mime_types = ARRAY[
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/svg+xml',
    'image/avif',
    'image/gif'
  ]::text[]
WHERE id = 'site-assets';
