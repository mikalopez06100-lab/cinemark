import { supabase } from '@/lib/supabase'
import AdminShell from '@/components/AdminShell'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const [applicationsRes, filmsRes, postsRes, partnersRes, recentAppsRes] = await Promise.all([
    supabase.from('applications').select('id', { count: 'exact' }).eq('status', 'new'),
    supabase.from('films').select('id', { count: 'exact' }),
    supabase.from('blog_posts').select('id', { count: 'exact' }).eq('published', true),
    supabase.from('partners').select('id', { count: 'exact' }).eq('active', true),
    supabase.from('applications').select('*').order('created_at', { ascending: false }).limit(5),
  ])

  const stats = [
    { label: 'Candidatures nouvelles', value: applicationsRes.count ?? 0 },
    { label: 'Films total', value: filmsRes.count ?? 0 },
    { label: 'Articles publiés', value: postsRes.count ?? 0 },
    { label: 'Partenaires actifs', value: partnersRes.count ?? 0 },
  ]

  const recentApps = recentAppsRes.data ?? []

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      new: 'badge-new', read: 'badge-read',
      contacted: 'badge-contacted', rejected: 'badge-rejected'
    }
    const label: Record<string, string> = {
      new: 'Nouveau', read: 'Lu', contacted: 'Contacté', rejected: 'Refusé'
    }
    return <span className={`badge ${map[s] ?? ''}`}>{label[s] ?? s}</span>
  }

  return (
    <AdminShell>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
      </div>

      <div className="admin-stats">
        {stats.map((s) => (
          <div key={s.label} className="admin-stat-card">
            <p className="admin-stat-label">{s.label}</p>
            <p className="admin-stat-value">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="admin-table-wrap" style={{ marginTop: '1.5rem' }}>
        <div className="admin-table-header">
          <span className="admin-table-title">Actions rapides</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', padding: '1rem 0.25rem 0.25rem' }}>
          <Link href="/admin/films?new=1" className="btn-admin">+ Nouveau film</Link>
          <Link href="/admin/partners?new=1" className="btn-admin">+ Nouveau partenaire</Link>
          <Link href="/admin/blog?new=1" className="btn-admin">+ Nouvelle actualité</Link>
        </div>
      </div>

      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <span className="admin-table-title">5 dernières candidatures</span>
          <Link href="/admin/applications" className="btn-admin-ghost">Voir toutes</Link>
        </div>
        <table>
          <thead>
            <tr>
              <th>Marque</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Budget</th>
              <th>Statut</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentApps.length === 0 ? (
              <tr><td colSpan={6} style={{ color: 'var(--muted)', textAlign: 'center', padding: '2rem' }}>Aucune candidature</td></tr>
            ) : recentApps.map((app: any) => (
              <tr key={app.id}>
                <td style={{ fontWeight: 400 }}>{app.brand_name}</td>
                <td style={{ color: 'var(--muted)' }}>{app.contact_name ?? '—'}</td>
                <td style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>{app.email}</td>
                <td style={{ color: 'var(--muted)' }}>{app.budget_range ?? '—'}</td>
                <td>{statusBadge(app.status)}</td>
                <td style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
                  {new Date(app.created_at).toLocaleDateString('fr-FR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  )
}
