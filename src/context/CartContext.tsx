"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

type CartItem = {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  loading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchCart = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data, error } = await supabase
        .from('user_cart')
        .select('*')
        .eq('user_id', session.user.id);
      
      if (!error && data) {
          setCart(data);
      }
    } else {
        // Fallback to localStorage if not logged in? Or just clear?
        const localCart = localStorage.getItem('kalsa_cart');
        if (localCart) setCart(JSON.parse(localCart));
    }
    setLoading(false);
  };

  useEffect(() => {
     fetchCart();
     // Listen for auth changes to re-fetch cart
     const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
        fetchCart();
     });
     return () => subscription.unsubscribe();
  }, [supabase]);

  // Sync with localStorage for guest users
  useEffect(() => {
    const syncLocal = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            localStorage.setItem('kalsa_cart', JSON.stringify(cart));
        }
    };
    syncLocal();
  }, [cart, supabase]);

  const addToCart = async (item: Omit<CartItem, 'id'>) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
        // Check if item exists
        const existing = cart.find(i => i.product_id === item.product_id);
        if (existing) {
            await updateQuantity(existing.id, existing.quantity + item.quantity);
        } else {
            const { data, error } = await supabase
                .from('user_cart')
                .insert([{ user_id: session.user.id, ...item }])
                .select();
            if (!error && data) setCart([...cart, data[0]]);
        }
    } else {
        const existingIdx = cart.findIndex(i => i.product_id === item.product_id);
        if (existingIdx > -1) {
            const newCart = [...cart];
            newCart[existingIdx].quantity += item.quantity;
            setCart(newCart);
        } else {
            setCart([...cart, { ...item, id: Math.random().toString(36).substr(2, 9) }]);
        }
    }
    setIsCartOpen(true);
  };

  const removeFromCart = async (id: string) => {
     const { data: { session } } = await supabase.auth.getSession();
     if (session) {
        await supabase.from('user_cart').delete().eq('id', id);
     }
     setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = async (id: string, quantity: number) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
          await supabase.from('user_cart').update({ quantity }).eq('id', id);
      }
      setCart(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, cartCount, isCartOpen, setIsCartOpen, loading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
