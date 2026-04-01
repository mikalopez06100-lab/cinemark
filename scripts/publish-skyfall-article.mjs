/**
 * Publie l'article Skyfall.
 * Prerequis: node scripts/extract-skyfall-images.mjs
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

const htmlPath = 'c:/Users/ppmpc/Desktop/Cinemark/article_skyfall_cinemark.html'
const html = fs.readFileSync(htmlPath, 'utf8')

const bodym = html.match(/<article class="article-body">([\s\S]*?)<\/article>/)
let inner = bodym ? bodym[1] : ''

const captions = [...inner.matchAll(/<figure[^>]*>[\s\S]*?<figcaption>([\s\S]*?)<\/figcaption>[\s\S]*?<\/figure>/g)].map(
  (m) => m[1].replace(/<[^>]+>/g, '').trim()
)

inner = inner.replace(/<figure[\s\S]*?<\/figure>/g, () => {
  const cap = captions[0] || ''
  return `<figure class="blog-article-image"><img src="/blog/skyfall-heineken-figure.jpg" alt="Skyfall et le placement produit Heineken" width="1200" height="800" loading="lazy" /><figcaption>${cap}</figcaption></figure>`
})

const content = `<div class="blog-article-html">
<figure class="blog-article-cover"><img src="/blog/skyfall-heineken-hero.jpg" alt="45 millions de dollars pour une biere - Skyfall" width="1200" height="675" loading="eager" /></figure>
${inner.trim()}
</div>`
  .replace(/href="#"/g, 'href="/marques"')
  .replace(/Contacter Cinemark Azur/g, 'Candidater — marques & partenaires')

const title = '45 millions de dollars pour une biere - le placement produit explique'
const slug = 'skyfall-placement-produit-heineken-45-millions'
const introText =
  html
    .match(/<p class="intro">([\s\S]*?)<\/p>/)?.[1]
    ?.replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim() ||
  "Le cas Skyfall montre comment le placement produit peut financer une strategie de visibilite mondiale."
const excerpt = introText.slice(0, 280) + (introText.length > 280 ? '…' : '')
const category = 'Actualites'
const coverUrl = '/blog/skyfall-heineken-hero.jpg'

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
  console.log('Article publie :', slug)
} finally {
  await client.end()
}
