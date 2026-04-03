import type { Metadata } from 'next'
import Image from 'next/image'
import MarquesClient from '@/app/marques/MarquesClient'
import pontonImage from '../../public/images/votre-marque-ponton.png'
import plateauSurfImage from '../../public/images/votre-marque-plateau-surf.png'

export const metadata: Metadata = {
  title: 'Votre marque — Cinémark',
  description:
    'Votre marque sur grand écran : visibilité qualitative, partenariats locaux et accompagnement Cinémark.',
}

export default function VotreMarquePage() {
  return (
    <section id="marques" className="page-section-top marques-page--votre-marque">
      <div className="marques-intro">
        <p className="section-label">Votre marque</p>
        <h1 className="section-title">
          Votre marque sur <em>grand écran</em>
        </h1>
        <p className="section-text">
          Le Cinéma est un support de communication puissant, capable de créer une véritable connexion avec le public et de retenir son attention.
        </p>
        <p className="section-text" style={{ marginTop: '1rem' }}>
          Démarquez-vous et faites rayonner votre enseigne, grâce à une présence originale et raffinée.
        </p>
      </div>

      <div className="marques-votre-marque-break-visual">
        <Image
          src={pontonImage}
          alt="Deux femmes sur un ponton au bord d'un lac, paysage verdoyant — visibilité de marque et cinéma"
          fill
          sizes="(max-width: 900px) 100vw, min(960px, 90vw)"
          className="marques-votre-marque-break-visual-img"
          priority
          placeholder="blur"
        />
      </div>

      <div className="marques-grid marques-grid--votre-marque">
        <div className="marques-why">
          {[
            {
              num: '01',
              title: 'Une visibilité qualitative',
              text: "Moins intrusif qu'une publicité ou qu'un message radio, votre marque accompagne avec élégance une histoire et des personnages.",
            },
            {
              num: '02',
              title: 'Partenariats',
              text: 'Nous recherchons continuellement des partenaires locaux, notamment pour la partie hébergement et restauration (café, repas, desserts, boissons, etc.) des équipes.',
            },
            {
              num: '03',
              title: 'Une aventure humaine et collaborative',
              text: "Vous serez conviés sur le plateau de tournage puis invités à l'avant-première du film. L'ensemble de nos partenaires sera invité aux évènements networking organisés par Cinémark, favorisant les opportunités de collaboration et de développement.",
            },
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

        <div className="marques-form-stack">
          <div className="marques-votre-marque-visual">
            <Image
              src={plateauSurfImage}
              alt="Tournage sur une plage : équipe avec perche et groupe de surfeurs avec planches colorées — placement de marque et production Cinémark"
              fill
              sizes="(max-width: 900px) 100vw, 45vw"
              className="marques-votre-marque-visual-img"
            />
          </div>
          <MarquesClient />
        </div>
      </div>
    </section>
  )
}
