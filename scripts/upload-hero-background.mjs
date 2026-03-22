/**
 * Upload du fond hero Nice → site-assets/backgrounds/nice-paysage.png
 * Clé : SUPABASE_SERVICE_ROLE_KEY ou NEXT_PUBLIC_SUPABASE_ANON_KEY (si politique le permet).
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
const apiKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const filePath = path.join(root, 'public', 'images', 'nice-hero-bg.png')
const storagePath = 'backgrounds/nice-paysage.png'

if (!url || !apiKey) {
  console.error('NEXT_PUBLIC_SUPABASE_URL et une clé API sont requis.')
  process.exit(1)
}
if (!fs.existsSync(filePath)) {
  console.error('Fichier introuvable:', filePath)
  process.exit(1)
}

const supabase = createClient(url, apiKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const buf = fs.readFileSync(filePath)
const { error } = await supabase.storage.from('site-assets').upload(storagePath, buf, {
  contentType: 'image/png',
  upsert: true,
})

if (error) {
  console.error('Upload échoué:', error.message)
  console.error('Ajoutez une politique INSERT anon pour ce chemin ou utilisez la clé service_role.')
  process.exit(1)
}

console.log('Fond hero uploadé:', storagePath)
console.log('URL:', `${url.replace(/\/$/, '')}/storage/v1/object/public/site-assets/${storagePath}`)
