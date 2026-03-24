import Link from 'next/link';

export default function CentralAjuda() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6">
      <h1 className="font-head text-4xl font-bold mb-8">Central de <em className="text-gold">Ajuda</em></h1>
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Link href="/rastrear" className="bg-cream p-6 border border-sand hover:border-gold transition"><h3 className="font-semibold mb-2">📦 Rastrear Pedido</h3><p className="text-sm text-warm">Acompanhe sua entrega</p></Link>
        <Link href="/trocas-devolucoes" className="bg-cream p-6 border border-sand hover:border-gold transition"><h3 className="font-semibold mb-2">↩️ Trocas e Devoluções</h3><p className="text-sm text-warm">Política em 7 dias</p></Link>
        <div className="bg-cream p-6 border border-sand"><h3 className="font-semibold mb-2">💳 Pagamento</h3><p className="text-sm text-warm">Pix, cartão, boleto. Parcele em 12x</p></div>
        <Link href="/contato" className="bg-cream p-6 border border-sand hover:border-gold transition"><h3 className="font-semibold mb-2">📧 Contato</h3><p className="text-sm text-warm">Seg-Sex 9h-18h</p></Link>
      </div>
    </div>
  );
}
