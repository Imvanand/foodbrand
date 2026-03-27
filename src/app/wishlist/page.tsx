"use client";

import React, { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { Heart, Loader2, ArrowRight, Trash2 } from 'lucide-react';
import styles from './wishlist.module.css';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchWishlist = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data, error } = await supabase
        .from('user_wishlist')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
        
      if (!error && data) setWishlist(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWishlist();
  }, [supabase]);

  const removeFromWishlist = async (id: string) => {
    const { error } = await supabase.from('user_wishlist').delete().eq('id', id);
    if (!error) {
       setWishlist(prev => prev.filter(item => item.id !== id));
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <div style={{ padding: '80px', textAlign: 'center', minHeight: '60vh' }}>
        <Loader2 className="animate-spin" size={40} color="#224b33" />
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <Link href="/profile">Your Account</Link> › <span className={styles.current}>Your Wishlist</span>
        </div>

        <h1 className={styles.title}>Your Wish List</h1>

        {wishlist.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.heartWrapper}>
              <Heart size={80} color="#e5e5e5" strokeWidth={1} fill="#f9f9f9" />
            </div>
            <h2>Your Wish List is empty</h2>
            <p>Save your favorite Masalas for later! Just click on the heart icon on any product.</p>
            <Link href="/" className={styles.exploreBtn}>Explore Products <ArrowRight size={18} /></Link>
          </div>
        ) : (
          <div className={styles.wishlistGrid}>
            {wishlist.map((item) => (
                <div key={item.id} className={styles.productCard}>
                    <div className={styles.imageBox}>
                        <img src={item.product_image || '/Front.png'} alt={item.product_name} />
                        <button className={styles.removeIcon} onClick={() => removeFromWishlist(item.id)}>
                            <Trash2 size={18} />
                        </button>
                    </div>
                    <div className={styles.productInfo}>
                        <Link href="/#our-product" className={styles.productName}>{item.product_name}</Link>
                        <div className={styles.priceRow}>
                            <span className={styles.price}>₹139.00</span>
                        </div>
                        <Link href="/#our-product" className={styles.viewBtn}>View Product</Link>
                    </div>
                </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
