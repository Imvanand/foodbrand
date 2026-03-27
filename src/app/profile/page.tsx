"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import styles from './profile.module.css';
import { Package, Lock, MapPin, Building2, CreditCard, Heart, MessageSquare, ShieldCheck, Mail } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
      }
      setLoading(false);
    };
    fetchUser();
  }, [router, supabase]);

  if (loading) return (
    <>
      <Navbar />
      <div style={{ padding: '80px', textAlign: 'center', color: '#224b33', minHeight: '60vh' }}>Loading Your Account...</div>
      <Footer />
    </>
  );
  
  if (!user) return null;

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0];

  const cards = [
    {
      title: "Your Orders",
      desc: "Track, return, or buy things again",
      href: "/orders",
      icon: <Package size={40} color="#224b33" strokeWidth={1.5} />
    },
    {
      title: "Login & security",
      desc: "Edit login, name, and mobile number",
      href: "/profile/security",
      icon: <Lock size={40} color="#224b33" strokeWidth={1.5} />
    },
    {
        title: "Your Addresses",
        desc: "Edit addresses for orders and gifts",
        href: "/profile/addresses",
        icon: <MapPin size={40} color="#224b33" strokeWidth={1.5} />
    },
    {
      title: "Payment options",
      desc: "Edit or add payment methods",
      href: "/profile/payments",
      icon: <CreditCard size={40} color="#224b33" strokeWidth={1.5} />
    },
    {
      title: "Your Wish List",
      desc: "Save products for later",
      href: "/wishlist",
      icon: <Heart size={40} color="#224b33" strokeWidth={1.5} />
    },
    {
      title: "Contact Us",
      desc: "Help, support and custom queries",
      href: "/contact",
      icon: <MessageSquare size={40} color="#224b33" strokeWidth={1.5} />
    },
    {
      title: "Data Privacy",
      desc: "View our privacy notice and terms",
      href: "/privacy_policy",
      icon: <ShieldCheck size={40} color="#224b33" strokeWidth={1.5} />
    },
    {
      title: "Bulk & Business",
      desc: "Manage GST invoices and bulk orders",
      href: "/contact#bulk-order",
      icon: <Building2 size={40} color="#224b33" strokeWidth={1.5} />
    },
    {
        title: "Communication",
        desc: "Email preferences and notifications",
        href: "/profile/communications",
        icon: <Mail size={40} color="#224b33" strokeWidth={1.5} />
      }
  ];

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Your Account</h1>
          <p className={styles.welcomeText}>Hello, <strong>{userName}</strong>! Manage your orders, personal info, and preferences below.</p>
        </div>
        
        <div className={styles.grid}>
          {cards.map((card, idx) => (
            <Link href={card.href} className={styles.card} key={idx}>
              <div className={styles.iconWrapper}>
                {card.icon}
              </div>
              <div className={styles.textWrapper}>
                <div className={styles.cardTitle}>{card.title}</div>
                <div className={styles.cardDesc}>{card.desc}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.footerSection}>
            <div className={styles.footerHeader}>Related Topics</div>
            <div className={styles.footerLinks}>
                <Link href="/recipes">Our Recipes</Link>
                <Link href="/about">About Kalsa Foods</Link>
                <Link href="/contact">Bulk Inquiry</Link>
                <Link href="/privacy_policy">Privacy Policy</Link>
            </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
