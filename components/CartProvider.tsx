"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type CartItem = {
  slug: string;
  quantity: number;
  couponCode?: string;
};

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  lastAddedSlug: string | null;
  noticeVisible: boolean;
  addItem: (slug: string, quantity?: number) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  updateCoupon: (slug: string, couponCode: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "alma-natura-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [lastAddedSlug, setLastAddedSlug] = useState<string | null>(null);
  const [noticeVisible, setNoticeVisible] = useState(false);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as CartItem[];
      if (Array.isArray(parsed)) {
        setItems(parsed.filter((item) => item.slug && item.quantity > 0));
      }
    } catch {
      // ignore invalid storage
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((slug: string, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.slug === slug);
      if (existing) {
        return prev.map((item) =>
          item.slug === slug
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { slug, quantity }];
    });
    setLastAddedSlug(slug);
    setNoticeVisible(true);
    if (noticeTimer.current) {
      clearTimeout(noticeTimer.current);
    }
    noticeTimer.current = setTimeout(() => {
      setNoticeVisible(false);
    }, 2200);
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((item) => item.slug !== slug));
  }, []);

  const updateQuantity = useCallback((slug: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.slug !== slug);
      }
      return prev.map((item) =>
        item.slug === slug ? { ...item, quantity } : item
      );
    });
  }, []);

  const updateCoupon = useCallback((slug: string, couponCode: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.slug === slug ? { ...item, couponCode } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      totalItems,
      lastAddedSlug,
      noticeVisible,
      addItem,
      removeItem,
      updateQuantity,
      updateCoupon,
      clearCart,
    }),
    [
      items,
      totalItems,
      lastAddedSlug,
      noticeVisible,
      addItem,
      removeItem,
      updateQuantity,
      updateCoupon,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return context;
}
