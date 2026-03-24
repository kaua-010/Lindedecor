import Link from 'next/link';

const links = {
  Loja: [
    { href: '/#produtos', label: 'Produtos' },
    { href: '/#produtos', label: 'Coleção Premium' },
    { href: '/#produtos', label: 'Kits & Combos' },
  ],
  Empresa: [
    { href: '/sobre', label: 'Sobre nós' },
    { href: '/blog', label: 'Blog' },
    { href: '/trabalhe-conosco', label: 'Trabalhe conosco' },
    { href: '/parceiros', label: 'Parceiros' },
    { href: '/sustentabilidade', label: 'Sustentabilidade' },
  ],
  Suporte: [
    { href: '/central-ajuda', label: 'Central de Ajuda' },
    { href: '/rastrear', label: 'Rastrear Pedido' },
    { href: '/trocas-devolucoes', label: 'Trocas e Devoluções' },
    { href: '/privacidade', label: 'Privacidade' },
    { href: '/contato', label: 'Contato' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-dark text-stone py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
        <div>
          <h3 className="font-head text-cream text-xl font-bold mb-4">Line<span className="text-gold">Decor</span></h3>
          <p className="text-sm text-warm max-w-xs">Decoração que transforma espaços desde 2017.</p>
        </div>
        {Object.entries(links).map(([title, items]) => (
          <div key={title}>
            <h4 className="text-cream text-xs tracking-widest uppercase mb-4">{title}</h4>
            <ul className="space-y-2">
              {items.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-warm hover:text-gold text-sm transition">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-6xl mx-auto pt-8 border-t border-stone/20 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-warm">© 2025 LineDecor · Todos os direitos reservados</p>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-white/5 text-xs">Pix</span>
          <span className="px-3 py-1 bg-white/5 text-xs">Cartão</span>
          <span className="px-3 py-1 bg-white/5 text-xs">Boleto</span>
        </div>
      </div>
    </footer>
  );
}
