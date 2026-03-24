import Link from 'next/link';

export default function Sobre() {
  return (
    <div className="max-w-3xl mx-auto py-20 px-6">
      <h1 className="font-head text-4xl font-bold mb-8">Sobre a <em className="text-gold">LineDecor</em></h1>
      <p className="text-warm leading-relaxed mb-6">
        A LineDecor nasceu do sonho de levar decoração de qualidade e personalidade para cada lar. 
        Selecionamos peças exclusivas — vasos, talheres, pratos, quadros e itens premium.
      </p>
      <div className="grid md:grid-cols-3 gap-6 my-12">
        <div className="bg-cream p-6 text-center"><span className="text-4xl block mb-2">🎨</span><strong>Design Autêntico</strong></div>
        <div className="bg-cream p-6 text-center"><span className="text-4xl block mb-2">🌿</span><strong>Sustentabilidade</strong></div>
        <div className="bg-cream p-6 text-center"><span className="text-4xl block mb-2">💎</span><strong>Qualidade</strong></div>
      </div>
      <Link href="/contato" className="text-gold hover:underline">Fale conosco →</Link>
    </div>
  );
}
