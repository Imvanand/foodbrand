'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import styles from './how-to-order.module.css';
import { ShoppingBag, MessageCircle, CreditCard, Truck, QrCode } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const revealVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function HowToOrder() {
    const { lang } = useLanguage();

    const content = {
        hi: {
            heroTitle: "Order Kaise Karein?",
            heroSubtitle: "KALSA ka asli swad apne kitchen tak lana bahut hi simple hai. Bas niche diye gaye steps follow karein.",
            steps: [
                {
                    title: "Packs Select Karein",
                    desc: "Humara signature 'Spice Mix Masala' select karein. 3 ya usse zyada packs order karne par delivery bilkul FREE hai!",
                    icon: <ShoppingBag size={30} />
                },
                {
                    title: "Details Fill Karein",
                    desc: " Apna Name, Phone Number, aur Address enter karein taki hum aapka order sahi jagah deliver kar sakein.",
                    icon: <CreditCard size={30} />
                },
                {
                    title: "Payment Options",
                    desc: "Aap UPI se QR code scan karke turant pay kar sakte hain ya fir confirmation ke baad pay karne ka option select kar sakte hain.",
                    icon: <QrCode size={30} />
                },
                {
                    title: "WhatsApp Par Confirm Karein",
                    desc: "Order submit karte hi aapko system-generated PDF Invoice mil jayega aur details WhatsApp par open ho jayengi. Hume message send karein aur order confirm ho jayega!",
                    icon: <MessageCircle size={30} />
                }
            ],
            whatsappTitle: "Direct Order on WhatsApp?",
            whatsappDesc: "Agar aapko website se order karne me koi dikat ho rahi hai, to aap direct hume WhatsApp par message kar sakte hain.",
            whatsappBtn: "WhatsApp Par Order Karein"
        },
        en: {
            heroTitle: "How to Order?",
            heroSubtitle: "Bringing the authentic taste of KALSA to your kitchen is simple. Just follow the steps below.",
            steps: [
                {
                    title: "Select Your Quantity",
                    desc: "Choose our signature 'Spice Mix Masala'. Get FREE delivery on ordering a minimum of 3 packs!",
                    icon: <ShoppingBag size={30} />
                },
                {
                    title: "Enter Delivery Details",
                    desc: "Provide your Name, Phone Number, and Address so we can deliver your order to the right place.",
                    icon: <CreditCard size={30} />
                },
                {
                    title: "Payment Options",
                    desc: "You can pay instantly by scanning the UPI QR code or choose to pay after confirmation.",
                    icon: <QrCode size={30} />
                },
                {
                    title: "Confirm on WhatsApp",
                    desc: "Upon submission, you'll get a PDF Invoice and order details will open on WhatsApp. Just send the message to confirm your order!",
                    icon: <MessageCircle size={30} />
                }
            ],
            whatsappTitle: "Need Help? Order on WhatsApp",
            whatsappDesc: "If you find it easier, you can simply text us your order on WhatsApp. We are here to help you!",
            whatsappBtn: "Order via WhatsApp"
        }
    };

    const t = content[lang as keyof typeof content] || content.hi;

    return (
        <main className={styles.main}>
            <Navbar />

            <section className={styles.hero}>
                <div className={styles.container}>
                    <motion.h1
                        key={`title-${lang}`}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {t.heroTitle}
                    </motion.h1>
                    <motion.p
                        key={`subtitle-${lang}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {t.heroSubtitle}
                    </motion.p>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.stepsGrid}>
                        {t.steps.map((step, idx) => (
                            <motion.div
                                key={`${lang}-${idx}`}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={revealVariant}
                                className={styles.stepCard}
                            >
                                <div className={styles.stepNumber}>
                                    {idx + 1}
                                </div>
                                <div className={styles.stepContent}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                        <span style={{ color: '#ED944D' }}>{step.icon}</span>
                                        <h3 style={{ margin: 0 }}>{step.title}</h3>
                                    </div>
                                    <p>{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={revealVariant}
                        className={styles.whatsappSection}
                    >
                        <h2>{t.whatsappTitle}</h2>
                        <p>{t.whatsappDesc}</p>
                        <a
                            href="https://wa.me/918709438350"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.whatsappBtn}
                        >
                            <MessageCircle size={24} />
                            {t.whatsappBtn}
                        </a>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
