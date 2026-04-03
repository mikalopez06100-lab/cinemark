import type { StaticImageData } from 'next/image'
import conceptLocal from '../public/images/concept-cosy-kombucha-tournage.png'

/** Fichier versionné ; sync optionnelle vers le bucket (scripts/upload-concept-image.mjs). */
export const CONCEPT_IMAGE_STORAGE_PATH = 'concept/cosy-kombucha-tournage.png'

export function getConceptImageUrl(): string | StaticImageData {
  const override = process.env.NEXT_PUBLIC_CONCEPT_IMAGE_URL?.trim()
  if (override) return override
  return conceptLocal
}
