import { createSupabaseServerClient } from '@/lib/supabase-server'
import AdminShell from '@/components/AdminShell'
import AdminFilmsClient from './AdminFilmsClient'
import type { Film, Partner } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function AdminFilmsPage() {
  const supabase = createSupabaseServerClient()
  const [filmsRes, partnersRes] = await Promise.all([
    supabase
      .from('films')
      .select('*')
      .order('production_date', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false }),
    supabase.from('partners').select('id, name').order('name'),
  ])

  return (
    <AdminShell>
      <AdminFilmsClient
        films={(filmsRes.data ?? []) as Film[]}
        partners={(partnersRes.data ?? []) as Pick<Partner, 'id' | 'name'>[]}
      />
    </AdminShell>
  )
}
