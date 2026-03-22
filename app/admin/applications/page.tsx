import { supabase } from '@/lib/supabase'
import AdminShell from '@/components/AdminShell'
import AdminApplicationsClient from './AdminApplicationsClient'
import type { Application } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function AdminApplicationsPage() {
  const { data } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <AdminShell>
      <AdminApplicationsClient applications={(data ?? []) as Application[]} />
    </AdminShell>
  )
}
