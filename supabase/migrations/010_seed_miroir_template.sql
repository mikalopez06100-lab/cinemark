INSERT INTO films (
  title,
  slug,
  status,
  director,
  production_date,
  synopsis,
  production,
  poster_url,
  gallery_urls,
  description,
  format
)
VALUES (
  'Miroir',
  'miroir',
  'upcoming',
  'À compléter',
  DATE '2026-03-01',
  'Miroir suit une trajectoire intime et visuelle autour des reflets, de l''identité et des territoires traversés. Ce synopsis est une base éditoriale à enrichir dans l''admin.',
  'À compléter',
  '/images/films/miroir-affiche.png',
  ARRAY['/images/films/miroir-affiche.png']::text[],
  'Fiche modèle pré-remplie pour accélérer la mise en ligne du film Miroir.',
  'Long métrage'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  director = EXCLUDED.director,
  production_date = EXCLUDED.production_date,
  synopsis = EXCLUDED.synopsis,
  production = EXCLUDED.production,
  poster_url = EXCLUDED.poster_url,
  gallery_urls = EXCLUDED.gallery_urls,
  description = EXCLUDED.description,
  format = EXCLUDED.format;
