'use client';

import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'ok' | 'erro'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('idle');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('ok');
        setEmail('');
      } else setStatus('erro');
    } catch {
      setStatus('erro');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md mx-auto gap-0">
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="Seu melhor e-mail"
        required
        className="flex-1 bg-white/10 border border-stone/30 px-5 py-4 text-cream placeholder-warm outline-none focus:border-gold"
      />
      <button type="submit" className="bg-gold text-dark px-6 py-4 font-semibold text-sm uppercase hover:bg-gold2 transition">
        Quero!
      </button>
      {status === 'ok' && <p className="absolute mt-2 text-green text-sm">Cadastrado!</p>}
      {status === 'erro' && <p className="absolute mt-2 text-rust text-sm">Erro. Tente novamente.</p>}
    </form>
  );
}
