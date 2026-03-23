import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

let browserClient: ReturnType<typeof createBrowserClient> | null = null

function createSupabaseClient() {
  if (typeof window === 'undefined') {
    // Server components in this codebase still import this module for read queries.
    return createClient(supabaseUrl, supabaseAnonKey)
  }
  if (!browserClient) {
    browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }
  return browserClient
}

export const supabase = createSupabaseClient()

// Types
export type Partner = {
  id: string
  name: string
  category: string | null
  website: string | null
  logo_url: string | null
  active: boolean
  created_at: string
}

export type Film = {
  id: string
  title: string
  slug: string
  year: number | null
  format: string | null
  description: string | null
  status: 'ongoing' | 'upcoming' | 'done'
  partner_ids: string[] | null
  created_at: string
}

export type BlogPost = {
  id: string
  title: string
  slug: string
  category: string | null
  excerpt: string | null
  content: string | null
  cover_url: string | null
  published: boolean
  published_at: string | null
  created_at: string
}

export type Application = {
  id: string
  brand_name: string
  sector: string | null
  contact_name: string | null
  email: string
  phone: string | null
  website: string | null
  budget_range: string | null
  message: string | null
  status: 'new' | 'read' | 'contacted' | 'rejected'
  created_at: string
}
