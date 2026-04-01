import Link from 'next/link'
import SiteLogo from '@/components/SiteLogo'

export default function Footer() {
  return (
    <footer>
      <Link href="/" className="footer-brand">
        <SiteLogo variant="footer" />
      </Link>

      <p className="footer-copy">© 2025 Cinémark · Placement de Produits Régionaux · Nice, France</p>

      <div className="footer-social">
        <a href="https://instagram.com/cinemark_azur" target="_blank" rel="noopener noreferrer">Instagram</a>
        <Link href="/partenaires">Partenaires</Link>
        <Link href="/blog">Actualités</Link>
        <Link href="/votre-marque">Candidater</Link>
      </div>
    </footer>
  )
}
