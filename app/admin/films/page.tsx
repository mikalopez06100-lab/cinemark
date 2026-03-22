import { supabase } from '@/lib/supabase'
import AdminShell from '@/components/AdminShell'
import AdminFilmsClient from './AdminFilmsClient'
import type { Film, Partner } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function AdminFilmsPage() {
  const [filmsRes, partnersRes] = await Promise.all([
    supabase.from('films').select('*').order('created_at', { ascending: false }),
    supabase.from('partners').select('id, name').eq('active', true).order('name'),
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
