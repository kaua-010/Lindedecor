'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchApi, fmt } from '@/lib/api';

export default function RastrearPage() {
  const searchParams = useSearchParams();
  const [codigo, setCodigo] = useState(searchParams.get('codigo') || '');
  const [pedido, setPedido] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function buscar() {
    if (!codigo.trim()) return;
    setLoading(true);
    setPedido(null);
    try {
      const p = await fetchApi(`/pedidos/rastrear/${encodeURIComponent(codigo)}`);
      setPedido(p);
    } catch {
      setPedido({ erro: true });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto py-20 px-6">
      <h1 className="font-head text-4xl font-bold mb-8">Rastrear <em className="text-gold">Pedido</em></h1>
      <div className="flex gap-2 mb-8">
        <input
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Código (ex: LD123ABC)"
          className="flex-1 border border-sand px-4 py-3"
        />
        <button onClick={buscar} disabled={loading} className="bg-gold text-dark px-6 py-3 font-semibold">
          Buscar
        </button>
      </div>
      {pedido?.erro && <p className="text-rust">Pedido não encontrado.</p>}
      {pedido && !pedido.erro && (
        <div className="bg-cream p-6 border border-sand">
          <h2 className="font-head text-xl font-bold mb-4">Pedido #{pedido.codigo}</h2>
          <p><strong>Cliente:</strong> {pedido.nomeCliente}</p>
          <p><strong>Total:</strong> {fmt(pedido.total)}</p>
          <p><strong>Status:</strong> {pedido.status}</p>
          {pedido.codigoRastreio && <p><strong>Rastreio:</strong> {pedido.codigoRastreio}</p>}
        </div>
      )}
    </div>
  );
}
