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

const entries = [
  { name: 'Akathor', category: 'Culture · Musique', file: '01_akathor.png' },
  { name: 'À la Fut', category: 'Brasserie · Artisanal', file: '02_a_la_fut.png' },
  { name: 'Avia', category: 'Énergie · Mobilité', file: '03_avia.png' },
  { name: 'Casino Barrière', category: 'Loisirs · Institution', file: '04_casino_barriere.png' },
  { name: 'Bière du Comté', category: 'Brasserie · Artisanal', file: '05_brasserie_comte.png' },
  { name: 'Cosy Kombucha', category: 'Boisson · Artisanal', file: '06_cosy_kombucha.png' },
  { name: 'Domaine du Blavet', category: 'Vins · Terroir', file: '07_domaine_blavet.png' },
  { name: 'Esprit Azur', category: 'Marque locale', file: '08_esprit_azur.png' },
  { name: 'Ezea', category: 'Marque locale', file: '09_ezea.png' },
  { name: 'Fil Rouge', category: 'Marque locale', file: '10_fil_rouge.png' },
  { name: 'FSGT 06', category: 'Sport · Fédération', file: '11_fsgt.png' },
  { name: 'Haute Pression', category: 'Marque locale', file: '12_haute_pression.png' },
  { name: 'J. Multari', category: 'Gastronomie', file: '13_j_multari.png' },
  { name: 'Jumalee', category: 'Marque locale', file: '14_jumalee.png' },
  { name: 'Club Nautique', category: 'Sport · Mer', file: '15_club_nautique.png' },
  { name: 'Ailes Azur', category: 'Marque locale', file: '16_ailes_azur.png' },
  { name: 'Levens', category: 'Territoire · Institution', file: '17_levens.png' },
  { name: 'Lin du Sud', category: 'Textile · Artisanal', file: '18_lin_du_sud.png' },
  { name: 'OGC Nice', category: 'Sport · Institution', file: '19_ogc_nice.png' },
  { name: 'Pays de Fayence', category: 'Territoire', file: '20_pays_fayence.png' },
  { name: 'Guglielmi', category: 'Gastronomie', file: '21_guglielmi.png' },
  { name: 'Roz Paper', category: 'Marque locale', file: '22_roz_paper.png' },
  { name: 'Soleia Nice', category: 'Limoncello · Local', file: '23_soleia_nice.png' },
  { name: 'Spar', category: 'Distribution · Proximité', file: '24_spar.png' },
  { name: 'Vieforme', category: 'Bien-être', file: '25_vieforme.png' },
]

const env = { ...process.env, ...loadEnvLocal() }
const connectionString = env.DATABASE_URL
if (!connectionString) {
  console.error('DATABASE_URL manquant')
  process.exit(1)
}

const client = new pg.Client({ connectionString })
await client.connect()
try {
  for (const p of entries) {
    const logoUrl = `/images/partners/${p.file}`
    const existing = await client.query('SELECT id FROM partners WHERE name = $1 LIMIT 1', [p.name])
    if (existing.rowCount) {
      await client.query(
        'UPDATE partners SET category = $1, logo_url = $2, active = true WHERE id = $3',
        [p.category, logoUrl, existing.rows[0].id]
      )
    } else {
      await client.query(
        'INSERT INTO partners (name, category, logo_url, active) VALUES ($1, $2, $3, true)',
        [p.name, p.category, logoUrl]
      )
    }
  }
  console.log(`OK: ${entries.length} partenaires synchronisés`)
} finally {
  await client.end()
}
