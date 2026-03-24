'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { fetchApi, fmt } from '@/lib/api';

const FRETE_GRATIS = 299;

export default function CheckoutPage() {
  const { cart, total } = useCart();
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cep, setCep] = useState('');
  const [cupom, setCupom] = useState('');
  const [desconto, setDesconto] = useState(0);
  const [cupomAplicado, setCupomAplicado] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const subtotal = total;
  const frete = subtotal >= FRETE_GRATIS ? 0 : 25;
  const totalFinal = Math.max(0, subtotal - desconto + frete);

  async function aplicarCupom() {
    if (!cupom.trim()) return;
    try {
      const r = await fetchApi<{ desconto: number; cupom: string }>(`/cupons/validar?codigo=${encodeURIComponent(cupom)}&total=${subtotal}`);
      setDesconto(r.desconto);
      setCupomAplicado(r.cupom);
    } catch {
      setDesconto(0);
      setCupomAplicado(null);
    }
  }

  async function finalizar(e: React.FormEvent) {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);
    try {
      await fetchApi('/pedidos', {
        method: 'POST',
        body: JSON.stringify({
          nome,
          email,
          telefone,
          endereco,
          itens: cart.map((i) => ({ id: i.id, nome: i.nome, qty: i.qty, preco: i.preco, emoji: i.emoji })),
          subtotal,
          frete,
          desconto,
          cupom: cupomAplicado,
          total: totalFinal,
        }),
      });
      localStorage.removeItem('linedecor_cart');
      router.push('/pedido-confirmado');
    } catch (e: any) {
      alert(e.message || 'Erro ao finalizar');
    } finally {
      setLoading(false);
    }
  }

  if (cart.length === 0 && !loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
        <p className="text-warm mb-4">Seu carrinho está vazio.</p>
        <Link href="/#produtos" className="bg-gold text-dark px-6 py-3 font-semibold">Voltar às compras</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <h1 className="font-head text-3xl font-bold mb-8">Finalizar Pedido</h1>
      <form onSubmit={finalizar} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-warm mb-1">Nome *</label>
          <input value={nome} onChange={(e) => setNome(e.target.value)} required className="w-full border border-sand px-4 py-3" />
        </div>
        <div>
          <label className="block text-sm font-medium text-warm mb-1">E-mail *</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border border-sand px-4 py-3" />
        </div>
        <div>
          <label className="block text-sm font-medium text-warm mb-1">Telefone *</label>
          <input value={telefone} onChange={(e) => setTelefone(e.target.value)} required placeholder="(19) 97108-0410" className="w-full border border-sand px-4 py-3" />
        </div>
        <div>
          <label className="block text-sm font-medium text-warm mb-1">CEP</label>
          <input value={cep} onChange={(e) => setCep(e.target.value)} placeholder="00000-000" className="w-full border border-sand px-4 py-3" />
        </div>
        <div>
          <label className="block text-sm font-medium text-warm mb-1">Endereço *</label>
          <textarea value={endereco} onChange={(e) => setEndereco(e.target.value)} required rows={3} className="w-full border border-sand px-4 py-3" />
        </div>
        <div>
          <label className="block text-sm font-medium text-warm mb-1">Cupom</label>
          <div className="flex gap-2">
            <input value={cupom} onChange={(e) => setCupom(e.target.value)} className="flex-1 border border-sand px-4 py-3" placeholder="BEMVINDO10" />
            <button type="button" onClick={aplicarCupom} className="bg-sand px-4 py-3 text-sm font-semibold">Aplicar</button>
          </div>
        </div>
        <div className="border-t border-sand pt-6 space-y-2">
          <div className="flex justify-between"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
          {desconto > 0 && <div className="flex justify-between text-green"><span>Desconto</span><span>-{fmt(desconto)}</span></div>}
          <div className="flex justify-between"><span>Frete</span><span>{frete === 0 ? 'Grátis' : fmt(frete)}</span></div>
          <div className="flex justify-between font-head font-bold text-lg pt-2"><span>Total</span><span>{fmt(totalFinal)}</span></div>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-gold text-dark py-4 font-semibold text-sm uppercase hover:bg-gold2 disabled:opacity-50">
          {loading ? 'Processando...' : 'Confirmar Pedido'}
        </button>
      </form>
    </div>
  );
}
