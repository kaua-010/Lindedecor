'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [pedido, setPedido] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;

    async function carregarPedido() {
      try {
        const resultado = await fetchApi<any>(`/payment/session/${sessionId}`);
        setPedido(resultado);
      } catch (e) {
        console.error('Erro ao carregar pedido:', e);
      } finally {
        setLoading(false);
      }
    }

    carregarPedido();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6">
        <div className="animate-spin h-12 w-12 border-4 border-gold border-t-transparent rounded-full mb-4"></div>
        <p className="text-warm">Processando seu pagamento...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-20 px-6 text-center">
      {/* Ícone de sucesso */}
      <div className="mb-8">
        <div className="inline-flex items-center justify-center h-20 w-20 bg-green-100 rounded-full mb-4">
          <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <h1 className="font-head text-3xl md:text-4xl font-bold mb-2">
        ✅ Pagamento Aprovado!
      </h1>
      <p className="text-warm text-lg mb-8">
        Obrigado pela sua compra! Você receberá um email de confirmação em instantes.
      </p>

      {/* Info do pedido */}
      <div className="bg-stone/5 p-8 rounded-lg mb-8 text-left">
        <div className="mb-4">
          <p className="text-stone text-sm uppercase tracking-wider mb-2">Status do Pagamento</p>
          <p className="font-bold text-lg">Aprovado</p>
        </div>
        <div>
          <p className="text-stone text-sm uppercase tracking-wider mb-2">ID da Sessão</p>
          <p className="font-mono text-sm break-all text-warm">{sessionId}</p>
        </div>
      </div>

      {/* Próximos passos */}
      <div className="bg-gold/10 border border-gold/20 p-6 rounded-lg mb-8 text-left">
        <h3 className="font-head text-lg font-semibold mb-4">Próximas Etapas:</h3>
        <ol className="space-y-3 text-sm">
          <li className="flex gap-3">
            <span className="bg-gold text-dark rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">1</span>
            <span>Você receberá um email de confirmação</span>
          </li>
          <li className="flex gap-3">
            <span className="bg-gold text-dark rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">2</span>
            <span>Seu pedido será preparado e embalado</span>
          </li>
          <li className="flex gap-3">
            <span className="bg-gold text-dark rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">3</span>
            <span>Você receberá um código de rastreamento via email</span>
          </li>
        </ol>
      </div>

      {/* Botões de ação */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/rastrear"
          className="bg-gold text-dark px-8 py-3 font-semibold uppercase tracking-wider hover:bg-gold/90 transition"
        >
          Rastrear Pedido
        </Link>
        <Link
          href="/#produtos"
          className="border border-stone/40 px-8 py-3 font-semibold uppercase tracking-wider hover:border-cream transition"
        >
          Continuar Comprando
        </Link>
      </div>

      {/* Suporte */}
      <div className="mt-12 pt-8 border-t border-stone/20">
        <p className="text-stone text-sm mb-4">
          Dúvidas? Entre em contato pelo email ou WhatsApp
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
          <a href="mailto:contato@linedecor.com" className="text-gold hover:underline">
            📧 contato@linedecor.com
          </a>
          <a href="https://wa.me/5519971080410" target="_blank" className="text-gold hover:underline">
            💬 WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
