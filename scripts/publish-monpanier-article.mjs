/**
 * Publie l'article Mon Panier Local (extrait du HTML bureau + images dans public/blog/).
 * Prérequis : node scripts/extract-article-images.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pg from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

function loadEnvLocal() {
  const p = path.join(root, '.env.local')
  if (!fs.existsSync(p)) return {}
  const env = {}
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const eq = t.indexOf('=')
    if (eq === -1) continue
    const key = t.slice(0, eq).trim()
    let val = t.slice(eq + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    env[key] = val
  }
  return env
}

const htmlPath = 'c:/Users/ppmpc/Desktop/Cinemark/article_cinemark_monpanierlocal.html'
const html = fs.readFileSync(htmlPath, 'utf8')

const bodym = html.match(/<article class="article-body">([\s\S]*?)<\/article>/)
let inner = bodym ? bodym[1] : ''
inner = inner.replace(/<figure[\s\S]*?<\/figure>/g, '<<<FIG>>>')

const figcap =
  html
    .match(/<figure class="article-image">[\s\S]*?<figcaption>([\s\S]*?)<\/figcaption>/)?.[1]
    .replace(/<[^>]+>/g, '')
    .trim() || 'Sur le plateau · Photographies Cinemark Azur'

inner = inner.replace(
  '<<<FIG>>>',
  `<figure class="blog-article-image"><img src="/blog/mon-panier-local-plateau.png" alt="Plateau de tournage Mon Panier Local 06" width="1200" height="800" loading="lazy" /><figcaption>${figcap}</figcaption></figure>`
)

const content = `<div class="blog-article-html">
<figure class="blog-article-cover"><img src="/blog/mon-panier-local-hero.png" alt="Fruits locaux et clap de tournage — Cinémark Azur" width="1200" height="675" loading="eager" /></figure>
${inner.trim()}
</div>`
  .replace(/href="#"/g, 'href="/marques"')
  .replace(/Contacter Cinemark Azur/g, 'Candidater — marques & partenaires')

const title = "Quand Mon Panier Local 06 s'invite sur un tournage"
const slug = 'mon-panier-local-06-cinemark-azur'
const excerpt =
  'Comment une marque locale du 06 a transformé une caisse de fruits en outil de communication cinématographique sur le tournage du court-métrage « Léa est là ».'
const category = 'Placement produit'
const coverUrl = '/blog/mon-panier-local-hero.png'

const env = { ...process.env, ...loadEnvLocal() }
const connectionString = env.DATABASE_URL
if (!connectionString) {
  console.error('DATABASE_URL manquant')
  process.exit(1)
}

const client = new pg.Client({ connectionString })
await client.connect()
try {
  await client.query(`
    INSERT INTO blog_posts (title, slug, category, excerpt, content, published, published_at, cover_url)
    VALUES ($1, $2, $3, $4, $5, true, now(), $6)
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      category = EXCLUDED.category,
      excerpt = EXCLUDED.excerpt,
      content = EXCLUDED.content,
      published = true,
      published_at = COALESCE(blog_posts.published_at, EXCLUDED.published_at),
      cover_url = EXCLUDED.cover_url
  `, [title, slug, category, excerpt, content, coverUrl])
  console.log('Article publié :', slug)
} finally {
  await client.end()
}
