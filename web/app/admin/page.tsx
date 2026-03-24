'use client';

import { useEffect, useState } from 'react';
import { fetchApi, fmt } from '@/lib/api';

export default function AdminPage() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/pedidos').then(setPedidos).catch(() => []);
    fetchApi('/produtos').then(setProdutos).catch(() => []);
  }, []);

  return (
    <div className="min-h-screen bg-dark text-cream p-8">
      <h1 className="font-head text-3xl font-bold mb-8">Admin LineDecor</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl mb-4">Pedidos</h2>
          <div className="bg-earth/50 rounded p-4 space-y-2 max-h-96 overflow-y-auto">
            {pedidos.map((p) => (
              <div key={p.id} className="border-b border-stone/30 pb-2">
                <p><strong>#{p.codigo}</strong> {p.nomeCliente} - {fmt(p.total)}</p>
                <p className="text-xs text-stone">{p.status}</p>
              </div>
            ))}
            {pedidos.length === 0 && <p className="text-stone">Nenhum pedido</p>}
          </div>
        </div>
        <div>
          <h2 className="text-xl mb-4">Produtos</h2>
          <div className="bg-earth/50 rounded p-4 space-y-2 max-h-96 overflow-y-auto">
            {produtos.map((p) => (
              <div key={p.id} className="border-b border-stone/30 pb-2 flex justify-between">
                <span>{p.emoji} {p.nome}</span>
                <span>{fmt(p.preco)}</span>
              </div>
            ))}
            {produtos.length === 0 && <p className="text-stone">Nenhum produto. Execute o seed.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
