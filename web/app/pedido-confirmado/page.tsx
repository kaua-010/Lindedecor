import Link from 'next/link';

export default function PedidoConfirmado() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="font-head text-4xl font-bold text-gold mb-4">Pedido Confirmado!</h1>
      <p className="text-warm mb-8">Você receberá a confirmação por e-mail.</p>
      <Link href="/rastrear" className="bg-gold text-dark px-8 py-3 font-semibold mb-4">Rastrear Pedido</Link>
      <Link href="/#produtos" className="text-warm hover:text-gold">Continuar comprando</Link>
    </div>
  );
}
