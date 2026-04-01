"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Menu, X, User, MapPin, ShoppingCart, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './Navbar.module.css';
import AnnouncementBar from '../AnnouncementBar/AnnouncementBar';
import { useLanguage } from '@/context/LanguageContext';
import { createClient } from '@/utils/supabase/client';
import { useCart } from '@/context/CartContext';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/track?q=${searchQuery.trim().toUpperCase()}`);
            setSearchQuery('');
        }
    };
    const [user, setUser] = useState<any>(null);
    const [defaultAddress, setDefaultAddress] = useState<any>(null);
    const { lang, setLang } = useLanguage();
    const { cartCount, setIsCartOpen } = useCart();
    
    const supabase = createClient();

    useEffect(() => {
        const getSessionAndAddress = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUser(session.user);
                const { data } = await supabase
                    .from('user_addresses')
                    .select('full_name, city, pincode')
                    .eq('user_id', session.user.id)
                    .order('is_default', { ascending: false })
                    .limit(1);
                if (data && data.length > 0) setDefaultAddress(data[0]);
            }
        };
        getSessionAndAddress();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (session?.user) {
                    setUser(session.user);
                    const { data } = await supabase
                        .from('user_addresses')
                        .select('full_name, city, pincode')
                        .eq('user_id', session.user.id)
                        .order('is_default', { ascending: false })
                        .limit(1);
                    if (data && data.length > 0) setDefaultAddress(data[0]);
                    else setDefaultAddress(null);
                } else {
                    setUser(null);
                    setDefaultAddress(null);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [supabase]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 40) setIsScrolled(true);
            else setIsScrolled(false);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { title: lang === 'hi' ? "होम" : "Home", href: "/", hasDropdown: false },
        { title: lang === 'hi' ? "प्रोडक्ट्स" : "Our Product", href: "/#our-product", hasDropdown: false },
        { title: lang === 'hi' ? "रेसिपे" : "Recipes", href: "/recipes", hasDropdown: false },
        { title: lang === 'hi' ? "ऑर्डर कैसे करें" : "How to Order", href: "/how-to-order", hasDropdown: false },
        { title: lang === 'hi' ? "हमारी कहानी" : "What's the Story", href: "/our-story", hasDropdown: false },
        { title: lang === 'hi' ? "समीक्षा दें" : "Submit Review", href: "/submit-review", hasDropdown: false },
        {
            title: lang === 'hi' ? "संपर्क करें" : "Contact us",
            href: "/contact",
            hasDropdown: true,
            dropdownItems: [
                { title: lang === 'hi' ? "संपर्क" : "Contact", href: "/contact" },
                { title: lang === 'hi' ? "बल्क ऑर्डर" : "Bulk Orders", href: "/contact#bulk-order" },
                { title: lang === 'hi' ? "फीडबैक" : "Feedback & Complains", href: "/feedback" }
            ]
        },
    ];

    return (
        <header className={styles.header}>
            <AnnouncementBar />
            <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
                <div className={`${styles.container} container`}>
                    <button className={styles.mobileToggle} onClick={() => setIsMobileMenuOpen(true)}>
                        <Menu size={24} />
                    </button>

                    <div className={styles.logoAndLocation}>
                        <div className={styles.logo}>
                            <Link href="/">
                                <div className={styles.logoImageContainer}>
                                    <img src="/logo/logo.png" alt="Kalsa Foods Logo" className={styles.logoImage} />
                                </div>
                            </Link>
                        </div>

                        {user && user.email !== 'imvanand1@gmail.com' && (
                            <Link href="/profile/addresses" className={styles.locationWidget}>
                                <MapPin size={18} strokeWidth={1.5} className={styles.locationIcon} color="#333" />
                                <div className={styles.locationText}>
                                    <div className={styles.locationLine1}>
                                        {defaultAddress ? (lang === 'hi' ? `डिलीवर करें: ${defaultAddress.full_name?.split(' ')[0]}` : `Deliver to ${defaultAddress.full_name?.split(' ')[0]}`) : (lang === 'hi' ? `अपनी जगह चुनें` : `Select your address`)}
                                    </div>
                                    <div className={styles.locationLine2}>
                                        {defaultAddress ? <span style={{fontWeight: 700}}>{defaultAddress.city} {defaultAddress.pincode}</span> : <span style={{fontWeight: 700}}>{lang === 'hi' ? `अपडेट लोकेशन` : `Update location`}</span>}
                                    </div>
                                </div>
                            </Link>
                        )}
                    </div>

                    <form className={styles.navbarSearch} onSubmit={handleSearch}>
                        <div className={styles.searchWrapper}>
                            <input 
                                type="text" 
                                placeholder={lang === 'hi' ? "ऑर्डर ट्रैक करें (KF-XXXXX)" : "Track Order (KF-XXXXX)"}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" aria-label="Search">
                                <Search size={20} color="#333" />
                            </button>
                        </div>
                    </form>

                    <div className={styles.rightActions}>
                        <div className={styles.langSwitcher}>
                            <button className={`${styles.langBtn} ${lang === 'en' ? styles.activeLang : ''}`} onClick={() => setLang('en')}>EN</button>
                            <button className={`${styles.langBtn} ${lang === 'hi' ? styles.activeLang : ''}`} onClick={() => setLang('hi')}>हिं</button>
                        </div>
                        
                        {user && user.email !== 'imvanand1@gmail.com' && (
                            <div className={`${styles.accountContainer} ${styles.hasDropdown}`}>
                                <Link href="/profile" className={styles.accountToggle}>
                                    <div className={styles.accountTextContainer}>
                                        <div className={styles.accountGreeting}>
                                            {lang === 'hi' ? `नमस्ते, ${user.user_metadata?.full_name?.split(' ')[0] || 'यूज़र'}` : `Hello, ${user.user_metadata?.full_name?.split(' ')[0] || 'User'}`}
                                        </div>
                                        <div className={styles.accountMain}>
                                            {lang === 'hi' ? 'अकाउंट और लिस्ट' : 'Account & Lists'}
                                            <ChevronDown size={14} className={styles.chevron} />
                                        </div>
                                    </div>
                                    <User size={20} className={styles.mobileUserIcon} />
                                </Link>

                                <div className={styles.dropdown} style={{ right: 0, left: 'auto', transform: 'translateX(0)', minWidth: '240px' }}>
                                    <div className={styles.dropdownInner} style={{ padding: '15px 20px' }}>
                                        <div className={styles.accountLinksList}>
                                            <h4 className={styles.accountLinksTitle}>
                                                {lang === 'hi' ? 'आपका अकाउंट' : 'Your Account'}
                                            </h4>
                                            
                                            <Link href="/profile">{lang === 'hi' ? 'आपकी प्रोफ़ाइल' : 'Your Profile'}</Link>
                                            <Link href="/orders">{lang === 'hi' ? 'आपके ऑर्डर्स' : 'Your Orders'}</Link>
                                            <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/'; }} className={styles.signOutBtnDropdown}>
                                                {lang === 'hi' ? 'लॉग आउट' : 'Sign Out'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button className={styles.cartIconLink} onClick={() => setIsCartOpen(true)}>
                            <div className={styles.cartContainer}>
                                <ShoppingCart size={28} className={styles.cartIcon} color="#224b33" strokeWidth={2.5} />
                                <span className={styles.cartCountBadge}>{cartCount}</span>
                            </div>
                            <div className={styles.cartText}>{lang === 'hi' ? 'कार्ट' : 'Cart'}</div>
                        </button>
                    </div>
                </div>
            </nav>

            <nav className={styles.subnav}>
                <div className={`container ${styles.subnavContainer}`}>
                    <button className={styles.desktopAllCategories} onClick={() => setIsMobileMenuOpen(true)}>
                        <Menu size={20} />
                        {lang === 'hi' ? 'सभी' : 'All'}
                    </button>
                    
                    <ul className={styles.subnavLinks}>
                        {navItems.map((item, idx) => (
                            <li key={idx} className={item.hasDropdown ? styles.subnavHasDropdown : ''}>
                                <Link href={item.href}>
                                    {item.title}
                                    {item.hasDropdown && <ChevronDown size={14} className={styles.chevron} />}
                                </Link>
                                {item.hasDropdown && item.dropdownItems && (
                                    <div className={styles.subnavDropdown}>
                                        <div className={styles.dropdownInner}>
                                            {item.dropdownItems.map((subItem, sIdx) => (
                                                <Link key={sIdx} href={subItem.href}>{subItem.title}</Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.active : ''}`}>
                <div className={styles.mobileHeader}>
                    <div className={styles.mobileLogoContainer}>
                        <img src="/logo/logo.png" alt="Kalsa Foods Logo" className={styles.mobileLogoImage} />
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
                </div>
                <ul className={styles.mobileLinks}>
                    {navItems.map((item, idx) => (
                        <li key={idx}>
                            <Link href={item.href} onClick={() => { if (item.href !== '#') setIsMobileMenuOpen(false); }}>
                                {item.title}
                            </Link>
                            {item.hasDropdown && item.dropdownItems && (
                                <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                                    {item.dropdownItems.map((subItem, sIdx) => (
                                        <li key={sIdx} style={{ marginBottom: '10px' }}>
                                            <Link href={subItem.href} onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '1rem', opacity: 0.8 }}>{subItem.title}</Link>
                                        </li>
                                    ))}
                                    {/* Add tracking after bulk orders if Contact dropdown is open */}
                                    {item.title === (lang === 'hi' ? "संपर्क करें" : "Contact us") && (
                                        <li style={{ marginBottom: '10px' }}>
                                            <Link href="/track" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f39c12' }}>{lang === 'hi' ? "ऑर्डर ट्रैक करें" : "Track Order"}</Link>
                                        </li>
                                    )}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
                <div className={styles.mobileLangSwitcher}>
                    <button className={`${styles.langBtn} ${lang === 'en' ? styles.activeLang : ''}`} onClick={() => setLang('en')}>English (EN)</button>
                    <button className={`${styles.langBtn} ${lang === 'hi' ? styles.activeLang : ''}`} onClick={() => setLang('hi')}>हिन्दी (HI)</button>
                    {user && user.email !== 'imvanand1@gmail.com' && (
                        <>
                            <Link href="/profile" className={styles.langBtn} onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#f39c12', fontWeight: 700, marginTop: '10px' }}>My Profile</Link>
                            <button onClick={async () => { await supabase.auth.signOut(); setIsMobileMenuOpen(false); window.location.href = '/'; }} className={styles.langBtn} style={{ color: '#ef4444', fontWeight: 700, marginTop: '10px', textAlign: 'left', border: 'none', background: 'none' }}>Logout</button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
