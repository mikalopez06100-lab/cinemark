import type { Metadata } from 'next'
import MarquesClient from './MarquesClient'

export const metadata: Metadata = {
  title: 'Candidature Marques — Cinémark',
  description: 'Rejoignez les marques locales qui ont choisi de parler autrement. Déposez votre candidature — nous vous contactons sous 48h.',
}

export default function MarquesPage() {
  return (
    <section id="marques" style={{ paddingTop: '10rem' }}>
      <div className="marques-intro">
        <p className="section-label">Candidature marques</p>
        <h1 className="section-title">Votre marque mérite<br />d&apos;<em>être vue</em>.</h1>
        <p className="section-text">Rejoignez les marques locales qui ont choisi de parler autrement. Déposez votre candidature — nous vous contactons sous 48h.</p>
      </div>

      <div className="marques-grid">
        <div className="marques-why">
          {[
            { num: '01', title: 'Visibilité organique', text: "Votre produit apparaît naturellement dans la narration. Pas de rupture, pas d'intrusion — une présence qui s'intègre à l'histoire." },
            { num: '02', title: 'Impact durable', text: "Un film reste disponible des années après sa sortie. Votre placement continue de générer de la visibilité longtemps après la diffusion initiale." },
            { num: '03', title: 'Ancrage territorial', text: "Les productions régionales parlent à un public local précis. Votre marque bénéficie d'une association forte avec le territoire." },
            { num: '04', title: 'Extraits exploitables', text: "Vous recevez les extraits avec votre produit pour vos propres réseaux, en complément de la diffusion principale." },
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

        <MarquesClient />
      </div>
    </section>
  )
}
