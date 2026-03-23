/**
 * Extrait les PNG base64 du HTML Lin du Sud → public/blog/lindusud-*.png
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const htmlPath = 'c:/Users/ppmpc/Desktop/Cinemark/article_lindusud.html'
const outDir = path.join(root, 'public', 'blog')

const html = fs.readFileSync(htmlPath, 'utf8')

function saveBase64(filename, b64) {
  if (!b64) {
    console.warn('Missing:', filename)
    return null
  }
  const buf = Buffer.from(b64, 'base64')
  const fp = path.join(outDir, filename)
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(fp, buf)
  console.log('Wrote', filename, buf.length, 'bytes')
  return `/blog/${filename}`
}

const heroM = html.match(
  /\.hero-bg\s*\{[\s\S]*?background-image:\s*url\(['"]?data:image\/png;base64,([^'")]+)/
)
const firstM = html.match(
  /<figure class="article-image">[\s\S]*?<img[^>]+src="data:image\/png;base64,([^"]+)"/
)
const midM = html.match(
  /<figure class="article-image-mid">[\s\S]*?<img[^>]+src="data:image\/png;base64,([^"]+)"/
)

const u0 = saveBase64('lindusud-comme-tout-le-monde-hero.png', heroM?.[1])
const u1 = saveBase64('lindusud-comme-tout-le-monde-plateau.png', firstM?.[1])
const u2 = saveBase64('lindusud-comme-tout-le-monde-mid.png', midM?.[1])

console.log('URLs:', u0, u1, u2)
