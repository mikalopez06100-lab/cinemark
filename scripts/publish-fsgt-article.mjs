/**
 * Publie l'article FSGT 06 × Comme tout le monde.
 * Prérequis : node scripts/extract-fsgt-images.mjs
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

const htmlPath = 'c:/Users/ppmpc/Desktop/Cinemark/article_fsgt_cinemark.html'
const html = fs.readFileSync(htmlPath, 'utf8')

const bodym = html.match(/<article class="article-body">([\s\S]*?)<\/article>/)
let inner = bodym ? bodym[1] : ''

const caps = []
for (const m of inner.matchAll(/<figure[^>]*>([\s\S]*?)<\/figure>/g)) {
  const cap = m[1]
    .match(/<figcaption>([\s\S]*?)<\/figcaption>/)?.[1]
    ?.replace(/<[^>]+>/g, '')
    .trim()
  caps.push(cap || '')
}

let figIdx = 0
inner = inner.replace(/<figure[\s\S]*?<\/figure>/g, () => {
  const cap = caps[figIdx] || ''
  figIdx += 1
  if (figIdx === 1) {
    return `<figure class="blog-article-image"><img src="/blog/fsgt-comme-tout-le-monde-plateau.png" alt="Plateau de tournage FSGT 06 — Comme tout le monde" width="1200" height="800" loading="lazy" /><figcaption>${cap}</figcaption></figure>`
  }
  return `<figure class="blog-article-image blog-article-image--square"><img src="/blog/fsgt-comme-tout-le-monde-carre.png" alt="FSGT — tournage Comme tout le monde" width="900" height="900" loading="lazy" /><figcaption>${cap}</figcaption></figure>`
})

const content = `<div class="blog-article-html">
<figure class="blog-article-cover"><img src="/blog/fsgt-comme-tout-le-monde-hero.png" alt="FSGT 06 et tournage Comme tout le monde — Cinémark Azur" width="1200" height="675" loading="eager" /></figure>
${inner.trim()}
</div>`
  .replace(/href="#"/g, 'href="/marques"')
  .replace(
    /Contacter Cinemark Azur/g,
    'Candidater — marques & partenaires'
  )

const title = 'La FSGT 06 sur grand écran — Comme tout le monde'
const slug = 'fsgt-06-comme-tout-le-monde-cinemark-azur'
const introText =
  html
    .match(/<p class="intro">([\s\S]*?)<\/p>/)?.[1]
    ?.replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim() ||
  "Quand le sport associatif rencontre le cinéma sur la Côte d'Azur."
const excerpt = introText.slice(0, 280) + (introText.length > 280 ? '…' : '')
const category = 'Territoire'
const coverUrl = '/blog/fsgt-comme-tout-le-monde-hero.png'

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
