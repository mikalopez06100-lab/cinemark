'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import SiteLogo from '@/components/SiteLogo'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '◈' },
  { href: '/admin/films', label: 'Films', icon: '▶' },
  { href: '/admin/partners', label: 'Partenaires', icon: '◉' },
  { href: '/admin/blog', label: 'Blog', icon: '◎' },
  { href: '/admin/applications', label: 'Candidatures', icon: '◇' },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-logo">
          <SiteLogo variant="admin" />
          <span className="admin-logo-sub">Administration</span>
        </Link>

        <nav className="admin-nav">
          {navItems.map((item) => {
            const isActive = item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={isActive ? 'active' : ''}
              >
                <span style={{ fontSize: '1rem', opacity: 0.7 }}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <button
            onClick={handleLogout}
            style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '0.75rem', letterSpacing: '0.05em', padding: 0 }}
          >
            Déconnexion →
          </button>
        </div>
      </aside>

      <main className="admin-main">
        {children}
      </main>
    </div>
  )
}
