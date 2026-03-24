'use client';

import { useEffect, useState } from 'react';
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
  badge?: string;
};

export default function ProdutosGrid() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    fetchApi<Produto[]>('/produtos')
      .then(setProdutos)
      .catch(() => setProdutos([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"><div className="col-span-full text-center py-20 text-warm">Carregando...</div></div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {produtos.map((p) => (
        <div key={p.id} className="bg-white border border-sand overflow-hidden hover:shadow-lg transition group">
          <Link href={`/produto/${p.id}`} className="block aspect-square bg-sand flex items-center justify-center text-6xl group-hover:scale-105 transition">
            {p.emoji}
          </Link>
          <div className="p-4">
            <p className="text-xs text-warm uppercase tracking-wider mb-1">{p.categoria}</p>
            <Link href={`/produto/${p.id}`} className="font-head font-semibold text-lg block mb-2 hover:text-gold">{p.nome}</Link>
            <div className="flex items-center justify-between mb-2">
              <div>
                {p.precoOriginal && <span className="text-stone line-through text-sm mr-2">{fmt(p.precoOriginal)}</span>}
                <span className="font-head font-bold text-gold">{fmt(p.preco)}</span>
              </div>
            </div>
            <button
              onClick={(e) => { e.preventDefault(); addItem({ id: p.id, nome: p.nome, preco: p.preco, emoji: p.emoji, categoria: p.categoria }); }}
              disabled={p.estoque <= 0}
              className="w-full py-2 bg-dark text-cream text-xs font-semibold tracking-wider uppercase hover:bg-earth disabled:bg-stone disabled:cursor-not-allowed transition"
            >
              {p.estoque > 0 ? '+ Adicionar' : 'Sem estoque'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
