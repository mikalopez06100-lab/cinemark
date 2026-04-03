import type { Metadata } from 'next'
import Image from 'next/image'
import tournageScene from '../../public/images/votre-tournage-scene.png'

export const metadata: Metadata = {
  title: 'Votre tournage — Cinémark',
  description: 'Vous préparez un tournage dans le Sud ? Nous vous aidons à trouver des partenaires et des placements de produit cohérents.',
}

export default function MarquesPage() {
  return (
    <section id="marques" className="page-section-top marques-page--tournage">
      <div className="marques-intro">
        <p className="section-label">Votre tournage</p>
        <h1 className="section-title marques-hero-title">
          <span className="marques-hero-line1">Vous préparez un tournage</span>
          <span className="marques-hero-line2">
            dans le <em>Sud</em> ?
          </span>
        </h1>
        <p className="section-text">Nous accompagnons les productions audiovisuelles dans la recherche de partenaires et de placements de produit adaptés à votre univers cinématographique.</p>
      </div>

      <div className="marques-tournage-visual marques-tournage-visual--between">
        <Image
          src={tournageScene}
          alt="Plateau de tournage de nuit, clap et équipe — Cinémark accompagne les productions"
          fill
          sizes="(max-width: 900px) 100vw, min(960px, 90vw)"
          className="marques-tournage-visual-img"
          priority
        />
      </div>

      <div className="marques-why marques-why--after-tournage-visual">
        {[
          { num: '01', title: 'Un budget complémentaire', text: 'Nous analysons votre projet, puis nous sollicitons les partenaires les plus adaptés pour compléter son financement.' },
          { num: '02', title: 'Des partenaires impliqués', text: 'Les enseignes que nous solliciterons ne seront pas de simples partenaires, mais de véritables acteurs engagés dans la réussite de votre projet et de sa diffusion.' },
          { num: '03', title: 'Des économies réalisées', text: 'Hébergement, régie, craft, costumes, décors : les partenariats activés permettent de réduire les coûts de production.' },
        ].map((item) => (
          <div key={item.num} className="marques-why-item">
            <div className="marques-why-num">{item.num}</div>
            <div className="marques-why-text">
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
