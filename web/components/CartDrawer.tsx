'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { fmt } from '@/lib/api';

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, updateQty, removeItem, total, count } = useCart();

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed top-0 right-0 w-full max-w-md h-full bg-cream z-50 flex flex-col shadow-xl">
        <div className="p-6 border-b border-sand flex justify-between items-center">
          <h2 className="font-head text-xl font-bold">Carrinho</h2>
          <button onClick={onClose} className="text-2xl text-warm hover:text-dark">×</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <p className="text-stone text-center py-12">Seu carrinho está vazio</p>
          ) : (
            <div className="space-y-4">
              {cart.map((i) => (
                <div key={i.id} className="flex gap-4 border-b border-sand pb-4">
                  <div className="w-16 h-16 bg-sand flex items-center justify-center text-3xl">{i.emoji}</div>
                  <div className="flex-1">
                    <p className="font-semibold">{i.nome}</p>
                    <p className="text-xs text-warm">{i.categoria}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQty(i.id, -1)} className="w-7 h-7 border border-sand hover:bg-dark hover:text-cream">−</button>
                      <span className="w-6 text-center">{i.qty}</span>
                      <button onClick={() => updateQty(i.id, 1)} className="w-7 h-7 border border-sand hover:bg-dark hover:text-cream">+</button>
                      <button onClick={() => removeItem(i.id)} className="ml-2 text-rust text-sm">Remover</button>
                    </div>
                  </div>
                  <div className="font-head font-bold">{fmt(i.preco * i.qty)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-6 border-t border-sand">
          <div className="flex justify-between text-sm mb-2">
            <span>Total</span>
            <span className="font-head font-bold text-lg">{fmt(total)}</span>
          </div>
          <p className="text-xs text-stone mb-4">✓ Frete grátis acima de R$ 299</p>
          <Link
            href="/checkout"
            onClick={onClose}
            className="block w-full bg-gold text-dark py-3 text-center font-semibold text-sm tracking-wider uppercase hover:bg-gold2 transition"
          >
            Finalizar Compra
          </Link>
        </div>
      </div>
    </>
  );
}
