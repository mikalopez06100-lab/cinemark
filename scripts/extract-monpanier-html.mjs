import fs from 'fs'

const html = fs.readFileSync('c:/Users/ppmpc/Desktop/Cinemark/article_cinemark_monpanierlocal.html', 'utf8')

const h1m = html.match(/<h1 class="hero-titre">([\s\S]*?)<\/h1>/)
const h1 = h1m ? h1m[1].replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : ''

const bodym = html.match(/<article class="article-body">([\s\S]*?)<\/article>/)
let inner = bodym ? bodym[1] : ''

const figs = [...inner.matchAll(/<figure class="article-image">[\s\S]*?<figcaption>([\s\S]*?)<\/figcaption>\s*<\/figure>/g)]
const captions = figs.map((f) => f[1].replace(/<[^>]+>/g, '').trim())

inner = inner.replace(/<figure[\s\S]*?<\/figure>/g, '<<<FIG>>>')

console.log('---H1---')
console.log(h1)
console.log('---CAPTIONS---')
console.log(JSON.stringify(captions, null, 2))
console.log('---BODY_CLEAN---')
console.log(inner.trim())
