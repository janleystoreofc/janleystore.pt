import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product, ProductColor } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, color?: ProductColor, quantity?: number, customText?: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItemsCount: number;
  subtotal: number;
  shipping: number;
  discount: number;
  couponCode: string;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  total: number;
  freeShippingThreshold: number;
  remainingForFreeShipping: number;
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  lastAddedItem: CartItem | null;
  notification: string | null;
  clearNotification: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 30.00;
const STANDARD_SHIPPING_COST = 3.50;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('janley_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('janley_favorites');
      return saved ? JSON.parse(saved) : ['suporte-telemovel'];
    } catch {
      return ['suporte-telemovel'];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscountRate, setAppliedDiscountRate] = useState(0);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('janley_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem('janley_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Error saving favorites:', e);
    }
  }, [favorites]);

  const addToCart = (product: Product, color?: ProductColor, quantity = 1, customText?: string) => {
    const selectedColor = color || product.colors[0];
    const cartItemId = `${product.id}-${selectedColor.name}${customText ? `-${customText}` : ''}`;

    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          product,
          selectedColor,
          quantity,
          customText,
        };
        setLastAddedItem(newItem);
        return [...prev, newItem];
      }
    });

    setNotification(`"${product.name}" foi adicionado ao teu carrinho!`);
    setIsCartOpen(true);

    setTimeout(() => {
      setNotification((curr) => (curr ? null : curr));
    }, 4000);
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  const applyCoupon = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'JANLEY10') {
      setCouponCode('JANLEY10');
      setAppliedDiscountRate(0.10);
      return true;
    } else if (clean === 'GUIMARAES' || clean === 'PORTUGAL') {
      setCouponCode(clean);
      setAppliedDiscountRate(0.15);
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setCouponCode('');
    setAppliedDiscountRate(0);
  };

  const clearNotification = () => setNotification(null);

  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = subtotal * appliedDiscountRate;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || items.length === 0;
  const shipping = isFreeShipping ? 0 : STANDARD_SHIPPING_COST;
  const total = Math.max(0, subtotal - discount + shipping);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItemsCount,
        subtotal,
        shipping,
        discount,
        couponCode,
        applyCoupon,
        removeCoupon,
        total,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        remainingForFreeShipping,
        favorites,
        toggleFavorite,
        isFavorite,
        lastAddedItem,
        notification,
        clearNotification,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
