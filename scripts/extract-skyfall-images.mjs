/**
 * Extrait les images base64 du HTML Skyfall -> public/blog/skyfall-*.jpg
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const htmlPath = 'c:/Users/ppmpc/Desktop/Cinemark/article_skyfall_cinemark.html'
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

const heroM = html.match(/\.hero-bg\s*\{[\s\S]*?data:image\/jpeg;base64,([^'")\s]+)/)
const figM = html.match(/<figure class="article-image">[\s\S]*?<img[^>]+src="data:image\/jpeg;base64,([^"]+)"/)

const u0 = saveBase64('skyfall-heineken-hero.jpg', heroM?.[1])
const u1 = saveBase64('skyfall-heineken-figure.jpg', figM?.[1])

console.log('URLs:', u0, u1)
