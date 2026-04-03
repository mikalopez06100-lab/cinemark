import { createSupabaseServerClient } from '@/lib/supabase-server'
import AdminShell from '@/components/AdminShell'
import AdminPartnersClient from './AdminPartnersClient'
import type { Partner } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function AdminPartnersPage() {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from('partners')
    .select('*')
    .order('name')

  return (
    <AdminShell>
      <AdminPartnersClient partners={(data ?? []) as Partner[]} />
    </AdminShell>
  )
}
