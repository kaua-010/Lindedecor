'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { fetchApi, fmt } from '@/lib/api';

type Produto = {
  id: string;
  nome: string;
  preco: number;
  precoOriginal?: number;
  categoria: string;
  emoji: string;
  descricao?: string;
  estoque: number;
};

export default function ProdutoPage() {
  const params = useParams();
  const { addItem } = useCart();
  const [p, setP] = useState<Produto | null>(null);

  useEffect(() => {
    fetchApi<Produto>(`/produtos/${params.id}`).then(setP).catch(() => setP(null));
  }, [params.id]);

  if (!p) return <div className="min-h-[40vh] flex items-center justify-center">Carregando...</div>;

  return (
    <div className="max-w-4xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-12">
      <div className="aspect-square bg-sand flex items-center justify-center text-9xl">{p.emoji}</div>
      <div>
        <p className="text-warm text-xs uppercase tracking-widest mb-2">{p.categoria}</p>
        <h1 className="font-head text-4xl font-bold mb-4">{p.nome}</h1>
        <div className="mb-6">
          {p.precoOriginal && <span className="text-stone line-through mr-2">{fmt(p.precoOriginal)}</span>}
          <span className="font-head text-2xl font-bold text-gold">{fmt(p.preco)}</span>
        </div>
        <p className="text-warm mb-8">{p.descricao || 'Produto de decoração LineDecor.'}</p>
        <button
          onClick={() => addItem({ id: p.id, nome: p.nome, preco: p.preco, emoji: p.emoji, categoria: p.categoria })}
          disabled={p.estoque <= 0}
          className="w-full py-4 bg-gold text-dark font-semibold uppercase hover:bg-gold2 disabled:bg-stone disabled:cursor-not-allowed transition"
        >
          {p.estoque > 0 ? 'Adicionar ao Carrinho' : 'Sem estoque'}
        </button>
      </div>
    </div>
  );
}
