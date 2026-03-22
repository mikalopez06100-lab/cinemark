/**
 * Envoie le logo vers Supabase Storage (bucket site-assets).
 * Préférez SUPABASE_SERVICE_ROLE_KEY (.env.local) ; sinon clé anon + migration 003 (puis 004 pour refermer).
 *
 * Usage : node scripts/upload-site-logo.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

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

const env = { ...process.env, ...loadEnvLocal() }
const url = env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const logoPath = path.join(root, 'public', 'images', 'cinemark-logo.png')
const storagePath = 'branding/cinemark-logo.png'

if (!url) {
  console.error('NEXT_PUBLIC_SUPABASE_URL manquant dans .env.local.')
  process.exit(1)
}

const apiKey = serviceKey || anonKey
if (!apiKey) {
  console.error(
    'Ajoutez SUPABASE_SERVICE_ROLE_KEY ou NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local.'
  )
  process.exit(1)
}

if (!fs.existsSync(logoPath)) {
  console.error('Fichier introuvable:', logoPath)
  process.exit(1)
}

const supabase = createClient(url, apiKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const buf = fs.readFileSync(logoPath)
const { data, error } = await supabase.storage.from('site-assets').upload(storagePath, buf, {
  contentType: 'image/png',
  upsert: true,
})

if (error) {
  console.error('Upload échoué:', error.message)
  console.error('Avez-vous appliqué supabase/migrations/002_storage_site_assets.sql ?')
  process.exit(1)
}

console.log('Logo uploadé:', data?.path ?? storagePath)
console.log('URL publique:', `${url.replace(/\/$/, '')}/storage/v1/object/public/site-assets/${storagePath}`)
