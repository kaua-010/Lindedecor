'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CartItem = {
  id: string;
  nome: string;
  preco: number;
  emoji: string;
  categoria: string;
  qty: number;
};

type CartContextType = {
  cart: CartItem[];
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, delta: number) => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = 'linedecor_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setCart(JSON.parse(saved));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart, mounted]);

  const addItem = (item: Omit<CartItem, 'qty'>, qty = 1) => {
    setCart((prev) => {
      const i = prev.find((x) => x.id === item.id);
      if (i) return prev.map((x) => (x.id === item.id ? { ...x, qty: x.qty + qty } : x));
      return [...prev, { ...item, qty }];
    });
  };

  const removeItem = (id: string) => setCart((prev) => prev.filter((x) => x.id !== id));

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => {
      const i = prev.find((x) => x.id === id);
      if (!i) return prev;
      const q = i.qty + delta;
      if (q <= 0) return prev.filter((x) => x.id !== id);
      return prev.map((x) => (x.id === id ? { ...x, qty: q } : x));
    });
  };

  const total = cart.reduce((a, i) => a + i.preco * i.qty, 0);
  const count = cart.reduce((a, i) => a + i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQty, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
