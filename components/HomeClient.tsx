'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function HomeClient() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [form, setForm] = useState({
    firstName: '', lastName: '', brand: '', email: '', message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    if (!form.email || !form.brand) return
    setStatus('loading')
    const { error } = await supabase.from('applications').insert({
      brand_name: form.brand,
      contact_name: `${form.firstName} ${form.lastName}`.trim() || null,
      email: form.email,
      message: form.message || null,
    })
    setStatus(error ? 'error' : 'success')
  }

  if (status === 'success') {
    return (
      <div className="reveal reveal-delay-1" style={{ padding: '3rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '2px' }}>
        <p style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', color: 'var(--cream)', marginBottom: '1rem' }}>Message envoyé.</p>
        <p style={{ color: 'var(--muted)' }}>Nous vous répondrons sous 48h.</p>
      </div>
    )
  }

  return (
    <div className="reveal reveal-delay-1">
      <div className="form-row">
        <div className="form-group">
          <label>Prénom</label>
          <input name="firstName" type="text" placeholder="Votre prénom" value={form.firstName} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Nom</label>
          <input name="lastName" type="text" placeholder="Votre nom" value={form.lastName} onChange={handleChange} />
        </div>
      </div>
      <div className="form-group">
        <label>Marque / Entreprise / Production</label>
        <input name="brand" type="text" placeholder="Nom de votre marque" value={form.brand} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input name="email" type="email" placeholder="votre@email.com" value={form.email} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Votre message</label>
        <textarea name="message" placeholder="Parlez-nous de votre marque et de vos objectifs de visibilité…" value={form.message} onChange={handleChange} />
      </div>
      {status === 'error' && <p style={{ color: '#f87171', marginBottom: '1rem', fontSize: '0.85rem' }}>Une erreur est survenue. Veuillez réessayer.</p>}
      <button className="form-submit" onClick={handleSubmit} disabled={status === 'loading'}>
        {status === 'loading' ? 'Envoi…' : 'Envoyer ma demande'}
      </button>
    </div>
  )
}
