import Link from 'next/link';

export default function Parceiros() {
  return (
    <div className="max-w-2xl mx-auto py-20 px-6">
      <h1 className="font-head text-4xl font-bold mb-8">Seja Nosso <em className="text-gold">Parceiro</em></h1>
      <p className="text-warm mb-8">Artistas e artesãos — trabalhamos juntos. Entre em contato.</p>
      <Link href="/contato" className="bg-gold text-dark px-8 py-3 font-semibold">Falar sobre Parceria</Link>
    </div>
  );
}
