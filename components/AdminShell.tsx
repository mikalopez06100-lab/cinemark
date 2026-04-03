'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import SiteLogo from '@/components/SiteLogo'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '◈' },
  { href: '/admin/films', label: 'Projets', icon: '▶' },
  { href: '/admin/partners', label: 'Partenaires', icon: '◉' },
  { href: '/admin/blog', label: 'Actualités', icon: '◎' },
  { href: '/admin/applications', label: 'Candidatures', icon: '◇' },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const navLink = (item: (typeof navItems)[number]) => {
    const isActive = item.href === '/admin'
      ? pathname === '/admin'
      : pathname.startsWith(item.href)
    return (
      <Link
        key={item.href}
        href={item.href}
        className={isActive ? 'active' : ''}
        onClick={() => setMobileMenuOpen(false)}
      >
        <span style={{ fontSize: '1rem', opacity: 0.7 }}>{item.icon}</span>
        {item.label}
      </Link>
    )
  }

  return (
    <div className="admin-shell">
      <header className="admin-mobile-top">
        <Link href="/admin" className="admin-mobile-top-brand" onClick={() => setMobileMenuOpen(false)}>
          <SiteLogo variant="admin" />
        </Link>
        <button
          type="button"
          className="admin-mobile-menu-btn"
          aria-expanded={mobileMenuOpen}
          aria-controls="admin-mobile-drawer"
          onClick={() => setMobileMenuOpen((o) => !o)}
        >
          {mobileMenuOpen ? 'Fermer' : 'Menu'}
        </button>
      </header>

      <div
        id="admin-mobile-drawer"
        className={`admin-mobile-drawer${mobileMenuOpen ? ' is-open' : ''}`}
        aria-hidden={!mobileMenuOpen}
      >
        <nav className="admin-mobile-drawer-nav" aria-label="Rubriques administration">
          {navItems.map((item) => navLink(item))}
        </nav>
        <div className="admin-mobile-drawer-footer">
          <button
            type="button"
            className="admin-mobile-logout"
            onClick={() => {
              setMobileMenuOpen(false)
              void handleLogout()
            }}
          >
            Déconnexion →
          </button>
        </div>
      </div>
      {mobileMenuOpen ? (
        <button
          type="button"
          className="admin-mobile-backdrop"
          aria-label="Fermer le menu"
          onClick={() => setMobileMenuOpen(false)}
        />
      ) : null}

      <div className="admin-shell-body">
        <aside className="admin-sidebar">
          <Link href="/admin" className="admin-logo">
            <SiteLogo variant="admin" />
            <span className="admin-logo-sub">Administration</span>
          </Link>

          <nav className="admin-nav" aria-label="Rubriques administration">
            {navItems.map((item) => navLink(item))}
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
    </div>
  )
}
