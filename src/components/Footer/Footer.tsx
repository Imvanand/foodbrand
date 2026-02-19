import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';
import { Instagram, Mail, Phone, MapPin, Youtube } from 'lucide-react';

const Footer = () => {
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
                        <h4>Made from Our Mother's Secret Recipe:</h4>
                        <p>Inspired by generations of home-cooked traditions, our Spice Mix Masala delivers the true taste of homemade goodness in every dish.</p>
                    </div>
                    <div className={styles.socials}>
                        <a href="https://www.instagram.com/kalsafoods" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={20} /></a>
                        <a href="https://www.youtube.com/@Vivekandpreeti" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Youtube size={20} /></a>
                    </div>
                </div>

                <div className={styles.linksSection}>
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link href="/our-story">Our Story</Link></li>
                        <li><Link href="/#our-product">Shop All</Link></li>
                        <li><Link href="/recipes">Recipes</Link></li>
                        <li><Link href="/contact">Contact Us</Link></li>
                        <li><Link href="/contact#bulk-order">Bulk Orders</Link></li>
                        <li><Link href="/feedback">Feedback</Link></li>
                    </ul>
                </div>

                <div className={styles.contactSection}>
                    <h3>Get In Touch</h3>
                    <div className={styles.contactItem}>
                        <MapPin size={18} />
                        <span>K R Puram, Bangalore</span>
                    </div>
                    <div className={styles.contactItem}>
                        <Phone size={18} />
                        <span>+91 87094 38350</span>
                    </div>
                    <div className={styles.contactItem}>
                        <Mail size={18} />
                        <span>support@kalsafoods.com</span>
                    </div>
                </div>
            </div>

            <div className={styles.bottomBar}>
                <div className="container">
                    <p>&copy; 2026 Kalsa Foods . All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
