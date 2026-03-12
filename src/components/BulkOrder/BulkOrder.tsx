'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, ArrowRight, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './BulkOrder.module.css';

import { useLanguage } from '@/context/LanguageContext';

const BulkOrder = () => {
    const { lang } = useLanguage();

    const t = {
        en: {
            badge: "Wholesale & Business",
            title: "Planning a Bulk Order?",
            desc: "Whether it's for a restaurant, retail shop, or a special event, we offer specialized pricing and priority logistics for large quantity orders. Get in touch with our team directly for a custom quote.",
            callBtn: "Call Directly: +91 87094 38350",
            inquiryBtn: "Online Inquiry",
            stat1: "Organic Certified",
            stat2: "Delivery"
        },
        hi: {
            badge: "थोक और व्यापार",
            title: "बल्क ऑर्डर की योजना बना रहे हैं?",
            desc: "चाहे वह रेस्टोरेंट, रिटेल शॉप या किसी विशेष कार्यक्रम के लिए हो, हम बड़ी मात्रा में ऑर्डर के लिए विशेष मूल्य निर्धारण और प्राथमिकता रसद प्रदान करते हैं। कस्टम कोट के लिए सीधे हमारी टीम से संपर्क करें।",
            callBtn: "सीधे कॉल करें: +91 87094 38350",
            inquiryBtn: "ऑनलाइन पूछताछ",
            stat1: "प्रमाणित ऑर्गेनिक",
            stat2: "डिलिवरी"
        }
    }[lang];

    return (
        <section id="bulk-order" className={styles.bulkSection}>
            <div className="container">
                <motion.div
                    className={styles.bulkCard}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className={styles.content}>
                        <motion.div
                            className={styles.badge}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            {t.badge}
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                        >
                            {t.title}
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                        >
                            {t.desc}
                        </motion.p>
                        <motion.div
                            className={styles.ctaGroup}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                        >
                            <a href="tel:+918709438350" className={styles.callBtn}>
                                <Phone size={20} />
                                <span>{t.callBtn}</span>
                            </a>
                            <Link href="/contact" className={styles.inquiryBtn}>
                                <span>{t.inquiryBtn}</span>
                                <ArrowRight size={18} />
                            </Link>
                        </motion.div>
                    </div>
                    <div className={styles.imageWrapper}>
                        <div className={styles.iconContainer}>
                            <Package size={120} strokeWidth={1} className={styles.packageIcon} />
                        </div>
                        <div className={styles.stats}>
                            <div className={styles.statItem}>
                                <span className={styles.statValue}>100%</span>
                                <span className={styles.statLabel}>{t.stat1}</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statValue}>Pan-India</span>
                                <span className={styles.statLabel}>{t.stat2}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default BulkOrder;
