'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import SiteLogo from '@/components/SiteLogo'

const NAV_ITEMS = [
  { href: '/#concept', label: 'Concept' },
  { href: '/films', label: 'Films / Projets' },
  { href: '/partenaires', label: 'Partenaires' },
  { href: '/marques', label: 'Votre tournage' },
  { href: '/votre-marque', label: 'Votre marque' },
  { href: '/blog', label: 'Actualités' },
  { href: '/#contact', label: 'Contact' },
] as const

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('nav-menu-open', menuOpen)
    return () => document.body.classList.remove('nav-menu-open')
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav className={scrolled ? 'scrolled' : ''} aria-label="Navigation principale">
        <Link href="/" className="nav-logo" onClick={closeMenu}>
          <SiteLogo variant="nav" priority />
        </Link>

        <ul className="nav-links">
          {NAV_ITEMS.filter((i) => i.href !== '/#contact').map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="nav-menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="nav-mobile-panel"
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu des rubriques'}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="nav-menu-toggle-icon" aria-hidden>
            <span />
            <span />
            <span />
          </span>
          <span className="nav-menu-toggle-text">Menu</span>
        </button>

        <Link href="/#contact" className="nav-cta" onClick={closeMenu}>
          Contact
        </Link>
      </nav>

      {menuOpen && (
        <button
          type="button"
          className="nav-mobile-backdrop"
          aria-label="Fermer le menu"
          onClick={closeMenu}
        />
      )}

      <div
        id="nav-mobile-panel"
        className={`nav-mobile-panel${menuOpen ? ' nav-mobile-panel--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Rubriques"
        aria-hidden={!menuOpen}
      >
        <ul className="nav-mobile-list">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link href={item.href} onClick={closeMenu}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
