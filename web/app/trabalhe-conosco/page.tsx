import Link from 'next/link';

export default function TrabalheConosco() {
  return (
    <div className="max-w-2xl mx-auto py-20 px-6">
      <h1 className="font-head text-4xl font-bold mb-8">Trabalhe <em className="text-gold">Conosco</em></h1>
      <p className="text-warm mb-8">Envie seu currículo para kauavaes55@gmail.com</p>
      <Link href="/contato" className="bg-gold text-dark px-8 py-3 font-semibold">Enviar Currículo</Link>
    </div>
  );
}
