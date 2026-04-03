'use client'

import Image from 'next/image'
import { useState } from 'react'
import { resolveMediaUrl } from '@/lib/media-url'
import { getSiteLogoRemoteUrl } from '@/lib/site-logo'
import fallbackLogo from '../public/images/cinemark-logo.png'

const FALLBACK_SRC = fallbackLogo.src

/** Dimensions = ratio intrinsèque (~3,33:l) ; le CSS fixe la taille d’affichage réelle. */
const SIZES = {
  nav: { width: 480, height: 144, className: 'site-logo site-logo--nav' as const },
  footer: { width: 420, height: 126, className: 'site-logo site-logo--footer' as const },
  admin: { width: 480, height: 144, className: 'site-logo site-logo--admin' as const },
}

type Variant = keyof typeof SIZES

export default function SiteLogo({
  variant,
  priority,
}: {
  variant: Variant
  priority?: boolean
}) {
  const remote = resolveMediaUrl(getSiteLogoRemoteUrl())
  const [src, setSrc] = useState(remote ?? FALLBACK_SRC)
  const { width, height, className } = SIZES[variant]

  return (
    <Image
      src={src}
      alt="Cinémark — placement de produits régionaux"
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={() => {
        if (src !== FALLBACK_SRC) setSrc(FALLBACK_SRC)
      }}
    />
  )
}
