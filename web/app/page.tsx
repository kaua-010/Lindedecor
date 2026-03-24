import Link from 'next/link';
import ProdutosGrid from '@/components/ProdutosGrid';

export default function Home() {
  return (
    <>
      <section className="min-h-[90vh] bg-dark text-cream grid md:grid-cols-2">
        <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24">
          <p className="text-gold text-xs tracking-widest uppercase mb-6">Coleção 2025</p>
          <h1 className="font-head text-4xl md:text-6xl font-light leading-tight mb-4">
            Design que <em className="text-gold">transforma</em> seu espaço.
          </h1>
          <p className="text-stone text-sm max-w-md mb-8">
            Peças únicas para quem acredita que cada detalhe do lar conta uma história.
          </p>
          <div className="flex gap-4">
            <Link href="#produtos" className="bg-gold text-dark px-8 py-3 font-semibold text-sm tracking-wider uppercase hover:bg-gold2 transition">
              Explorar Coleção
            </Link>
            <Link href="/sobre" className="border border-stone/40 px-8 py-3 text-sm tracking-wider uppercase hover:border-cream transition">
              Sobre Nós
            </Link>
          </div>
        </div>
        <div className="bg-gradient-to-br from-earth to-dark flex items-center justify-center min-h-[40vh] md:min-h-0">
          <span className="text-[20vw] font-head font-bold italic text-gold/10">L</span>
        </div>
      </section>

      <div className="bg-gold py-3 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap text-dark font-medium text-xs tracking-widest">
          Frete Grátis acima de R$299 ✦ Parcele em até 12x ✦ Entrega para todo Brasil ✦
          Frete Grátis acima de R$299 ✦ Parcele em até 12x ✦ Entrega para todo Brasil ✦
        </div>
      </div>

      <section id="produtos" className="py-20 px-6 md:px-12 lg:px-24">
        <div className="mb-12">
          <p className="text-gold text-xs tracking-widest uppercase mb-2">Destaques</p>
          <h2 className="font-head text-3xl md:text-4xl font-light">
            Mais <em className="font-semibold">Vendidos</em>
          </h2>
        </div>
        <ProdutosGrid />
      </section>

      <section className="py-20 px-6 md:px-12 bg-dark text-cream text-center">
        <p className="text-gold text-xs tracking-widest uppercase mb-4">Fique por dentro</p>
        <h2 className="font-head text-3xl mb-4">Novidades e <em>ofertas</em> exclusivas</h2>
        <p className="text-stone text-sm mb-8">Cadastre seu e-mail e ganhe 10% off na primeira compra.</p>
        <NewsletterForm />
      </section>
    </>
  );
}
