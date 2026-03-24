'use client';

import { useState } from 'react';

export default function Contato() {
  const [status, setStatus] = useState<'idle' | 'ok' | 'erro'>('idle');
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setStatus('idle');
    try {
      const res = await fetch(`${API}/mensagens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: fd.get('nome'),
          email: fd.get('email'),
          assunto: fd.get('assunto'),
          mensagem: fd.get('mensagem'),
          tipo: 'contato',
        }),
      });
      if (res.ok) { setStatus('ok'); form.reset(); } else setStatus('erro');
    } catch { setStatus('erro'); }
  }

  return (
    <div className="max-w-2xl mx-auto py-20 px-6">
      <h1 className="font-head text-4xl font-bold mb-8">Fale <em className="text-gold">Conosco</em></h1>
      <p className="text-warm mb-8">Email: kauavaes55@gmail.com | Tel: (19) 97108-0410</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div><label className="block text-sm text-warm mb-1">Nome *</label><input name="nome" required className="w-full border border-sand px-4 py-3" /></div>
        <div><label className="block text-sm text-warm mb-1">E-mail *</label><input name="email" type="email" required className="w-full border border-sand px-4 py-3" /></div>
        <div><label className="block text-sm text-warm mb-1">Assunto</label><input name="assunto" className="w-full border border-sand px-4 py-3" /></div>
        <div><label className="block text-sm text-warm mb-1">Mensagem *</label><textarea name="mensagem" required rows={5} className="w-full border border-sand px-4 py-3" /></div>
        <button type="submit" className="bg-gold text-dark px-8 py-3 font-semibold">Enviar</button>
        {status === 'ok' && <p className="text-green">Mensagem enviada!</p>}
        {status === 'erro' && <p className="text-rust">Erro. Tente novamente.</p>}
      </form>
    </div>
  );
}
