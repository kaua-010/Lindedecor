'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';

export default function Nav() {
  const { count } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const links = [
    { href: '/#produtos', label: 'Produtos' },
    { href: '/sobre', label: 'Sobre' },
    { href: '/contato', label: 'Contato' },
    { href: '/central-ajuda', label: 'Ajuda' },
    { href: '/admin', label: 'Admin' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/95 backdrop-blur py-4 px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="font-head text-xl font-bold text-cream tracking-wide uppercase">
          Line<span className="text-gold">Decor</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-stone hover:text-cream text-sm tracking-wider transition">
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setCartOpen(true)} className="relative bg-cream/10 hover:bg-cream/20 text-cream px-4 py-2 text-sm font-semibold tracking-wider transition">
            Carrinho
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-dark rounded-full text-xs flex items-center justify-center font-bold">
                {count}
              </span>
            )}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-cream text-2xl">
            ☰
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <div className="fixed top-[60px] left-0 right-0 bg-dark z-40 md:hidden py-4 px-6 flex flex-col gap-3">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="text-stone hover:text-cream">
              {l.label}
            </Link>
          ))}
        </div>
      )}
      <div className="h-16" />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
