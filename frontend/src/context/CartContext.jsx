import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 't4i-cart-v1';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((it) => ({ ...it, qty: 1 }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore quota / storage errors
    }
  }, [items]);

  const addItem = (course) => {
    setItems((prev) => {
      const existing = prev.find((it) => it.slug === course.slug);
      if (existing) return prev;
      return [...prev, { slug: course.slug, title: course.title, fee: course.fee, qty: 1 }];
    });
  };

  const removeItem = (slug) => {
    setItems((prev) => prev.filter((it) => it.slug !== slug));
  };

  const clearCart = () => setItems([]);

  const count = useMemo(() => items.reduce((sum, it) => sum + it.qty, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.fee * it.qty, 0),
    [items]
  );

  const value = useMemo(
    () => ({ items, count, subtotal, addItem, removeItem, clearCart }),
    [items, count, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}