'use client'

import Image from 'next/image'
import { useState } from 'react'
import { getSiteLogoRemoteUrl } from '@/lib/site-logo'

const FALLBACK_SRC = '/images/cinemark-logo.png'

const SIZES = {
  nav: { width: 132, height: 40, className: 'site-logo site-logo--nav' as const },
  footer: { width: 120, height: 36, className: 'site-logo site-logo--footer' as const },
  admin: { width: 140, height: 42, className: 'site-logo site-logo--admin' as const },
}

type Variant = keyof typeof SIZES

export default function SiteLogo({
  variant,
  priority,
}: {
  variant: Variant
  priority?: boolean
}) {
  const remote = getSiteLogoRemoteUrl()
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
