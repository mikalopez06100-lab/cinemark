import { createSupabaseServerClient } from '@/lib/supabase-server'
import AdminShell from '@/components/AdminShell'
import AdminBlogClient from './AdminBlogClient'
import type { BlogPost } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function AdminBlogPage() {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <AdminShell>
      <AdminBlogClient posts={(data ?? []) as BlogPost[]} />
    </AdminShell>
  )
}
