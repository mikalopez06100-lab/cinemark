'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import SiteLogo from '@/components/SiteLogo'

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
        <SiteLogo variant="nav" priority />
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
