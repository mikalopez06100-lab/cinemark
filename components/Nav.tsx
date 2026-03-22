'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <Link href="/" className="nav-logo">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="2" y="8" width="24" height="18" rx="2" stroke="#b8973e" strokeWidth="1.5"/>
          <rect x="2" y="8" width="24" height="6" rx="2" fill="#b8973e" fillOpacity="0.2" stroke="#b8973e" strokeWidth="1.5"/>
          <line x1="8" y1="8" x2="6" y2="3" stroke="#b8973e" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="14" y1="8" x2="12" y2="3" stroke="#b8973e" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="20" y1="8" x2="18" y2="3" stroke="#b8973e" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="14" cy="20" r="3.5" stroke="#b8973e" strokeWidth="1.5"/>
        </svg>
        <span className="nav-logo-text" style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', fontWeight: 400 }}>
          Cinémark
        </span>
      </Link>

      <ul className="nav-links">
        <li><Link href="/#concept">Concept</Link></li>
        <li><Link href="/films">Films</Link></li>
        <li><Link href="/#clients">Références</Link></li>
        <li><Link href="/#territory">Territoire</Link></li>
        <li><Link href="/blog">Blog</Link></li>
      </ul>

      <Link href="/marques" className="nav-cta">Candidater</Link>
    </nav>
  )
}
