import type { Metadata } from 'next'
import { headers } from 'next/headers'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Cinémark — Placement de Produits Régionaux',
  description: "Cinémark connecte les marques locales aux productions cinématographiques de la région Sud. Films, séries, clips — votre produit devient part d'une histoire.",
  metadataBase: new URL('https://cinemark-azur.com'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = headers()
  const pathname = headersList.get('x-pathname') ?? ''
  const isAdmin = pathname.startsWith('/admin')

  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {!isAdmin && <Nav />}
        <main>{children}</main>
        {!isAdmin && <Footer />}
      </body>
    </html>
  )
}
