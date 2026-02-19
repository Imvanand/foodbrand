"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Added Image import
import { ChevronDown, Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';
import AnnouncementBar from '../AnnouncementBar/AnnouncementBar';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 40) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { title: "Home", href: "/", hasDropdown: false },
        { title: "Our Product", href: "/#our-product", hasDropdown: false },
        { title: "Recipes", href: "/recipes", hasDropdown: false },
        { title: "What's the Story", href: "/our-story", hasDropdown: false },
        {
            title: "Contact us",
            href: "#",
            hasDropdown: true,
            dropdownItems: [
                { title: "Contact", href: "/contact" },
                { title: "Bulk Orders", href: "/contact#bulk-order" },
                { title: "Feedback & Complains", href: "/feedback" }
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

                    <div className={styles.logo}>
                        <Link href="/">
                            <div className={styles.logoImageContainer}>
                                <img
                                    src="/logo/logo.png"
                                    alt="Kalsa Foods Logo"
                                    className={styles.logoImage}
                                />
                            </div>
                        </Link>
                    </div>

                    <ul className={styles.navLinks}>
                        {navItems.map((item, idx) => (
                            <li key={idx} className={item.hasDropdown ? styles.hasDropdown : ''}>
                                <Link href={item.href}>
                                    {item.title}
                                    {item.hasDropdown && <ChevronDown size={14} className={styles.chevron} />}
                                </Link>
                                {item.hasDropdown && item.dropdownItems && (
                                    <div className={styles.dropdown}>
                                        <div className={styles.dropdownInner}>
                                            {item.dropdownItems.map((subItem, sIdx) => (
                                                <Link key={sIdx} href={subItem.href}>
                                                    {subItem.title}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>

                    {/* <div className={styles.actions}>
                        <button className={styles.iconBtn} aria-label="Search">
                            <Search size={22} strokeWidth={1.5} />
                        </button>
                        <button className={styles.iconBtn} aria-label="Account">
                            <User size={22} strokeWidth={1.5} />
                        </button>
                        <button className={styles.iconBtn} aria-label="Cart">
                            <ShoppingBag size={22} strokeWidth={1.5} />
                            <span className={styles.badge}>0</span>
                        </button>
                    </div> */}
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.active : ''}`}>
                <div className={styles.mobileHeader}>
                    <div className={styles.mobileLogoContainer}>
                        <img
                            src="/logo/logo.png"
                            alt="Kalsa Foods Logo"
                            className={styles.mobileLogoImage}
                        />
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
                </div>
                <ul className={styles.mobileLinks}>
                    {navItems.map((item, idx) => (
                        <li key={idx}>
                            <Link href={item.href} onClick={() => !item.hasDropdown && setIsMobileMenuOpen(false)}>
                                {item.title}
                            </Link>
                            {item.hasDropdown && item.dropdownItems && (
                                <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                                    {item.dropdownItems.map((subItem, sIdx) => (
                                        <li key={sIdx} style={{ marginBottom: '10px' }}>
                                            <Link
                                                href={subItem.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                style={{ fontSize: '1rem', opacity: 0.8 }}
                                            >
                                                {subItem.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </header>
    );
};

export default Navbar;
