-- Partenaires
CREATE TABLE partners (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  category text,
  website text,
  logo_url text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Films
CREATE TABLE films (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  year int,
  format text,
  description text,
  status text CHECK (status IN ('ongoing','upcoming','done')) NOT NULL,
  partner_ids uuid[],
  created_at timestamptz DEFAULT now()
);

-- Articles blog
CREATE TABLE blog_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text,
  excerpt text,
  content text,
  published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Candidatures marques
CREATE TABLE applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_name text NOT NULL,
  sector text,
  contact_name text,
  email text NOT NULL,
  phone text,
  website text,
  budget_range text,
  message text,
  status text DEFAULT 'new' CHECK (status IN ('new','read','contacted','rejected')),
  created_at timestamptz DEFAULT now()
);

-- Row Level Security
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE films ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can read active partners" ON partners FOR SELECT USING (active = true);
CREATE POLICY "Public can read films" ON films FOR SELECT USING (true);
CREATE POLICY "Public can read published posts" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Anyone can insert application" ON applications FOR INSERT WITH CHECK (true);

-- Admin full access (authenticated users)
CREATE POLICY "Authenticated full access partners" ON partners FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated full access films" ON films FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated full access blog_posts" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated full access applications" ON applications FOR ALL USING (auth.role() = 'authenticated');

-- Seed data (optional — can be removed)
INSERT INTO partners (name, category, website, active) VALUES
  ('OGC Nice', 'Sport · Institution', 'https://ogcnice.com', true),
  ('Riviera Kombucha', 'Boisson · Artisanal', null, true),
  ('Riviera Beer', 'Brasserie · Artisanal', null, true),
  ('Bacho Brewery', 'Brasserie · Tourettes-sur-Loup', null, true),
  ('Soleia Nice', 'Limoncello · Local', null, true),
  ('Limonade du Comte', 'Boisson · Région SUD', null, true),
  ('WeMood Shop', 'Art & Décoration', null, true),
  ('Champagne C. Cherki', 'Champagne · Prestige', null, true);

INSERT INTO films (title, slug, year, format, description, status) VALUES
  ('Soleil d''Azur', 'soleil-dazur', 2025, 'Long métrage', 'Un drame familial tourné entre Nice et Menton, explorant l''héritage et le territoire méditerranéen. Réalisé par Antoine Mercier.', 'ongoing'),
  ('La Côte & L''Ombre', 'la-cote-et-lombre', 2025, 'Série documentaire', '6 épisodes sur les artisans et producteurs de la région PACA, diffusion prévue sur une plateforme nationale en automne 2025.', 'ongoing'),
  ('Nice by Night', 'nice-by-night', 2025, 'Court métrage', 'Un polar nocturne niçois sélectionné pour le Festival de Cannes Courts Métrages 2025. Tournage prévu en juillet.', 'upcoming'),
  ('Territoire Libre', 'territoire-libre', 2025, 'Clip musical', 'Production musicale pour un artiste régional émergent, tournage en extérieur sur la Corniche. 45 min de diffusion estimée.', 'upcoming'),
  ('Méditerranée', 'mediterranee', 2024, 'Long métrage · Diffusion Netflix', 'Un film de voyage et d''identité tourné sur toute la côte méditerranéenne française. 1,2M de vues en 3 mois sur Netflix France.', 'done'),
  ('Les Saveurs du Sud', 'les-saveurs-du-sud', 2024, 'Série culinaire · Diffusion France 3', '8 épisodes mettant en valeur les artisans alimentaires de PACA. Audience moyenne de 380 000 téléspectateurs par épisode.', 'done');

INSERT INTO blog_posts (title, slug, category, excerpt, content, published, published_at) VALUES
  ('Soleil d''Azur : 3 semaines de tournage à Menton', 'soleil-dazur-tournage-menton', 'Coulisses', 'Retour sur le tournage du dernier long métrage accompagné par Cinémark, entre soleils de façade et nuits de production.', 'Retour sur le tournage du dernier long métrage accompagné par Cinémark, entre soleils de façade et nuits de production. Trois semaines intenses sur les hauteurs de Menton, avec une équipe de 25 personnes et des décors naturels d''exception.', true, '2025-05-15'),
  ('Pourquoi le placement produit local explose en 2025', 'placement-produit-local-2025', 'Tendances', 'Les marques régionales découvrent enfin ce que les multinationales savent depuis des années : le cinéma reste le média le plus mémorable.', 'Les marques régionales découvrent enfin ce que les multinationales savent depuis des années : le cinéma reste le média le plus mémorable. En 2025, le placement produit local connaît une croissance de 340% selon les dernières études sectorielles.', true, '2025-05-08'),
  ('OGC Nice & Cinémark : un an de collaboration', 'ogcnice-cinemark-collaboration', 'Partenariat', 'Retour sur 12 mois de présence de l''OGC Nice dans les productions Cinémark, et les résultats mesurés en termes de notoriété.', 'Retour sur 12 mois de présence de l''OGC Nice dans les productions Cinémark, et les résultats mesurés en termes de notoriété. Des chiffres qui parlent d''eux-mêmes : +23% de reconnaissance de marque sur les 18-35 ans de la région.', true, '2025-05-02');
