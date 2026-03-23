/**
 * Publie l'article Lin du Sud x Comme tout le monde.
 * Prérequis : node scripts/extract-lindusud-images.mjs
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

const htmlPath = 'c:/Users/ppmpc/Desktop/Cinemark/article_lindusud.html'
const html = fs.readFileSync(htmlPath, 'utf8')

const bodym = html.match(/<article class="article-body">([\s\S]*?)<\/article>/)
let inner = bodym ? bodym[1] : ''

const captions = [...inner.matchAll(/<figure[^>]*>[\s\S]*?<figcaption>([\s\S]*?)<\/figcaption>[\s\S]*?<\/figure>/g)].map(
  (m) => m[1].replace(/<[^>]+>/g, '').trim()
)

let idx = 0
inner = inner.replace(/<figure[\s\S]*?<\/figure>/g, () => {
  const cap = captions[idx] || ''
  const replacement =
    idx === 0
      ? `<figure class="blog-article-image"><img src="/blog/lindusud-comme-tout-le-monde-plateau.png" alt="Plateau Lin du Sud sur tournage" width="1200" height="800" loading="lazy" /><figcaption>${cap}</figcaption></figure>`
      : `<figure class="blog-article-image"><img src="/blog/lindusud-comme-tout-le-monde-mid.png" alt="Équipe de tournage Lin du Sud" width="900" height="1200" loading="lazy" /><figcaption>${cap}</figcaption></figure>`
  idx += 1
  return replacement
})

const content = `<div class="blog-article-html">
<figure class="blog-article-cover"><img src="/blog/lindusud-comme-tout-le-monde-hero.png" alt="Lin du Sud sur le tournage Comme tout le monde — Cinémark Azur" width="1200" height="675" loading="eager" /></figure>
${inner.trim()}
</div>`
  .replace(/href="#"/g, 'href="/marques"')
  .replace(/Contacter Cinemark Azur/g, 'Candidater — marques & partenaires')

const title = 'Lin du Sud — une chemise sur grand écran'
const slug = 'lin-du-sud-comme-tout-le-monde-cinemark-azur'
const introText =
  html
    .match(/<p class="intro">([\s\S]*?)<\/p>/)?.[1]
    ?.replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim() ||
  "Quand une marque locale de textile rencontre l'image cinéma."
const excerpt = introText.slice(0, 280) + (introText.length > 280 ? '…' : '')
const category = 'Placement produit'
const coverUrl = '/blog/lindusud-comme-tout-le-monde-hero.png'

const env = { ...process.env, ...loadEnvLocal() }
const connectionString = env.DATABASE_URL
if (!connectionString) {
  console.error('DATABASE_URL manquant')
  process.exit(1)
}

const client = new pg.Client({ connectionString })
await client.connect()
try {
  await client.query(
    `
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
  `,
    [title, slug, category, excerpt, content, coverUrl]
  )
  console.log('Article publié :', slug)
} finally {
  await client.end()
}
