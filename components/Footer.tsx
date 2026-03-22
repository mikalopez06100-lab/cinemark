import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <Link href="/" className="footer-brand">
        <svg viewBox="0 0 28 28" fill="none">
          <rect x="2" y="8" width="24" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="2" y="8" width="24" height="6" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="8" y1="8" x2="6" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="14" y1="8" x2="12" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="20" y1="8" x2="18" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="14" cy="20" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
        <span className="footer-brand-text">Cinémark</span>
      </Link>

      <p className="footer-copy">© 2025 Cinémark · Placement de Produits Régionaux · Nice, France</p>

      <div className="footer-social">
        <a href="https://instagram.com/cinemark_azur" target="_blank" rel="noopener noreferrer">Instagram</a>
        <Link href="/blog">Blog</Link>
        <Link href="/marques">Candidater</Link>
      </div>
    </footer>
  )
}
