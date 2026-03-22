/**
 * Extrait les PNG base64 du HTML exporté (hero + figure) vers public/blog/
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const htmlPath = 'c:/Users/ppmpc/Desktop/Cinemark/article_cinemark_monpanierlocal.html'
const outDir = path.join(root, 'public', 'blog')

const html = fs.readFileSync(htmlPath, 'utf8')

function saveBase64(label, b64) {
  if (!b64) {
    console.warn('Missing:', label)
    return null
  }
  const buf = Buffer.from(b64, 'base64')
  const name = `${label}.png`
  const fp = path.join(outDir, name)
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(fp, buf)
  console.log('Wrote', fp, buf.length, 'bytes')
  return `/blog/${name}`
}

// Fond hero (.hero-bg)
const heroM = html.match(/\.hero-bg\s*\{[^}]*background-image:\s*url\(['"]?data:image\/png;base64,([^'")]+)/)
const heroB64 = heroM?.[1]

// Figure image
const figM = html.match(/<figure class="article-image">\s*<img[^>]+src="data:image\/png;base64,([^"]+)"/)
const figB64 = figM?.[1]

const u1 = saveBase64('mon-panier-local-hero', heroB64)
const u2 = saveBase64('mon-panier-local-plateau', figB64)

console.log('URLs:', u1, u2)
