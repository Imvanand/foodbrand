"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';
import { Instagram, Mail, Phone, MapPin, Youtube } from 'lucide-react';

import { useLanguage } from '@/context/LanguageContext';

const Footer = () => {
    const { lang } = useLanguage();

    const t = {
        en: {
            motherTitle: "Made from Our Mother's Secret Recipe:",
            motherDesc: "Inspired by generations of home-cooked traditions, our Spice Mix Masala delivers the true taste of homemade goodness in every dish.",
            quickLinks: "Quick Links",
            getInTouch: "Get In Touch",
            rights: "All Rights Reserved.",
            links: [
                { name: "Our Story", href: "/our-story" },
                { name: "Shop All", href: "/#our-product" },
                { name: "How to Order", href: "/how-to-order" },
                { name: "Recipes", href: "/recipes" },
                { name: "Contact Us", href: "/contact" },
                { name: "Bulk Orders", href: "/contact#bulk-order" },
                { name: "Feedback", href: "/feedback" }
            ],
            address: "K R Puram, Bangalore"
        },
        hi: {
            motherTitle: "हमारी माँ की Secret रेसिपी से बना:",
            motherDesc: "घर के बने व्यंजनों की पीढ़ियों पुरानी परंपराओं से प्रेरित, हमारा स्पाइस मिक्स मसाला हर डिश में घर के बने खाने का असली स्वाद देता है।",
            quickLinks: "त्वरित लिंक",
            getInTouch: "संपर्क में रहें",
            rights: "सर्वाधिकार सुरक्षित।",
            links: [
                { name: "हमारी कहानी", href: "/our-story" },
                { name: "खरीदारी करें", href: "/#our-product" },
                { name: "ऑर्डर कैसे करें", href: "/how-to-order" },
                { name: "रेसिपी", href: "/recipes" },
                { name: "संपर्क करें", href: "/contact" },
                { name: "बल्क ऑर्डर", href: "/contact#bulk-order" },
                { name: "फीडबैक", href: "/feedback" }
            ],
            address: "के आर पुरम, बैंगलोर"
        }
    }[lang];

    return (
        <footer className={styles.footer}>
            <div className={`${styles.container} container`}>
                <div className={styles.brandSection}>
                    <div className={styles.logo}>
                        <img
                            src="/logo/logo.png"
                            alt="Kalsa Foods Logo"
                            className={styles.footerLogoImage}
                        />
                    </div>
                    <div className={styles.motherRecipe}>
                        <h4>{t.motherTitle}</h4>
                        <p>{t.motherDesc}</p>
                    </div>
                    <div className={styles.socials}>
                        <a href="https://www.instagram.com/kalsafoods" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={20} /></a>
                        <a href="https://www.youtube.com/@Vivekandpreeti" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Youtube size={20} /></a>
                    </div>
                </div>

                <div className={styles.linksSection}>
                    <h3>{t.quickLinks}</h3>
                    <ul>
                        {t.links.map((link, idx) => (
                            <li key={idx}>
                                <Link href={link.href}>{link.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={styles.contactSection}>
                    <h3>{t.getInTouch}</h3>
                    <div className={styles.contactItem}>
                        <MapPin size={18} />
                        <span>{t.address}</span>
                    </div>
                    <div className={styles.contactItem}>
                        <Phone size={18} />
                        <span>+91 87094 38350</span>
                    </div>
                    <div className={styles.contactItem}>
                        <Mail size={18} />
                        <span>support@kalsafoods.com</span>
                    </div>
                    <div className={styles.contactItem}>
                        <span className={styles.gstinLabel}>GSTIN: 29KOEPK2332M1ZI</span>
                    </div>
                </div>
            </div>

            <div className={styles.bottomBar}>
                <div className="container">
                    <p>&copy; 2026 Kalsa Foods . {t.rights}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
