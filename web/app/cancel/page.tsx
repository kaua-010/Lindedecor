'use client';

import Link from 'next/link';

export default function CancelPage() {
  return (
    <div className="max-w-2xl mx-auto py-20 px-6 text-center">
      {/* Ícone de erro */}
      <div className="mb-8">
        <div className="inline-flex items-center justify-center h-20 w-20 bg-red-100 rounded-full mb-4">
          <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>

      <h1 className="font-head text-3xl md:text-4xl font-bold mb-2">
        ❌ Pagamento Cancelado
      </h1>
      <p className="text-warm text-lg mb-8">
        O pagamento foi cancelado. Mas não se preocupe — você pode tentar novamente!
      </p>

      {/* Motivos comuns */}
      <div className="bg-stone/5 p-8 rounded-lg mb-8 text-left">
        <h3 className="font-head text-lg font-semibold mb-4">Motivos comuns:</h3>
        <ul className="space-y-2 text-sm text-warm">
          <li>✓ Dados do cartão incorretos</li>
          <li>✓ Cartão expirado ou bloqueado</li>
          <li>✓ Limite de crédito insuficiente</li>
          <li>✓ Você clicou em voltar no pagamento</li>
        </ul>
      </div>

      {/* Próximas ações */}
      <div className="bg-gold/10 border border-gold/20 p-6 rounded-lg mb-8 text-left">
        <h3 className="font-head text-lg font-semibold mb-4">O que fazer agora:</h3>
        <ol className="space-y-3 text-sm">
          <li className="flex gap-3">
            <span className="bg-gold text-dark rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">1</span>
            <span>Verifique os dados do seu cartão</span>
          </li>
          <li className="flex gap-3">
            <span className="bg-gold text-dark rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">2</span>
            <span>Tente novamente ou use outro método de pagamento</span>
          </li>
          <li className="flex gap-3">
            <span className="bg-gold text-dark rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">3</span>
            <span>Se o problema persistir, entre em contato conosco</span>
          </li>
        </ol>
      </div>

      {/* Botões de ação */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/checkout"
          className="bg-gold text-dark px-8 py-3 font-semibold uppercase tracking-wider hover:bg-gold/90 transition"
        >
          Tentar Novamente
        </Link>
        <Link
          href="/#produtos"
          className="border border-stone/40 px-8 py-3 font-semibold uppercase tracking-wider hover:border-cream transition"
        >
          Voltar à Loja
        </Link>
      </div>

      {/* Suporte */}
      <div className="mt-12 pt-8 border-t border-stone/20">
        <p className="text-stone text-sm mb-4">
          Ainda tem dúvidas? Nossa equipe está pronta para ajudar!
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
