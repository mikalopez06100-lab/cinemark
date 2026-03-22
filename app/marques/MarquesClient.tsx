'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const BUDGETS = ['< 500 €', '500 – 1 500 €', '1 500 – 5 000 €', '5 000 € +']

export default function MarquesClient() {
  const [budget, setBudget] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [form, setForm] = useState({
    brand_name: '', sector: '', contact_name: '', email: '',
    phone: '', website: '', message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    if (!form.brand_name || !form.email) return
    setStatus('loading')
    const { error } = await supabase.from('applications').insert({
      brand_name: form.brand_name,
      sector: form.sector || null,
      contact_name: form.contact_name || null,
      email: form.email,
      phone: form.phone || null,
      website: form.website || null,
      budget_range: budget || null,
      message: form.message || null,
    })
    setStatus(error ? 'error' : 'success')
  }

  if (status === 'success') {
    return (
      <div className="marques-form-wrap" style={{ textAlign: 'center', padding: '4rem 3rem' }}>
        <p style={{ fontFamily: 'var(--serif)', fontSize: '1.8rem', color: 'var(--cream)', marginBottom: '1rem' }}>Candidature envoyée.</p>
        <p style={{ color: 'var(--muted)' }}>Nous étudions votre dossier et vous recontactons sous 48h.</p>
      </div>
    )
  }

  return (
    <div className="marques-form-wrap">
      <p className="form-title">Déposer une candidature</p>

      <div className="form-row">
        <div className="form-group">
          <label>Nom de la marque *</label>
          <input name="brand_name" type="text" placeholder="Ex. Riviera Beer" value={form.brand_name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Secteur d&apos;activité *</label>
          <input name="sector" type="text" placeholder="Ex. Brasserie artisanale" value={form.sector} onChange={handleChange} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Contact *</label>
          <input name="contact_name" type="text" placeholder="Prénom Nom" value={form.contact_name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Email *</label>
          <input name="email" type="email" placeholder="contact@marque.fr" value={form.email} onChange={handleChange} required />
        </div>
      </div>

      <div className="form-group">
        <label>Téléphone</label>
        <input name="phone" type="tel" placeholder="+33 6 00 00 00 00" value={form.phone} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Site web ou profil Instagram</label>
        <input name="website" type="text" placeholder="https://..." value={form.website} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Budget envisagé</label>
        <div className="budget-options">
          {BUDGETS.map((b) => (
            <div
              key={b}
              className={`budget-option ${budget === b ? 'selected' : ''}`}
              onClick={() => setBudget(b === budget ? '' : b)}
            >
              {b}
            </div>
          ))}
        </div>
      </div>

      <div className="form-group" style={{ marginTop: '1.5rem' }}>
        <label>Décrivez votre marque et vos attentes</label>
        <textarea
          name="message"
          placeholder="Parlez-nous de votre produit, de votre cible, et de ce que vous attendez d'un placement…"
          value={form.message}
          onChange={handleChange}
        />
      </div>

      {status === 'error' && (
        <p style={{ color: '#f87171', marginBottom: '1rem', fontSize: '0.85rem' }}>
          Une erreur est survenue. Veuillez réessayer.
        </p>
      )}

      <button className="form-submit" onClick={handleSubmit} disabled={status === 'loading'}>
        {status === 'loading' ? 'Envoi en cours…' : 'Envoyer ma candidature'}
      </button>
    </div>
  )
}
